"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { REEL_RIVALS } from "@/lib/data";
import { Starburst } from "./Logo";

const VISUALS = [
  "from-sky-300 via-sky-400 to-blue-500",
  "from-zinc-700 via-zinc-800 to-black",
  "from-amber-200 via-yellow-400 to-amber-600",
  "from-rose-200 via-rose-300 to-red-400",
  "from-violet-200 via-indigo-300 to-indigo-400",
  "from-slate-300 via-slate-400 to-slate-600",
];

export default function FeaturedMatchups() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % REEL_RIVALS.length), 2600);
    return () => clearInterval(t);
  }, [paused]);

  const rival = REEL_RIVALS[active];

  return (
    <div
      className="glass grid overflow-hidden rounded-[28px] p-3 text-left md:grid-cols-[1.1fr_1fr] md:p-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* visual */}
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[20px] bg-gradient-to-br transition-all duration-700 ${VISUALS[active % VISUALS.length]}`}>
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,white,transparent_55%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-white/25 shadow-2xl ring-1 ring-white/50 backdrop-blur-md sm:h-48 sm:w-48">
              <Starburst className="h-20 w-20 animate-[spin_18s_linear_infinite] sm:h-24 sm:w-24" />
            </div>
            <Link
              href="/slot"
              className="absolute -right-10 -top-2 grid h-16 w-16 place-items-center rounded-full bg-white text-sm font-medium text-ink shadow-lg transition hover:scale-105"
            >
              Spin
            </Link>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="pill border-white/60 bg-white/70 text-ink backdrop-blur">IOWA × {rival.short}</span>
          <span className="pill border-white/60 bg-white/70 text-ink backdrop-blur">{rival.tag}</span>
        </div>
      </div>

      {/* list */}
      <div className="relative flex flex-col justify-center px-4 py-8 md:px-10">
        <p className="eyebrow">Featured Matchups</p>
        <ul className="mt-5 space-y-3">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const i = (active + offset + REEL_RIVALS.length) % REEL_RIVALS.length;
            const r = REEL_RIVALS[i];
            const d = Math.abs(offset);
            return (
              <li key={r.id}>
                <button
                  onClick={() => setActive(i)}
                  className="flex items-start gap-2 text-left transition-all duration-500"
                  style={{ opacity: d === 0 ? 1 : d === 1 ? 0.28 : 0.1 }}
                >
                  <span className={`font-semibold tracking-[-0.03em] ${d === 0 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"} transition-all duration-500`}>
                    {r.mascot}
                  </span>
                  <span className="mt-1 whitespace-nowrap text-xs text-zinc-500">[{r.tag}]</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
