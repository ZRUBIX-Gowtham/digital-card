import type { Metadata } from "next";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { CTA } from "@/components/marketing/CTA";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Features — Free Digital Business Card & Website Builder",
  description:
    "Everything Digital Site can do — QR sharing, ready-made templates, catalogues, payments and analytics. The easy, free way to build your own digital business card and website.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        badge="Features"
        title="A complete toolkit for your"
        highlight="professional identity"
        description="From the first tap to a saved contact and a completed payment, Digital Site covers every part of how you connect."
        backgroundImage="/images/features-hero-bg.png"
      />
      <Features />
      <HowItWorks />
      <CTA />
    </>
  );
}
