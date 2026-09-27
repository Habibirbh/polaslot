export type ReelItem = {
  id: string;
  label: string;
  tag: string;
  /** Baseline success rate for this unit/scenario, 0–1. */
  weight: number;
};

export type Rival = ReelItem & {
  name: string;
  short: string;
  mascot: string;
  /** Opponent strength, 0–1. Higher = harder matchup. */
  strength: number;
  colors: [string, string];
};

export const REEL_CORE: ReelItem[] = [
  { id: "mcnamara", label: "Cade McNamara Passing", tag: "Offense", weight: 0.48 },
  { id: "kjohnson", label: "Kaleb Johnson Ground Game", tag: "Offense", weight: 0.64 },
  { id: "parker", label: "Phil Parker Defense", tag: "Defense", weight: 0.72 },
  { id: "redzone", label: "Kinnick Red Zone D", tag: "Defense", weight: 0.69 },
  { id: "special", label: "Special Teams Hidden Yards", tag: "Special Teams", weight: 0.63 },
];

export const REEL_SCENARIO: ReelItem[] = [
  { id: "rush", label: "Over 27.5 Rush Attempts", tag: "Prop", weight: 0.58 },
  { id: "turnover", label: "Turnover Forced Inside 20", tag: "Defense", weight: 0.41 },
  { id: "spread", label: "Cover -3.5 Spread", tag: "Line", weight: 0.5 },
  { id: "comeback", label: "4th Quarter Comeback Drive", tag: "Clutch", weight: 0.33 },
  { id: "under", label: "Under 38.5 Total Points", tag: "Total", weight: 0.56 },
];

/** Iowa's nine 2026 Big Ten opponents, in schedule order. */
export const REEL_RIVALS: Rival[] = [
  { id: "michigan", name: "Michigan", label: "vs. Michigan Wolverines", short: "MICH", mascot: "Wolverines", tag: "Big Ten", weight: 0, strength: 0.8, colors: ["#00274C", "#FFCB05"] },
  { id: "ohiostate", name: "Ohio State", label: "vs. Ohio State", short: "OSU", mascot: "Buckeyes", tag: "Big Ten", weight: 0, strength: 0.9, colors: ["#BB0000", "#666666"] },
  { id: "washington", name: "Washington", label: "vs. Washington Huskies", short: "UW", mascot: "Huskies", tag: "Big Ten", weight: 0, strength: 0.7, colors: ["#4B2E83", "#B7A57A"] },
  { id: "minnesota", name: "Minnesota", label: "vs. Minnesota", short: "MINN", mascot: "Golden Gophers", tag: "Floyd of Rosedale", weight: 0, strength: 0.58, colors: ["#7A0019", "#FFCC33"] },
  { id: "wisconsin", name: "Wisconsin", label: "vs. Wisconsin Badgers", short: "WIS", mascot: "Badgers", tag: "Heartland Trophy", weight: 0, strength: 0.6, colors: ["#C5050C", "#FFFFFF"] },
  { id: "northwestern", name: "Northwestern", label: "vs. Northwestern Wildcats", short: "NU", mascot: "Wildcats", tag: "Big Ten", weight: 0, strength: 0.5, colors: ["#4E2A84", "#FFFFFF"] },
  { id: "purdue", name: "Purdue", label: "vs. Purdue Boilermakers", short: "PUR", mascot: "Boilermakers", tag: "Big Ten", weight: 0, strength: 0.42, colors: ["#000000", "#CFB991"] },
  { id: "illinois", name: "Illinois", label: "vs. Illinois Fighting Illini", short: "ILL", mascot: "Fighting Illini", tag: "Big Ten", weight: 0, strength: 0.68, colors: ["#E84A27", "#13294B"] },
  { id: "nebraska", name: "Nebraska", label: "vs. Nebraska", short: "NEB", mascot: "Cornhuskers", tag: "Heroes Game", weight: 0, strength: 0.56, colors: ["#E41C38", "#FDF2D9"] },
];

