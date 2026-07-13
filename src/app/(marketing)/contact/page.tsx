import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Digital Site team. We usually reply within one business day.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: "Phone", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${siteConfig.whatsapp}`,
  },
  { icon: MapPin, label: "Location", value: "India", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="Let's"
        highlight="talk"
        description="Questions about plans, teams or custom designs? Send us a note and we'll get back to you quickly."
        backgroundImage="/images/contact-hero-bg.png"
      />
      <Section containerClassName="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {channels.map((c) => {
              const Icon = c.icon;
              const inner = (
                <div className="glass flex items-center gap-4 rounded-2xl p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {c.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {c.value}
                    </p>
                  </div>
                </div>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block transition-shadow hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
          </div>

        <ContactForm />
      </Section>
    </>
  );
}
