import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase-1 file-based analytics. Every meaningful interaction on a public card
 * (a view, or a tap on call / whatsapp / email / directions / save-contact /
 * form submit) is logged as one event in `.data/events.json`. The dashboard
 * aggregates these into per-day views, a click breakdown and top referrers.
 *
 * Mirrors `cards-store.ts`; Phase 2 swaps the file for a DB / analytics table.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "events.json");

export type EventType =
  | "view"
  | "call"
  | "whatsapp"
  | "email"
  | "map"
  | "save-contact"
  | "enquiry"
  | "booking";

/** Interaction types (everything except a plain page view). */
export const ACTION_TYPES: EventType[] = [
  "call",
  "whatsapp",
  "email",
  "map",
  "save-contact",
  "enquiry",
  "booking",
];

export interface CardEvent {
  cardSlug: string;
  type: EventType;
  /** ISO timestamp. */
  at: string;
  /** Referrer host, when the visit came from another site. */
  ref?: string;
}

function readAll(): CardEvent[] {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw) as CardEvent[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* no events yet */
  }
  return [];
}

function writeAll(events: CardEvent[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(events), "utf8");
}

/** Append one event. `ref` is normalised to a bare host. */
export function logEvent(
  cardSlug: string,
  type: EventType,
  ref?: string,
): void {
  const all = readAll();
  all.push({ cardSlug, type, at: new Date().toISOString(), ref: cleanHost(ref) });
  writeAll(all);
}

function cleanHost(ref?: string): string | undefined {
  if (!ref) return undefined;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return host || undefined;
  } catch {
    return undefined;
  }
}

/** Local YYYY-MM-DD key for a date. */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalActions: number;
  /** Chronological, one entry per day for the last `days` days. */
  daily: { date: string; label: string; views: number }[];
  /** Count per action type (call, whatsapp, …), excluding views. */
  actions: { type: EventType; count: number }[];
  /** Most common referrer hosts, busiest first. */
  referrers: { host: string; count: number }[];
}

/**
 * Aggregate a card's events into everything the dashboard chart needs.
 * `days` controls the width of the daily-views series (default 14).
 */
export function analyticsForCard(cardSlug: string, days = 14): AnalyticsSummary {
  const events = readAll().filter((e) => e.cardSlug === cardSlug);

  const viewsByDay = new Map<string, number>();
  const actionCounts = new Map<EventType, number>();
  const referrerCounts = new Map<string, number>();
  let totalViews = 0;
  let totalActions = 0;

  for (const e of events) {
    if (e.type === "view") {
      totalViews++;
      const key = dayKey(new Date(e.at));
      viewsByDay.set(key, (viewsByDay.get(key) ?? 0) + 1);
      if (e.ref) referrerCounts.set(e.ref, (referrerCounts.get(e.ref) ?? 0) + 1);
    } else {
      totalActions++;
      actionCounts.set(e.type, (actionCounts.get(e.type) ?? 0) + 1);
    }
  }

  const daily: AnalyticsSummary["daily"] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dayKey(d);
    daily.push({
      date: key,
      label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      views: viewsByDay.get(key) ?? 0,
    });
  }

  const actions = ACTION_TYPES.map((type) => ({
    type,
    count: actionCounts.get(type) ?? 0,
  })).filter((a) => a.count > 0);

  const referrers = [...referrerCounts.entries()]
    .map(([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return { totalViews, totalActions, daily, actions, referrers };
}
