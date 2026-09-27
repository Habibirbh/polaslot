import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import SlotMachine from "@/components/SlotMachine";

export const metadata: Metadata = { title: "Matchup Slot" };

export default function Page() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-80 bg-gradient-to-b from-yellow-100/60 to-transparent blur-2xl" />
      <SectionHeading as="h1" eyebrow="Matchup Slot" title="Spin the" accent="scenario." body="Hawkeye Core × Game Scenario × Big Ten Rival. Hold the reels you like, spin the rest, and share your AI-scored call with the HawkeyeReport community." />
      <div className="mt-12">
        <SlotMachine />
      </div>
    </section>
  );
}
