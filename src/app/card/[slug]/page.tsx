import { permanentRedirect } from "next/navigation";
import { getAllCardSlugsFromStore } from "@/lib/cards-store";

export function generateStaticParams() {
  const slugs = getAllCardSlugsFromStore();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Legacy route. Cards now live at the personalized URL `/{slug}`, so we
 * permanently redirect old `/card/{slug}` links to the new location.
 */
export default async function LegacyCardRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}
