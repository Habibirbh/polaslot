import type { PosterStyleId, Rival } from "./data";

type PosterInput = { rival: Rival; style: PosterStyleId; tagline?: string };

const W = 1024;
const H = 1536;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Small seeded PRNG so each matchup/style renders consistently. */
function rng(seed: string) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starburst(cx: number, cy: number, r: number, fill: string, rays = 12) {
  const pts: string[] = [];
  for (let i = 0; i < rays * 2; i++) {
    const a = (Math.PI * i) / rays - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
}

function footer(color: string, muted: string, domain: string) {
  return `
  <line x1="80" y1="1420" x2="${W - 80}" y2="1420" stroke="${muted}" stroke-width="2"/>
  <text x="80" y="1470" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="4" fill="${color}" font-weight="700">POLASLOT COLLECTIBLE</text>
  <text x="${W - 80}" y="1470" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="2" fill="${muted}">${esc(domain)} · @HawkeyeReport</text>`;
}

function vintage({ rival, tagline }: PosterInput, domain: string) {
  const rand = rng(`vintage:${rival.id}`);
  let dots = "";
  for (let y = 0; y < 30; y++)
    for (let x = 0; x < 20; x++) {
      const r = 2 + ((x + y) % 5) * 1.3 * rand();
      dots += `<circle cx="${60 + x * 48}" cy="${520 + y * 18}" r="${r.toFixed(1)}" fill="#18181B" opacity="0.12"/>`;
    }
  return `
  <rect width="${W}" height="${H}" fill="#F4ECD8"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#18181B" stroke-width="6"/>
  <rect x="58" y="58" width="${W - 116}" height="${H - 116}" fill="none" stroke="#CA8A04" stroke-width="3"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="58" y="${300 + i * 34}" width="${W - 116}" height="16" fill="${i % 2 ? "#18181B" : "#CA8A04"}"/>`).join("")}
  ${dots}
  <text x="${W / 2}" y="170" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="9" fill="#18181B">OFFICIAL GAMEDAY PROGRAM</text>
  <text x="${W / 2}" y="250" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="#8A5A00">Kinnick Stadium · Iowa City</text>
  <circle cx="${W / 2}" cy="820" r="250" fill="#EAB308" stroke="#18181B" stroke-width="10"/>
  <circle cx="${W / 2}" cy="820" r="215" fill="none" stroke="#18181B" stroke-width="3" stroke-dasharray="8 10"/>
  <text x="${W / 2}" y="800" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="128" fill="#18181B">IOWA</text>
  <text x="${W / 2}" y="880" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="64" fill="#18181B">vs.</text>
  <text x="${W / 2}" y="1170" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="${Math.min(120, Math.floor(1150 / rival.mascot.length))}" fill="#18181B">${esc(rival.mascot.toUpperCase())}</text>
  <text x="${W / 2}" y="1250" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="42" fill="#8A5A00">${esc(tagline ?? "Fight for Iowa")}</text>
  <text x="${W / 2}" y="1330" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="10" fill="#18181B">★ BIG TEN CONFERENCE ★ 50¢ ★</text>
  ${footer("#18181B", "#8A5A00", domain)}`;
}

function cyber({ rival, tagline }: PosterInput, domain: string) {
  let grid = "";
  const horizon = 900;
  for (let i = -12; i <= 12; i++)
    grid += `<line x1="${W / 2}" y1="${horizon}" x2="${W / 2 + i * 140}" y2="${H}" stroke="#EAB308" stroke-width="1.5" opacity="0.55"/>`;
  for (let j = 0; j < 12; j++) {
    const y = horizon + Math.pow(j / 11, 2) * (H - horizon);
    grid += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="#EAB308" stroke-width="1.5" opacity="${(0.15 + j * 0.04).toFixed(2)}"/>`;
  }
  return `
  <defs>
    <linearGradient id="cy-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#09090B"/><stop offset="0.6" stop-color="#18181B"/><stop offset="1" stop-color="#27272A"/></linearGradient>
    <radialGradient id="cy-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FDE047"/><stop offset="1" stop-color="#CA8A04" stop-opacity="0"/></radialGradient>
    <filter id="cy-glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#cy-bg)"/>
  <circle cx="${W / 2}" cy="${horizon}" r="360" fill="url(#cy-sun)" opacity="0.55"/>
  ${grid}
  <g filter="url(#cy-glow)">${starburst(W / 2, 560, 170, "#EAB308", 16)}</g>
  <circle cx="${W / 2}" cy="560" r="60" fill="#09090B"/>
  <text x="80" y="150" font-family="Menlo, monospace" font-size="28" fill="#EAB308" letter-spacing="6">// PROTOCOL: HAWKEYE_NATION</text>
  <text x="80" y="195" font-family="Menlo, monospace" font-size="24" fill="#71717A">SIM.RUN(IOWA, ${esc(rival.short)}) → READY</text>
  <text x="${W / 2}" y="1010" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="170" fill="#FAFAFA" letter-spacing="-4" filter="url(#cy-glow)">IOWA</text>
  <text x="${W / 2}" y="1120" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="110" fill="none" stroke="#EAB308" stroke-width="3">× ${esc(rival.short)}</text>
  <text x="${W / 2}" y="1220" text-anchor="middle" font-family="Menlo, monospace" font-size="34" fill="#EAB308">${esc((tagline ?? "Swarm mode engaged").toUpperCase())}</text>
  ${footer("#FAFAFA", "#71717A", domain)}`;
}