/** Schedule-shaped opponent info for a Big Ten rival, so ratings live in one place. */
function team(id: string): ScheduleGame["opponent"] {
  const r = REEL_RIVALS.find((r) => r.id === id)!;
  return { name: r.name, mascot: r.mascot, short: r.short, strength: r.strength };
}

/** Extra logit nudges for units that naturally fit a scenario. */
export const AFFINITY: Record<string, number> = {
  "kjohnson:rush": 0.9,
  "kjohnson:spread": 0.25,
  "mcnamara:comeback": 0.35,
  "mcnamara:rush": -0.35,
  "parker:turnover": 0.7,
  "parker:under": 0.8,
  "redzone:turnover": 0.85,
  "redzone:under": 0.6,
  "special:spread": 0.3,
  "special:comeback": 0.2,
};

export const POSTER_STYLES = [
  { id: "vintage", label: "Vintage 1970s Big Ten Program", blurb: "Halftone print, cream stock, retro stripes" },
  { id: "cyber", label: "Modern Cyber Hawkeye", blurb: "Charcoal chrome, gold neon grid" },
  { id: "kinnick", label: "Kinnick Stadium Under Lights", blurb: "Night sky, light towers, black-and-gold crowd" },
  { id: "minimal", label: "Minimalist Typographic", blurb: "Swiss grid, bold type, one gold accent" },
] as const;

export type PosterStyleId = (typeof POSTER_STYLES)[number]["id"];

export type BeatItem = {
  id: string;
  kind: "Podcast" | "Postgame" | "Film Study" | "Recruiting" | "Injury Report";
  title: string;
  summary: string;
  duration: string;
  published: string;
  tags: string[];
  hot?: boolean;
};

/**
 * Seed content for the Beat Digest. Replace with a live HawkeyeReport feed
 * (RSS / X API / CMS) when available.
 */
export const BEAT_FEED: BeatItem[] = [
  {
    id: "stunner-michigan",
    kind: "Film Study",
    title: "The Stunner Over Michigan: Film Study & Defensive Dominance",
    summary:
      "Every third-down stop broken down snap by snap — how Phil Parker's quarters looks baited two red-zone throws and flipped the field.",
    duration: "48 min",
    published: "2h ago",
    tags: ["Defense", "Michigan", "All-22"],
    hot: true,
  },
  {
    id: "postgame-pod",
    kind: "Podcast",
    title: "HawkeyeReport Postgame Pod: Kinnick Was Rocking",
    summary:
      "Instant reactions from the press box, locker-room quotes, and the three plays that decided the fourth quarter.",
    duration: "1 hr 12 min",
    published: "6h ago",
    tags: ["Postgame", "Reactions"],
  },
  {
    id: "run-game",
    kind: "Postgame",
    title: "Ground-and-Pound Report: 31 Carries, Zero Apologies",
    summary:
      "Outside zone efficiency, pin-and-pull success rates, and why the offensive line graded out as the best in the Big Ten this week.",
    duration: "9 min read",
    published: "Yesterday",
    tags: ["Offense", "O-Line"],
  },
  {
    id: "injury-wed",
    kind: "Injury Report",
    title: "Wednesday Availability: Secondary Depth Under the Microscope",
    summary:
      "Two corners listed as limited in practice. What the rotation looks like if the nickel spot needs a true freshman.",
    duration: "4 min read",
    published: "Yesterday",
    tags: ["Injuries", "Secondary"],
  },
  {
    id: "recruiting-visit",
    kind: "Recruiting",
    title: "Official Visit Weekend: Four-Star Edge Rusher Locks In Kinnick Trip",
    summary:
      "Recruiting desk breakdown of the 2027 class, positional needs, and which in-state targets are trending black and gold.",
    duration: "6 min read",
    published: "2d ago",
    tags: ["Recruiting", "2027 Class"],
  },
  {
    id: "power-pod",
    kind: "Podcast",
    title: "Big Ten Power Hour: Where Iowa Really Stands",
    summary:
      "Strength of schedule, rest-of-season win probabilities, and the path to Indianapolis — with listener mailbag.",
    duration: "58 min",
    published: "3d ago",
    tags: ["Big Ten", "Rankings"],
  },
];

