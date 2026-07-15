import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { TemplateBrowser } from "@/components/marketing/TemplateBrowser";
import { CTA } from "@/components/marketing/CTA";
import { CardRenderer } from "@/components/card-templates/registry";
import { templates, categories } from "@/data/templates";
import { getCard } from "@/data/cards";

export const metadata: Metadata = {
  title: "Templates — Free Digital Business Card Designs",
  description:
    "Browse 27 professionally designed digital business card templates across 7 categories. Pick one, personalise it and create your own digital card website free — preview each design live.",
  alternates: { canonical: "/templates" },
};

import { getSession } from "@/lib/auth";

export default async function TemplatesPage() {
  const user = await getSession();
  const isLoggedIn = !!user;

  // Every template showcases its live, original design (top-cropped) instead of
  // a pre-rendered PNG, so the gallery always reflects the real card — the same
  // treatment the Album (gallery) and Reel (video) templates already used.
  const items = templates.map((template) => {
    const demo = getCard(template.demoSlug);
    return {
      template,
      fallback: demo ? (
        // Zoom the card out a little in the gallery so the fonts read smaller
        // and more of the design shows — tweak the value to taste.
        <div className="pointer-events-none w-full" style={{ zoom: 0.8 }}>
          <CardRenderer card={demo} templateId={template.id} />
        </div>
      ) : undefined,
    };
  });

  return (
    <>
      <PageHero
        badge="27 templates · 7 categories"
        title="Pick a design,"
        highlight="make it yours"
        description="Every template is mobile-first, fast and fully editable. Filter by category, then tap any card for a live, interactive preview."
        backgroundImage="/images/templates-hero-bg.png"
      />
      <Section>
        <TemplateBrowser items={items} categories={categories} isLoggedIn={isLoggedIn} />
      </Section>
      <CTA />
    </>
  );
}
