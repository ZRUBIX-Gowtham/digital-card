import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your data.`,
};

const clauses: { heading: string; body: string[] }[] = [
  {
    heading: "1. Information we collect",
    body: [
      "We collect the details you add to your card (such as your name, role, contact info and links), your account email, and basic usage data like page views and QR scans so we can improve the service.",
    ],
  },
  {
    heading: "2. How we use it",
    body: [
      "We use your data to display your card, operate and secure your account, provide analytics you’ve enabled, and send you essential service messages. We do not sell your personal data.",
    ],
  },
  {
    heading: "3. Sharing",
    body: [
      "The information on your public card is, by design, visible to anyone with your link. Beyond that, we only share data with trusted processors (like hosting and payment providers) needed to run the service.",
    ],
  },
  {
    heading: "4. Cookies",
    body: [
      "We use a small number of cookies for sign-in and anonymous analytics. You can control cookies through your browser settings.",
    ],
  },
  {
    heading: "5. Your rights",
    body: [
      "You can view, edit, export or delete your card and account data at any time. To request full deletion of your account, contact us and we’ll action it promptly.",
    ],
  },
  {
    heading: "6. Data security & retention",
    body: [
      "We use industry-standard measures to protect your data and keep it only as long as your account is active or as required by law.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      `For any privacy question or request, email ${siteConfig.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        badge="Legal"
        title="Privacy"
        highlight="Policy"
        description="Your trust matters. Here's exactly what we collect, why, and the control you have over it."
      />
      <Section containerClassName="max-w-3xl">
        <p className="text-sm text-muted">Last updated: 2 July 2026</p>
        <div className="mt-8 space-y-10">
          {clauses.map((c) => (
            <div key={c.heading}>
              <h2 className="text-xl font-semibold text-foreground">
                {c.heading}
              </h2>
              {c.body.map((p, i) => (
                <p key={i} className="mt-3 text-base leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
