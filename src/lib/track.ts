/**
 * Client-side interaction tracking. Fires a fire-and-forget beacon to
 * `/api/track` so the owner's analytics can count taps on Call, WhatsApp, etc.
 *
 * Uses `navigator.sendBeacon` because most of these actions (tel:, mailto:,
 * external links) navigate the page away immediately — a normal `fetch` would
 * be cancelled, but a beacon is guaranteed to be delivered by the browser.
 */
import type { EventType } from "@/lib/analytics-store";

/** Action types a visitor can trigger from the public card. */
export type TrackAction = Exclude<EventType, "view">;

export function trackAction(slug: string, type: TrackAction): void {
  if (typeof navigator === "undefined") return;
  try {
    const payload = JSON.stringify({ slug, type });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      // Fallback for browsers without sendBeacon.
      void fetch("/api/track", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  } catch {
    /* tracking is best-effort — never block the visitor */
  }
}
