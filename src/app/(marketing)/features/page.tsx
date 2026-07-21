import type { Metadata } from "next";
import { Features } from "@/components/marketing/Features";
import { WhatIsDigitalSite } from "@/components/marketing/WhatIsDigitalSite";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { EmailSignatureFeature } from "@/components/marketing/EmailSignatureFeature";
import { QrCodeFeature } from "@/components/marketing/QrCodeFeature";
import { CTA } from "@/components/marketing/CTA";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Features — Free Digital Business Card & Website Builder",
  description:
    "Everything OnlineCard can do — QR sharing, ready-made templates, catalogues, payments and analytics. The easy, free way to build your own digital business card and website.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        badge="Features"
        title="A complete toolkit for your"
        highlight="professional identity"
        description="From the first tap to a saved contact and a completed payment, OnlineCard covers every part of how you connect."
        backgroundImage="/images/features-hero-bg.png"
      />
      <Features />
      <WhatIsDigitalSite />
      <EmailSignatureFeature />
      <QrCodeFeature />
      <HowItWorks />
      <CTA />
    </>
  );
}
