import { AFFINITY, REEL_CORE, REEL_RIVALS, REEL_SCENARIO } from "./data";

export type Prediction = {
  coreId: string;
  scenarioId: string;
  rivalId: string;
  likelihood: number; // 0–100, one decimal
  fanConfidence: number; // 0–100, integer
  edge: "Strong" | "Lean" | "Coin Flip" | "Fade";
  insight: string;
  insightSource: "ai" | "model";
  createdAt: string;
};

/** FNV-1a hash → deterministic 0–1 value so a combo always scores the same. */
function hash01(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0xffffffff;
}

const logit = (p: number) => Math.log(p / (1 - p));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function findCombo(coreId: string, scenarioId: string, rivalId: string) {
  const core = REEL_CORE.find((r) => r.id === coreId);
  const scenario = REEL_SCENARIO.find((r) => r.id === scenarioId);
  const rival = REEL_RIVALS.find((r) => r.id === rivalId);
  if (!core || !scenario || !rival) return null;
  return { core, scenario, rival };
}

export function scoreCombo(coreId: string, scenarioId: string, rivalId: string) {
  const combo = findCombo(coreId, scenarioId, rivalId);
  if (!combo) return null;
  const { core, scenario, rival } = combo;

  const key = `${core.id}:${scenario.id}`;
  const jitter = (hash01(`${key}:${rival.id}`) - 0.5) * 0.5; // ±0.25 logit
  const x =
    logit(core.weight) * 0.55 +
    logit(scenario.weight) * 0.75 +
    (AFFINITY[key] ?? 0) -
    (rival.strength - 0.65) * 2.4 +
    0.35 + // Kinnick home-field bump
    jitter;

  const likelihood = Math.round(clamp(sigmoid(x) * 100, 6, 94) * 10) / 10;
  const hype = hash01(`hype:${rival.id}:${core.id}`) * 14 - 4;
  const fanConfidence = Math.round(clamp(likelihood + hype + 6, 5, 98));
  const edge: Prediction["edge"] =
    likelihood >= 68 ? "Strong" : likelihood >= 55 ? "Lean" : likelihood >= 45 ? "Coin Flip" : "Fade";

  return { ...combo, likelihood, fanConfidence, edge };
}

const CORE_ANGLES: Record<string, string> = {
  mcnamara: "Play-action off the stretch look is the lever — keep the safeties honest and the intermediate window opens",
  kjohnson: "Iowa wins this on first-down efficiency: 5+ yards on early downs keeps the playbook fully open",
  parker: "Parker's disguised quarters shell should force the QB into late reads and contested throws",
  redzone: "Inside the 20, the Kinnick front compresses the field — expect bracketed coverage on the top target",
  special: "Field position is the silent killer here — a +8 yard average starting spot is worth a full score",
};

const RIVAL_ANGLES: Record<string, string> = {
  michigan: "Michigan's physical front means the trenches decide it.",
  ohiostate: "Ohio State's explosive-play rate is the biggest threat — limit chunk gains over 20 yards.",
  wisconsin: "A Heartland Trophy grinder: fewest mistakes wins.",
  nebraska: "Black Friday weather and turnovers historically swing this one late.",
  minnesota: "Floyd of Rosedale games tend to shorten — every possession counts.",
  washington: "A Friday-night trip to Seattle: crowd noise and a two-hour time shift test communication early.",
  northwestern: "Low-possession, field-position football — the hidden-yardage battle usually decides it.",
  purdue: "Purdue's pass-heavy looks invite Iowa's zone defense to jump routes and set up short fields.",
  illinois: "Illinois wins with tempo in the middle of the field — tackling in space is the key.",
};

export function templateInsight(coreId: string, rivalId: string): string {
  return `${CORE_ANGLES[coreId] ?? "Execution in the trenches is the key"}. ${RIVAL_ANGLES[rivalId] ?? ""}`.trim();
}
