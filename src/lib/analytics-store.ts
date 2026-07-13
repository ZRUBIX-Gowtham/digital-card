import { type EventType, ACTION_TYPES } from "./analytics-types";

const STORAGE_KEY = "zx_analytics_events";

export type { EventType };
export { ACTION_TYPES };

export interface CardEvent {
  cardSlug: string;
  type: EventType;
  at: string;
  ref?: string;
}

function isServer() {
  return typeof window === "undefined";
}

function readAll(): CardEvent[] {
  if (isServer()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CardEvent[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeAll(events: CardEvent[]): void {
  if (isServer()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

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

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalActions: number;
  daily: { date: string; label: string; views: number }[];
  actions: { type: EventType; count: number }[];
  referrers: { host: string; count: number }[];
}

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
