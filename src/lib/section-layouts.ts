/**
 * Per-section design variants. Where `section-display.ts` controls how items are
 * *arranged* (list / carousel / auto-play), this controls how each item *looks* —
 * the visual template of the section. Sections listed here appear in the editor's
 * "Design & Layout" hub and get a "Change layout" button, where the user switches
 * designs with live-preview cards.
 *
 * Generic: add a section key with its variants, wire a preview + renderer, and
 * the hub / picker pick it up automatically.
 */

export interface LayoutVariant {
  value: string;
  label: string;
  /** One-line summary shown under the preview in the picker. */
  description: string;
}

/** Which sections offer design variants, and the choices for each. */
export const SECTION_LAYOUT_OPTIONS: Record<string, LayoutVariant[]> = {
  about: [
    { value: "plain", label: "Plain", description: "Simple paragraph with optional meta chips." },
    { value: "card", label: "Card", description: "Bio sits inside a soft bordered card." },
    { value: "highlight", label: "Highlight", description: "Accent-tinted panel with a left accent bar." },
    { value: "banner", label: "Banner", description: "Bold accent gradient band with light text." },
  ],
  services: [
    { value: "list", label: "List", description: "Full-width rows with an icon, title, price and description." },
    { value: "cards", label: "Cards", description: "Two-column grid of compact cards." },
    { value: "tiles", label: "Icon tiles", description: "Centred, icon-forward tiles that lead with the symbol." },
    { value: "numbered", label: "Numbered", description: "Ordered steps with a numbered accent badge." },
    { value: "priced", label: "Price focus", description: "Clean rows with the price pushed to the right." },
  ],
  shop: [
    { value: "grid", label: "Grid", description: "Two-column product cards with image, price and button." },
    { value: "list", label: "List", description: "Wide rows — image left, details and button right." },
    { value: "compact", label: "Compact", description: "Tighter three-column tiles for many products." },
    { value: "minimal", label: "Minimal", description: "Borderless cards with just image, name and price." },
  ],
  stats: [
    { value: "grid", label: "Grid", description: "Two-column tinted cards with icon, value and label." },
    { value: "row", label: "Inline row", description: "A compact strip with dividers between each figure." },
    { value: "bold", label: "Big numbers", description: "Oversized numbers stacked for maximum impact." },
    { value: "pills", label: "Pills", description: "Rounded accent pills, one per figure." },
    { value: "iconrows", label: "Icon rows", description: "Horizontal cards with the icon on the left." },
  ],
  gallery: [
    { value: "grid", label: "Grid", description: "Uniform square thumbnails in a neat, tidy grid." },
    { value: "masonry", label: "Masonry", description: "Staggered heights for a natural, collage-style wall." },
    { value: "framed", label: "Framed", description: "White-bordered, polaroid-style frames." },
    { value: "collage", label: "Collage", description: "Larger two-column tiles for a bolder look." },
    { value: "rounded", label: "Rounded", description: "Soft, heavily-rounded tiles with a gap." },
  ],
  team: [
    { value: "cards", label: "Cards", description: "Two-column cards with the photo sitting on top." },
    { value: "rows", label: "List rows", description: "Horizontal rows — photo left, name and role right." },
    { value: "circles", label: "Circles", description: "Large circular avatars, centred and airy." },
    { value: "compact", label: "Compact", description: "Three-column small avatars for bigger teams." },
    { value: "minimal", label: "Minimal", description: "Tidy name list with a small avatar, no cards." },
  ],
  businessHours: [
    { value: "list", label: "List", description: "Day and time rows inside one bordered card." },
    { value: "striped", label: "Striped", description: "Alternating row shading for easy scanning." },
    { value: "cards", label: "Cards", description: "Each day on its own compact chip card." },
    { value: "grid", label: "Grid", description: "Two-column grid of day/time pairs." },
  ],
  brochures: [
    { value: "list", label: "List", description: "File rows with an icon and a download button." },
    { value: "cards", label: "Cards", description: "Two-column document cards." },
    { value: "tiles", label: "Tiles", description: "Centred file tiles with a big icon." },
    { value: "compact", label: "Compact", description: "Slim single-line rows for many files." },
  ],
  awards: [
    { value: "list", label: "List", description: "Icon, title and issuer in a bordered row." },
    { value: "cards", label: "Cards", description: "Two-column badge cards, centred." },
    { value: "timeline", label: "Timeline", description: "Vertical line with year markers." },
    { value: "badges", label: "Badges", description: "Pill-style ribbons with the year up front." },
  ],
  brands: [
    { value: "grid", label: "Grid", description: "Three-column logo tiles." },
    { value: "mono", label: "Monochrome", description: "Greyscale logos that colour on hover." },
    { value: "bordered", label: "Bordered", description: "Framed tiles with more breathing room." },
    { value: "pills", label: "Pills", description: "Rounded chips — great for text-only brands." },
  ],
  testimonials: [
    { value: "classic", label: "Classic", description: "Bordered card with a quote mark, star rating, and an author chip." },
    { value: "minimal", label: "Minimal", description: "Clean, understated quote with the author on a single line below." },
    { value: "bubble", label: "Speech bubble", description: "Chat-style bubble with the reviewer and stars underneath." },
    { value: "spotlight", label: "Spotlight", description: "Bold accent-filled card that puts the review front and centre." },
    { value: "quote", label: "Quote", description: "Centred design with a large quotation mark and the author below." },
  ],
  faqs: [
    { value: "accordion", label: "Accordion", description: "Tap-to-expand rows — the classic FAQ look." },
    { value: "cards", label: "Cards", description: "Each Q&A always open inside its own card." },
    { value: "bordered", label: "Bordered", description: "Accordion with a left accent bar on each row." },
    { value: "numbered", label: "Numbered", description: "Expandable rows led by a numbered badge." },
  ],
  enquiry: [
    { value: "card", label: "Card", description: "Fields inside a soft bordered card — clean and classic." },
    { value: "minimal", label: "Minimal", description: "Borderless, understated fields with a rounded pill button." },
    { value: "boxed", label: "Boxed", description: "Accent-tinted panel led by a centred icon and title." },
    { value: "gradient", label: "Gradient", description: "Bold accent gradient header band above the fields." },
    { value: "split", label: "Split header", description: "Icon and title on a tinted bar, fields below." },
    { value: "elevated", label: "Elevated", description: "Floating card with a stronger shadow and accent top bar." },
  ],
  booking: [
    { value: "card", label: "Card", description: "Fields inside a soft bordered card — clean and classic." },
    { value: "minimal", label: "Minimal", description: "Borderless, understated fields with a rounded pill button." },
    { value: "boxed", label: "Boxed", description: "Accent-tinted panel led by a centred icon and title." },
    { value: "gradient", label: "Gradient", description: "Bold accent gradient header band above the fields." },
    { value: "split", label: "Split header", description: "Icon and title on a tinted bar, fields below." },
    { value: "elevated", label: "Elevated", description: "Floating card with a stronger shadow and accent top bar." },
  ],
  cta: [
    { value: "banner", label: "Banner", description: "Bold accent gradient band with centred text and button." },
    { value: "card", label: "Card", description: "Clean bordered card, text left and a solid button." },
    { value: "split", label: "Split", description: "Text on the left, button pinned to the right." },
    { value: "minimal", label: "Minimal", description: "Understated centred text with a simple button." },
    { value: "boxed", label: "Boxed", description: "Accent-tinted panel led by an icon, button below." },
  ],
  header: [
    { value: "default", label: "Template default", description: "Keep this template's own built-in header design." },
    { value: "modern", label: "Modern", description: "Sleek, edge-to-edge native app style with clean typography and no borders." },
    { value: "cover", label: "Cover", description: "Accent cover band with a centred avatar plate and name below." },
    { value: "aside", label: "Aside", description: "Horizontal accent band — avatar on the left, name and role right." },
    { value: "banner", label: "Banner", description: "Bold accent gradient, big centred avatar and white social row." },
    { value: "minimal", label: "Minimal", description: "Clean, no fill — a thin accent rule and left-aligned identity." },
    { value: "card", label: "Card", description: "Name and role inside a bordered panel with an accent top strip." },
  ],
  footer: [
    { value: "classic", label: "Classic", description: "Name, company, centred social row and a credit line." },
    { value: "minimal", label: "Minimal", description: "Clean centred name and copyright only — no borders." },
    { value: "card", label: "Card", description: "Details on the left, socials on the right inside a card." },
    { value: "contact", label: "Contact", description: "Quick email, phone and address links above the socials." },
    { value: "branded", label: "Branded", description: "Bold accent band with light text and white social buttons." },
  ],
  nav: [
    { value: "modern", label: "Modern", description: "Seamless, native-app style drawer with clean spacing and no borders." },
    { value: "classic", label: "Classic", description: "Standard side drawer with an avatar header and dot-led links." },
    { value: "minimal", label: "Minimal", description: "Clean list with no dividers and understated typography." },
    { value: "card", label: "Card", description: "Each link sits inside its own bordered card." },
    { value: "compact", label: "Compact", description: "Tighter spacing with subtle dividers between each link." },
    { value: "branded", label: "Branded", description: "Bold accent background for the entire menu with white text." },
  ],
};

