import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCardFromStore, incrementCardViews } from "@/lib/cards-store";
import { logEvent, metaFromHeaders } from "@/lib/analytics-store";
import { CardRenderer } from "@/components/card-templates/registry";
import { siteConfig } from "@/lib/site";

// Cards are editable at runtime (file store), so render on demand rather than
// baking the seed data in at build time.
export const dynamic = "force-dynamic";

/** Top-level paths that must never be treated as a username/card slug. */
const RESERVED = new Set([
  "features",
  "templates",
  "pricing",
  "contact",
  "signin",
  "dashboard",
  "card",
  "preview",
  "api",
  "sitemap.xml",
  "robots.txt",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const card = await getCardFromStore(username);
  if (!card) return { title: "Card not found" };
  return {
    title: `${card.name} — ${card.title}`,
    description: card.tagline ?? card.about ?? `${card.name} · ${card.company}`,
    alternates: { canonical: `/${card.slug}` },
  };
}

export default async function UsernameCardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (RESERVED.has(username)) notFound();

  const card = await getCardFromStore(username);
  if (!card) notFound();

  // Count this visit. Page is force-dynamic, so this runs on every load.
  const views = (await incrementCardViews(username)) ?? card.views ?? 0;

  // Log the view for analytics, tagging the referrer host when the visitor
  // arrived from another site, plus their device/browser/OS and geo-IP location
  // (derived from the request headers) so the dashboard can break visits down.
  const h = await headers();
  const referer = h.get("referer") ?? undefined;
  await logEvent(username, "view", referer, metaFromHeaders(h));

  // The card creator decides what visitors see — light or dark — regardless of
  // the visitor's own system/theme preference. Use explicit colours (not the
  // app tokens) so this page never follows the global chrome toggle.
  const darkCard = card.theme === "dark";

  return (
    <main
      className={`min-h-screen py-0  ${darkCard ? "card-dark bg-black" : "bg-slate-50"
        }`}
    >
      <div className="mx-auto w-full max-w-[430px]">
        <CardRenderer card={{ ...card, views }} />
      </div>
      <div className="mx-auto mt-8 w-full max-w-[430px] px-6 text-center pb-6">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand ${darkCard ? "text-slate-400" : "text-slate-500"
            }`}
        >
          Create your own card with {siteConfig.name}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
