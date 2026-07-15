import "server-only";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc, doc, setDoc, increment } from "firebase/firestore";
import { parseUserAgent, type DeviceKind } from "@/lib/ua";
import { pulseDocPath } from "@/lib/pulse";

export type EventType =
  | "view"
  | "call"
  | "whatsapp"
  | "email"
  | "map"
  | "save-contact"
  | "pay"
  | "enquiry"
  | "booking";

export const ACTION_TYPES: EventType[] = [
  "call",
  "whatsapp",
  "email",
  "map",
  "save-contact",
  "pay",
  "enquiry",
  "booking",
];

/**
 * Where/how a visitor reached the card, derived server-side from the request
 * headers (User-Agent + the platform's geo-IP headers). Every field is optional
 * — locally there are no geo headers, and some UA strings can't be classified.
 */
export interface VisitMeta {
  os?: string;
  browser?: string;
  device?: DeviceKind;
  country?: string; // ISO 3166-1 alpha-2, e.g. "IN"
  region?: string;
  city?: string;
  lat?: number;
  lng?: number;
}

export interface CardEvent extends VisitMeta {
  cardSlug: string;
  type: EventType;
  at: string;
  ref?: string;
}

/** A `Headers`-like object — both `Request.headers` and `next/headers` fit. */
type HeaderGetter = { get(name: string): string | null };

/**
 * Build a {@link VisitMeta} from the incoming request headers. The geo headers
 * are set by Vercel's edge network (absent in local dev, which is fine — those
 * fields just stay empty). City names arrive URL-encoded.
 */
export function metaFromHeaders(h: HeaderGetter): VisitMeta {
  const { os, browser, device } = parseUserAgent(h.get("user-agent") ?? "");
  const meta: VisitMeta = { os, browser, device };

  const country = h.get("x-vercel-ip-country");
  if (country) meta.country = country;

  const region = h.get("x-vercel-ip-country-region");
  if (region) meta.region = region;

  const city = h.get("x-vercel-ip-city");
  if (city) meta.city = safeDecode(city);

  const lat = toNum(h.get("x-vercel-ip-latitude"));
  const lng = toNum(h.get("x-vercel-ip-longitude"));
  if (lat !== undefined && lng !== undefined) {
    meta.lat = lat;
    meta.lng = lng;
  }
  return meta;
}

