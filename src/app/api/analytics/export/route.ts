import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { visitsCsvForCard, toRangeKey, RANGE_DAYS } from "@/lib/analytics-store";

// Generated per request from the owner's live data — never cache.
export const dynamic = "force-dynamic";

/**
 * Download the signed-in owner's visitors as a CSV, honouring the same
 * `?range=` window as the analytics page. Auth is the session cookie: a visitor
 * can only ever export their own card's data.
 */
export async function GET(request: Request): Promise<Response> {
  const user = await getSession();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const card = await getCardFromStore(user.cardSlug);
  if (!card) return new Response("Card not found", { status: 404 });

  const range = toRangeKey(new URL(request.url).searchParams.get("range") ?? undefined);
  const csv = await visitsCsvForCard(card.slug, RANGE_DAYS[range]);

  const filename = `${card.slug}-visitors-${range}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
