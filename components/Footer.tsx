import Link from "next/link";
import { Starburst } from "./Logo";
import { NAV } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <Starburst className="h-6 w-6" />
            <span className="font-semibold">PolaSlot</span>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            AI sports predictions and gameday collectibles for the HawkeyeReport community. For entertainment and analysis only — not
            betting advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
          <a href="https://x.com/HawkeyeReport" target="_blank" rel="noreferrer" className="hover:text-ink">
            @HawkeyeReport ↗
          </a>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} polaslot.fun · Not affiliated with the University of Iowa or the Big Ten Conference.
      </div>
    </footer>
  );
}