function safeDecode(v: string): string {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function toNum(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function logEvent(
  cardSlug: string,
  type: EventType,
  ref?: string,
  meta?: VisitMeta,
): Promise<void> {
  if (!cardSlug) return;
  try {
    const event: CardEvent = {
      cardSlug,
      type,
      at: new Date().toISOString(),
    };
    const cleanRef = cleanHost(ref);
    if (cleanRef) {
      event.ref = cleanRef;
    }
    // Firestore rejects `undefined`, so copy only the fields we actually have.
    if (meta) {
      const target = event as unknown as Record<string, unknown>;
      for (const [k, v] of Object.entries(meta)) {
        if (v !== undefined && v !== null) target[k] = v;
      }
    }
    await addDoc(collection(db, "cards", cardSlug, "analytics"), event);

    // Bump the card's pulse counter so any open dashboard refreshes in real
    // time. Best-effort and non-sensitive (just a counter) — never block on it.
    try {
      await setDoc(
        doc(db, ...pulseDocPath(cardSlug)),
        { n: increment(1), at: event.at },
        { merge: true },
      );
    } catch {
      /* pulse is optional */
    }
  } catch (error) {
    console.error("Error logging analytics event:", error);
  }
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

export interface Breakdown {
  name: string;
  count: number;
}

/** One dot on the map — a single visit, at that visit's geo-IP coordinates. */
export interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
}

/** One row in the "recent visitors" report. */
export interface VisitRow {
  at: string;
  device?: string;
  os?: string;
  browser?: string;
  location?: string;
}

export interface AnalyticsSummary {
  /** Every view in the window — one per page load (matches the raw counter). */
  totalViews: number;
  /** Views after collapsing repeat loads from the same visitor. */
  uniqueVisits: number;
  totalActions: number;
  daily: { date: string; label: string; views: number }[];
  actions: { type: EventType; count: number }[];
  referrers: { host: string; count: number }[];
  devices: Breakdown[];
  browsers: Breakdown[];
  operatingSystems: Breakdown[];
  locations: Breakdown[];
  points: GeoPoint[];
  visits: VisitRow[];
}

/** Cap how many dots/rows we ship to the browser, newest first. */
const MAX_POINTS = 2000;
const MAX_VISIT_ROWS = 60;

/**
 * Two views from the same visitor within this window count as a single visit.
 * The public card is `force-dynamic`, so a prefetch, a double navigation or a
 * link-unfurl bot can log the same open twice (often one request resolves the
 * city and the other only the country) — this collapses those into one.
 */
const VIEW_DEDUPE_MS = 5 * 60 * 1000;

const DEVICE_LABELS: Record<DeviceKind, string> = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
};

let regionNames: Intl.DisplayNames | undefined;
function countryName(code: string): string {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Sort a count map into a descending [{name, count}] list, keeping the top N. */
function topBreakdown(counts: Map<string, number>, limit = 8): Breakdown[] {
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** The date windows the dashboard can filter analytics by. */
export type RangeKey = "today" | "7d" | "30d" | "all";

/** Days each range covers — `undefined` means all time (no cutoff). */
export const RANGE_DAYS: Record<RangeKey, number | undefined> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  all: undefined,
};

export const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  all: "All time",
};

/** Narrow an arbitrary string (e.g. a URL param) to a valid range key. */
export function toRangeKey(value: string | undefined): RangeKey {
  return value && value in RANGE_DAYS ? (value as RangeKey) : "7d";
}

/** "City, Country" for a visit — either part may be missing. */
function placeLabel(e: VisitMeta): string {
  return [e.city, e.country ? countryName(e.country) : undefined]
    .filter(Boolean)
    .join(", ");
}

/**
 * Fetch a card's events, newest-first, with duplicate views collapsed and the
 * list clipped to the requested window. Shared by the dashboard summary and the
 * CSV export so both see exactly the same visits. `chartDays` is how many daily
 * bars the summary should draw for the resolved window.
 */
async function loadEvents(
  cardSlug: string,
  rangeDays?: number,
): Promise<{
  events: CardEvent[];
  chartDays: number;
  rawViews: number;
  viewsByDayRaw: Map<string, number>;
}> {
  let events: CardEvent[] = [];
  try {
    const q = query(collection(db, "cards", cardSlug, "analytics"));
    const snap = await getDocs(q);
    events = snap.docs.map((d) => d.data() as CardEvent);
  } catch (error) {
    console.error("Error fetching analytics for card:", error);
  }

  // Newest first, so the map dots and the recent-visitors table both show the
  // latest activity (and we keep the most recent when we hit the caps).
  events.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));

  // Restrict everything to the selected window (undefined = all time). Days are
  // counted as whole calendar days ending today, matching the chart.
  const now = new Date();
  let chartDays: number;
  if (rangeDays && rangeDays > 0) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (rangeDays - 1));
    const cutoff = start.getTime();
    events = events.filter((e) => Date.parse(e.at) >= cutoff);
    chartDays = rangeDays;
  } else {
    // All time: size the daily chart to span from the first recorded event.
    const oldest = events.length ? Date.parse(events[events.length - 1].at) : now.getTime();
    const span = Math.ceil((now.getTime() - oldest) / 86_400_000) + 1;
    chartDays = Math.min(90, Math.max(7, span));
  }

  // Raw view totals — counted from every load in the window, before dedupe, so
  // the "Total views" stat and the daily chart match the running page counter.
  let rawViews = 0;
  const viewsByDayRaw = new Map<string, number>();
  for (const e of events) {
    if (e.type !== "view") continue;
    rawViews++;
    const key = dayKey(new Date(e.at));
    viewsByDayRaw.set(key, (viewsByDayRaw.get(key) ?? 0) + 1);
  }

  // Collapse duplicate views from the same visitor (prefetch, double-load or a
  // link-unfurl bot) so one open counts as one visit — this feeds the "Unique
  // visits" stat and every breakdown. Actions are always kept; only views with
  // a matching device/OS/browser/country in the dedupe window are dropped, and
  // the newest (most detailed) one survives.
  const deduped: CardEvent[] = [];
  let lastView: { t: number; fp: string } | undefined;
  for (const e of events) {
    if (e.type === "view") {
      const t = Date.parse(e.at);
      const fp = `${e.device ?? ""}|${e.os ?? ""}|${e.browser ?? ""}|${e.country ?? ""}`;
      if (lastView && lastView.fp === fp && lastView.t - t <= VIEW_DEDUPE_MS) {
        continue;
      }
      lastView = { t, fp };
    }
    deduped.push(e);
  }

  return { events: deduped, chartDays, rawViews, viewsByDayRaw };
}

