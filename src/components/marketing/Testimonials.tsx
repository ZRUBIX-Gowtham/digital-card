import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { initials } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I share my card on WhatsApp and clients save my number instantly. It's replaced printed cards completely for my practice.",
    name: "Dr. Nadia Rao",
    role: "Dermatologist",
  },
  {
    quote:
      "Setting up took ten minutes. The catalogue and UPI details mean people can see my services and pay without a single phone call.",
    name: "Kabir Nair",
    role: "Creative Director",
  },
  {
    quote:
      "Our whole sales team is on digitalsite now. Consistent branding, and we can update roles without reprinting anything.",
    name: "Rohan Verma",
    role: "Director of Sales",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Loved by professionals"
        title="Trusted by people who mean business"
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="glass flex flex-col rounded-2xl p-7"
          >
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {initials(t.name)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  {t.name}
                </span>
                <span className="block text-xs text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
