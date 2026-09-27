"use client";

import { useMemo, useState } from "react";
import { Check, Download, Loader2, Share2, Sparkles, Wand2 } from "lucide-react";
import { POSTER_STYLES, REEL_RIVALS, type PosterStyleId } from "@/lib/data";
import { buildPosterSvg, svgToDataUrl, svgToPngDataUrl } from "@/lib/poster-svg";

type Output = { kind: "ai"; src: string; model: string } | { kind: "studio"; svg: string };

const STYLE_SWATCH: Record<PosterStyleId, string> = {
  vintage: "from-amber-100 to-yellow-500",
  cyber: "from-zinc-900 to-yellow-500",
  kinnick: "from-slate-900 via-slate-700 to-emerald-700",
  minimal: "from-zinc-50 to-zinc-300",
};

const LOADING_LINES = ["Warming up the press box…", "Mixing black & gold inks…", "Framing the Kinnick lights…", "Adding championship shine…"];

async function dataUrlToFile(dataUrl: string, name: string) {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], name, { type: blob.type });
}

export default function PosterStudio() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "polaslot.fun";
  const [rivalId, setRivalId] = useState(REEL_RIVALS[0].id);
  const [style, setStyle] = useState<PosterStyleId>("kinnick");
  const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [output, setOutput] = useState<Output | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);

  const rival = REEL_RIVALS.find((r) => r.id === rivalId)!;
  const livePreview = useMemo(
    () => buildPosterSvg({ rival, style, tagline: tagline.trim() || undefined }, domain),
    [rival, style, tagline, domain],
  );

  const generate = async () => {
    setLoading(true);
    setNote(null);
    setLineIdx(0);
    const t = setInterval(() => setLineIdx((i) => (i + 1) % LOADING_LINES.length), 2200);
    const studio = () => {
      setOutput({ kind: "studio", svg: livePreview });
      setNote("Rendered with the PolaSlot Studio engine — AI image service is busy, so we crafted a high-res collectible instead.");
    };
    try {
      const res = await fetch("/api/generate-poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rivalId, style, tagline: tagline.trim() }),
      });
      const data = (await res.json().catch(() => ({ fallback: true }))) as { fallback?: boolean; image?: string; model?: string };
      if (!data.fallback && data.image) setOutput({ kind: "ai", src: data.image, model: data.model ?? "dall-e-3" });
      else studio();
    } catch {
      studio();
    } finally {
      clearInterval(t);
      setLoading(false);
    }
  };

  const currentPng = async () => {
    const shown: Output = output ?? { kind: "studio", svg: livePreview };
    return shown.kind === "ai" ? shown.src : svgToPngDataUrl(shown.svg);
  };

  const filename = `polaslot-iowa-vs-${rival.id}-${style}.png`;

  const download = async () => {
    setBusy("download");
    try {
      const a = document.createElement("a");
      a.href = await currentPng();
      a.download = filename;
      a.click();
    } finally {
      setBusy(null);
    }
  };

  const share = async () => {
    setBusy("share");
    const text = `My Iowa vs. ${rival.mascot} gameday collectible from PolaSlot 🏈 @HawkeyeReport #Hawkeyes`;
    try {
      const file = await dataUrlToFile(await currentPng(), filename);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "PolaSlot Gameday Poster" });
        return;
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    } finally {
      setBusy(null);
    }
    window.open(`https://x.com/intent/tweet?${new URLSearchParams({ text, url: `https://${domain}/poster` })}`, "_blank", "noopener");
  };

  const displaySrc = output ? (output.kind === "ai" ? output.src : svgToDataUrl(output.svg)) : svgToDataUrl(livePreview);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* Controls */}
      <div className="glass rounded-[28px] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-gold-deep" />
          <h3 className="font-semibold">Poster settings</h3>
        </div>

        <fieldset className="mt-6">
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Select matchup</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {REEL_RIVALS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRivalId(r.id)}
                aria-pressed={rivalId === r.id}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  rivalId === r.id ? "border-ink bg-ink text-white" : "border-line bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Iowa {r.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Art style</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {POSTER_STYLES.map((s) => {
              const on = style === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  aria-pressed={on}
                  className={`group relative flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    on ? "border-ink bg-white shadow-sm" : "border-line bg-white/60 hover:border-zinc-300"
                  }`}
                >
                  <span className={`h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br ring-1 ring-black/5 ${STYLE_SWATCH[s.id]}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{s.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">{s.blurb}</span>
                  </span>
                  {on && (
                    <span className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mt-7 block">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Headline (optional)</span>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value.slice(0, 60))}
            placeholder="e.g. Swarm the Wolverines"
            className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-yellow-100"
          />
        </label>

        <button onClick={generate} disabled={loading} className="btn-gold mt-7 w-full !py-3.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? LOADING_LINES[lineIdx] : "Generate Gameday Poster"}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500">Powered by OpenAI DALL·E 3 / GPT Image · ~20–40 seconds</p>
      </div>

      {/* Preview */}
      <div className="glass flex flex-col rounded-[28px] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span
            className={`pill ${
              output?.kind === "ai"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : output
                  ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                  : "border-line bg-zinc-50 text-zinc-500"
            }`}
          >
            {output?.kind === "ai" ? `AI render · ${output.model === "dall-e-3" ? "DALL·E 3" : output.model}` : output ? "Studio collectible" : "Live preview"}
          </span>
          <div className="flex gap-2">
            <button onClick={download} disabled={loading || busy !== null} className="btn-secondary !py-2">
              {busy === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
            </button>
            <button onClick={share} disabled={loading || busy !== null} className="btn-primary !py-2">
              {busy === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />} Share
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt={`Iowa vs. ${rival.mascot} gameday poster`}
            className={`block h-auto w-full transition duration-500 ${loading ? "scale-[1.02] opacity-40 blur-sm" : ""}`}
          />
          {loading && (
            <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] bg-[length:200%_100%]" />
          )}
        </div>
        {note && <p className="mx-auto mt-4 max-w-md text-center text-xs text-zinc-500">{note}</p>}
      </div>
    </div>
  );
}
