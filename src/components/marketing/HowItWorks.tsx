import { UserPlus, Paintbrush, Send } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

const steps = [
  {
    icon: UserPlus,
    title: "Add your details",
    description:
      "Enter your name, role, contact, socials and services. It takes just a few minutes.",
  },
  {
    icon: Paintbrush,
    title: "Pick a template",
    description:
      "Choose a design you love and set your brand colour. Preview it live as you go.",
  },
  {
    icon: Send,
    title: "Share your card",
    description:
      "Get your link and QR code. Share it anywhere — WhatsApp, email, print or in person.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how">
      <SectionHeading
        eyebrow="How it works"
        title="Live in three simple steps"
        description="No design skills or downloads required. If you can send a WhatsApp, you can build your card."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="relative rounded-2xl border border-border bg-surface p-7"
            >
              <span className="absolute right-6 top-6 text-4xl font-bold text-brand-50">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {s.description}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
