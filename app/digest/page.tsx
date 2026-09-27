import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import BeatDigest from "@/components/BeatDigest";

export const metadata: Metadata = { title: "Beat Digest" };

export default function Page() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 -z-10 h-80 bg-gradient-to-b from-yellow-100/60 to-transparent blur-2xl" />
      <SectionHeading as="h1" eyebrow="Beat Digest" title="The beat," accent="distilled." body="Podcast radar, film study, injury notes, and recruiting intel from the HawkeyeReport network, summarized for Hawkeye Nation." />
      <div className="mt-12">
        <BeatDigest />
      </div>
    </section>
  );
}
