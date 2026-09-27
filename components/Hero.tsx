import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { HERO_AVATARS } from "@/lib/data";
import FeaturedMatchups from "./FeaturedMatchups";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-100/80 via-amber-50/40 to-transparent blur-3xl" />
        <div className="absolute right-[-10%] top-32 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 text-center sm:px-8 sm:pt-16">
        {/* social proof pill */}
        <div className="animate-fade-up inline-flex flex-col items-center gap-3">
          <div className="flex -space-x-2.5">
            {HERO_AVATARS.map((a) => (
              <Image
                key={a.src}
                src={a.src}
                alt={a.alt}
                width={40}
                height={40}
                priority
                className="h-10 w-10 rounded-full object-cover ring-[3px] ring-white"
              />
            ))}
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[10px] font-semibold text-gold ring-[3px] ring-white">
              45K+
            </span>
          </div>
          <p className="text-[15px] text-zinc-600">Trusted by 45,000+ Hawkeye fans &amp; collegiate analysts</p>
        </div>

        <h1
          className="animate-fade-up mx-auto mt-7 max-w-5xl text-[44px] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[84px]"
          style={{ animationDelay: "80ms" }}
        >
          Insights That <span className="serif-accent">Speak.</span>
          <br />
          Predictions <span className="serif-accent">That</span> Perform.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-zinc-600 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          The predictive odds &amp; tactical line analytics engine built for Hawkeye Nation. Spin live game scenarios, run AI match
          simulations, and generate gameday collectibles.
        </p>

        <div className="animate-fade-up mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: "240ms" }}>
          <Link href="/slot" className="btn-primary !px-6 !py-3">
            Spin Matchup Slot <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/poster" className="btn-secondary !px-6 !py-3">
            <Sparkles className="h-4 w-4 text-gold-deep" /> Generate Gameday Poster
          </Link>
        </div>

        {/* featured card with floating stat badges */}
        <div className="animate-fade-up relative mx-auto mt-16 max-w-6xl" style={{ animationDelay: "320ms" }}>
          <div className="glass animate-float absolute -left-3 -top-6 z-10 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-left lg:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">78.4%</span>
              <span className="block text-[11px] text-zinc-500">Red Zone D vs. NEB</span>
            </span>
          </div>
          <div
            className="glass animate-float absolute -right-3 top-24 z-10 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 text-left lg:flex"
            style={{ animationDelay: "1.5s" }}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-yellow-50 text-gold-deep">
              <Zap className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">12.8K spins</span>
              <span className="block text-[11px] text-zinc-500">this game week</span>
            </span>
          </div>
          <FeaturedMatchups />
        </div>
      </div>
    </section>
  );
}
