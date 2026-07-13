/**
 * Central site configuration. Change brand-level copy here once.
 */
export const siteConfig = {
  name: "Digital Site",
  brand: "Digital Site",
  tagline: "Create Your Free Digital Business Card",
  description:
    "Digital Site is the easy, free way to create your own digital business card and one-page website in minutes. Share your contact, portfolio, products and payments with a single link or QR code — no app, no printing.",
  /** Central keyword set — inherited by every page for consistent SEO. */
  keywords: [
    "digital business card",
    "free digital business card",
    "create digital business card free",
    "online business card maker",
    "digital visiting card",
    "virtual business card",
    "QR business card",
    "vCard",
    "smart business card",
    "NFC business card",
    "digital website",
    "create website free",
    "free website",
    "easy to create website",
    "make your own website",
    "one page website",
    "link in bio",
    "personal website builder",
    "e-business card",
    "digitalsite",
  ],
  url: "https://cards.digitalsite.com",
  email: "hello@digitalsite.com",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  social: {
    instagram: "https://instagram.com/digitalsite",
    linkedin: "https://linkedin.com/company/digitalsite",
    twitter: "https://twitter.com/digitalsite",
  },
  nav: [
    { label: "Features", href: "/#features" },
    { label: "Templates", href: "/#templates" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
