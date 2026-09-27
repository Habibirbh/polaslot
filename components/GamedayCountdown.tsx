"use client";

import { useEffect, useState } from "react";
import { Hand, MapPin, Minus, Plus, Send } from "lucide-react";
import { GAMEDAY_SCHEDULE } from "@/lib/data";
import { Starburst } from "./Logo";

const WAVE_DOTS = 44;

/** Central-time offset for a 2026 date (DST ends Nov 1, 2026). */
const centralOffset = (date: string) => (date < "2026-11-01" ? "-05:00" : "-06:00");

function nextGame(now: number) {
  const withTimes = GAMEDAY_SCHEDULE.map((g) => {
    const dayStart = new Date(`${g.date}T00:00:00${centralOffset(g.date)}`).getTime();
    // Count down to kickoff when announced, otherwise to the start of gameday.
    const target = g.kickoff ? new Date(g.kickoff).getTime() : dayStart;
    // A TBA game stays "next" through the end of its gameday.
    const until = g.kickoff ? target : dayStart + 86_400_000;
    return { ...g, target, until };
  });
  const upcoming = withTimes.find((g) => g.until > now);
  return { game: upcoming ?? withTimes.at(-1)!, seasonOver: !upcoming };
}

/** Simple projection from opponent strength; mirrors the slot model's home-field bump. */
function projection(strength: number, home: boolean) {
  const iowa = Math.round(24 - strength * 8 + (home ? 3 : 0));
  const opp = Math.round(10 + strength * 12 - (home ? 2 : 0));
  return { iowa, opp };
}

function verdict(iowa: number, opp: number) {
  const m = iowa - opp;
  if (m === 0) return "Deadlocked — overtime at Kinnick.";
  if (m < 0) return m >= -3 ? "Heartbreaker by a field goal." : "A tough day for the black and gold.";
  if (m <= 3) return "Iowa by a boot — classic nail-biter.";
  if (m <= 10) return "Iowa grinds it out. Punt is a weapon.";
  if (m <= 20) return "Iowa rolls. Swarm mode fully engaged.";
  return "A statement win. Kinnick goes nuts.";
}

