import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { templates } from "@/data/templates";

// Eight standout templates spanning the categories for the homepage.
const FEATURED = ["biz-meridian", "biz-onyx", "pro-verdant", "crea-canvas", "crea-nova", "shop-boutique", "shop-luxe", "me-sunset"];

export function TemplatesShowcase() {
  const featured = FEATURED.map((id) => templates.find((t) => t.id === id)!).filter(Boolean);

  return (
    <Section id="templates" className="bg-surface">
      <SectionHeading
        eyebrow="Templates"
        title="27 designs across 7 categories"
        description="From corporate to creative to full product catalogues — start from a polished template and make it yours."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((t) => {
          return (
            <Link
              key={t.id}
              href={`/preview/${t.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-border bg-surface-2">
                <img
                  src={`/preview-images/${t.id}.png`}
                  alt={`${t.name} template preview`}
                  loading="lazy"
                  className="block h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                  <p className="text-xs text-muted">Best for {t.bestFor}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-brand" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <ButtonLink href="/templates" variant="outline" size="lg">
          Browse all 27 templates
        </ButtonLink>
      </div>
    </Section>
  );
}
