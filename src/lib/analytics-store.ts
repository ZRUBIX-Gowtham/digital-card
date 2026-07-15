import "server-only";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { parseUserAgent, type DeviceKind } from "@/lib/ua";

export type EventType =
  | "view"
  | "call"
  | "whatsapp"
  | "email"
  | "map"
  | "save-contact"
  | "enquiry"
  | "booking";

export const ACTION_TYPES: EventType[] = [
  "call",
  "whatsapp",
  "email",
  "map",
  "save-contact",
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
  totalViews: number;
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

export async function analyticsForCard(cardSlug: string, days = 14): Promise<AnalyticsSummary> {
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

  const viewsByDay = new Map<string, number>();
  const actionCounts = new Map<EventType, number>();
  const referrerCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const browserCounts = new Map<string, number>();
  const osCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();
  const points: GeoPoint[] = [];
  const visits: VisitRow[] = [];
  let totalViews = 0;
  let totalActions = 0;

  const bump = (m: Map<string, number>, key?: string) => {
    if (key) m.set(key, (m.get(key) ?? 0) + 1);
  };
  const placeLabel = (e: CardEvent): string =>
    [e.city, e.country ? countryName(e.country) : undefined].filter(Boolean).join(", ");

  for (const e of events) {
    if (e.type === "view") {
      totalViews++;
      const key = dayKey(new Date(e.at));
      viewsByDay.set(key, (viewsByDay.get(key) ?? 0) + 1);
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

    const label = placeLabel(e);
    if (label) bump(locationCounts, label);

    // Every visit with coordinates becomes its own dot — the map jitters
    // overlapping city-level points so each visitor is individually visible.
    if (typeof e.lat === "number" && typeof e.lng === "number" && points.length < MAX_POINTS) {
      points.push({ lat: e.lat, lng: e.lng, label: label || "Unknown" });
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

  return {
    totalViews,
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
