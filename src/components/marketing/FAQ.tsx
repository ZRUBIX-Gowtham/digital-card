import { Section, SectionHeading } from "@/components/ui/Section";

const faqs = [
  {
    q: "Does the person receiving my card need an app?",
    a: "No. Your card is a normal web link that opens in any browser. They can view it, tap to call or message you, and save your contact — with nothing to install.",
  },
  {
    q: "Can I update my card after sharing it?",
    a: "Yes. Your link and QR code stay the same, but the content updates instantly. Change your number, role or services once and everyone sees the latest version.",
  },
  {
    q: "How do people pay me from the card?",
    a: "Add your UPI ID and bank details, and they'll appear in a dedicated payment section so clients can pay you directly.",
  },
  {
    q: "Is there really a free plan?",
    a: "Yes — the Starter plan is free forever and includes a full card with a QR code, shareable link and save-to-contacts.",
  },
  {
    q: "Can my whole team use it?",
    a: "The Business plan lets you manage multiple team cards with consistent branding and central controls.",
  },
];

export function FAQ() {
  return (
    <Section>
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything you might want to know before you create your first card."
      />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
              {f.q}
              <span className="text-brand transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
