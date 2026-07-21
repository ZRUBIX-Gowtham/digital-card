import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
};

const clauses: { heading: string; body: string[] }[] = [
  {
    heading: "1. Acceptance of terms",
    body: [
      `By creating a card or using ${siteConfig.name} in any way, you agree to these Terms of Service. If you do not agree, please do not use the service.`,
    ],
  },
  {
    heading: "2. Your account",
    body: [
      "You are responsible for the accuracy of the information on your card and for keeping your sign-in details secure. You must be at least 16 years old to create an account.",
    ],
  },
  {
    heading: "3. Acceptable use",
    body: [
      "You agree not to use the service to publish unlawful, misleading, or infringing content, to impersonate others, or to distribute malware or spam. We may suspend cards that violate these rules.",
    ],
  },
  {
    heading: "4. Plans and payments",
    body: [
      "Free plans remain free. Paid plans are billed in advance and renew automatically until cancelled. Fees are non-refundable except where required by law.",
    ],
  },
  {
    heading: "5. Your content",
    body: [
      "You retain ownership of everything you add to your card. You grant us a limited licence to host and display that content solely to operate the service.",
    ],
  },
  {
    heading: "6. Availability & changes",
    body: [
      "We work hard to keep the service running but provide it “as is” without warranties. We may update features, and we may revise these terms — we’ll note the effective date when we do.",
    ],
  },
  {
    heading: "7. Contact",
    body: [
      `Questions about these terms? Email us at ${siteConfig.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        badge="Legal"
        title="Terms of"
        highlight="Service"
        description="The ground rules for using OnlineCard. We've kept them short and readable."
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
