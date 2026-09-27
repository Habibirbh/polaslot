import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import SlotMachine from "@/components/SlotMachine";
import PosterStudio from "@/components/PosterStudio";
import BeatDigest from "@/components/BeatDigest";
import SectionHeading from "@/components/SectionHeading";
import GamedayCountdown from "@/components/GamedayCountdown";
import { REEL_CORE, REEL_RIVALS, REEL_SCENARIO } from "@/lib/data";

const STATS = [
  { v: "45.2K", k: "HawkeyeReport community" },
  { v: String(REEL_CORE.length * REEL_SCENARIO.length * REEL_RIVALS.length), k: "Unique reel scenarios" },
  { v: "4", k: "Collectible art styles" },
  { v: "<3s", k: "Per AI simulation" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-line px-5 sm:px-8 md:grid-cols-4 md:divide-x">
          {STATS.map((s) => (
            <div key={s.k} className="px-4 py-8 text-center">
              <div className="text-3xl font-semibold tracking-tight">{s.v}</div>
              <div className="mt-1 text-sm text-zinc-500">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="slot" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="The PolaSlot Engine"
          title="Spin the"
          accent="scenario."
          after="Read the edge."
          body="Three reels, one matchup. Every spin runs the combination through our Big Ten model and returns a likelihood, a tactical key, and where the fan base stands."
        />
        <div className="mt-12">
          <SlotMachine compact />
        </div>
      </section>

      <section id="poster" className="scroll-mt-24 border-t border-line bg-white/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading
            eyebrow="AI Poster Lab"
            title="Gameday art,"
            accent="collected."
            body="Pick a matchup and an era. DALL·E 3 paints a one-of-one poster — and if the AI queue is busy, our studio renderer delivers a print-ready collectible instantly."
          />
          <div className="mt-12">
            <PosterStudio />
          </div>
        </div>
      </section>

      <section id="digest" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Hawkeye Beat Intelligence"
          title="The beat,"
          accent="distilled."
          body="Podcast radar, postgame breakdowns, and recruiting notes from the HawkeyeReport network — summarized by AI so you're caught up before kickoff."
        />
        <div className="mt-12">
          <BeatDigest limit={3} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/digest" className="btn-secondary">
            View full Beat Digest <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <GamedayCountdown />
    </>
  );
}