function Stepper({ label, value, onChange, accent }: { label: string; value: number; onChange: (v: number) => void; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs font-medium tracking-[0.2em] ${accent ? "text-gold" : "text-zinc-400"}`}>{label}</span>
      <span className="mt-2 font-semibold tabular-nums tracking-tight text-white [font-size:clamp(44px,6vw,64px)] leading-none">{value}</span>
      <div className="mt-3 flex gap-1.5">
        {[
          { d: -1, Icon: Minus, aria: "Decrease" },
          { d: 1, Icon: Plus, aria: "Increase" },
        ].map(({ d, Icon, aria }) => (
          <button
            key={d}
            onClick={() => onChange(Math.max(0, Math.min(99, value + d)))}
            aria-label={`${aria} ${label} score`}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-zinc-300 transition hover:border-gold hover:text-gold active:scale-90"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GamedayCountdown() {
  const [now, setNow] = useState<number | null>(null);
  const [score, setScore] = useState<{ iowa: number; opp: number } | null>(null);
  const [waveId, setWaveId] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Render against a fixed time on the server to avoid hydration drift; the client takes over on mount.
  const { game, seasonOver } = nextGame(now ?? 0);
  const rival = game.opponent;
  const proj = projection(rival.strength, game.home);
  const call = score ?? proj;

  const diff = Math.max(0, game.target - (now ?? 0));
  const units = [
    { k: "Days", v: Math.floor(diff / 86_400_000) },
    { k: "Hours", v: Math.floor(diff / 3_600_000) % 24 },
    { k: "Mins", v: Math.floor(diff / 60_000) % 60 },
    { k: "Secs", v: Math.floor(diff / 1000) % 60 },
  ];

  const kickoffLabel = game.kickoff
    ? new Date(game.kickoff).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Chicago",
        timeZoneName: "short",
      })
    : `${new Date(`${game.date}T12:00:00${centralOffset(game.date)}`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "America/Chicago",
      })} · Time TBA`;

  const shareCall = () => {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "polaslot.fun";
    const text = `My final score call 🏈\nIOWA ${call.iowa} – ${call.opp} ${rival.short}\n${verdict(call.iowa, call.opp)}\n\n@HawkeyeReport #Hawkeyes`;
    window.open(`https://x.com/intent/tweet?${new URLSearchParams({ text, url: `https://${domain}` })}`, "_blank", "noopener");
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-ink text-white">
        {/* atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-96 w-[760px] -translate-x-1/2 rounded-full bg-yellow-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="bg-grid absolute inset-0 opacity-[0.07] invert [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
          <Starburst className="absolute -right-24 -top-24 h-96 w-96 animate-[spin_60s_linear_infinite] opacity-[0.06]" />
        </div>

        {/* Hidden until mounted so the prerendered HTML never flashes a past game. */}
        <div
          className={`grid gap-10 p-6 transition-opacity duration-500 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-14 ${now ? "opacity-100" : "opacity-0"}`}
        >
          {/* Countdown */}
          <div>
            <span className="pill border-white/15 bg-white/5 text-zinc-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              {seasonOver ? "Season complete" : game.kickoff ? "Next kickoff" : "Next gameday"}
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Iowa <span className="serif-accent text-gold">{game.home ? "vs." : "at"}</span> {rival.mascot}
            </h2>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
              <span>{kickoffLabel}</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {game.location}
              </span>
              {game.tv && <span className="pill border-white/15 text-zinc-300">{game.tv}</span>}
              {game.tag && <span className="pill border-gold/30 bg-gold/10 text-gold">{game.tag}</span>}
            </p>

            <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">
              {units.map((u) => (
                <div key={u.k} className="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-4 text-center backdrop-blur-sm sm:py-5">
                  <div
                    key={now ? u.v : "x"}
                    className="animate-fade-up font-semibold tabular-nums tracking-tight [font-size:clamp(28px,5vw,52px)] leading-none"
                    suppressHydrationWarning
                  >
                    {now ? String(u.v).padStart(2, "0") : "--"}
                  </div>
                  <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-[11px]">{u.k}</div>
                </div>
              ))}
            </div>

            {/* Kinnick Wave */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    The <span className="serif-accent text-base text-gold">Kinnick</span> Wave
                  </p>
                  <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-zinc-400">
                    After the first quarter, all of Kinnick turns to wave to the kids watching from the children&apos;s hospital.
                  </p>
                </div>
                <button
                  onClick={() => setWaveId((n) => n + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold/20 active:scale-95"
                >
                  <Hand className="h-4 w-4" /> {waveId ? "Wave again" : "Join the Wave"}
                </button>
              </div>
              <div className="mt-5 flex h-8 items-end justify-between" aria-hidden>
                {Array.from({ length: WAVE_DOTS }, (_, i) => (
                  <span
                    key={`${waveId}-${i}`}
                    className={`wave-dot block h-2 w-2 rounded-full ${i % 3 === 0 ? "bg-gold" : "bg-zinc-500"} ${waveId ? "is-waving" : ""}`}
                    style={{ animationDelay: `${i * 32}ms` }}
                  />
                ))}
              </div>
              {waveId > 0 && (
                <p key={waveId} className="animate-fade-up mt-3 text-center text-xs text-zinc-400">
                  Waved {waveId === 1 ? "" : `${waveId}× `}to the kids up in the hospital 💛
                </p>
              )}
            </div>
          </div>

          {/* Call the Final */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-md sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Call the final</p>
            <p className="mt-1 text-sm text-zinc-500">Lock in your score before kickoff.</p>

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-start">
              <Stepper label="IOWA" value={call.iowa} accent onChange={(v) => setScore({ ...call, iowa: v })} />
              <span className="serif-accent mt-9 text-2xl text-zinc-600">–</span>
              <Stepper label={rival.short} value={call.opp} onChange={(v) => setScore({ ...call, opp: v })} />
            </div>

            <p key={`${call.iowa}-${call.opp}`} className="animate-fade-up mt-8 text-center text-lg leading-snug">
              <span className="serif-accent text-xl text-gold">“</span>
              {verdict(call.iowa, call.opp)}
              <span className="serif-accent text-xl text-gold">”</span>
            </p>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-xs">
              <span className="text-zinc-400">PolaSlot projection</span>
              <button
                onClick={() => setScore(null)}
                className="font-mono tabular-nums text-zinc-200 transition hover:text-gold"
                title="Reset to projection"
              >
                IOWA {proj.iowa} – {proj.opp} {rival.short}
              </button>
            </div>

            <button onClick={shareCall} className="btn-gold mt-6 w-full !py-3.5">
              <Send className="h-4 w-4" /> Post my call to X
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
