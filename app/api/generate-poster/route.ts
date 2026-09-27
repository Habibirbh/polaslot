import { NextResponse } from "next/server";
import { POSTER_STYLES, REEL_RIVALS } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 180;

const STYLE_PROMPTS: Record<string, string> = {
  vintage:
    "a 1970s Big Ten college football gameday program cover, cream paper stock, halftone printing, retro black and gold stripes, hand-lettered serif typography, slight print wear",
  cyber:
    "a futuristic cyberpunk college football poster, charcoal chrome, glowing gold neon perspective grid, sleek abstract hawk silhouette made of light, dramatic rim lighting",
  kinnick:
    "a cinematic night-game poster of a packed Midwestern college football stadium under bright light towers, black and gold crowd, fog and light beams, low wide angle",
  minimal:
    "a Swiss minimalist typographic sports poster, off-white background, strict grid, huge bold sans-serif letterforms, a single gold accent shape",
};

type Body = { rivalId?: string; style?: string; tagline?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rival = REEL_RIVALS.find((r) => r.id === body.rivalId);
  const style = POSTER_STYLES.find((s) => s.id === body.style);
  if (!rival || !style) return NextResponse.json({ error: "Unknown matchup or style" }, { status: 400 });

  const key = process.env.OPENAI_API_KEY;
  // The client renders an SVG collectible whenever `fallback` is true, so we never surface a hard error.
  if (!key) return NextResponse.json({ fallback: true, reason: "missing_key" });

  const tagline = (body.tagline ?? "").slice(0, 80);
  const prompt = [
    `Vertical gameday collectible poster for Iowa Hawkeyes vs ${rival.mascot} college football.`,
    `Style: ${STYLE_PROMPTS[style.id]}.`,
    "Palette: deep charcoal black and championship gold.",
    tagline ? `Include the short headline text "${tagline}".` : "Minimal text; the word IOWA may appear prominently.",
    "No official logos, trademarks, or real player likenesses. High detail, print quality.",
  ].join(" ");

  // DALL·E 3 first (per spec); if it's unavailable on this key, retry with the GPT Image family.
  const models = [...new Set([process.env.OPENAI_IMAGE_MODEL || "dall-e-3", "gpt-image-1"])];
  let reason = "unknown";

  for (const model of models) {
    const result = await generateImage(key, model, prompt);
    if ("image" in result) return NextResponse.json({ fallback: false, model, ...result });
    reason = result.reason;
    // Quota / billing / policy errors will fail the same way on every model — skip straight to the fallback.
    if (["insufficient_quota", "billing_hard_limit_reached", "content_policy_violation", "rate_limit_exceeded"].includes(reason)) break;
  }

  return NextResponse.json({ fallback: true, reason });
}

async function generateImage(
  key: string,
  model: string,
  prompt: string,
): Promise<{ image: string; revisedPrompt?: string } | { reason: string }> {
  const isDalle = model.startsWith("dall-e");
  const params = isDalle
    ? // b64 avoids expiring URLs and CORS issues when downloading.
      { size: "1024x1792", quality: "standard", response_format: "b64_json" }
    : // GPT Image models always return b64 and use their own size/quality vocab.
      { size: "1024x1536", quality: "medium" };

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(isDalle ? 55_000 : 110_000),
      body: JSON.stringify({ model, prompt, n: 1, ...params }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
      console.warn(`[generate-poster] ${model} error`, res.status, err.error?.code, err.error?.message);
      return { reason: err.error?.code ?? `http_${res.status}` };
    }

    const data = (await res.json()) as { data?: { b64_json?: string; revised_prompt?: string }[] };
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) return { reason: "empty_response" };
    return { image: `data:image/png;base64,${b64}`, revisedPrompt: data.data?.[0]?.revised_prompt };
  } catch (e) {
    console.warn(`[generate-poster] ${model} request failed`, e);
    return { reason: "network" };
  }
}