export const AI_INSIGHTS = [
  { kind: "Injury", tone: "rose", text: "2 DBs limited Wed — nickel depth is the swing factor vs. spread looks." },
  { kind: "Power Rating", tone: "amber", text: "Iowa climbs to #5 in PolaSlot Big Ten ratings (+1.8 pts after defensive surge)." },
  { kind: "Recruiting", tone: "sky", text: "Official-visit weekend: 3 in-state 2027 targets on campus; edge rusher is the headliner." },
  { kind: "Trend", tone: "emerald", text: "Hawkeyes 9–2 ATS as home underdogs at Kinnick over the sample window." },
] as const;

/** Placeholder portraits (randomuser.me) — swap for real community members when available. */
export const HERO_AVATARS = [
  { src: "/avatars/men-32.jpg", alt: "Hawkeye fan" },
  { src: "/avatars/women-44.jpg", alt: "Collegiate analyst" },
  { src: "/avatars/men-75.jpg", alt: "Hawkeye fan" },
  { src: "/avatars/women-68.jpg", alt: "Sports journalist" },
];

export type ScheduleGame = {
  /** YYYY-MM-DD in Central time. */
  date: string;
  /** ISO kickoff with offset, or null while the time is TBA. */
  kickoff: string | null;
  home: boolean;
  location: string;
  tv?: string;
  /** Trophy / event label shown next to the venue. */
  tag?: string;
  opponent: { name: string; mascot: string; short: string; strength: number };
};

/**
 * Official 2026 Iowa football schedule (hawkeyesports.com, as of Sept 27, 2026).
 * Update `kickoff` as TBA times are announced (usually 6–12 days before the game).
 */
export const GAMEDAY_SCHEDULE: ScheduleGame[] = [
  { date: "2026-09-05", kickoff: "2026-09-05T15:15:00-05:00", home: true, location: "Kinnick Stadium, Iowa City", tv: "BTN", tag: "Fry Fest", opponent: { name: "Northern Illinois", mascot: "Huskies", short: "NIU", strength: 0.3 } },
  { date: "2026-09-12", kickoff: "2026-09-12T18:30:00-05:00", home: true, location: "Kinnick Stadium, Iowa City", tv: "NBC", tag: "Cy-Hawk Trophy", opponent: { name: "Iowa State", mascot: "Cyclones", short: "ISU", strength: 0.62 } },
  { date: "2026-09-19", kickoff: "2026-09-19T15:00:00-05:00", home: true, location: "Kinnick Stadium, Iowa City", tv: "FS1", opponent: { name: "UNI", mascot: "Panthers", short: "UNI", strength: 0.15 } },
  { date: "2026-09-26", kickoff: null, home: false, location: "Ann Arbor, Mich.", opponent: team("michigan") },
  { date: "2026-10-03", kickoff: "2026-10-03T14:30:00-05:00", home: true, location: "Kinnick Stadium, Iowa City", tv: "CBS", tag: "Big Ten home opener", opponent: team("ohiostate") },
  { date: "2026-10-09", kickoff: "2026-10-09T20:00:00-05:00", home: false, location: "Seattle, Wash.", tv: "FOX or FS1", tag: "Friday night", opponent: team("washington") },
  { date: "2026-10-24", kickoff: null, home: false, location: "Minneapolis, Minn.", tag: "Floyd of Rosedale", opponent: team("minnesota") },
  { date: "2026-10-31", kickoff: null, home: true, location: "Kinnick Stadium, Iowa City", tag: "Homecoming · Heartland Trophy", opponent: team("wisconsin") },
  { date: "2026-11-07", kickoff: null, home: false, location: "Evanston, Ill.", opponent: team("northwestern") },
  { date: "2026-11-14", kickoff: null, home: true, location: "Kinnick Stadium, Iowa City", opponent: team("purdue") },
  { date: "2026-11-21", kickoff: null, home: false, location: "Champaign, Ill.", opponent: team("illinois") },
  { date: "2026-11-27", kickoff: "2026-11-27T11:00:00-06:00", home: true, location: "Kinnick Stadium, Iowa City", tv: "CBS", tag: "Heroes Trophy · Black Friday", opponent: team("nebraska") },
];
