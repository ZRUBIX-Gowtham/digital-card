import { Globe, Users, Zap } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

const highlights = [
  {
    icon: Globe,
    title: "Your Mini-Website",
    description: "It's more than a business card. It's a single, powerful page where clients find your services, portfolio, and contact details instantly.",
  },
  {
    icon: Users,
    title: "Built for Networking",
    description: "Whether you're at a conference or sending an email, giving people a digital card makes you memorable and instantly accessible.",
  },
  {
    icon: Zap,
    title: "Always Active",
    description: "No printing delays, no carrying stacks of paper. Your digital identity is live 24/7 and updates everywhere automatically when you edit it.",
  },
];

export function WhatIsDigitalSite() {
  return (
    <Section id="what-is-digital-site" className="bg-brand-50/50 dark:bg-brand-900/10">
      <SectionHeading
        eyebrow="What is Digital Site?"
        title="Your entire professional life, in one smart link."
        description="We are replacing the traditional paper business card with a powerful, interactive profile. Digital Site lets you build a personal landing page in minutes, making it easier for clients to save your number, view your work, and pay you directly."
      />
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div key={h.title} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20 ring-4 ring-surface-2 dark:ring-surface">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{h.title}</h3>
              <p className="text-muted leading-relaxed">{h.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
