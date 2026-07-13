import type { Metadata } from "next";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Pricing — Start Free",
  description:
    "Simple, honest pricing for Digital Site digital business cards. Create your card free forever and upgrade for premium templates, payments and analytics when you need more.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        badge="Pricing"
        title="Plans that"
        highlight="grow with you"
        description="Try it free forever. Upgrade for premium templates, payments and analytics whenever you're ready."
        backgroundImage="/images/pricing-hero-bg.png"
      />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