export async function analyticsForCard(
  cardSlug: string,
  rangeDays?: number,
): Promise<AnalyticsSummary> {
  const { events, chartDays, rawViews, viewsByDayRaw } = await loadEvents(cardSlug, rangeDays);
  const now = new Date();

  const actionCounts = new Map<EventType, number>();
  const referrerCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const browserCounts = new Map<string, number>();
  const osCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();
  const points: GeoPoint[] = [];
  const visits: VisitRow[] = [];
  let uniqueVisits = 0;
  let totalActions = 0;

  const bump = (m: Map<string, number>, key?: string) => {
    if (key) m.set(key, (m.get(key) ?? 0) + 1);
  };

  for (const e of events) {
    if (e.type === "view") {
      uniqueVisits++;
      if (e.ref) referrerCounts.set(e.ref, (referrerCounts.get(e.ref) ?? 0) + 1);

      // One row per visit for the "recent visitors" report.
      if (visits.length < MAX_VISIT_ROWS) {
        visits.push({
          at: e.at,
          device: e.device ? DEVICE_LABELS[e.device] : undefined,
          os: e.os,
          browser: e.browser,
          location: placeLabel(e) || undefined,
        });
      }
    } else {
      totalActions++;
      actionCounts.set(e.type, (actionCounts.get(e.type) ?? 0) + 1);
    }

    // Visitor breakdowns are counted across every event so a card with lots of
    // taps but few reloads still shows a representative audience.
    bump(deviceCounts, e.device ? DEVICE_LABELS[e.device] : undefined);
    bump(browserCounts, e.browser);
    bump(osCounts, e.os);

    // Group locations by country so every visit within a country rolls up into
    // one row (e.g. "Chennai, India" and a city-less "India" both count as
    // India) — the city stays visible in the map dots and recent-visitors table.
    const region = e.country ? countryName(e.country) : e.city;
    if (region) bump(locationCounts, region);

    // Every visit with coordinates becomes its own dot — the map jitters
    // overlapping city-level points so each visitor is individually visible.
    if (typeof e.lat === "number" && typeof e.lng === "number" && points.length < MAX_POINTS) {
      points.push({ lat: e.lat, lng: e.lng, label: placeLabel(e) || "Unknown" });
    }
  }

  const daily: AnalyticsSummary["daily"] = [];
  for (let i = chartDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = dayKey(d);
    daily.push({
      date: key,
      label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      views: viewsByDayRaw.get(key) ?? 0,
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

  return {
    totalViews: rawViews,
    uniqueVisits,
    totalActions,
    daily,
    actions,
    referrers,
    devices: topBreakdown(deviceCounts, 3),
    browsers: topBreakdown(browserCounts),
    operatingSystems: topBreakdown(osCounts),
    locations: topBreakdown(locationCounts, 8),
    points,
    visits,
  };
}

/** Escape one CSV field: wrap in quotes and double any embedded quotes. */
function csvField(value: string | number | undefined): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * Build a CSV of every visit (view event) in the window — one row per visit,
 * uncapped, newest first. Used by the analytics "Export CSV" download.
 */
export async function visitsCsvForCard(cardSlug: string, rangeDays?: number): Promise<string> {
  const { events } = await loadEvents(cardSlug, rangeDays);
  const header = ["When (ISO)", "Location", "Country", "Device", "OS", "Browser", "Referrer"];
  const rows = [header.map(csvField).join(",")];

  for (const e of events) {
    if (e.type !== "view") continue;
    rows.push(
      [
        csvField(e.at),
        csvField(placeLabel(e)),
        csvField(e.country ? countryName(e.country) : ""),
        csvField(e.device ? DEVICE_LABELS[e.device] : ""),
        csvField(e.os),
        csvField(e.browser),
        csvField(e.ref),
      ].join(","),
    );
  }

  // Prepend a BOM so Excel opens UTF-8 city names (e.g. accented places) right.
  return "﻿" + rows.join("\r\n");
}
