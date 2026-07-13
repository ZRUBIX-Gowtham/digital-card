export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  featured?: boolean;
  cta: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    name: "Starter",
    price: "₹0",
    period: "forever",
    description: "Everything you need to get your first card online.",
    cta: "Start free",
    features: [
      "1 digital card",
      "3 templates",
      "QR code & shareable link",
      "Save-to-contacts (vCard)",
      "Social & contact links",
    ],
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per year",
    description: "For professionals who want to stand out and convert.",
    featured: true,
    cta: "Go Pro",
    features: [
      "Unlimited cards",
      "All premium templates",
      "Custom brand colour & URL",
      "Products & services catalogue",
      "UPI & payment details",
      "Card view analytics",
    ],
  },
  {
    name: "Business",
    price: "₹1,999",
    period: "per year",
    description: "For teams and companies managing many cards.",
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "Up to 25 team cards",
      "Central branding controls",
      "Lead capture & export",
      "Priority support",
      "Remove digitalsite badge",
    ],
  },
];
