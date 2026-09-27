import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import PosterStudio from "@/components/PosterStudio";

export const metadata: Metadata = { title: "AI Poster Lab" };

export default function Page() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-80 bg-gradient-to-b from-yellow-100/60 to-transparent blur-2xl" />
      <SectionHeading as="h1" eyebrow="AI Poster Lab" title="Gameday art," accent="collected." body="Generate a one-of-one gameday collectible with DALL·E 3 — with an instant studio render as a built-in fallback." />
      <div className="mt-12">
        <PosterStudio />
      </div>
    </section>
  );
}
