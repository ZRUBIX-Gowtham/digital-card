import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCardFromStore, incrementCardViews, getAllCardSlugsFromStore } from "@/lib/cards-store";
import { logEvent } from "@/lib/analytics-store";
import { CardRenderer } from "@/components/card-templates/registry";
import { siteConfig } from "@/lib/site";

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

export function generateStaticParams() {
  const slugs = getAllCardSlugsFromStore();
  return slugs.filter(s => !RESERVED.has(s)).map((username) => ({
    username,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const card = getCardFromStore(username);
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

  const card = getCardFromStore(username);
  if (!card) notFound();

  const views = card.views ?? 0;


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
