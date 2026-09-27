import { NextResponse } from "next/server";
import { scoreCombo, templateInsight, type Prediction } from "@/lib/predict";

export const runtime = "nodejs";

async function aiInsight(prompt: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(4500),
      body: JSON.stringify({
        model: process.env.OPENAI_INSIGHT_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 90,
        messages: [
          {
            role: "system",
            content:
              "You are a sharp Iowa Hawkeyes football analyst writing for the HawkeyeReport community. Reply with ONE tactical insight sentence (max 35 words). No hedging, no emojis, no betting advice.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim().replace(/^"|"$/g, "") || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: { coreId?: string; scenarioId?: string; rivalId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const scored = scoreCombo(body.coreId ?? "", body.scenarioId ?? "", body.rivalId ?? "");
  if (!scored) return NextResponse.json({ error: "Unknown reel selection" }, { status: 400 });

  const { core, scenario, rival, likelihood, fanConfidence, edge } = scored;
  const ai = await aiInsight(
    `Scenario: ${core.label} — ${scenario.label} ${rival.label}. Model likelihood ${likelihood}%. Give the single tactical key to this scenario hitting.`,
  );

  const prediction: Prediction = {
    coreId: core.id,
    scenarioId: scenario.id,
    rivalId: rival.id,
    likelihood,
    fanConfidence,
    edge,
    insight: ai ?? templateInsight(core.id, rival.id),
    insightSource: ai ? "ai" : "model",
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(prediction);
}
