"use client";

import { useState } from "react";
import { Activity, ArrowUpRight, BrainCircuit, Clock, Flame, Headphones, HeartPulse, Radio, Trophy, UserPlus } from "lucide-react";
import { AI_INSIGHTS, BEAT_FEED, type BeatItem } from "@/lib/data";

const TABS = ["All", "Podcast", "Film Study", "Postgame", "Injury Report", "Recruiting"] as const;

const KIND_ICON: Record<BeatItem["kind"], typeof Headphones> = {
  Podcast: Headphones,
  "Film Study": Activity,
  Postgame: Trophy,
  "Injury Report": HeartPulse,
  Recruiting: UserPlus,
};

const TONE: Record<(typeof AI_INSIGHTS)[number]["tone"], string> = {
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function BeatDigest({ limit }: { limit?: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const items = BEAT_FEED.filter((b) => tab === "All" || b.kind === tab).slice(0, limit);

  return (
    <div className="space-y-6">
      {/* AI summary */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-gold">
            <BrainCircuit className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">AI Insight Summary</p>
            <p className="text-xs text-zinc-500">Distilled from this week&apos;s beat coverage</p>
          </div>
          <span className="pill ml-auto border-emerald-200 bg-emerald-50 text-emerald-700">
            <Radio className="h-3 w-3" /> Live radar
          </span>
        </div>
        <div className="mt-4 grid gap-2.5 md:grid-cols-2">
          {AI_INSIGHTS.map((i) => (
            <div key={i.kind} className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3">
              <span className={`pill shrink-0 ${TONE[i.tone]}`}>{i.kind}</span>
              <p className="text-sm leading-snug text-zinc-700">{i.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* tabs */}
      <div className="flex justify-center">
        <div className="glass flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${tab === t ? "bg-ink text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* feed */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => {
          const Icon = KIND_ICON[b.kind];
          return (
            <article
              key={b.id}
              className="group animate-fade-up flex flex-col rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_18px_40px_-24px_rgba(24,24,27,0.35)]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className="pill border-line bg-zinc-50 text-zinc-700">
                  <Icon className="h-3 w-3" /> {b.kind}
                </span>
                {b.hot && (
                  <span className="pill border-yellow-200 bg-yellow-50 text-yellow-800">
                    <Flame className="h-3 w-3" /> Trending
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-400">{b.published}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight">{b.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{b.summary}</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {b.tags.map((t) => (
                    <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-zinc-500">
                  <Clock className="h-3 w-3" /> {b.duration}
                </span>
              </div>
              <a
                href="https://x.com/HawkeyeReport"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink opacity-70 transition group-hover:opacity-100"
              >
                Open on HawkeyeReport <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
