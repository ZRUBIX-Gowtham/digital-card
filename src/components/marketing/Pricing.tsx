import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { plans } from "@/data/pricing";

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, honest pricing"
        description="Start free and upgrade only when you need more. No hidden fees, cancel anytime."
      />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border bg-surface p-7",
              plan.featured
                ? "border-brand shadow-[0_16px_50px_rgba(79,70,229,0.15)] ring-1 ring-brand"
                : "border-border",
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              {plan.featured && <Badge>Most popular</Badge>}
            </div>
            <p className="mt-3 text-sm text-muted">{plan.description}</p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted">/ {plan.period}</span>
            </div>
            <ButtonLink
              href="/contact"
              variant={plan.featured ? "primary" : "outline"}
              className="mt-6 w-full"
            >
              {plan.cta}
            </ButtonLink>
            <ul className="mt-7 space-y-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
