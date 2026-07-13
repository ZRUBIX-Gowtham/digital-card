/**
 * Shared metadata for the card's hamburger navigation: short labels for each
 * section and a check for whether a section actually has content (so the menu
 * never lists empty sections). Also exposes the anchor id used for jump links.
 */

import type { CardData } from "@/types/card";
import { getYouTubeId } from "@/lib/youtube";

/** Short, visitor-facing labels for the nav menu. */
export const SECTION_NAV_LABELS: Record<string, string> = {
  about: "About",
  services: "Services",
  shop: "Shop",
  stats: "Highlights",
  gallery: "Gallery",
  team: "Team",
  payment: "Payment",
  businessHours: "Hours",
  youtubeVideos: "Videos",
  brochures: "Downloads",
  awards: "Awards",
  brands: "Clients",
  testimonials: "Reviews",
  faqs: "FAQs",
  booking: "Book",
  enquiry: "Enquiry",
  cta: "Get in touch",
  map: "Location",
};

/** DOM id used for a section's scroll anchor. */
export function sectionAnchorId(sectionKey: string): string {
  return `sec-${sectionKey}`;
}

const DEFAULT_ORDER = [
  "about", "services", "shop", "stats", "gallery", "team", "payment",
  "businessHours", "youtubeVideos", "brochures", "awards", "brands",
  "testimonials", "faqs", "booking", "enquiry", "cta", "map",
];

/** True when a section has something to show for this card. */
export function sectionHasContent(card: CardData, key: string): boolean {
  switch (key) {
    case "about":
      return !!card.about;
    case "services":
      return !!card.services?.length;
    case "shop":
      return !!card.shop?.some((c) => c.products && c.products.length);
    case "stats":
      return !!card.stats?.length;
    case "gallery":
      return !!card.gallery?.length;
    case "team":
      return !!card.team?.length;
    case "payment":
      return !!(card.payment && (card.payment.upiId || card.payment.accountNumber));
    case "businessHours":
      return !!card.businessHours?.length;
    case "youtubeVideos":
      return !!card.youtubeVideos?.some((u) => getYouTubeId(u));
    case "brochures":
      return !!card.brochures?.length;
    case "awards":
      return !!card.awards?.length;
    case "brands":
      return !!card.brands?.length;
    case "testimonials":
      return !!card.testimonials?.length;
    case "faqs":
      return !!card.faqs?.length;
    case "booking":
      return !!card.booking?.enabled;
    case "enquiry":
      return !!card.enquiry?.enabled;
    case "cta":
      return !!(card.cta && (card.cta.title || card.cta.buttonLabel));
    case "map":
      return !!(card.contact?.address || card.contact?.mapUrl);
    default:
      return false;
  }
}

/** The ordered list of sections (key + label) to show in the nav for a card. */
export function navSections(card: CardData): { key: string; label: string }[] {
  const order =
    card.sectionsOrder && card.sectionsOrder.length ? card.sectionsOrder : DEFAULT_ORDER;
  return order
    .filter((key) => SECTION_NAV_LABELS[key] && sectionHasContent(card, key))
    .map((key) => ({ key, label: SECTION_NAV_LABELS[key] }));
}
