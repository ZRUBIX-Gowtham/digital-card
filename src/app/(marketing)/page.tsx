import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { Features } from "@/components/marketing/Features";
import { WhatIsDigitalSite } from "@/components/marketing/WhatIsDigitalSite";
import { EmailSignatureFeature } from "@/components/marketing/EmailSignatureFeature";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TemplatesShowcase } from "@/components/marketing/TemplatesShowcase";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";
import { Reveal } from "@/components/marketing/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal>
        <TrustBar />
      </Reveal>
      <Reveal>
        <BeforeAfter />
      </Reveal>
      <Reveal>
        <Features limit={6} />
      </Reveal>
      <Reveal>
        <WhatIsDigitalSite />
      </Reveal>
      <Reveal>
        <EmailSignatureFeature />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <TemplatesShowcase />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <CTA />
      </Reveal>
    </>
  );
}
