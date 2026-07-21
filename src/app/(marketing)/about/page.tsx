import type { Metadata } from "next";
import { Leaf, Zap, ShieldCheck, Heart } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { CTA } from "@/components/marketing/CTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we built OnlineCard — a faster, greener, more memorable way to share who you are and what you do with a free digital business card.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Zap,
    title: "Effortlessly fast",
    text: "One tap or scan and your full profile is in front of them — no app, no typing, no friction.",
  },
  {
    icon: Leaf,
    title: "Kinder to the planet",
    text: "Every digital card replaces a stack of paper ones. Update your details anytime without reprinting a thing.",
  },
  {
    icon: ShieldCheck,
    title: "Yours to control",
    text: "You own your link and your data. Change your card, hide sections or start over whenever you like.",
  },
  {
    icon: Heart,
    title: "Designed with care",
    text: "Beautiful, mobile-first templates that make you look as professional as you actually are.",
  },
];

const stats = [
  { value: "25+", label: "Ready-made templates" },
  { value: "7", label: "Industry categories" },
  { value: "<1 min", label: "To go live" },
  { value: "0", label: "Trees felled" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="Our story"
        title="Business cards, reimagined for a"
        highlight="digital-first world"
        description={`We started ${siteConfig.brand} with a simple belief: sharing who you are should be instant, beautiful and waste-free.`}
        backgroundImage="/images/about-hero-bg.png"
      />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why we exist"
              title="A first impression that keeps up with you"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Paper cards get lost, run out and go stale. Contacts get typed
                in wrong, or never saved at all. We thought the humble business
                card deserved a serious upgrade.
              </p>
              <p>
                {siteConfig.brand} turns your card into a living link: your
                photo, roles, portfolio, products, social profiles and payment
                details — all in one place, always current, saved to any phone
                in a single tap.
              </p>
              <p>
                Whether you&apos;re a freelancer, a founder or a whole sales
                team, you get a polished, consistent identity you can share
                anywhere in seconds.
              </p>
            </div>
          </div>

          <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="bg-gradient-to-r from-brand to-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="What we care about"
          title="The principles behind every card"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <Card key={v.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.text}
                </p>
              </Card>
            );
          })}
        </div>
      </Section>

      <CTA />
    </>
  );
}
