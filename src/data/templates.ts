import type { CategoryId, TemplateMeta } from "@/types/card";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
}

/** The template categories shown in the gallery. */
export const categories: Category[] = [
  { id: "business", name: "Business", tagline: "Companies, teams & B2B" },
  { id: "professional", name: "Professional", tagline: "Doctors, lawyers, consultants" },
  { id: "creative", name: "Creative", tagline: "Studios, designers, artists" },
  { id: "products", name: "Products & Sales", tagline: "Shops, catalogues & orders" },
  { id: "personal", name: "Personal", tagline: "Creators & link-in-bio" },
  { id: "gallery", name: "Photo Gallery", tagline: "Portfolios & photo albums" },
  { id: "video", name: "Video Gallery", tagline: "YouTube & video showcases" },
];

/**
 * 27 templates: 5 each across Business/Professional/Creative/Products/Personal,
 * plus a dedicated Photo Gallery (Album) and Video Gallery (Reel). Each is a base `layout` engine styled with a
 * distinct `style` (accent, header treatment, avatar shape, surface) so every
 * template reads as its own design. `demoSlug` picks the sample card shown in
 * the gallery preview.
 */
export const templates: TemplateMeta[] = [
  // ---------------------------------------------------------------- Business
  {
    id: "biz-meridian",
    name: "Meridian",
    category: "business",
    layout: "corporate",
    style: { accent: "#0369a1", header: "image", avatar: "rounded" },
    description: "Image header with a structured company info block.",
    bestFor: "Companies & B2B",
    demoSlug: "meridian-labs",
  },
  {
    id: "biz-summit",
    name: "Summit",
    category: "business",
    layout: "cover",
    style: { accent: "#1d4ed8", header: "solid", avatar: "circle" },
    description: "Clean cover band with a centered profile portrait.",
    bestFor: "Executives & sales",
    demoSlug: "meridian-labs",
  },
  {
    id: "biz-atlas",
    name: "Atlas",
    category: "business",
    layout: "sidebar",
    style: { accent: "#0f766e", header: "solid", avatar: "rounded" },
    description: "Teal sidebar profile beside a tidy content column.",
    bestFor: "Consultancies",
    demoSlug: "meridian-labs",
  },
  {
    id: "biz-onyx",
    name: "Onyx",
    category: "business",
    layout: "spotlight",
    style: { accent: "#38bdf8", accent2: "#6366f1", header: "dark" },
    description: "Dark, premium hero with a soft gradient glow.",
    bestFor: "Tech & startups",
    demoSlug: "meridian-labs",
  },
  {
    id: "biz-slate",
    name: "Slate",
    category: "business",
    layout: "minimal",
    style: { accent: "#334155", avatar: "rounded" },
    description: "Understated, text-first with a quiet slate accent.",
    bestFor: "Corporate minimalists",
    demoSlug: "meridian-labs",
  },

  // ------------------------------------------------------------ Professional
  {
    id: "pro-verdant",
    name: "Verdant",
    category: "professional",
    layout: "linkbio",
    style: { accent: "#059669", surface: "light", avatar: "circle" },
    description: "Emerald link-in-bio with big tappable call & booking buttons.",
    bestFor: "Doctors & clinics",
    demoSlug: "dr-nadia-rao",
  },
  {
    id: "pro-clinic",
    name: "Clinic",
    category: "professional",
    layout: "aside",
    style: { accent: "#0e7490", avatar: "rounded" },
    description: "Warm profile panel with the portrait beside the name.",
    bestFor: "Healthcare & wellness",
    demoSlug: "dr-nadia-rao",
  },
  {
    id: "pro-counsel",
    name: "Counsel",
    category: "professional",
    layout: "corporate",
    style: { accent: "#7c2d12", header: "gradient", accent2: "#b45309", avatar: "rounded" },
    description: "Warm, authoritative header with a formal info grid.",
    bestFor: "Lawyers & advisors",
    demoSlug: "aarav-mehta",
  },
  {
    id: "pro-ivory",
    name: "Ivory",
    category: "professional",
    layout: "editorial",
    style: { accent: "#1e3a8a", avatar: "circle" },
    description: "Elegant editorial layout with a monogram and framed name.",
    bestFor: "Consultants",
    demoSlug: "aarav-mehta",
  },
  {
    id: "pro-noir",
    name: "Noir",
    category: "professional",
    layout: "aurora",
    style: { accent: "#10b981", accent2: "#22d3ee", header: "dark" },
    description: "Sleek centered dark hero with a glowing aurora and mint accent.",
    bestFor: "Modern professionals",
    demoSlug: "dr-nadia-rao",
  },

  // ---------------------------------------------------------------- Creative
  {
    id: "crea-nova",
    name: "Nova",
    category: "creative",
    layout: "showcase",
    style: { accent: "#8b5cf6", accent2: "#db2777", header: "gradient", avatar: "rounded" },
    description: "Vibrant gradient banner with oversized type and a gallery mosaic.",
    bestFor: "Studios & creators",
    demoSlug: "pixel-forge",
  },
  {
    id: "crea-canvas",
    name: "Canvas",
    category: "creative",
    layout: "cover",
    style: { accent: "#db2777", accent2: "#f97316", header: "gradient", avatar: "square" },
    description: "Vibrant gradient cover with a square avatar.",
    bestFor: "Designers & artists",
    demoSlug: "pixel-forge",
  },
  {
    id: "crea-studio",
    name: "Studio",
    category: "creative",
    layout: "corporate",
    style: { accent: "#7c3aed", header: "image", avatar: "rounded" },
    description: "Portfolio-style header with work gallery grid.",
    bestFor: "Agencies",
    demoSlug: "pixel-forge",
  },
  {
    id: "crea-muse",
    name: "Muse",
    category: "creative",
    layout: "bento",
    style: { accent: "#e11d48", accent2: "#f97316", avatar: "circle" },
    description: "Playful bento tile-grid hero with a bold gradient avatar tile.",
    bestFor: "Content creators",
    demoSlug: "pixel-forge",
  },
  {
    id: "crea-mono",
    name: "Mono",
    category: "creative",
    layout: "masthead",
    style: { accent: "#111827", avatar: "rounded" },
    description: "Editorial masthead with oversized type and a bold rule.",
    bestFor: "Writers & minimalists",
    demoSlug: "sara-khan",
  },

  // -------------------------------------------------------- Products & Sales
  {
    id: "shop-market",
    name: "Market",
    category: "products",
    layout: "storefront",
    style: { accent: "#ea580c", accent2: "#f59e0b", header: "gradient", avatar: "rounded" },
    description: "Shop landing with a featured product hero and grid.",
    bestFor: "Retail & D2C",
    demoSlug: "urban-threads",
  },
  {
    id: "shop-boutique",
    name: "Boutique",
    category: "products",
    layout: "product",
    style: { accent: "#be123c", header: "image", avatar: "circle" },
    description: "Photo-header storefront with a clean shoppable grid.",
    bestFor: "Fashion & boutiques",
    demoSlug: "urban-threads",
  },
  {
    id: "shop-fresh",
    name: "Fresh",
    category: "products",
    layout: "catalog",
    style: { accent: "#16a34a", header: "solid", avatar: "rounded" },
    description: "Menu-style price list — perfect for food & services.",
    bestFor: "Food, cafés & services",
    demoSlug: "urban-threads",
  },
  {
    id: "shop-luxe",
    name: "Luxe",
    category: "products",
    layout: "lookbook",
    style: { accent: "#d4a017", accent2: "#f5d68a", avatar: "square" },
    description: "Premium dark lookbook with a featured piece and gold accents.",
    bestFor: "Premium & jewellery",
    demoSlug: "urban-threads",
  },
  {
    id: "shop-bazaar",
    name: "Bazaar",
    category: "products",
    layout: "stall",
    style: { accent: "#0d9488", accent2: "#22c55e", avatar: "circle" },
    description: "Lively shop feed with big product cards and WhatsApp ordering.",
    bestFor: "Local sellers",
    demoSlug: "urban-threads",
  },

  // ---------------------------------------------------------------- Personal
  {
    id: "me-aura",
    name: "Aura",
    category: "personal",
    layout: "halo",
    style: { accent: "#7c3aed", accent2: "#ec4899", avatar: "circle" },
    description: "Soft aesthetic profile with a glowing avatar halo.",
    bestFor: "Creators",
    demoSlug: "arjun-rao",
  },
  {
    id: "me-midnight",
    name: "Midnight",
    category: "personal",
    layout: "neon",
    style: { accent: "#22d3ee", accent2: "#a855f7", surface: "dark", avatar: "circle" },
    description: "Neon nightlife profile with glowing accents and a gradient name.",
    bestFor: "Influencers",
    demoSlug: "arjun-rao",
  },
  {
    id: "me-sunset",
    name: "Sunset",
    category: "personal",
    layout: "horizon",
    style: { accent: "#f97316", accent2: "#ec4899", header: "gradient", avatar: "circle" },
    description: "A refined warm-gradient cover with an overlapping portrait.",
    bestFor: "Lifestyle creators",
    demoSlug: "arjun-rao",
  },
  {
    id: "me-bloom",
    name: "Bloom",
    category: "personal",
    layout: "blossom",
    style: { accent: "#ec4899", accent2: "#8b5cf6", avatar: "circle" },
    description: "A premium gradient hero with a clean white content sheet.",
    bestFor: "Personal brand",
    demoSlug: "arjun-rao",
  },
  {
    id: "me-simple",
    name: "Simple",
    category: "personal",
    layout: "folio",
    style: { accent: "#0ea5e9", avatar: "circle" },
    description: "A refined editorial folio — centered portrait and airy whitespace.",
    bestFor: "Everyone",
    demoSlug: "sara-khan",
  },

  // ----------------------------------------------------------- Photo Gallery
  {
    id: "gallery-album",
    name: "Album",
    category: "gallery",
    layout: "gallery",
    style: { accent: "#2563eb", accent2: "#06b6d4", header: "gradient", avatar: "rounded" },
    description: "Photo-first template — a large tap-to-zoom gallery leads the card.",
    bestFor: "Photographers & studios",
    demoSlug: "pixel-forge",
  },

  // ----------------------------------------------------------- Video Gallery
  {
    id: "video-reel",
    name: "Reel",
    category: "video",
    layout: "videos",
    style: { accent: "#9333ea", accent2: "#ec4899", header: "gradient", avatar: "rounded" },
    description: "YouTube-first template — a feed of tap-to-play video cards leads.",
    bestFor: "Creators & channels",
    demoSlug: "pixel-forge",
  },
];

export function getTemplate(id: string): TemplateMeta | undefined {
  return templates.find((t) => t.id === id);
}

export function templatesByCategory(category: CategoryId): TemplateMeta[] {
  return templates.filter((t) => t.category === category);
}
