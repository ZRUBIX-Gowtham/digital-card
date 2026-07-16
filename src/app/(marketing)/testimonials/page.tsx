import type { Metadata } from "next";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Testimonials — Digital Site",
  description: "See what professionals are saying about our free digital business cards.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        badge="Testimonials"
        title="Trusted by"
        highlight="professionals"
        description="Discover how people are using Digital Site to build their professional identity and connect with clients."
      />
      <Testimonials />
      <CTA />
    </>
  );
}
