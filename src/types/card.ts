/**
 * Core data model for a digital business card.
 * Phase 1 uses local seed data shaped exactly like this; Phase 2 swaps the
 * data source (DB) without changing this contract or any template component.
 */

/** A template id (e.g. "business-aurora"). See src/data/templates.ts. */
export type TemplateId = string;

export type SocialPlatform =
  | "website"
  | "linkedin"
  | "instagram"
  | "twitter"
  | "facebook"
  | "youtube"
  | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string; // digits only, e.g. 919000000000
  email?: string;
  website?: string;
  address?: string;
  mapUrl?: string;
}

export interface Service {
  title: string;
  description?: string;
  price?: string;
  image?: string;
  icon?: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  rating: number; // 1-5
  feedback: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CallToAction {
  title: string;
  subtitle?: string;
  buttonLabel: string;
  /** What the button does. Defaults to "whatsapp". */
  action?: "link" | "whatsapp" | "phone" | "email";
  /** Target for the action: URL (link), number (whatsapp/phone), or email.
   *  Falls back to the card's contact details when empty. */
  value?: string;
  /** Lucide icon name shown on the button. */
  icon?: string;
}

export interface BusinessHour {
  day: string;
  hours: string; // e.g. "9:00 AM - 6:00 PM" or "Closed"
}

export interface Brochure {
  title: string;
  url: string; // File URL or base64
}

export interface GalleryItem {
  src: string;
  alt: string;
}

export interface TeamMember {
  name: string;
  role?: string;
  image?: string; // photo URL or base64; falls back to initials
}

export interface StatItem {
  value: string; // e.g. "500+", "10", "4.9★"
  label: string; // e.g. "Happy clients"
  icon?: string; // lucide icon name
}

export interface Award {
  title: string;
  issuer?: string;
  year?: string;
  icon?: string; // lucide icon name
}

export interface BrandLogo {
  name: string;
  logo?: string; // logo image URL or base64; falls back to name text
}

export interface ShopProduct {
  name: string;
  image?: string; // product image URL or base64
  price?: string; // current price, e.g. "₹499"
  mrp?: string; // optional original price; shown struck-through when higher
  /** Which action the product button performs. Defaults to "whatsapp". */
  cta?: "link" | "whatsapp";
  url?: string; // buy/redirect link, used when cta === "link"
  whatsapp?: string; // per-product WhatsApp number (cta "whatsapp"); falls back to card contact
  /** Custom button text. Defaults to "Buy now" (link) or "Order on WhatsApp". */
  ctaLabel?: string;
  /** Lucide icon name for the link button. Defaults to "ShoppingBag". */
  ctaIcon?: string;
}

export interface ShopCategory {
  name: string; // e.g. "T-Shirts"
  products: ShopProduct[];
}

export interface PaymentInfo {
  upiId?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  /** Whether the "Pay via UPI" button is shown to visitors. Defaults to on. */
  showPayButton?: boolean;
  /** Whether the scan-to-pay QR code is shown to visitors. Defaults to on. */
  showQr?: boolean;
  /** Fixed amount (₹) to pre-fill the UPI payment with. Empty = visitor enters
   *  the amount themselves in their UPI app. */
  amount?: string;
}

/**
 * Email-signature configuration: the chosen design plus per-field text
 * overrides and a list of fields the user has removed. Empty overrides fall
 * back to the matching card field (see src/lib/signature.ts).
 */
export interface SignatureConfig {
  /** Chosen signature design id. */
  template?: string;
  /** Accent colour (hex) for the signature. Falls back to the card accent. */
  accent?: string;
  /** Font-family stack applied across the signature. */
  font?: string;
  /** Primary text colour (name + contact values). */
  textColor?: string;
  name?: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  /** Photo URL used in the signature (falls back to the card avatar). */
  photo?: string;
  /** Social handles keyed by platform, e.g. { linkedin: "..." }. */
  socials?: Record<string, string>;
  /** Field keys the user removed from the signature, e.g. ["address"]. */
  hide?: string[];
}

/** Lead-capture "Enquiry" form shown on the public card. */
export interface EnquiryConfig {
  /** Whether the enquiry form section is shown. */
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  /** Ask the visitor for a phone number. Defaults to on. */
  askPhone?: boolean;
  /** Ask the visitor for an email. Defaults to on. */
  askEmail?: boolean;
  /** Submit button text. Defaults to "Send enquiry". */
  buttonLabel?: string;
}

/** "Book an appointment" form shown on the public card. */
export interface BookingConfig {
  /** Whether the booking form section is shown. */
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  /** Services the visitor can pick from. Empty = no service selector. */
  services?: string[];
  /** Custom time slots, e.g. ["10:00 AM", "2:00 PM"]. Used when no working
   *  hours are set below; otherwise slots are generated from the window. */
  slots?: string[];
  /** Working-hours window (slot labels, e.g. "9:00 AM"–"5:00 PM"). When both
   *  are set, slots are auto-generated across the window at `slotInterval`. */
  dayStart?: string;
  dayEnd?: string;
  /** Optional break/lunch window (slot labels). Slots overlapping this window
   *  are skipped when generating, e.g. "1:00 PM"–"2:00 PM". */
  breakStart?: string;
  breakEnd?: string;
  /** Minutes between generated slots. Defaults to 60. */
  slotInterval?: number;
  /** How the slot picker looks on the public card. Defaults to "dropdown". */
  slotStyle?: "dropdown" | "pills" | "grid" | "list" | "cards";
  /** Submit button text. Defaults to "Request booking". */
  buttonLabel?: string;
}

export interface CardData {
  slug: string;
  templateId: TemplateId;
  /** Optional brand accent color override (hex). Falls back to template default. */
  accent?: string;
  /** Overall text/size scale for the card. Defaults to "md". */
  fontScale?: "sm" | "md" | "lg";
  /** Colour scheme visitors see on the public card. Defaults to "light". */
  theme?: "light" | "dark";
  name: string;
  title: string;
  company: string;
  tagline?: string;
  about?: string;
  /** Fallback text for the avatar/logo when no image is set (initials). */
  logoText?: string;
  /** Profile photo / logo image URL. Falls back to initials when empty. */
  avatarImage?: string;
  /** Optional cover / banner image URL used by image-forward templates. */
  coverImage?: string;
  contact: ContactInfo;
  socials: SocialLink[];
  services: Service[];
  gallery: GalleryItem[];
  payment?: PaymentInfo;
  establishedYear?: string;
  businessType?: string;
  testimonials?: Testimonial[];
  faqs?: FAQ[];
  cta?: CallToAction;
  youtubeVideos?: string[];
  businessHours?: BusinessHour[];
  brochures?: Brochure[];
  team?: TeamMember[];
  stats?: StatItem[];
  awards?: Award[];
  brands?: BrandLogo[];
  shop?: ShopCategory[];
  /** Lead-capture enquiry form. */
  enquiry?: EnquiryConfig;
  /** Appointment / booking request form. */
  booking?: BookingConfig;
  /** Email-signature design + per-field overrides (see src/lib/signature.ts). */
  signature?: SignatureConfig;
  sectionsOrder?: string[];
  /** Per-section display style, e.g. { testimonials: "carousel-auto" }. */
  sectionStyles?: Record<string, string>;
  /** Per-section design variant, e.g. { testimonials: "spotlight" }. */
  sectionLayouts?: Record<string, string>;
  /** Total public profile views. Incremented on each visit to /{slug}. */
  views?: number;
  /** Whether the hamburger navigation menu is shown. Defaults to shown. */
  showNav?: boolean;
  /** Whether the navbar is pinned to the top. Defaults to true. */
  navFixed?: boolean;
  /** Whether the card footer is shown. Defaults to shown. */
  showFooter?: boolean;
  /** Whether the view count is shown on the public card. Defaults to shown. */
  showViews?: boolean;
  /** Whether the view count sits on a background chip. Defaults to shown. */
  viewsBadgeBg?: boolean;
  /**
   * For hero-sheet layouts (e.g. Luxe), whether the hero stays pinned while the
   * content sheet scrolls up over it. Defaults to on.
   */
  stickyHero?: boolean;
  /**
   * Loading splash shown once when a visitor first opens the public card, then
   * it animates away to reveal the page. "none" disables it. Defaults to "card".
   */
  introStyle?: IntroStyle;
}

/** Loading-splash designs offered for the public card's first-open animation. */
export type IntroStyle =
  | "none"
  | "card"
  | "spotlight"
  | "curtain"
  | "minimal"
  | "ripple";

/** Categories used to organise the template gallery. */
export type CategoryId =
  | "business"
  | "professional"
  | "creative"
  | "products"
  | "personal"
  | "gallery"
  | "video";

/** Base layout engines a template can be rendered with. */
export type LayoutId =
  | "cover"
  | "sidebar"
  | "spotlight"
  | "minimal"
  | "corporate"
  | "product"
  | "catalog"
  | "storefront"
  | "linkbio"
  | "aside"
  | "editorial"
  | "showcase"
  | "aurora"
  | "bento"
  | "masthead"
  | "lookbook"
  | "stall"
  | "halo"
  | "folio"
  | "blossom"
  | "horizon"
  | "neon"
  | "gallery"
  | "videos";

/** Visual style knobs applied on top of a layout to create distinct designs. */
export interface TemplateStyle {
  accent: string;
  /** Optional second colour for gradients. */
  accent2?: string;
  header?: "solid" | "gradient" | "image" | "dark" | "plain";
  avatar?: "circle" | "rounded" | "square";
  surface?: "light" | "tint" | "dark";
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: CategoryId;
  layout: LayoutId;
  style: TemplateStyle;
  description: string;
  /** Best-fit audience shown on the templates gallery. */
  bestFor: string;
  /** Demo card slug used for "Preview live" links. */
  demoSlug: string;
}
