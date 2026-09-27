"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lock, LockOpen, RotateCw, Share2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { REEL_CORE, REEL_RIVALS, REEL_SCENARIO, type ReelItem } from "@/lib/data";
import { scoreCombo, templateInsight, type Prediction } from "@/lib/predict";
import { sfx } from "@/lib/sound";

const ITEM_H = 84;
const LOOPS = 10;
const DURATIONS = [1500, 2000, 2500];
const SOUND_KEY = "polaslot:sound";

const REELS: { title: string; items: ReelItem[] }[] = [
  { title: "Hawkeye Core", items: REEL_CORE },
  { title: "Game Scenario", items: REEL_SCENARIO },
  { title: "Big Ten Rival", items: REEL_RIVALS },
];

/* ---------------------------------- Reel ---------------------------------- */

function Reel({
  title,
  items,
  index,
  spinId,
  duration,
  locked,
  onToggleLock,
  onStop,
  disabled,
}: {
  title: string;
  items: ReelItem[];
  index: number;
  spinId: number;
  duration: number;
  locked: boolean;
  onToggleLock: () => void;
  onStop: () => void;
  disabled: boolean;
}) {
  const len = items.length;
  const [pos, setPos] = useState(len + index); // strip position of the centred item
  const [animating, setAnimating] = useState(false);
  const lastSpin = useRef(spinId);

  useEffect(() => {
    if (spinId === lastSpin.current) return;
    lastSpin.current = spinId;
    if (locked) {
      const t = setTimeout(onStop, 350);
      return () => clearTimeout(t);
    }
    setAnimating(true);
    // Land deep in the strip so the reel visibly rolls several loops.
    setPos((LOOPS - 2) * len + index);
    const t = setTimeout(() => {
      setAnimating(false);
      setPos(len + index); // silently snap back to the first loop
      onStop();
    }, duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  const strip = Array.from({ length: LOOPS }, () => items).flat();

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{title}</span>
        <button
          onClick={onToggleLock}
          disabled={disabled}
          className={`pill transition ${locked ? "border-yellow-300 bg-yellow-50 text-yellow-800" : "border-line bg-white text-zinc-500 hover:text-ink"}`}
          aria-pressed={locked}
          aria-label={`${locked ? "Unlock" : "Lock"} ${title} reel`}
        >
          {locked ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
          {locked ? "Held" : "Hold"}
        </button>
      </div>
      <div
        className={`relative overflow-hidden rounded-2xl border bg-white transition ${locked ? "border-yellow-300" : "border-line"}`}
        style={{ height: ITEM_H * 3 }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-2 z-10 rounded-xl border border-yellow-400/70 bg-yellow-50/40" style={{ top: ITEM_H, height: ITEM_H }} />
        <div className="reel-window h-full" aria-live="polite">
          <div
            className="reel-strip"
            style={{
              transform: `translate3d(0, ${-(pos - 1) * ITEM_H}px, 0)`,
              transition: animating ? `transform ${duration}ms cubic-bezier(0.15, 0.75, 0.2, 1.02)` : "none",
              filter: animating ? "blur(0.4px)" : "none",
            }}
          >
            {strip.map((item, i) => (
              <div
                key={i}
                className="relative z-20 flex items-center justify-center px-4 text-center text-[15px] font-semibold leading-snug tracking-tight sm:text-base"
                style={{ height: ITEM_H }}
                aria-hidden={i !== pos}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Result card ------------------------------ */

function useCountUp(target: number, run: boolean, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

const EDGE_STYLE: Record<Prediction["edge"], string> = {
  Strong: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Lean: "border-sky-200 bg-sky-50 text-sky-700",
  "Coin Flip": "border-zinc-200 bg-zinc-50 text-zinc-600",
  Fade: "border-rose-200 bg-rose-50 text-rose-700",
};

function ResultCard({ result, labels }: { result: Prediction; labels: [string, string, string] }) {
  const likely = useCountUp(result.likelihood, true);
  const fans = useCountUp(result.fanConfidence, true, 1200);
  const R = 52;
  const C = 2 * Math.PI * R;

  const shareUrl = (() => {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "polaslot.fun";
    let text = `🎰 PolaSlot scenario: ${labels[0]} · ${labels[1]} ${labels[2]}\n📊 ${result.likelihood}% likelihood (${result.edge})\n🔑 ${result.insight}`;
    const tail = `\n\n@HawkeyeReport #Hawkeyes`;
    const max = 280 - tail.length - 24; // leave room for the t.co link
    if (text.length > max) text = text.slice(0, max - 1) + "…";
    return `https://x.com/intent/tweet?${new URLSearchParams({ text: text + tail, url: `https://${domain}/slot` })}`;
  })();

  return (
    <div className="glass animate-fade-up grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#F4F4F5" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#gauge)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - likely / 100)}
            />
            <defs>
              <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FACC15" />
                <stop offset="1" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">{likely.toFixed(1)}%</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Likelihood</div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <span className={`pill ${EDGE_STYLE[result.edge]}`}>{result.edge} edge</span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="hidden lg:block">
          <span className={`pill ${EDGE_STYLE[result.edge]}`}>{result.edge} edge</span>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          Tactical Key Insight
          <span className="ml-2 normal-case tracking-normal text-zinc-400">{result.insightSource === "ai" ? "· AI generated" : "· PolaSlot model"}</span>
        </p>
        <p className="mt-1.5 text-lg leading-snug text-ink">
          <span className="serif-accent text-xl">“</span>
          {result.insight}
          <span className="serif-accent text-xl">”</span>
        </p>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Fan Confidence Meter</span>
            <span className="font-medium tabular-nums text-ink">{Math.round(fans)}%</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full rounded-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-yellow-500" style={{ width: `${fans}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 lg:flex-col">
        <a href={shareUrl} target="_blank" rel="noreferrer" className="btn-primary">
          <Share2 className="h-4 w-4" /> Share Prediction to X
        </a>
      </div>
    </div>
  );
}

/* ------------------------------ Slot machine ------------------------------ */

export default function SlotMachine({ compact = false }: { compact?: boolean }) {
  const [indices, setIndices] = useState<[number, number, number]>([1, 0, 0]);
  const [locks, setLocks] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [spinId, setSpinId] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ p: Prediction; labels: [string, string, string] } | null>(null);
  const [sound, setSound] = useState(true);

  const stopped = useRef(0);
  const pending = useRef<Promise<Prediction | null> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => {
    try {
      setSound(localStorage.getItem(SOUND_KEY) !== "off");
    } catch {}
    return () => {
      if (tickTimer.current) clearInterval(tickTimer.current);
    };
  }, []);

  const toggleSound = () =>
    setSound((s) => {
      try {
        localStorage.setItem(SOUND_KEY, s ? "off" : "on");
      } catch {}
      return !s;
    });

  const finish = useCallback(async (next: [number, number, number]) => {
    if (tickTimer.current) clearInterval(tickTimer.current);
    const ids = [REEL_CORE[next[0]].id, REEL_SCENARIO[next[1]].id, REEL_RIVALS[next[2]].id] as const;
    let p = await pending.current;
    if (!p) {
      // Offline / API failure: score locally so the experience never breaks.
      const s = scoreCombo(...ids)!;
      p = {
        coreId: ids[0],
        scenarioId: ids[1],
        rivalId: ids[2],
        likelihood: s.likelihood,
        fanConfidence: s.fanConfidence,
        edge: s.edge,
        insight: templateInsight(ids[0], ids[2]),
        insightSource: "model",
        createdAt: new Date().toISOString(),
      };
    }
    const labels: [string, string, string] = [REEL_CORE[next[0]].label, REEL_SCENARIO[next[1]].label, REEL_RIVALS[next[2]].label];
    setResult({ p, labels });
    setSpinning(false);
    if (soundRef.current) sfx.win();
  }, []);

  const nextRef = useRef(indices);

  const spin = () => {
    if (spinning) return;
    const next: [number, number, number] = [
      locks[0] ? indices[0] : Math.floor(Math.random() * REEL_CORE.length),
      locks[1] ? indices[1] : Math.floor(Math.random() * REEL_SCENARIO.length),
      locks[2] ? indices[2] : Math.floor(Math.random() * REEL_RIVALS.length),
    ];
    nextRef.current = next;
    stopped.current = 0;
    setResult(null);
    setSpinning(true);
    setIndices(next);
    setSpinId((n) => n + 1);

    pending.current = fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coreId: REEL_CORE[next[0]].id, scenarioId: REEL_SCENARIO[next[1]].id, rivalId: REEL_RIVALS[next[2]].id }),
    })      .then((r) => (r.ok ? (r.json() as Promise<Prediction>) : null))
      .catch(() => null);

    if (soundRef.current && !locks.every(Boolean)) {
      tickTimer.current = setInterval(() => soundRef.current && sfx.tick(), 75);
    }
  };

  const onReelStop = useCallback(() => {
    stopped.current += 1;
    if (soundRef.current) sfx.stop();
    if (stopped.current === 3) void finish(nextRef.current);
  }, [finish]);

  const allLocked = locks.every(Boolean);

  return (
    <div className="space-y-6">
      <div className="glass rounded-[28px] p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium">PolaSlot Engine</span>
            <span className="pill border-line bg-zinc-50 text-zinc-500">v2.6 · Big Ten model</span>
          </div>
          <button onClick={toggleSound} className="pill border-line bg-white py-1 text-zinc-600 hover:text-ink" aria-pressed={sound}>
            {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            Sound {sound ? "on" : "off"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {REELS.map((reel, i) => (
            <Reel
              key={reel.title}
              title={reel.title}
              items={reel.items}
              index={indices[i]}
              spinId={spinId}
              duration={DURATIONS[i]}
              locked={locks[i]}
              disabled={spinning}
              onToggleLock={() => setLocks((l) => l.map((v, j) => (j === i ? !v : v)) as [boolean, boolean, boolean])}
              onStop={onReelStop}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button onClick={spin} disabled={spinning || allLocked} className="btn-gold !px-8 !py-3.5 text-base">
            {spinning ? <RotateCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {spinning ? "Simulating…" : "Spin Scenario"}
          </button>
          {!compact && (
            <p className="text-xs text-zinc-500">
              {allLocked ? "Release at least one reel to spin." : "Hold a reel to lock it and re-spin the others."}
            </p>
          )}
        </div>
      </div>

      {result && <ResultCard key={result.p.createdAt} result={result.p} labels={result.labels} />}
    </div>
  );
}
