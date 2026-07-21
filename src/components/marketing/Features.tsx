import { Section, SectionHeading } from "@/components/ui/Section";
import { features } from "@/data/features";

export function Features({ limit }: { limit?: number }) {
  const items = limit ? features.slice(0, limit) : features;
  return (
    <Section id="features" className="bg-surface">
      <SectionHeading
        eyebrow="Everything you need"
        title="One card that does it all"
        description="OnlineCard packs everything your contacts need to reach, remember and pay you — into a single, elegant link."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <Icon className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