/** Fallback variant used when the card hasn't chosen one for a section. */
export const DEFAULT_SECTION_LAYOUT: Record<string, string> = {
  about: "plain",
  services: "list",
  shop: "grid",
  stats: "grid",
  gallery: "grid",
  team: "cards",
  businessHours: "list",
  brochures: "list",
  awards: "list",
  brands: "grid",
  testimonials: "classic",
  faqs: "accordion",
  enquiry: "card",
  booking: "card",
  cta: "banner",
  header: "default",
  footer: "classic",
  nav: "classic",
};

/** Human labels for each section, used as headings in the layout hub. */
export const SECTION_LAYOUT_TITLES: Record<string, string> = {
  about: "About",
  services: "Products & Services",
  shop: "Product Showcase",
  stats: "Stats / Achievements",
  gallery: "Gallery",
  team: "Team Members",
  businessHours: "Business Hours",
  brochures: "Brochures & PDFs",
  awards: "Awards & Certifications",
  brands: "Clients & Brands",
  testimonials: "Testimonials",
  faqs: "FAQs",
  enquiry: "Enquiry Form",
  booking: "Appointment Booking",
  cta: "Call to Action",
  header: "Header",
  footer: "Footer",
  nav: "Navigation Menu",
};

/** Resolve the effective design variant for a section on a given card. */
export function effectiveSectionLayout(
  sectionLayouts: Record<string, string> | undefined,
  sectionId: string,
): string {
  return (
    sectionLayouts?.[sectionId] ??
    DEFAULT_SECTION_LAYOUT[sectionId] ??
    SECTION_LAYOUT_OPTIONS[sectionId]?.[0]?.value ??
    ""
  );
}
