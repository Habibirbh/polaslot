import Link from "next/link";

export function Starburst({ className = "h-7 w-7" }: { className?: string }) {
  const rays = 12;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="sb-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FACC15" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      {Array.from({ length: rays }, (_, i) => (
        <rect key={i} x="14.6" y="2" width="2.8" height="11" rx="1.4" fill="url(#sb-grad)" transform={`rotate(${(360 / rays) * i} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="4.2" fill="#18181B" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="PolaSlot home">
      <Starburst className="h-7 w-7 transition-transform duration-500 group-hover:rotate-45" />
      <span className="text-[22px] font-semibold tracking-tight">PolaSlot</span>
    </Link>
  );
}