function kinnick({ rival, tagline }: PosterInput, domain: string) {
  const rand = rng(`kinnick:${rival.id}`);
  let stars = "";
  for (let i = 0; i < 90; i++)
    stars += `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * 520).toFixed(0)}" r="${(rand() * 2 + 0.5).toFixed(1)}" fill="#FFFFFF" opacity="${(rand() * 0.7 + 0.2).toFixed(2)}"/>`;
  let crowd = "";
  for (let i = 0; i < 520; i++) {
    const x = rand() * W;
    const y = 960 + rand() * 170;
    crowd += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(rand() * 3 + 2).toFixed(1)}" fill="${rand() > 0.45 ? "#EAB308" : "#0A0A0A"}" opacity="0.85"/>`;
  }
  const tower = (x: number) => `
    <polygon points="${x},300 ${x - 380},1100 ${x + 380},1100" fill="url(#kn-beam)" opacity="0.35"/>
    <rect x="${x - 70}" y="250" width="140" height="70" rx="6" fill="#18181B"/>
    ${[0, 1, 2, 3].map((c) => [0, 1].map((r) => `<circle cx="${x - 48 + c * 32}" cy="${270 + r * 30}" r="10" fill="#FEF9C3"/>`).join("")).join("")}
    <rect x="${x - 6}" y="320" width="12" height="640" fill="#18181B"/>`;
  return `
  <defs>
    <linearGradient id="kn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020617"/><stop offset="0.55" stop-color="#1E293B"/><stop offset="1" stop-color="#334155"/></linearGradient>
    <linearGradient id="kn-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FEF9C3"/><stop offset="1" stop-color="#FEF9C3" stop-opacity="0"/></linearGradient>
    <linearGradient id="kn-field" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#166534"/><stop offset="1" stop-color="#14532D"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#kn-sky)"/>
  ${stars}
  ${tower(170)}${tower(W - 170)}
  <rect x="0" y="940" width="${W}" height="200" fill="#111827"/>
  ${crowd}
  <polygon points="0,1140 ${W},1140 ${W},${H} 0,${H}" fill="url(#kn-field)"/>
  ${[0, 1, 2, 3, 4].map((i) => `<line x1="0" y1="${1170 + i * 55}" x2="${W}" y2="${1170 + i * 55}" stroke="#FFFFFF" stroke-width="3" opacity="0.5"/>`).join("")}
  <rect x="0" y="1395" width="${W}" height="${H - 1395}" fill="#0A0A0A" opacity="0.8"/>
  <text x="${W / 2}" y="140" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" letter-spacing="12" fill="#FDE68A">SATURDAY NIGHT · KINNICK</text>
  <text x="${W / 2}" y="660" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="96" fill="#FFFFFF">Iowa</text>
  <text x="${W / 2}" y="760" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="46" letter-spacing="10" fill="#EAB308">VS</text>
  <text x="${W / 2}" y="870" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="96" fill="#FFFFFF">${esc(rival.mascot)}</text>
  <text x="${W / 2}" y="1330" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="40" fill="#FFFFFF">${esc(tagline ?? "Under the lights, in the swarm")}</text>
  ${footer("#FFFFFF", "#A1A1AA", domain)}`;
}

function minimal({ rival, tagline }: PosterInput, domain: string) {
  return `
  <rect width="${W}" height="${H}" fill="#FAFAFA"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${80 + i * 78.5}" y1="0" x2="${80 + i * 78.5}" y2="${H}" stroke="#E4E4E7" stroke-width="1"/>`).join("")}
  <text x="80" y="160" font-family="Helvetica, Arial, sans-serif" font-size="28" letter-spacing="6" fill="#71717A">GAMEDAY / BIG TEN</text>
  <text x="${W - 80}" y="160" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#71717A">№ ${esc(rival.short)}-01</text>
  <text x="62" y="520" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="330" letter-spacing="-18" fill="#18181B">IOWA</text>
  <rect x="80" y="585" width="240" height="22" fill="#EAB308"/>
  <text x="80" y="720" font-family="Georgia, serif" font-style="italic" font-size="88" fill="#18181B">versus</text>
  <text x="62" y="1000" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="${rival.short.length > 3 ? 280 : 330}" letter-spacing="-16" fill="#18181B">${esc(rival.short)}</text>
  ${starburst(W - 190, 760, 90, "#EAB308", 12)}
  <text x="80" y="1130" font-family="Helvetica, Arial, sans-serif" font-size="40" fill="#18181B" font-weight="600">${esc(tagline ?? "Predictions that score.")}</text>
  <text x="80" y="1190" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#71717A">Kinnick Stadium — Iowa City, Iowa</text>
  ${footer("#18181B", "#A1A1AA", domain)}`;
}

export function buildPosterSvg(input: PosterInput, domain = "polaslot.fun"): string {
  const body = { vintage, cyber, kinnick, minimal }[input.style](input, domain);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

export const svgToDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Rasterises an SVG string to a PNG data URL in the browser. */
export async function svgToPngDataUrl(svg: string, scale = 1): Promise<string> {
  const img = new Image();
  img.decoding = "async";
  img.src = svgToDataUrl(svg);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}
