// Typed wrapper around eventMenus.json, the single source for the four
// prix-fixe event menus, wine pairings, additions, rooms and FAQ.
// The JSON is also read by Node scripts (the planner PDF and its drift guard),
// so the data stays in the .json file and only types and helpers live here.
import data from "./eventMenus.json";

export type MenuTier = "lunch35" | "dinner65" | "dinner80" | "dinner120"; // identical to the calculator's keys
export type TierAnchor = "lunch-35" | "dinner-65" | "dinner-80" | "dinner-120"; // permanent DOM ids
export type Diet = "vegetarian" | "vegan" | "gluten-free" | "pescatarian"; // rendered as plain words, never badges
export type ServiceRule = "all" | "shared" | "choose-one";

export interface Dish {
  name: string;
  desc: string;
  diet?: Diet[];
}
export interface Course {
  label: string;
  rule: ServiceRule;
  isMain?: boolean;
  dishes: Dish[];
}
export interface Tier {
  key: MenuTier;
  anchor: TierAnchor;
  price: number;
  name: "Lunch" | "Dinner" | "Premier dinner";
  meal: "lunch" | "dinner";
  note?: string; // "Lunch only"
  coursesLabel: string; // at a glance
  mainsSummary: string[]; // at a glance; short names, diet in words
  alsoServed: string; // at a glance
  winePairing: boolean; // false for lunch35 (the page lists none today)
  calcLabel: string; // FROZEN: GA quote_submit event_label and the Formspree payload
  calcDesc: string; // the calculator's one-line description
  courses: Course[];
}
export interface WinePairing {
  key: "none" | "standard" | "rare" | "legendary";
  label: string; // FROZEN
  displayName: string;
  price: number;
  desc: string;
}
export interface Addition {
  key: string; // FROZEN
  label: string; // FROZEN
  price: number;
  desc: string;
  includedIn120: boolean;
}
export interface HorsDoeuvre {
  key: string; // FROZEN
  label: string; // FROZEN
  price: number;
  desc: string;
}
export interface Room {
  name: string;
  capacity: string;
  note: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface Terms {
  gratuity: string;
  tax: string;
  deposit: string;
  headcount: string;
  ordering: string;
}

// JSON imports widen literals to string, hence the casts.
export const TIERS = data.tiers as Tier[]; // order: lunch35, dinner65, dinner80, dinner120
export const TIER_BY_KEY = Object.fromEntries(TIERS.map((t) => [t.key, t])) as Record<MenuTier, Tier>;
export const WINE_PAIRINGS = data.winePairings as WinePairing[]; // includes "none"
export const ADDITIONS: Addition[] = data.additions;
export const HORS_DOEUVRES: HorsDoeuvre[] = data.horsDoeuvres;
export const ROOMS: Room[] = data.rooms;
export const FAQ: Faq[] = data.faq; // drives both the visible <dl> and the JSON-LD
export const AS_OF: string = data.asOf;
export const TERMS: Terms = data.terms; // booking terms, confirmed by the owner 2026-09-22

export const SERVICE_TEXT: Record<ServiceRule, string> = {
  all: "served to every guest",
  shared: "for the table, family style",
  "choose-one": "each guest chooses one",
};

export const EVENT_MENUS_PATH = "/banquet-catering";
export const CATERING_HREF = "/banquet-catering?tab=catering";
export const CANONICAL_ORIGIN = "https://www.andiamoinbanca.com";
export const SECTION_IDS = {
  rates: "rates",
  wine: "wine-pairings",
  additions: "additions",
  rooms: "rooms",
  questions: "questions",
  estimate: "quote-calculator",
  orderCatering: "order-catering",
} as const;

// Cross-page tier link, for wouter <Link>. On /banquet-catering itself use a native <a href="#anchor">.
export const tierHref = (k: MenuTier) => `${EVENT_MENUS_PATH}#${TIER_BY_KEY[k].anchor}`;
// Copy-link target. Always the canonical origin, never window.origin (previews, www-less hosts).
export const tierShareUrl = (k: MenuTier) => `${CANONICAL_ORIGIN}${tierHref(k)}`;
export const tierLabel = (k: MenuTier) => `${TIER_BY_KEY[k].name} · $${TIER_BY_KEY[k].price}`; // "Dinner · $80"

// Linked from the page only when published is true; flipped in the JSON once Will approves the PDF.
export const PLANNER_PDF = data.pdf as {
  href: "/andiamo-event-menus.pdf";
  published: boolean;
  edition: "rates" | "full";
};
