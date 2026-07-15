import { getCardFromStore } from "@/lib/cards-store";
import { logEvent, metaFromHeaders, ACTION_TYPES, type EventType } from "@/lib/analytics-store";

// Runs on demand (a beacon per interaction); nothing to cache.
export const dynamic = "force-dynamic";

/**
 * Lightweight interaction tracking. Public cards fire a `navigator.sendBeacon`
 * here when a visitor taps Call / WhatsApp / Email / Directions / Save-contact,
 * so the owner's dashboard can show a click breakdown. Page *views* are logged
 * server-side while rendering the card, not here.
 *
 * The payload is trusted only as far as: the slug must be a real card, and the
 * type must be a known action. Anything else is ignored (204, no error) so a
 * beacon never surfaces failures to the visitor.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { slug?: string; type?: string };
    const slug = typeof body.slug === "string" ? body.slug : "";
    const type = body.type as EventType | undefined;

    if (
      slug &&
      type &&
      ACTION_TYPES.includes(type) &&
      await getCardFromStore(slug)
    ) {
      // The beacon is sent from the visitor's browser, so these headers carry
      // their real device/browser and (on Vercel) geo-IP location.
      await logEvent(slug, type, undefined, metaFromHeaders(request.headers));
    }
  } catch {
    /* malformed beacon — ignore */
  }
  return new Response(null, { status: 204 });
}
