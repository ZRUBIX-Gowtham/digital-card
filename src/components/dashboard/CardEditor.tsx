"use client";

import {
  useState,
  useTransition,
  useEffect,
  useMemo,
  useId,
  useRef,
  useCallback,
  useContext,
  createContext,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Check,
  AlertCircle,
  RotateCcw,
  FileText,
  Palette,
  LayoutTemplate,
  ChevronRight,
  Pencil,
  X,
} from "lucide-react";
import * as Icons from "lucide-react";
import type {
  CardData,
  SocialPlatform,
  SocialLink,
  Service,
  GalleryItem,
  TeamMember,
  StatItem,
  Award,
  BrandLogo,
  ShopCategory,
  ShopProduct,
  Testimonial,
  CallToAction,
  EnquiryConfig,
  BookingConfig,
} from "@/types/card";
import { getTemplate } from "@/data/templates";
import {
  DISPLAY_STYLE_OPTIONS,
  DEFAULT_SECTION_STYLE,
  type DisplayOption,
} from "@/lib/section-display";
import {
  SECTION_LAYOUT_OPTIONS,
  SECTION_LAYOUT_TITLES,
  effectiveSectionLayout,
} from "@/lib/section-layouts";
import {
  TestimonialVariantCard,
  ServicesBody,
  GalleryBody,
  TeamBody,
  StatsBody,
  AboutBody,
  BusinessHoursBody,
  BrochureBody,
  AwardsBody,
  BrandsBody,
  FaqBody,
  ShopProductsBody,
  CtaBody,
} from "@/components/card/sections";
import { LeadFormPreview } from "@/components/card/LeadForms";
import { HOUR_OPTIONS, WORKING_HOUR_PRESETS, effectiveSlots } from "@/lib/slots";
import { FooterBody } from "@/components/card/CardFooter";
import { HeaderBody } from "@/components/card/CardHeader";
import { NavPreviewBody } from "@/components/card/CardNav";
import { CardRenderer } from "@/components/card-templates/registry";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { Container } from "@/components/ui/Container";
import { saveCardAction } from "@/app/dashboard/edit/actions";

/**
 * Coordinates the collapsible editor panels so at most two are open at once
 * (opening a third collapses the one that was opened earliest). All panels
 * start collapsed. When no provider is present, panels fall back to their own
 * local open state.
 */
const PanelAccordionContext = createContext<{
  openIds: string[];
  toggle: (id: string) => void;
} | null>(null);

/** Max panels that may stay expanded together. */
const MAX_OPEN_PANELS = 2;

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "website",
  "linkedin",
  "instagram",
  "twitter",
  "facebook",
  "youtube",
  "whatsapp",
];

const SWATCHES = ["#4f46e5", "#0369a1", "#047857", "#6d28d9", "#dc2626", "#ea580c", "#0f172a"];

const FONT_SIZES: { id: NonNullable<CardData["fontScale"]>; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
];

const ALL_SECTIONS = [
  { id: "about", label: "About Us", icon: Icons.User, description: "Profile bio & description" },
  { id: "services", label: "Products & Services", icon: Icons.Briefcase, description: "List of items or catalog" },
  { id: "shop", label: "Product Showcase", icon: Icons.ShoppingBag, description: "Shop by category with buy links" },
  { id: "stats", label: "Stats / Achievements", icon: Icons.BarChart3, description: "Number counters & highlights" },
  { id: "gallery", label: "Gallery", icon: Icons.Image, description: "Photos & image portfolio" },
  { id: "team", label: "Team Members", icon: Icons.Users, description: "People, photos & roles" },
  { id: "payment", label: "Payment Details", icon: Icons.CreditCard, description: "UPI & bank accounts" },
  { id: "businessHours", label: "Business Hours", icon: Icons.Clock, description: "Timings & operating hours" },
  { id: "youtubeVideos", label: "YouTube Videos", icon: Icons.Video, description: "Embedded video player" },
  { id: "brochures", label: "Brochures & PDFs", icon: Icons.FileText, description: "Document downloads" },
  { id: "awards", label: "Awards & Certifications", icon: Icons.Award, description: "Credentials & recognitions" },
  { id: "brands", label: "Clients & Brands", icon: Icons.Building2, description: "Logos of brands you serve" },
  { id: "testimonials", label: "Testimonials", icon: Icons.Heart, description: "Reviews & star ratings" },
  { id: "faqs", label: "FAQs", icon: Icons.HelpCircle, description: "Frequently Asked Questions" },
  { id: "booking", label: "Appointment Booking", icon: Icons.CalendarCheck, description: "Let visitors request a slot" },
  { id: "enquiry", label: "Enquiry Form", icon: Icons.Send, description: "Capture leads from your card" },
  { id: "cta", label: "Call to Action", icon: Icons.MousePointerClick, description: "Prompt with a button" },
  { id: "map", label: "Map / Location", icon: Icons.MapPin, description: "Embedded map & directions" },
];

/** Visitor slot-picker designs offered in the booking editor. */
const SLOT_STYLES: { value: NonNullable<BookingConfig["slotStyle"]>; label: string }[] = [
  { value: "dropdown", label: "Dropdown" },
  { value: "pills", label: "Pills" },
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "cards", label: "Cards" },
];

const sampleImg = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

/**
 * Prefilled sample content used when a section is first added, so the card is
 * never empty — the user just edits the placeholders. Applied only when the
 * target field is currently empty/unset.
 */
const SECTION_SAMPLES: Record<string, { field: keyof CardData; value: unknown }> = {
  about: {
    field: "about",
    value:
      "We're a passionate team dedicated to delivering quality work our clients love. Edit this text to tell your own story.",
  },
  services: {
    field: "services",
    value: [
      { title: "Free Consultation", description: "A 30-minute intro call to understand your needs.", price: "Free", icon: "MessageSquare" },
      { title: "Premium Package", description: "Everything you need to get started, done for you.", price: "₹4,999", icon: "Star" },
    ],
  },
  shop: {
    field: "shop",
    value: [
      {
        name: "T-Shirts",
        products: [
          { name: "Classic Cotton Tee", image: sampleImg("tshirt1"), price: "₹499", mrp: "₹799", url: "" },
          { name: "Graphic Print Tee", image: sampleImg("tshirt2"), price: "₹599", mrp: "₹999", url: "" },
        ],
      },
      {
        name: "Shirts",
        products: [
          { name: "Formal White Shirt", image: sampleImg("shirt1"), price: "₹1,299", mrp: "₹1,999", url: "" },
          { name: "Casual Denim Shirt", image: sampleImg("shirt2"), price: "₹1,499", mrp: "", url: "" },
        ],
      },
    ],
  },
  stats: {
    field: "stats",
    value: [
      { value: "500+", label: "Happy clients", icon: "Users" },
      { value: "10 Yrs", label: "Experience", icon: "Calendar" },
      { value: "4.9★", label: "Avg. rating", icon: "Star" },
      { value: "24/7", label: "Support", icon: "Clock" },
    ],
  },
  gallery: {
    field: "gallery",
    value: [
      { src: "https://picsum.photos/seed/gallery1/400/520", alt: "Project presentation" },
      { src: "https://picsum.photos/seed/gallery2/400/320", alt: "Office workspace" },
      { src: "https://picsum.photos/seed/gallery3/400/460", alt: "Team collaboration" },
    ],
  },
  team: {
    field: "team",
    value: [
      { name: "Alex Carter", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Maya Rodriguez", role: "Head of Design", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    ],
  },
  businessHours: {
    field: "businessHours",
    value: [
      { day: "Monday", hours: "9:00 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
      { day: "Friday", hours: "9:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "Closed" },
      { day: "Sunday", hours: "Closed" },
    ],
  },
  youtubeVideos: {
    field: "youtubeVideos",
    value: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  },
  brochures: {
    field: "brochures",
    value: [
      { title: "Company Profile.pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    ],
  },
  awards: {
    field: "awards",
    value: [
      { title: "Best Startup 2024", issuer: "TechAwards", year: "2024", icon: "Trophy" },
      { title: "ISO 9001 Certified", issuer: "BSI", year: "2023", icon: "ShieldCheck" },
    ],
  },
  brands: {
    field: "brands",
    value: [{ name: "Acme" }, { name: "Globex" }, { name: "Umbrella" }],
  },
  testimonials: {
    field: "testimonials",
    value: [
      { name: "Priya Sharma", role: "Marketing Director", rating: 5, feedback: "Absolutely fantastic experience — highly professional and reliable!" },
      { name: "James Wilson", role: "Business Owner", rating: 5, feedback: "They understood exactly what I needed. Great results and support." },
    ],
  },
  faqs: {
    field: "faqs",
    value: [
      { question: "What areas do you serve?", answer: "We work with clients locally and remotely across the region." },
      { question: "How do I get started?", answer: "Tap the Contact button and send us a message — we'll take it from there." },
    ],
  },
  cta: {
    field: "cta",
    value: {
      title: "Ready to get started?",
      subtitle: "Let's talk about how we can help you today.",
      buttonLabel: "Message us",
      action: "whatsapp",
      value: "",
      icon: "MessageCircle",
    },
  },
  enquiry: {
    field: "enquiry",
    value: {
      enabled: true,
      title: "Send an Enquiry",
      subtitle: "Leave your details and we'll get back to you.",
      askPhone: true,
      askEmail: true,
      buttonLabel: "Send enquiry",
    },
  },
  booking: {
    field: "booking",
    value: {
      enabled: true,
      title: "Book an Appointment",
      subtitle: "Request a slot and we'll confirm shortly.",
      services: [],
      slots: [],
      buttonLabel: "Request booking",
    },
  },
};

export function CardEditor({ initialCard }: { initialCard: CardData }) {
  const [card, setCard] = useState<CardData>(initialCard);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  // Mobile-only: the live preview is shown in a full-screen popup on tap.
  const [previewOpen, setPreviewOpen] = useState(false);
  // Section whose layout picker is currently open (opens automatically when a
  // section with design variants is added, so the user chooses a look first).
  const [layoutPickerFor, setLayoutPickerFor] = useState<string | null>(null);
  const closeLayoutPicker = useCallback(() => setLayoutPickerFor(null), []);
  // Left "Add section" drawer (section + layout catalog) open state.
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Accordion: ids of the currently-expanded panels (oldest first, capped at
  // MAX_OPEN_PANELS). Opening one past the cap collapses the oldest.
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const togglePanel = useCallback((id: string) => {
    setOpenPanels((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      const next = [...cur, id];
      while (next.length > MAX_OPEN_PANELS) next.shift();
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "design" || tab === "content") {
        setActiveTab(tab);
      }
    }
  }, []);

  // Sync state if server prop changes (e.g. from server actions / revalidation)
  useEffect(() => {
    setCard(prev => {
      // If template or accent changed from the outside, sync the entire card to reflect server state
      if (prev.templateId !== initialCard.templateId || prev.accent !== initialCard.accent) {
        return initialCard;
      }
      return prev;
    });
  }, [initialCard]);

  // Auto-dismiss the save toast after a few seconds.
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 3500);
    return () => clearTimeout(t);
  }, [status]);

  // Stop the page behind the mobile preview popup from scrolling.
  useEffect(() => {
    if (!previewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [previewOpen]);

  function set<K extends keyof CardData>(key: K, value: CardData[K]) {
    setCard((c) => ({ ...c, [key]: value }));
    setStatus(null);
  }
  function setContact(key: keyof CardData["contact"], value: string) {
    setCard((c) => ({ ...c, contact: { ...c.contact, [key]: value } }));
    setStatus(null);
  }
  function setPayment(key: string, value: string) {
    setCard((c) => ({ ...c, payment: { ...(c.payment ?? {}), [key]: value } }));
    setStatus(null);
  }
  function setSectionStyle(sectionId: string, value: string) {
    setCard((c) => ({
      ...c,
      sectionStyles: { ...(c.sectionStyles ?? {}), [sectionId]: value },
    }));
    setStatus(null);
  }
  function setSectionLayout(sectionId: string, value: string) {
    setCard((c) => ({
      ...c,
      sectionLayouts: { ...(c.sectionLayouts ?? {}), [sectionId]: value },
    }));
    setStatus(null);
    // Auto-scroll ONLY the preview phone to the section so the page doesn't jump
    setTimeout(() => {
      const el = document.getElementById(`sec-${sectionId}`);
      if (el) {
        const scroller = el.closest('.overflow-y-auto');
        if (scroller) {
          const scrollerRect = scroller.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const targetScrollTop = scroller.scrollTop + (elRect.top - scrollerRect.top);
          scroller.scrollTo({ top: targetScrollTop - 16, behavior: "smooth" });
        }
      }
    }, 50);
  }
  function setCta(key: keyof CallToAction, value: string) {
    setCard((c) => ({
      ...c,
      cta: {
        ...(c.cta ?? { title: "", buttonLabel: "" }),
        [key]: value,
      } as CallToAction,
    }));
    setStatus(null);
  }
  function setEnquiry<K extends keyof EnquiryConfig>(key: K, value: EnquiryConfig[K]) {
    setCard((c) => ({
      ...c,
      enquiry: { ...(c.enquiry ?? { enabled: true }), [key]: value },
    }));
    setStatus(null);
  }
  function setBooking<K extends keyof BookingConfig>(key: K, value: BookingConfig[K]) {
    setCard((c) => ({
      ...c,
      booking: { ...(c.booking ?? { enabled: true }), [key]: value },
    }));
    setStatus(null);
  }

  /** Restore layout, colour and text size to what this card started with. */
  function resetDesign() {
    setCard((c) => ({
      ...c,
      templateId: initialCard.templateId,
      accent: initialCard.accent,
      fontScale: initialCard.fontScale,
      theme: initialCard.theme,
      stickyHero: initialCard.stickyHero,
    }));
    setStatus(null);
  }

  /** Restore all content to the original, keeping the current design. */
  function resetContent() {
    setCard((c) => ({
      ...initialCard,
      slug: c.slug,
      templateId: c.templateId,
      accent: c.accent,
      fontScale: c.fontScale,
      theme: c.theme,
    }));
    setStatus(null);
  }

  function save() {
    startTransition(async () => {
      const res = await saveCardAction(card);
      if (res.ok) {
        // Keep a local copy as a lightweight backup / offline draft.
        try {
          localStorage.setItem(`zx_card_${card.slug}`, JSON.stringify(card));
        } catch {
          /* storage full or unavailable — non-fatal */
        }
      }
      setStatus(
        res.ok
          ? { ok: true, msg: "Saved! Your public card is updated." }
          : { ok: false, msg: res.error ?? "Something went wrong." },
      );
    });
  }

  const currentTemplate = getTemplate(card.templateId);
  const accent = card.accent ?? currentTemplate?.style.accent ?? "#4f46e5";

  const activeSectionsOrder = card.sectionsOrder !== undefined && card.sectionsOrder !== null
    ? card.sectionsOrder
    : ["about", "services", "gallery", "payment"];

  function moveSection(index: number, direction: "up" | "down") {
    setCard((c) => {
      const currentOrder = c.sectionsOrder !== undefined && c.sectionsOrder !== null
        ? [...c.sectionsOrder]
        : ["about", "services", "gallery", "payment"];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < currentOrder.length) {
        const temp = currentOrder[index];
        currentOrder[index] = currentOrder[targetIndex];
        currentOrder[targetIndex] = temp;
      }
      return { ...c, sectionsOrder: currentOrder };
    });
    setStatus(null);
  }

  function deleteSection(sectionId: string) {
    setCard((c) => {
      const currentOrder = c.sectionsOrder !== undefined && c.sectionsOrder !== null
        ? c.sectionsOrder
        : ["about", "services", "gallery", "payment"];
      const newOrder = currentOrder.filter((id) => id !== sectionId);
      return { ...c, sectionsOrder: newOrder };
    });
    setStatus(null);
  }

  function addSection(sectionId: string) {
    setCard((c) => {
      const currentOrder = c.sectionsOrder !== undefined && c.sectionsOrder !== null
        ? c.sectionsOrder
        : ["about", "services", "gallery", "payment"];
      if (currentOrder.includes(sectionId)) return c;
      const newOrder = [...currentOrder, sectionId];

      const updates: Partial<CardData> = { sectionsOrder: newOrder };

      // Prefill the section with sample content the first time it's added, so
      // it never appears empty. Only applied when the field is currently empty.
      const sample = SECTION_SAMPLES[sectionId];
      if (sample) {
        const existing = c[sample.field];
        const isEmpty =
          existing == null ||
          (Array.isArray(existing) && existing.length === 0) ||
          (typeof existing === "string" && existing.trim() === "");
        if (isEmpty) {
          (updates as Record<string, unknown>)[sample.field] = sample.value;
        }
      }

      return { ...c, ...updates };
    });
    setStatus(null);
  }

  // Update one item in an array field immutably.
  function updateArr(key: keyof CardData, index: number, value: any) {
    setCard((c) => {
      const arr = [...((c[key] || []) as any[])];
      arr[index] = value;
      return { ...c, [key]: arr } as CardData;
    });
    setStatus(null);
  }

  return (
    <PanelAccordionContext.Provider value={{ openIds: openPanels, toggle: togglePanel }}>
      {/* ---------------- Page header ---------------- */}
      <header className="relative z-20 border-b border-border bg-surface/95 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <Container className="flex h-14 items-center justify-between gap-3 lg:h-16">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-base font-bold text-foreground">
                <Pencil className="h-4 w-4 text-brand" /> Edit card
              </h1>
              <p className="hidden truncate text-xs text-muted sm:block">
                Update your content, then save to publish.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add section</span>
            </button>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <button
              type="button"
              onClick={resetContent}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset content</span>
            </button>
            <a
              href={`/${card.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" /> View live
            </a>
          </div>
        </Container>
      </header>

      <Container className="py-6 pb-24 max-w-6xl lg:pb-6">
        <div
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,400px)] items-start"
        >
          {/* ---------------- Editor form ---------------- */}
          <div className="flex flex-col min-w-0 relative">
            {/* Sticky Tab Wrapper */}
            <div className="sticky top-14 lg:top-[65px] z-20 -mt-3 lg:-mt-10 mb-5 pb-6 pt-5 bg-gradient-to-b from-surface via-surface/90 to-transparent">
              <div className="flex rounded-2xl bg-surface-2 p-1.5 border border-border/50 shadow-sm relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "content"
                    ? "bg-surface text-foreground shadow-sm ring-1 ring-border font-bold scale-[1.01]"
                    : "text-muted hover:text-foreground hover:bg-surface-hover/50"
                    }`}
                >
                  <FileText className="h-4 w-4" />
                  Edit Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("design")}
                  className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "design"
                    ? "bg-surface text-foreground shadow-sm ring-1 ring-border font-bold scale-[1.01]"
                    : "text-muted hover:text-foreground hover:bg-surface-hover/50"
                    }`}
                >
                  <Palette className="h-4 w-4" />
                  Design & Layout
                </button>
              </div>
            </div>

            {/* Form container */}
            <div className="space-y-6">
              {activeTab === "design" ? (
                <div className="space-y-6 animate-fade-up">
                  {/* Template — read-only here; switching lives on the dashboard */}
                  <Panel
                    title="Template"
                    desc="This is your card's current design. To switch templates, head to your dashboard."
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="block h-11 w-11 shrink-0 rounded-xl"
                        style={{
                          background: currentTemplate?.style.accent2
                            ? `linear-gradient(135deg, ${currentTemplate.style.accent}, ${currentTemplate.style.accent2})`
                            : currentTemplate?.style.accent ?? card.accent,
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {currentTemplate?.name ?? "Custom"}
                        </p>
                        <p className="text-xs text-muted">Current template</p>
                      </div>
                    </div>
                  </Panel>

                  {/* Section layouts hub — switch each section's design live */}
                  <Panel
                    title="Section Layouts"
                    desc="Pick a design for each section. Changes apply to your card instantly."
                  >
                    <LayoutHub
                      card={card}
                      accent={accent}
                      activeSections={activeSectionsOrder}
                      onChange={setSectionLayout}
                    />
                  </Panel>

                  {/* Brand colour */}
                  <Panel title="Brand colour" desc="Accent used across your card.">
                    <div className="flex flex-wrap items-center gap-2">
                      {SWATCHES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={c}
                          onClick={() => set("accent", c)}
                          className={`h-9 w-9 rounded-full ring-offset-2 transition ${card.accent === c ? "ring-2 ring-foreground" : ""
                            }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="ml-1 inline-flex items-center gap-2 text-sm text-muted">
                        <input
                          type="color"
                          value={card.accent ?? "#4f46e5"}
                          onChange={(e) => set("accent", e.target.value)}
                          className="h-9 w-9 cursor-pointer rounded-full border border-border bg-transparent p-0"
                        />
                        Custom
                      </label>
                    </div>
                  </Panel>

                  {/* Card appearance — what visitors see (light or dark) */}
                  <Panel
                    title="Card appearance"
                    desc="Choose whether visitors see your public card in light or dark."
                  >
                    <div className="inline-flex rounded-xl border border-border p-1">
                      {(["light", "dark"] as const).map((t) => {
                        const active = (card.theme ?? "light") === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => set("theme", t)}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors cursor-pointer ${active
                              ? "bg-brand text-white"
                              : "text-muted hover:text-foreground"
                              }`}
                          >
                            {t === "dark" ? (
                              <Icons.Moon className="h-4 w-4" />
                            ) : (
                              <Icons.Sun className="h-4 w-4" />
                            )}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </Panel>

                  {/* Hero effect — only for hero-sheet layouts (e.g. Luxe) */}
                  {currentTemplate?.layout === "lookbook" && (
                    <Panel
                      title="Hero effect"
                      desc="Keep the hero pinned while the content scrolls up over it."
                    >
                      <Toggle
                        label="Sticky hero"
                        hint="On: the hero stays fixed and the content sheet glides over it. Off: everything scrolls normally."
                        checked={card.stickyHero !== false}
                        onChange={(v) => set("stickyHero", v)}
                      />
                    </Panel>
                  )}

                  {/* Text size */}
                  <Panel title="Text size" desc="Scales the whole card up or down.">
                    <div className="inline-flex rounded-xl border border-border p-1">
                      {FONT_SIZES.map((f) => {
                        const active = (card.fontScale ?? "md") === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => set("fontScale", f.id)}
                            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${active
                              ? "bg-brand text-white"
                              : "text-muted hover:text-foreground"
                              }`}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </Panel>

                  {/* Reset to defaults */}
                  <Panel
                    title="Reset design"
                    desc="Restore the layout, color scheme and typography to defaults."
                  >
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={resetDesign}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                      >
                        <RotateCcw className="h-4 w-4" /> Reset design settings
                      </button>
                    </div>
                  </Panel>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-up">
                  {/* Profile */}
                  <Panel collapsible defaultOpen icon={Icons.User} title="Profile" desc="Your name, role, company and tagline.">
                    <Grid2>
                      <Text label="Full name" value={card.name} onChange={(v) => set("name", v)} />
                      <Text label="Title / role" value={card.title} onChange={(v) => set("title", v)} />
                    </Grid2>
                    <Grid2>
                      <Text label="Company" value={card.company} onChange={(v) => set("company", v)} />
                      <Text
                        label="Initials (avatar fallback)"
                        value={card.logoText ?? ""}
                        onChange={(v) => set("logoText", v)}
                      />
                    </Grid2>
                    <Text label="Tagline" value={card.tagline ?? ""} onChange={(v) => set("tagline", v)} />
                  </Panel>

                  {/* Profile views */}
                  <Panel collapsible icon={Icons.Eye} title="Profile views" desc="A live view counter on your public card.">
                    <Toggle
                      label="Show view count"
                      hint="Anyone visiting your card can see how many views it has."
                      checked={card.showViews !== false}
                      onChange={(v) => set("showViews", v)}
                    />
                    {card.showViews !== false && (
                      <Toggle
                        label="Background behind count"
                        hint="Show the count on a chip, or as plain text only."
                        checked={card.viewsBadgeBg !== false}
                        onChange={(v) => set("viewsBadgeBg", v)}
                      />
                    )}
                  </Panel>

                  {/* Menu & footer */}
                  <Panel collapsible icon={Icons.Menu} title="Menu & Footer" desc="Optional navigation and footer on your public card.">
                    <Toggle
                      label="Hamburger menu"
                      hint="A menu button (top-left) that slides out and jumps to each section."
                      checked={card.showNav !== false}
                      onChange={(v) => set("showNav", v)}
                    />
                    {card.showNav !== false && (
                      <Toggle
                        label="Pin navbar to top"
                        hint="Keeps the top navigation bar visible as you scroll down."
                        checked={card.navFixed !== false}
                        onChange={(v) => set("navFixed", v)}
                      />
                    )}
                    <Toggle
                      label="Footer"
                      hint="A footer with your name, social links and a credit line."
                      checked={card.showFooter !== false}
                      onChange={(v) => set("showFooter", v)}
                    />
                  </Panel>

                  {/* Images */}
                  <Panel collapsible icon={Icons.Image} title="Header Images" desc="Upload profile photo and cover banner.">
                    <ImageUpload
                      label="Profile photo / logo"
                      value={card.avatarImage ?? ""}
                      onChange={(v) => set("avatarImage", v)}
                    />
                    <ImageUpload
                      label="Cover / banner"
                      value={card.coverImage ?? ""}
                      onChange={(v) => set("coverImage", v)}
                    />
                  </Panel>

                  {/* Contact */}
                  <Panel collapsible icon={Icons.Phone} title="Contact & Social Links" desc="How clients reach and follow you.">
                    <Grid2>
                      <Text label="Phone" value={card.contact.phone ?? ""} onChange={(v) => setContact("phone", v)} />
                      <Text
                        label="WhatsApp (digits)"
                        value={card.contact.whatsapp ?? ""}
                        onChange={(v) => setContact("whatsapp", v)}
                        placeholder="9190000…"
                      />
                    </Grid2>
                    <Grid2>
                      <Text label="Email" value={card.contact.email ?? ""} onChange={(v) => setContact("email", v)} />
                      <Text label="Website" value={card.contact.website ?? ""} onChange={(v) => setContact("website", v)} />
                    </Grid2>
                    <Text label="Address" value={card.contact.address ?? ""} onChange={(v) => setContact("address", v)} />
                    <Text label="Map URL" value={card.contact.mapUrl ?? ""} onChange={(v) => setContact("mapUrl", v)} />

                    <List
                      label="Social links"
                      items={card.socials}
                      onAdd={() =>
                        set("socials", [...card.socials, { platform: "website", url: "" }])
                      }
                      onRemove={(i) =>
                        set("socials", card.socials.filter((_, idx) => idx !== i))
                      }
                      render={(s: SocialLink, i) => (
                        <div className="grid grid-cols-[130px_1fr] gap-2">
                          <Select
                            label="Platform"
                            value={s.platform}
                            options={SOCIAL_PLATFORMS}
                            onChange={(v) =>
                              updateArr("socials", i, { ...s, platform: v as SocialPlatform })
                            }
                          />
                          <Text
                            label="URL"
                            value={s.url}
                            onChange={(v) => updateArr("socials", i, { ...s, url: v })}
                            placeholder="https://…"
                          />
                        </div>
                      )}
                    />
                  </Panel>

                  {/* Render active content panels dynamically in activeSectionsOrder.
                    Each section's Panel is built by the switch, then wrapped as a
                    collapsible accordion with reorder/delete controls in its header. */}
                  {activeSectionsOrder.map((sectionId, index) => {
                    const built = ((): React.ReactElement | null => {
                      switch (sectionId) {
                        case "about":
                          return (
                            <Panel key="about" title="About Us" desc="Write a brief introduction about your business." action={<ChangeLayoutButton sectionId="about" current={effectiveSectionLayout(card.sectionLayouts, "about")} onOpen={setLayoutPickerFor} />}>
                              <TextArea
                                label="Biography / About"
                                value={card.about ?? ""}
                                onChange={(v) => set("about", v)}
                                placeholder="Tell visitors about your background or company..."
                              />
                            </Panel>
                          );
                        case "services":
                          return (
                            <Panel key="services" title="Products & Services" desc="Add products or services with prices, descriptions, and custom icons." action={<ChangeLayoutButton sectionId="services" current={effectiveSectionLayout(card.sectionLayouts, "services")} onOpen={setLayoutPickerFor} />}>
                              <List
                                label="Items"
                                items={card.services}
                                onAdd={() =>
                                  set("services", [...card.services, { title: "", description: "", price: "", icon: "Briefcase" }])
                                }
                                onRemove={(i) =>
                                  set("services", card.services.filter((_, idx) => idx !== i))
                                }
                                render={(s: Service, i) => (
                                  <div className="space-y-3">
                                    <Grid2>
                                      <Text
                                        label="Title"
                                        value={s.title}
                                        onChange={(v) => updateArr("services", i, { ...s, title: v })}
                                      />
                                      <Text
                                        label="Price"
                                        value={s.price ?? ""}
                                        onChange={(v) => updateArr("services", i, { ...s, price: v })}
                                        placeholder="e.g. $49 or Free"
                                      />
                                    </Grid2>
                                    <div className="grid grid-cols-[140px_1fr] gap-3">
                                      <IconPicker
                                        label="Item Icon"
                                        value={s.icon || "Briefcase"}
                                        onChange={(v) => updateArr("services", i, { ...s, icon: v })}
                                      />
                                      <Text
                                        label="Description"
                                        value={s.description ?? ""}
                                        onChange={(v) => updateArr("services", i, { ...s, description: v })}
                                      />
                                    </div>
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "gallery":
                          return (
                            <Panel key="gallery" title="Gallery Portfolio" desc="Upload image showcases." action={<ChangeLayoutButton sectionId="gallery" current={effectiveSectionLayout(card.sectionLayouts, "gallery")} onOpen={setLayoutPickerFor} />}>
                              <SectionDisplayStyle sectionId="gallery" card={card} onChange={setSectionStyle} />
                              <List
                                label="Images"
                                items={card.gallery}
                                onAdd={() => {
                                  const newIdx = (card.gallery?.length || 0) + 1;
                                  const h = 300 + (newIdx * 70) % 300; // generates varying heights like 370, 440, 510, etc.
                                  set("gallery", [...card.gallery, { src: `https://picsum.photos/seed/gxnew${newIdx}/400/${h}`, alt: `Beautiful photo ${newIdx}` }]);
                                }}
                                onRemove={(i) =>
                                  set("gallery", card.gallery.filter((_, idx) => idx !== i))
                                }
                                render={(g: GalleryItem, i) => (
                                  <div className="space-y-3">
                                    <ImageUpload
                                      label="Upload Gallery Image"
                                      value={g.src}
                                      onChange={(v) => updateArr("gallery", i, { ...g, src: v })}
                                    />
                                    <Text
                                      label="Caption"
                                      value={g.alt}
                                      onChange={(v) => updateArr("gallery", i, { ...g, alt: v })}
                                      placeholder="e.g. Project photo"
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "payment":
                          return (
                            <Panel key="payment" title="Payment details" desc="UPI and bank details for client convenience.">
                              <Grid2>
                                <Text label="UPI ID" value={card.payment?.upiId ?? ""} onChange={(v) => setPayment("upiId", v)} />
                                <Text label="Bank name" value={card.payment?.bankName ?? ""} onChange={(v) => setPayment("bankName", v)} />
                              </Grid2>
                              <Grid2>
                                <Text label="Account name" value={card.payment?.accountName ?? ""} onChange={(v) => setPayment("accountName", v)} />
                                <Text label="Account number" value={card.payment?.accountNumber ?? ""} onChange={(v) => setPayment("accountNumber", v)} />
                              </Grid2>
                              <Text label="IFSC" value={card.payment?.ifsc ?? ""} onChange={(v) => setPayment("ifsc", v)} />
                            </Panel>
                          );
                        case "businessHours":
                          return (
                            <Panel key="businessHours" title="Business Hours" desc="Timings and operating hours." action={<ChangeLayoutButton sectionId="businessHours" current={effectiveSectionLayout(card.sectionLayouts, "businessHours")} onOpen={setLayoutPickerFor} />}>
                              <div className="space-y-3">
                                {(card.businessHours || []).map((bh, idx) => (
                                  <div key={idx} className="grid grid-cols-[110px_1fr] gap-3 items-center">
                                    <span className="text-xs font-semibold text-muted">{bh.day}</span>
                                    <Text
                                      label=""
                                      value={bh.hours}
                                      onChange={(v) => {
                                        const newHours = [...(card.businessHours || [])];
                                        newHours[idx] = { ...bh, hours: v };
                                        set("businessHours", newHours);
                                      }}
                                      placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                                    />
                                  </div>
                                ))}
                              </div>
                            </Panel>
                          );
                        case "youtubeVideos":
                          return (
                            <Panel key="youtubeVideos" title="YouTube Videos" desc="Responsive player embeds.">
                              <SectionDisplayStyle sectionId="youtubeVideos" card={card} onChange={setSectionStyle} />
                              <List
                                label="Videos"
                                items={card.youtubeVideos || []}
                                onAdd={() => set("youtubeVideos", [...(card.youtubeVideos || []), ""])}
                                onRemove={(i) => set("youtubeVideos", (card.youtubeVideos || []).filter((_, idx) => idx !== i))}
                                render={(url, i) => (
                                  <Text
                                    label="YouTube URL"
                                    value={url}
                                    onChange={(v) => {
                                      const newVideos = [...(card.youtubeVideos || [])];
                                      newVideos[i] = v;
                                      set("youtubeVideos", newVideos);
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=…"
                                  />
                                )}
                              />
                            </Panel>
                          );
                        case "brochures":
                          return (
                            <Panel key="brochures" title="Brochures & Documents" desc="Catalog or PDF price list downloads." action={<ChangeLayoutButton sectionId="brochures" current={effectiveSectionLayout(card.sectionLayouts, "brochures")} onOpen={setLayoutPickerFor} />}>
                              <List
                                label="Files"
                                items={card.brochures || []}
                                onAdd={() => set("brochures", [...(card.brochures || []), { title: "", url: "" }])}
                                onRemove={(i) => set("brochures", (card.brochures || []).filter((_, idx) => idx !== i))}
                                render={(b, i) => (
                                  <div className="space-y-3">
                                    <Text
                                      label="Document Title"
                                      value={b.title}
                                      onChange={(v) => {
                                        const newB = [...(card.brochures || [])];
                                        newB[i] = { ...b, title: v };
                                        set("brochures", newB);
                                      }}
                                      placeholder="e.g. Catalog"
                                    />
                                    <ImageUpload
                                      label="Upload PDF / File (or paste URL)"
                                      value={b.url}
                                      onChange={(v) => {
                                        const newB = [...(card.brochures || [])];
                                        newB[i] = { ...b, url: v };
                                        set("brochures", newB);
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "testimonials":
                          return (
                            <Panel key="testimonials" title="Testimonials" desc="Client reviews and ratings." action={<ChangeLayoutButton sectionId="testimonials" current={effectiveSectionLayout(card.sectionLayouts, "testimonials")} onOpen={setLayoutPickerFor} />}>
                              <SectionDisplayStyle sectionId="testimonials" card={card} onChange={setSectionStyle} />
                              <List
                                label="Reviews"
                                items={card.testimonials || []}
                                onAdd={() => set("testimonials", [...(card.testimonials || []), { name: "", feedback: "", rating: 5 }])}
                                onRemove={(i) => set("testimonials", (card.testimonials || []).filter((_, idx) => idx !== i))}
                                render={(t, i) => (
                                  <div className="space-y-3">
                                    <Grid2>
                                      <Text
                                        label="Client Name"
                                        value={t.name}
                                        onChange={(v) => {
                                          const newT = [...(card.testimonials || [])];
                                          newT[i] = { ...t, name: v };
                                          set("testimonials", newT);
                                        }}
                                      />
                                      <Text
                                        label="Role / Company"
                                        value={t.role || ""}
                                        onChange={(v) => {
                                          const newT = [...(card.testimonials || [])];
                                          newT[i] = { ...t, role: v };
                                          set("testimonials", newT);
                                        }}
                                      />
                                    </Grid2>
                                    <Select
                                      label="Rating"
                                      value={t.rating.toString()}
                                      options={["5", "4", "3", "2", "1"]}
                                      onChange={(v) => {
                                        const newT = [...(card.testimonials || [])];
                                        newT[i] = { ...t, rating: parseInt(v) };
                                        set("testimonials", newT);
                                      }}
                                    />
                                    <TextArea
                                      label="Feedback"
                                      value={t.feedback}
                                      onChange={(v) => {
                                        const newT = [...(card.testimonials || [])];
                                        newT[i] = { ...t, feedback: v };
                                        set("testimonials", newT);
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "faqs":
                          return (
                            <Panel key="faqs" title="Frequently Asked Questions" desc="Common client queries." action={<ChangeLayoutButton sectionId="faqs" current={effectiveSectionLayout(card.sectionLayouts, "faqs")} onOpen={setLayoutPickerFor} />}>
                              <List
                                label="FAQs"
                                items={card.faqs || []}
                                onAdd={() => set("faqs", [...(card.faqs || []), { question: "", answer: "" }])}
                                onRemove={(i) => set("faqs", (card.faqs || []).filter((_, idx) => idx !== i))}
                                render={(faq, i) => (
                                  <div className="space-y-3">
                                    <Text
                                      label="Question"
                                      value={faq.question}
                                      onChange={(v) => {
                                        const newF = [...(card.faqs || [])];
                                        newF[i] = { ...faq, question: v };
                                        set("faqs", newF);
                                      }}
                                    />
                                    <TextArea
                                      label="Answer"
                                      value={faq.answer}
                                      onChange={(v) => {
                                        const newF = [...(card.faqs || [])];
                                        newF[i] = { ...faq, answer: v };
                                        set("faqs", newF);
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "booking":
                          return (
                            <Panel
                              key="booking"
                              title="Appointment Booking"
                              desc="Visitors pick a date and request a slot — requests land in your Leads inbox."
                            >
                              <div className="space-y-4">
                                <Grid2>
                                  <Text
                                    label="Heading"
                                    value={card.booking?.title ?? ""}
                                    onChange={(v) => setBooking("title", v)}
                                    placeholder="Book an Appointment"
                                  />
                                  <Text
                                    label="Button label"
                                    value={card.booking?.buttonLabel ?? ""}
                                    onChange={(v) => setBooking("buttonLabel", v)}
                                    placeholder="Request booking"
                                  />
                                </Grid2>
                                <Text
                                  label="Subtitle"
                                  value={card.booking?.subtitle ?? ""}
                                  onChange={(v) => setBooking("subtitle", v)}
                                  placeholder="Request a slot and we'll confirm shortly."
                                />
                                <TextArea
                                  label="Services to choose from (one per line — optional)"
                                  value={(card.booking?.services ?? []).join("\n")}
                                  onChange={(v) =>
                                    setBooking(
                                      "services",
                                      v.split("\n").map((s) => s.trim()).filter(Boolean),
                                    )
                                  }
                                  placeholder={"Haircut\nHair colour\nConsultation"}
                                />
                                {/* Working hours → slots are generated across the window */}
                                <div className="space-y-3 rounded-xl border border-border bg-surface-2/40 p-4">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-foreground">
                                      Working hours
                                    </span>
                                    {effectiveSlots(card.booking).length > 0 && (
                                      <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                                        {effectiveSlots(card.booking).length} slots
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {WORKING_HOUR_PRESETS.map((p) => {
                                      const active =
                                        card.booking?.dayStart === p.start &&
                                        card.booking?.dayEnd === p.end;
                                      return (
                                        <button
                                          key={p.label}
                                          type="button"
                                          onClick={() => {
                                            setBooking("dayStart", p.start);
                                            setBooking("dayEnd", p.end);
                                          }}
                                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${active ? "border-brand bg-brand/10 text-brand" : "border-border text-muted hover:border-brand/40"}`}
                                        >
                                          {p.label}
                                        </button>
                                      );
                                    })}
                                    {(card.booking?.dayStart || card.booking?.dayEnd) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setBooking("dayStart", undefined);
                                          setBooking("dayEnd", undefined);
                                        }}
                                        className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition hover:text-foreground"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <Select
                                      label="Start"
                                      value={card.booking?.dayStart ?? ""}
                                      options={["", ...HOUR_OPTIONS]}
                                      onChange={(v) => setBooking("dayStart", v || undefined)}
                                    />
                                    <Select
                                      label="End"
                                      value={card.booking?.dayEnd ?? ""}
                                      options={["", ...HOUR_OPTIONS]}
                                      onChange={(v) => setBooking("dayEnd", v || undefined)}
                                    />
                                    <Select
                                      label="Every"
                                      value={`${card.booking?.slotInterval ?? 60} min`}
                                      options={["30 min", "60 min"]}
                                      onChange={(v) =>
                                        setBooking("slotInterval", parseInt(v, 10))
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                                    <Select
                                      label="Break from"
                                      value={card.booking?.breakStart ?? ""}
                                      options={["", ...HOUR_OPTIONS]}
                                      onChange={(v) => setBooking("breakStart", v || undefined)}
                                    />
                                    <Select
                                      label="Break to"
                                      value={card.booking?.breakEnd ?? ""}
                                      options={["", ...HOUR_OPTIONS]}
                                      onChange={(v) => setBooking("breakEnd", v || undefined)}
                                    />
                                    {(card.booking?.breakStart || card.booking?.breakEnd) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setBooking("breakStart", undefined);
                                          setBooking("breakEnd", undefined);
                                        }}
                                        className="mb-0.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted transition hover:text-foreground"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-muted">
                                    Slots generate automatically and skip your break window.
                                    Booked and past-time slots are greyed out for visitors and
                                    can&apos;t be double-booked.
                                  </p>
                                </div>

                                {/* Slot picker design */}
                                <div>
                                  <span className="mb-1.5 block text-xs font-medium text-muted">
                                    Slot picker design
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {SLOT_STYLES.map((s) => {
                                      const active =
                                        (card.booking?.slotStyle ?? "dropdown") === s.value;
                                      return (
                                        <button
                                          key={s.value}
                                          type="button"
                                          onClick={() => setBooking("slotStyle", s.value)}
                                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-brand bg-brand/10 text-brand" : "border-border text-muted hover:border-brand/40"}`}
                                        >
                                          {s.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {!card.booking?.dayStart && !card.booking?.dayEnd && (
                                  <TextArea
                                    label="Custom slots (one per line — used when no working hours set)"
                                    value={(card.booking?.slots ?? []).join("\n")}
                                    onChange={(v) =>
                                      setBooking(
                                        "slots",
                                        v.split("\n").map((s) => s.trim()).filter(Boolean),
                                      )
                                    }
                                    placeholder={"10:00 AM\n12:30 PM\n4:00 PM"}
                                  />
                                )}
                              </div>
                            </Panel>
                          );
                        case "enquiry":
                          return (
                            <Panel
                              key="enquiry"
                              title="Enquiry Form"
                              desc="Capture leads directly from your card — submissions land in your Leads inbox."
                            >
                              <div className="space-y-4">
                                <Grid2>
                                  <Text
                                    label="Heading"
                                    value={card.enquiry?.title ?? ""}
                                    onChange={(v) => setEnquiry("title", v)}
                                    placeholder="Send an Enquiry"
                                  />
                                  <Text
                                    label="Button label"
                                    value={card.enquiry?.buttonLabel ?? ""}
                                    onChange={(v) => setEnquiry("buttonLabel", v)}
                                    placeholder="Send enquiry"
                                  />
                                </Grid2>
                                <Text
                                  label="Subtitle"
                                  value={card.enquiry?.subtitle ?? ""}
                                  onChange={(v) => setEnquiry("subtitle", v)}
                                  placeholder="Leave your details and we'll get back to you."
                                />
                                <div className="space-y-3 rounded-xl border border-border bg-surface-2/40 p-4">
                                  <Toggle
                                    label="Ask for phone number"
                                    checked={card.enquiry?.askPhone !== false}
                                    onChange={(v) => setEnquiry("askPhone", v)}
                                  />
                                  <Toggle
                                    label="Ask for email"
                                    checked={card.enquiry?.askEmail !== false}
                                    onChange={(v) => setEnquiry("askEmail", v)}
                                  />
                                </div>
                              </div>
                            </Panel>
                          );
                        case "cta":
                          return (
                            <Panel
                              key="cta"
                              title="Call to Action"
                              desc="A prompt with a button that drives contact or clicks."
                              action={<ChangeLayoutButton sectionId="cta" current={effectiveSectionLayout(card.sectionLayouts, "cta")} onOpen={setLayoutPickerFor} />}
                            >
                              <div className="space-y-4">
                                <Text
                                  label="Title"
                                  value={card.cta?.title ?? ""}
                                  onChange={(v) => setCta("title", v)}
                                  placeholder="Ready to get started?"
                                />
                                <Text
                                  label="Subtitle"
                                  value={card.cta?.subtitle ?? ""}
                                  onChange={(v) => setCta("subtitle", v)}
                                  placeholder="Let's talk about how we can help."
                                />
                                <Grid2>
                                  <Text
                                    label="Button label"
                                    value={card.cta?.buttonLabel ?? ""}
                                    onChange={(v) => setCta("buttonLabel", v)}
                                    placeholder="Message us"
                                  />
                                  <IconPicker
                                    label="Button icon"
                                    value={card.cta?.icon ?? ""}
                                    onChange={(v) => setCta("icon", v)}
                                  />
                                </Grid2>
                                <Grid2>
                                  <Select
                                    label="Button action"
                                    value={card.cta?.action ?? "whatsapp"}
                                    options={["whatsapp", "link", "phone", "email"]}
                                    onChange={(v) => setCta("action", v)}
                                  />
                                  <Text
                                    label="Link / number / email"
                                    value={card.cta?.value ?? ""}
                                    onChange={(v) => setCta("value", v)}
                                    placeholder="Blank = use contact info"
                                  />
                                </Grid2>
                              </div>
                            </Panel>
                          );
                        case "team":
                          return (
                            <Panel key="team" title="Team Members" desc="Add people with photos and roles." action={<ChangeLayoutButton sectionId="team" current={effectiveSectionLayout(card.sectionLayouts, "team")} onOpen={setLayoutPickerFor} />}>
                              <SectionDisplayStyle sectionId="team" card={card} onChange={setSectionStyle} />
                              <List
                                label="Members"
                                items={card.team || []}
                                onAdd={() => set("team", [...(card.team || []), { name: "", role: "", image: "" }])}
                                onRemove={(i) => set("team", (card.team || []).filter((_, idx) => idx !== i))}
                                render={(m: TeamMember, i) => (
                                  <div className="space-y-3">
                                    <Grid2>
                                      <Text
                                        label="Name"
                                        value={m.name}
                                        onChange={(v) => updateArr("team", i, { ...m, name: v })}
                                      />
                                      <Text
                                        label="Role"
                                        value={m.role ?? ""}
                                        onChange={(v) => updateArr("team", i, { ...m, role: v })}
                                        placeholder="e.g. Co-founder"
                                      />
                                    </Grid2>
                                    <ImageUpload
                                      label="Photo"
                                      value={m.image ?? ""}
                                      onChange={(v) => updateArr("team", i, { ...m, image: v })}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "stats":
                          return (
                            <Panel key="stats" title="Stats / Achievements" desc="Punchy numbers that build trust." action={<ChangeLayoutButton sectionId="stats" current={effectiveSectionLayout(card.sectionLayouts, "stats")} onOpen={setLayoutPickerFor} />}>
                              <List
                                label="Stats"
                                items={card.stats || []}
                                onAdd={() => set("stats", [...(card.stats || []), { value: "", label: "", icon: "TrendingUp" }])}
                                onRemove={(i) => set("stats", (card.stats || []).filter((_, idx) => idx !== i))}
                                render={(s: StatItem, i) => (
                                  <div className="space-y-3">
                                    <Grid2>
                                      <Text
                                        label="Value"
                                        value={s.value}
                                        onChange={(v) => updateArr("stats", i, { ...s, value: v })}
                                        placeholder="e.g. 500+"
                                      />
                                      <Text
                                        label="Label"
                                        value={s.label}
                                        onChange={(v) => updateArr("stats", i, { ...s, label: v })}
                                        placeholder="e.g. Happy clients"
                                      />
                                    </Grid2>
                                    <IconPicker
                                      label="Icon"
                                      value={s.icon || "TrendingUp"}
                                      onChange={(v) => updateArr("stats", i, { ...s, icon: v })}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "awards":
                          return (
                            <Panel key="awards" title="Awards & Certifications" desc="Credentials and recognitions." action={<ChangeLayoutButton sectionId="awards" current={effectiveSectionLayout(card.sectionLayouts, "awards")} onOpen={setLayoutPickerFor} />}>
                              <List
                                label="Awards"
                                items={card.awards || []}
                                onAdd={() => set("awards", [...(card.awards || []), { title: "", issuer: "", year: "", icon: "Award" }])}
                                onRemove={(i) => set("awards", (card.awards || []).filter((_, idx) => idx !== i))}
                                render={(a: Award, i) => (
                                  <div className="space-y-3">
                                    <Text
                                      label="Title"
                                      value={a.title}
                                      onChange={(v) => updateArr("awards", i, { ...a, title: v })}
                                      placeholder="e.g. Certified Financial Planner"
                                    />
                                    <div className="grid grid-cols-[1fr_100px] gap-3">
                                      <Text
                                        label="Issuer"
                                        value={a.issuer ?? ""}
                                        onChange={(v) => updateArr("awards", i, { ...a, issuer: v })}
                                      />
                                      <Text
                                        label="Year"
                                        value={a.year ?? ""}
                                        onChange={(v) => updateArr("awards", i, { ...a, year: v })}
                                        placeholder="2024"
                                      />
                                    </div>
                                    <IconPicker
                                      label="Icon"
                                      value={a.icon || "Award"}
                                      onChange={(v) => updateArr("awards", i, { ...a, icon: v })}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "brands":
                          return (
                            <Panel key="brands" title="Clients & Brands" desc="Logos of brands you've worked with." action={<ChangeLayoutButton sectionId="brands" current={effectiveSectionLayout(card.sectionLayouts, "brands")} onOpen={setLayoutPickerFor} />}>
                              <SectionDisplayStyle sectionId="brands" card={card} onChange={setSectionStyle} />
                              <List
                                label="Brands"
                                items={card.brands || []}
                                onAdd={() => set("brands", [...(card.brands || []), { name: "", logo: "" }])}
                                onRemove={(i) => set("brands", (card.brands || []).filter((_, idx) => idx !== i))}
                                render={(b: BrandLogo, i) => (
                                  <div className="space-y-3">
                                    <Text
                                      label="Brand name"
                                      value={b.name}
                                      onChange={(v) => updateArr("brands", i, { ...b, name: v })}
                                    />
                                    <ImageUpload
                                      label="Logo (optional — shows name if empty)"
                                      value={b.logo ?? ""}
                                      onChange={(v) => updateArr("brands", i, { ...b, logo: v })}
                                    />
                                  </div>
                                )}
                              />
                            </Panel>
                          );
                        case "shop":
                          return (
                            <Panel
                              key="shop"
                              title="Product Showcase"
                              desc="Group products by category. Each product can link to a Buy URL and/or a WhatsApp number (falls back to your Contact number)."
                              action={<ChangeLayoutButton sectionId="shop" current={effectiveSectionLayout(card.sectionLayouts, "shop")} onOpen={setLayoutPickerFor} />}
                            >
                              <ShopEditor shop={card.shop || []} onChange={(v) => set("shop", v)} />
                            </Panel>
                          );
                        case "map":
                          return (
                            <Panel
                              key="map"
                              title="Map / Location"
                              desc="Show an embedded map with your address. The map is generated from the address; the Map URL is used for the “Get directions” button."
                            >
                              <Text
                                label="Address"
                                value={card.contact.address ?? ""}
                                onChange={(v) => setContact("address", v)}
                                placeholder="e.g. 12 MG Road, Bengaluru 560001"
                              />
                              <Text
                                label="Map URL (optional)"
                                value={card.contact.mapUrl ?? ""}
                                onChange={(v) => setContact("mapUrl", v)}
                                placeholder="https://maps.google.com/…"
                              />
                            </Panel>
                          );
                        default:
                          return null;
                      }
                    })();
                    if (!built) return null;
                    const info = ALL_SECTIONS.find((s) => s.id === sectionId);
                    return cloneElement(built as React.ReactElement<Record<string, unknown>>, {
                      key: sectionId,
                      collapsible: true,
                      defaultOpen: false,
                      icon: info?.icon,
                      action: (
                        <SectionControls
                          sectionId={sectionId}
                          index={index}
                          total={activeSectionsOrder.length}
                          onMove={moveSection}
                          onDelete={deleteSection}
                        />
                      ),
                    });
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ---------------- Live preview (desktop only) ---------------- */}
          <div className="hidden lg:sticky lg:top-[90px] lg:self-start lg:flex flex-col items-center gap-4 w-full shrink-0 h-[calc(100vh-120px)]">
            {/* Header: label + primary actions */}
            <div className="flex w-full shrink-0 items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <Icons.Eye className="h-3.5 w-3.5" /> Live preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`/${card.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View live
                </a>
                <button
                  type="button"
                  onClick={save}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  {pending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            {/* Phone Frame — fills the available height, centered */}
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <PhoneFrame
                className="h-full w-[285px] max-h-[720px] max-w-full shadow-xl"
                screenClassName="min-h-0 flex-1 !p-0 scroll-smooth"
              >
                <div className="h-full [&>div>div]:max-w-none [&>div>div]:overflow-visible [&>div>div]:rounded-none [&>div>div]:sm:rounded-none [&>div>div]:border-0 [&>div>div]:sm:border-0 [&>div>div]:shadow-none [&>div>div]:sm:shadow-none [&>div>div]:min-h-0 [&>div>div]:sm:min-h-0 [&>div>div>div]:max-w-none [&>div>div>div]:overflow-visible [&>div>div>div]:rounded-none [&>div>div>div]:sm:rounded-none [&>div>div>div]:border-0 [&>div>div>div]:sm:border-0 [&>div>div>div]:shadow-none [&>div>div>div]:sm:shadow-none [&>div>div>div]:min-h-0 [&>div>div>div]:sm:min-h-0">
                  <CardRenderer card={card} />
                </div>
              </PhoneFrame>
            </div>
          </div>
        </div>

        {/* Save toast — bottom-right custom popup */}
        {status && (
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-end px-6 sm:inset-x-auto sm:right-6">
            <div
              role="status"
              className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg animate-fade-up ${status.ok
                ? "border-emerald-200 bg-surface text-emerald-700"
                : "border-red-200 bg-surface text-red-700"
                }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${status.ok ? "bg-emerald-100" : "bg-red-100"
                  }`}
              >
                {status.ok ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </span>
              <p className="text-sm font-semibold text-foreground">{status.msg}</p>
              <button
                type="button"
                onClick={() => setStatus(null)}
                aria-label="Dismiss"
                className="ml-1 rounded-lg p-1 text-muted hover:bg-surface hover:text-muted"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {/* Mobile action bar — Save + Preview (desktop uses the side panel) */}
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
          >
            <Icons.Eye className="h-4 w-4" /> Preview
          </button>
        </div>

        {/* Mobile live-preview popup */}
        {previewOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm">
            <div className="flex shrink-0 items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-white">Live preview</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
              >
                <Icons.X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-4 pb-4">
              <PhoneFrame
                className="h-[75vh] w-[280px] max-h-full max-w-full shadow-2xl"
                screenClassName="min-h-0 flex-1 !p-0"
              >
                <div className="h-full [&>div>div]:max-w-none [&>div>div]:overflow-visible [&>div>div]:rounded-none [&>div>div]:sm:rounded-none [&>div>div]:border-0 [&>div>div]:sm:border-0 [&>div>div]:shadow-none [&>div>div]:sm:shadow-none [&>div>div]:min-h-0 [&>div>div]:sm:min-h-0 [&>div>div>div]:max-w-none [&>div>div>div]:overflow-visible [&>div>div>div]:rounded-none [&>div>div>div]:sm:rounded-none [&>div>div>div]:border-0 [&>div>div>div]:sm:border-0 [&>div>div>div]:shadow-none [&>div>div>div]:sm:shadow-none [&>div>div>div]:min-h-0 [&>div>div>div]:sm:min-h-0">
                  <CardRenderer card={card} />
                </div>
              </PhoneFrame>
            </div>
            <div className="flex shrink-0 items-center justify-center gap-3 px-4 pt-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save changes"}
              </button>
              <a
                href={`/${card.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4" /> View live
              </a>
            </div>
          </div>
        )}

        {/* Design picker shown right after a layout-capable section is added */}
        {layoutPickerFor && (
          <LayoutPicker
            sectionId={layoutPickerFor}
            card={card}
            accent={accent}
            current={effectiveSectionLayout(card.sectionLayouts, layoutPickerFor)}
            onChange={setSectionLayout}
            onClose={closeLayoutPicker}
          />
        )}
      </Container>

      {/* Left "Add section" drawer — every section with its layouts in a line */}
      <SectionCatalogDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        card={card}
        accent={accent}
        activeSections={activeSectionsOrder}
        onAdd={(id) => {
          addSection(id);
          setActiveTab("content");
        }}
        onLayout={setSectionLayout}
      />
    </PanelAccordionContext.Provider>
  );
}

/* ----------------------------- small UI bits ----------------------------- */

/** Small pill showing how many of a panel's fields are filled, e.g. "3/5". */
function CompletionBadge({
  counts,
}: {
  counts: { filled: number; total: number } | null;
}) {
  if (!counts || counts.total === 0) return null;
  const done = counts.filled >= counts.total;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
        done ? "bg-emerald-100 text-emerald-700" : "bg-surface-2 text-muted"
      }`}
      title={`${counts.filled} of ${counts.total} fields filled`}
    >
      {counts.filled}/{counts.total}
    </span>
  );
}

/**
 * Count the fillable fields (text inputs / textareas / selects) inside a panel
 * body and how many currently have a value. Runs after every render so the
 * badge stays live as the user types; the state bail-out avoids extra renders.
 */
function useFieldCounts(ref: React.RefObject<HTMLDivElement | null>) {
  const [counts, setCounts] = useState<{ filled: number; total: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "input, textarea, select",
    );
    let total = 0;
    let filled = 0;
    nodes.forEach((n) => {
      const type = (n as HTMLInputElement).type;
      if (type === "file" || type === "hidden" || type === "button" || type === "submit") return;
      total++;
      if (String(n.value ?? "").trim() !== "") filled++;
    });
    setCounts((prev) =>
      prev && prev.filled === filled && prev.total === total ? prev : { filled, total },
    );
  });
  return counts;
}

function Panel({
  id,
  title,
  desc,
  action,
  children,
  collapsible = false,
  defaultOpen = true,
  icon: Icon,
}: {
  /** Stable key for the shared accordion. Falls back to `title`. */
  id?: string;
  title: string;
  desc?: string;
  /** Optional control shown at the top-right of the panel header. */
  action?: React.ReactNode;
  children: React.ReactNode;
  /** When true, the panel header toggles the body open/closed (accordion). */
  collapsible?: boolean;
  /** Initial open state (only used when no accordion provider is present). */
  defaultOpen?: boolean;
  /** Optional leading icon shown in the header of collapsible panels. */
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const accordion = useContext(PanelAccordionContext);
  const panelId = id ?? title;
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const counts = useFieldCounts(bodyRef);

  const open = accordion ? accordion.openIds.includes(panelId) : localOpen;
  const toggle = () =>
    accordion ? accordion.toggle(panelId) : setLocalOpen((o) => !o);

  if (!collapsible) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <CompletionBadge counts={counts} />
            {action}
          </div>
        </div>
        <div ref={bodyRef} className="mt-4 space-y-4">{children}</div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-2 p-4">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
        >
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-90" : ""}`}
          />
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand">
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
            {desc && <span className="mt-0.5 block truncate text-xs text-muted">{desc}</span>}
          </span>
        </button>
        <CompletionBadge counts={counts} />
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {/* Body stays mounted (hidden when collapsed) so the field counts above
          remain accurate even for panels the user hasn't opened. */}
      <div
        ref={bodyRef}
        className={`space-y-4 border-t border-border p-4 ${open ? "" : "hidden"}`}
      >
        {children}
      </div>
    </section>
  );
}

/** Reorder + delete (and optional change-layout) controls shown in a section
 *  accordion's header. Kept outside the header's toggle button so clicks here
 *  don't collapse the panel. */
function SectionControls({
  sectionId,
  index,
  total,
  onMove,
  onDelete,
  layoutButton,
}: {
  sectionId: string;
  index: number;
  total: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onDelete: (sectionId: string) => void;
  layoutButton?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {layoutButton}
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface-2/60 p-0.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
          title="Move up"
          className="rounded p-1 text-muted transition-colors hover:bg-surface hover:text-foreground disabled:cursor-default disabled:opacity-30 cursor-pointer"
        >
          <Icons.ArrowUp className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, "down")}
          title="Move down"
          className="rounded p-1 text-muted transition-colors hover:bg-surface hover:text-foreground disabled:cursor-default disabled:opacity-30 cursor-pointer"
        >
          <Icons.ArrowDown className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(sectionId)}
          title="Remove section"
          className="rounded p-1 text-muted transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <Icons.Trash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

/** Left slide-in drawer opened from the header "Add section" button. Lists every
 *  section; each row shows the section with a horizontal line of its layout
 *  previews. Clicking a layout adds the section (if not already on the card) and
 *  applies that design; sections already added show an "Added" badge and let you
 *  switch their layout right here. */
function SectionCatalogDrawer({
  open,
  onClose,
  card,
  accent,
  activeSections,
  onAdd,
  onLayout,
}: {
  open: boolean;
  onClose: () => void;
  card: CardData;
  accent: string;
  activeSections: string[];
  onAdd: (id: string) => void;
  onLayout: (sectionId: string, value: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const currentFilterLabel = filter === "all" ? "All Sections" : ALL_SECTIONS.find((s) => s.id === filter)?.label;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in"
      />
      <aside className="animate-drawer-in relative flex h-full w-full max-w-3xl flex-col border-r border-border bg-surface shadow-2xl">
        {/* Header — reflows on mobile: title + close on row 1, filter full-width on row 2 */}
        <div className="flex shrink-0 flex-wrap items-start gap-3 border-b border-border/50 px-5 py-4 sm:items-center sm:gap-4 sm:px-6 sm:py-5">
          <div className="order-1 min-w-0 flex-1">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Plus className="h-5 w-5 shrink-0 text-brand" /> Add a section
            </h2>
            <p className="mt-1 text-sm text-muted">
              Pick a section and a layout — it&apos;s added to your card instantly.
            </p>
          </div>

          {/* Close — top-right on mobile, far right on desktop */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="order-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer sm:order-3"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Section filter — own full-width row on mobile, inline on desktop */}
          <div className="relative order-3 w-full sm:order-2 sm:w-44">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-brand/50 focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
            >
              <span className="truncate">{currentFilterLabel}</span>
              <Icons.ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex max-h-[60vh] flex-col overflow-y-auto rounded-2xl border border-border bg-surface py-2 shadow-2xl no-scrollbar animate-fade-in sm:left-auto sm:w-56">
                  <button
                    onClick={() => { setFilter("all"); setDropdownOpen(false); }}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer ${filter === "all" ? "bg-brand/10 text-brand font-semibold" : "text-muted"}`}
                  >
                    All Sections
                  </button>
                  {ALL_SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setFilter(s.id); setDropdownOpen(false); }}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer ${filter === s.id ? "bg-brand/10 text-brand font-semibold" : "text-muted"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sections list */}
        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 space-y-10">
          {ALL_SECTIONS.map((info) => {
            if (filter !== "all" && filter !== info.id) return null;
            const options = SECTION_LAYOUT_OPTIONS[info.id];
            const tiles = [];
            if (options?.length) {
              for (const o of options) {
                tiles.push({ variant: o.value, label: o.label, desc: o.description });
              }
            } else {
              tiles.push({ variant: null, label: info.label, desc: info.description });
            }

            const Icon = info.icon;

            return (
              <div key={info.id} id={`section-catalog-${info.id}`} className="space-y-4 pt-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-brand">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="text-base font-bold text-foreground">{info.label}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {tiles.map((tile) => {
                    const added = activeSections.includes(info.id);
                    const current = effectiveSectionLayout(card.sectionLayouts, info.id);
                    const active = added && tile.variant !== null && tile.variant === current;

                    return (
                      <div
                        key={`${info.id}-${tile.variant ?? "base"}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (!added) onAdd(info.id);
                          if (tile.variant) onLayout(info.id, tile.variant);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (!added) onAdd(info.id);
                            if (tile.variant) onLayout(info.id, tile.variant);
                          }
                        }}
                        aria-pressed={active}
                        title={`${info.label} · ${tile.label}`}
                        className={`group relative flex flex-col overflow-hidden rounded-xl border text-left outline-none transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer ${active
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-border hover:border-brand/50"
                          }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative flex h-44 justify-center overflow-hidden border-b border-border bg-surface-2 pt-3">
                          {active && (
                            <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow">
                              <Check className="h-3 w-3" /> Active
                            </span>
                          )}
                          {!active && added && (
                            <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                              <Check className="h-3 w-3" /> Added
                            </span>
                          )}
                          {tile.variant ? (
                            <div
                              className="pointer-events-none select-none px-3"
                              style={{
                                width: 340,
                                transform: "scale(0.85)",
                                transformOrigin: "top center",
                              }}
                            >
                              <SectionLayoutPreview
                                sectionId={info.id}
                                variant={tile.variant}
                                card={card}
                                accent={accent}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 pb-4 text-muted">
                              <Icon className="h-8 w-8" />
                              <span className="text-xs font-semibold">{info.label}</span>
                            </div>
                          )}
                        </div>

                        {/* Caption */}
                        <div className="flex items-center gap-2.5 px-3 py-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-brand">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {tile.variant ? tile.label : info.label}
                            </span>
                            <span className="block truncate text-[11px] text-muted">
                              {tile.variant ? info.label : tile.desc}
                            </span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

/** iOS-style on/off switch: track turns brand-colour when on, grey when off. */
function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-brand" : "bg-slate-300"
          }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
            }`}
        />
      </span>
    </button>
  );
}

/** Segmented control letting the user pick a section's layout (list/carousel/auto). */
function DisplayStyle({
  options,
  value,
  onChange,
}: {
  options: DisplayOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-2 p-2.5">
      <span className="text-xs font-medium text-muted">Display style</span>
      <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${active ? "bg-brand text-white" : "text-muted hover:text-foreground"
                }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Renders the display-style control for sections that support it. */
function SectionDisplayStyle({
  sectionId,
  card,
  onChange,
}: {
  sectionId: string;
  card: CardData;
  onChange: (sectionId: string, value: string) => void;
}) {
  const options = DISPLAY_STYLE_OPTIONS[sectionId];
  if (!options) return null;
  const value = card.sectionStyles?.[sectionId] ?? DEFAULT_SECTION_STYLE[sectionId];
  return (
    <DisplayStyle
      options={options}
      value={value}
      onChange={(v) => onChange(sectionId, v)}
    />
  );
}

/* ---- Sample content used to preview section designs (falls back to this
   when the card has no real items yet, so previews are never blank). ---- */
const SAMPLE_TESTIMONIAL: Testimonial = {
  name: "John Doe",
  role: "CEO, Tech Corp",
  rating: 5,
  feedback: "Excellent service — professional, fast, and exactly what we needed.",
};
const SAMPLE_SERVICES: Service[] = [
  { title: "Free Consultation", price: "Free", icon: "MessageSquare", description: "A 30-minute intro call to understand your needs." },
  { title: "Premium Package", price: "₹4,999", icon: "Star", description: "Everything you need, done for you." },
];
const SAMPLE_GALLERY: GalleryItem[] = [
  { src: "https://picsum.photos/seed/gx1/400/520", alt: "Photo 1" },
  { src: "https://picsum.photos/seed/gx2/400/320", alt: "Photo 2" },
  { src: "https://picsum.photos/seed/gx3/400/460", alt: "Photo 3" },
  { src: "https://picsum.photos/seed/gx4/400/380", alt: "Photo 4" },
];
const SAMPLE_TEAM: TeamMember[] = [
  { name: "Alex Carter", role: "Founder", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Maya Rodriguez", role: "Design Lead", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Sam Lee", role: "Engineer", image: "https://randomuser.me/api/portraits/men/54.jpg" },
];
const SAMPLE_STATS: StatItem[] = [
  { value: "500+", label: "Clients", icon: "Users" },
  { value: "10 Yrs", label: "Experience", icon: "Calendar" },
  { value: "4.9★", label: "Rating", icon: "Star" },
  { value: "24/7", label: "Support", icon: "Clock" },
];
const SAMPLE_ABOUT: CardData = {
  ...({} as CardData),
  about: "We're a passionate team dedicated to delivering quality work our clients love.",
  establishedYear: "2018",
  businessType: "Agency",
};
const SAMPLE_HOURS = [
  { day: "Mon", hours: "9:00 AM - 6:00 PM" },
  { day: "Sat", hours: "10:00 AM - 2:00 PM" },
  { day: "Sun", hours: "Closed" },
];
const SAMPLE_BROCHURES = [
  { title: "Company Profile.pdf", url: "#" },
  { title: "Price List 2025.pdf", url: "#" },
];
const SAMPLE_AWARDS = [
  { title: "Best Startup 2024", issuer: "TechAwards", year: "2024", icon: "Trophy" },
  { title: "ISO 9001 Certified", issuer: "BSI", year: "2023", icon: "ShieldCheck" },
];
const SAMPLE_BRANDS: BrandLogo[] = [
  { name: "Acme" },
  { name: "Globex" },
  { name: "Umbrella" },
];
const SAMPLE_FAQS = [
  { question: "What areas do you serve?", answer: "We work with clients locally and remotely across the region." },
  { question: "How do I get started?", answer: "Tap the Contact button and send us a message." },
];
const SAMPLE_SHOP: ShopProduct[] = [
  { name: "Classic Tee", image: "https://picsum.photos/seed/sp1/300/300", price: "₹499", mrp: "₹799" },
  { name: "Denim Shirt", image: "https://picsum.photos/seed/sp2/300/300", price: "₹1,299" },
  { name: "Cotton Cap", image: "https://picsum.photos/seed/sp3/300/300", price: "₹299" },
];
const SAMPLE_CTA: CallToAction = {
  title: "Ready to get started?",
  subtitle: "Let's talk about how we can help you today.",
  buttonLabel: "Message us",
  action: "whatsapp",
  icon: "MessageCircle",
};

/** Header button that opens the design picker for a section (content editor). */
function ChangeLayoutButton({
  sectionId,
  current,
  onOpen,
}: {
  sectionId: string;
  current: string;
  onOpen: (sectionId: string) => void;
}) {
  const options = SECTION_LAYOUT_OPTIONS[sectionId];
  if (!options) return null;
  const activeLabel = options.find((o) => o.value === current)?.label;
  return (
    <button
      type="button"
      onClick={() => onOpen(sectionId)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
    >
      <LayoutTemplate className="h-3.5 w-3.5 text-brand" />
      Change layout
      {activeLabel && (
        <span className="hidden text-muted sm:inline">· {activeLabel}</span>
      )}
    </button>
  );
}

/** Compact preview of a section rendered in a specific design variant. Uses the
 *  card's real items when present, otherwise sample content. */
function SectionLayoutPreview({
  sectionId,
  variant,
  card,
  accent,
}: {
  sectionId: string;
  variant: string;
  card: CardData;
  accent: string;
}) {
  switch (sectionId) {
    case "testimonials": {
      const t = card.testimonials?.[0]?.name ? card.testimonials[0] : SAMPLE_TESTIMONIAL;
      return <TestimonialVariantCard variant={variant} t={t} accent={accent} />;
    }
    case "services": {
      const services = (card.services?.length ? card.services : SAMPLE_SERVICES).slice(0, 2);
      return <ServicesBody services={services} accent={accent} variant={variant} />;
    }
    case "gallery": {
      const images = (card.gallery?.length ? card.gallery : SAMPLE_GALLERY).slice(0, 4);
      return <GalleryBody images={images} columns={2} variant={variant} />;
    }
    case "team": {
      const team = (card.team?.length ? card.team : SAMPLE_TEAM).slice(0, 3);
      return <TeamBody team={team} accent={accent} variant={variant} />;
    }
    case "stats": {
      const stats = (card.stats?.length ? card.stats : SAMPLE_STATS).slice(0, variant === "row" ? 3 : 4);
      return <StatsBody stats={stats} accent={accent} variant={variant} />;
    }
    case "about": {
      const src = card.about ? card : SAMPLE_ABOUT;
      return <AboutBody card={src} accent={accent} variant={variant} />;
    }
    case "businessHours": {
      const hours = (card.businessHours?.length ? card.businessHours : SAMPLE_HOURS).slice(0, 3);
      return <BusinessHoursBody hours={hours} accent={accent} variant={variant} />;
    }
    case "brochures": {
      const brochures = (card.brochures?.length ? card.brochures : SAMPLE_BROCHURES).slice(0, 2);
      return <BrochureBody brochures={brochures} accent={accent} variant={variant} />;
    }
    case "awards": {
      const awards = (card.awards?.length ? card.awards : SAMPLE_AWARDS).slice(0, 2);
      return <AwardsBody awards={awards} accent={accent} variant={variant} />;
    }
    case "brands": {
      const brands = (card.brands?.length ? card.brands : SAMPLE_BRANDS).slice(0, 3);
      return <BrandsBody brands={brands} accent={accent} variant={variant} />;
    }
    case "faqs": {
      const faqs = (card.faqs?.length ? card.faqs : SAMPLE_FAQS).slice(0, 2);
      return <FaqBody faqs={faqs} accent={accent} variant={variant} />;
    }
    case "shop": {
      const products = (card.shop?.[0]?.products?.length ? card.shop[0].products : SAMPLE_SHOP).slice(0, variant === "compact" ? 3 : 2);
      return <ShopProductsBody products={products} accent={accent} whatsapp={card.contact?.whatsapp} variant={variant} />;
    }
    case "cta": {
      const real = card.cta;
      const cta = real && (real.title || real.buttonLabel) ? real : SAMPLE_CTA;
      return <CtaBody cta={cta} card={card} accent={accent} variant={variant} />;
    }
    case "enquiry":
      return <LeadFormPreview variant={variant} accent={accent} type="enquiry" />;
    case "booking":
      return <LeadFormPreview variant={variant} accent={accent} type="booking" />;
    case "header":
      if (variant === "default") {
        return (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <LayoutTemplate className="h-6 w-6" style={{ color: accent }} />
            <p className="text-xs font-semibold text-foreground">
              This template&apos;s own header
            </p>
            <p className="text-[11px] leading-snug text-muted">
              Keeps the built-in design for your current template.
            </p>
          </div>
        );
      }
      return (
        <div className="-mx-4 -mt-4 overflow-hidden rounded-t-2xl">
          <HeaderBody card={card} accent={accent} variant={variant} />
        </div>
      );
    case "nav":
      return (
        <div className="-mx-4 -mt-4 overflow-hidden rounded-t-2xl h-full relative" style={{ minHeight: "240px" }}>
          <NavPreviewBody card={card} accent={accent} variant={variant} />
        </div>
      );
    case "footer":
      return (
        <div className="-mx-4 -mb-4 overflow-hidden rounded-b-2xl">
          <FooterBody card={card} accent={accent} variant={variant} />
        </div>
      );
    default:
      return null;
  }
}

/** Grid of clickable design cards for one section — each shows a live preview,
 *  the active design is ringed, and clicking applies it instantly. Shared by the
 *  layout hub and the add-a-section popup. */
function LayoutCardGrid({
  sectionId,
  card,
  accent,
  current,
  onChange,
  cols,
}: {
  sectionId: string;
  card: CardData;
  accent: string;
  current: string;
  onChange: (sectionId: string, value: string) => void;
  cols: string;
}) {
  const options = SECTION_LAYOUT_OPTIONS[sectionId] ?? [];
  return (
    <div className={`grid gap-3 ${cols}`}>
      {options.map((o) => {
        const active = o.value === current;
        return (
          <div
            key={o.value}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            onClick={() => onChange(sectionId, o.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(sectionId, o.value);
              }
            }}
            className={`group flex flex-col overflow-hidden rounded-xl border text-left outline-none transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.1)] focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer ${active ? "border-brand ring-2 ring-brand/30" : "border-border"
              }`}
          >
            <div className="relative flex h-44 items-start justify-center overflow-hidden border-b border-border bg-surface-2 pt-4">
              {active && (
                <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow">
                  <Check className="h-3 w-3" /> Active
                </span>
              )}
              {/* Non-interactive preview: inner buttons/links shouldn't be clickable
                  or nest interactive elements inside the selectable card. */}
              <div
                className="pointer-events-none select-none w-full flex justify-center"
                style={{ transform: "scale(0.85)", transformOrigin: "top center" }}
              >
                <div className="w-[340px] rounded-t-2xl border-x border-t border-border bg-slate-50 p-4 shadow-sm min-h-full">
                  <SectionLayoutPreview
                    sectionId={sectionId}
                    variant={o.value}
                    card={card}
                    accent={accent}
                  />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <h4 className="text-[13px] font-semibold text-foreground">{o.label}</h4>
              <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-[11px] leading-snug text-muted">
                {o.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Full-screen popup shown right after a layout-capable section is added, so the
 *  user picks a design first. Rendered through a portal to escape the editor's
 *  transformed content column. */
function LayoutPicker({
  sectionId,
  card,
  accent,
  current,
  onChange,
  onClose,
}: {
  sectionId: string;
  card: CardData;
  accent: string;
  current: string;
  onChange: (sectionId: string, value: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    // Always clear the lock on unmount — resetting to "" (rather than a captured
    // previous value) guarantees the page can scroll again even if a re-render or
    // error interrupted things.
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!SECTION_LAYOUT_OPTIONS[sectionId] || typeof document === "undefined") return null;
  const title = SECTION_LAYOUT_TITLES[sectionId] ?? "Section";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close layout picker"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Choose a ${title} layout`}
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
              <LayoutTemplate className="h-5 w-5 text-brand" />
              {title} layout
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Pick a design — your content stays, only the look changes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          <LayoutCardGrid
            sectionId={sectionId}
            card={card}
            accent={accent}
            current={current}
            onChange={onChange}
            cols="sm:grid-cols-2"
          />
        </div>

        <div className="flex justify-end border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** The "Design & Layout" hub: every active section that supports designs, each
 *  with its own row of live-preview cards. Clicking a card switches the design
 *  in real time. */
function LayoutHub({
  card,
  accent,
  activeSections,
  onChange,
}: {
  card: CardData;
  accent: string;
  activeSections: string[];
  onChange: (sectionId: string, value: string) => void;
}) {
  const ids = activeSections.filter((id) => SECTION_LAYOUT_OPTIONS[id]);
  // Nav + Footer aren't content sections, but they have design variants —
  // always offer the nav first, and the footer last while the footer is switched on.
  if (!ids.includes("nav")) ids.unshift("nav");
  if (card.showFooter !== false && !ids.includes("footer")) ids.push("footer");
  if (!ids.length) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface-2 p-4 text-sm text-muted">
        Add sections like Testimonials, Gallery, Team, Products &amp; Services or
        Stats, then switch their designs here.
      </p>
    );
  }
  return (
    <div className="space-y-7">
      {ids.map((id) => {
        const current = effectiveSectionLayout(card.sectionLayouts, id);
        const activeLabel = SECTION_LAYOUT_OPTIONS[id].find((o) => o.value === current)?.label;
        return (
          <div key={id}>
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {SECTION_LAYOUT_TITLES[id] ?? id}
              </h3>
              {activeLabel && (
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {activeLabel}
                </span>
              )}
            </div>
            <LayoutCardGrid
              sectionId={id}
              card={card}
              accent={accent}
              current={current}
              onChange={onChange}
              cols="grid-cols-1 sm:grid-cols-2 gap-4"
            />
          </div>
        );
      })}
    </div>
  );
}

/** Two-level editor: categories on top, products added under each category. */
function ShopEditor({
  shop,
  onChange,
}: {
  shop: ShopCategory[];
  onChange: (v: ShopCategory[]) => void;
}) {
  const addCategory = () =>
    onChange([...shop, { name: "New Category", products: [] }]);
  const removeCategory = (ci: number) =>
    onChange(shop.filter((_, i) => i !== ci));
  const setCategoryName = (ci: number, name: string) =>
    onChange(shop.map((cat, i) => (i === ci ? { ...cat, name } : cat)));
  const addProduct = (ci: number) =>
    onChange(
      shop.map((cat, i) =>
        i === ci
          ? { ...cat, products: [...cat.products, { name: "", image: "", price: "", mrp: "", url: "" }] }
          : cat,
      ),
    );
  const removeProduct = (ci: number, pi: number) =>
    onChange(
      shop.map((cat, i) =>
        i === ci ? { ...cat, products: cat.products.filter((_, j) => j !== pi) } : cat,
      ),
    );
  const setProduct = (ci: number, pi: number, product: ShopProduct) =>
    onChange(
      shop.map((cat, i) =>
        i === ci
          ? { ...cat, products: cat.products.map((p, j) => (j === pi ? product : p)) }
          : cat,
      ),
    );

  return (
    <div className="space-y-4">
      {shop.map((cat, ci) => (
        <div key={ci} className="rounded-xl border border-border bg-surface p-3.5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Category
            </span>
            <input
              type="text"
              value={cat.name}
              onChange={(e) => setCategoryName(ci, e.target.value)}
              placeholder="e.g. T-Shirts"
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => removeCategory(ci)}
              aria-label="Remove category"
              className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {cat.products.map((p, pi) => (
              <div key={pi} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-3">
                    <Text
                      label="Product name"
                      value={p.name}
                      onChange={(v) => setProduct(ci, pi, { ...p, name: v })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Text
                        label="Price"
                        value={p.price ?? ""}
                        onChange={(v) => setProduct(ci, pi, { ...p, price: v })}
                        placeholder="₹499"
                      />
                      <Text
                        label="Original (MRP)"
                        value={p.mrp ?? ""}
                        onChange={(v) => setProduct(ci, pi, { ...p, mrp: v })}
                        placeholder="₹799"
                      />
                    </div>
                    <Select
                      label="Button action"
                      value={p.cta ?? "whatsapp"}
                      options={["whatsapp", "link"]}
                      onChange={(v) =>
                        setProduct(ci, pi, { ...p, cta: v as "link" | "whatsapp" })
                      }
                    />
                    {(p.cta ?? "whatsapp") === "link" ? (
                      <>
                        <Text
                          label="Buy / Redirect URL"
                          value={p.url ?? ""}
                          onChange={(v) => setProduct(ci, pi, { ...p, url: v })}
                          placeholder="https://…"
                        />
                        <div className="grid grid-cols-[140px_1fr] gap-2">
                          <IconPicker
                            label="Button icon"
                            value={p.ctaIcon || "ShoppingBag"}
                            onChange={(v) => setProduct(ci, pi, { ...p, ctaIcon: v })}
                          />
                          <Text
                            label="Button text"
                            value={p.ctaLabel ?? ""}
                            onChange={(v) => setProduct(ci, pi, { ...p, ctaLabel: v })}
                            placeholder="Buy now"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Text
                          label="WhatsApp number"
                          value={p.whatsapp ?? ""}
                          onChange={(v) => setProduct(ci, pi, { ...p, whatsapp: v })}
                          placeholder="9198xxxxxxxx — or blank to use Contact number"
                        />
                        <Text
                          label="Button text"
                          value={p.ctaLabel ?? ""}
                          onChange={(v) => setProduct(ci, pi, { ...p, ctaLabel: v })}
                          placeholder="Order on WhatsApp"
                        />
                      </>
                    )}
                    <ImageUpload
                      label="Product image"
                      value={p.image ?? ""}
                      onChange={(v) => setProduct(ci, pi, { ...p, image: v })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProduct(ci, pi)}
                    aria-label="Remove product"
                    className="mt-6 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addProduct(ci)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm font-semibold text-brand hover:bg-brand-50/20"
      >
        <Plus className="h-4 w-4" /> Add category
      </button>
    </div>
  );
}

const fieldCls =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring";

function Text({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldCls}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className={fieldCls}
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldCls} pr-10 appearance-none capitalize cursor-pointer`}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
          <Icons.ChevronDown className="h-4 w-4 text-muted" />
        </div>
      </div>
    </label>
  );
}

function List<T>({
  label,
  items,
  onAdd,
  onRemove,
  render,
}: {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  render: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1">{render(item, i)}</div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Remove"
                className="mt-6 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted">None yet — click “Add”.</p>
        )}
      </div>
    </div>
  );
}

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // Unique per instance — a label-derived id collides when several uploads
  // share the same label (gallery, team, brochures), making the <label>
  // trigger the first matching input instead of its own.
  const inputId = useId();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Preview"
            className="h-14 w-14 rounded-lg object-cover border border-border"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 text-xs text-muted">
            No image
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
          />
          <div className="flex gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface"
            >
              Upload
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
          <span className="mt-1 block text-[10px] text-muted">PNG, JPG, or WEBP.</span>
        </div>
      </div>
    </div>
  );
}

const CURATED_ICONS = [
  // Business & Finance
  "Briefcase", "TrendingUp", "DollarSign", "Percent", "CreditCard", "Wallet", "PiggyBank", "Building2", "Award", "BadgePercent",
  // Commerce & Food
  "ShoppingCart", "ShoppingBag", "Store", "Tag", "Gift", "Coffee", "Utensils", "Cake", "Pizza", "Wine",
  // Tech & Media
  "Laptop", "Smartphone", "Monitor", "Camera", "Music", "Video", "Gamepad2", "Headphones", "Speaker", "Tv",
  // Healthcare & Wellness
  "Heart", "Activity", "Stethoscope", "Smile", "Flame", "Sprout", "Leaf", "Compass", "MapPin", "Globe",
  // Communication
  "Mail", "Phone", "MessageSquare", "Send", "Share2", "Bell", "Calendar", "Clock", "Shield", "Zap",
  // Creative & Tools
  "Scissors", "Tool", "Wrench", "Paintbrush", "Brush", "Pencil", "BookOpen", "GraduationCap", "Lightbulb", "Rocket",
  // Navigation & Icons
  "Home", "Settings", "HelpCircle", "Star", "Sparkles", "User", "Users", "Map", "Key", "Lock"
];

function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedIcon = value || "Briefcase";

  // Filter valid icon names from all Lucide exports dynamically
  const allIcons = useMemo(() => {
    return Object.keys(Icons).filter(
      (key) =>
        /^[A-Z]/.test(key) &&
        !["createLucideIcon", "LucideContext", "LucideProvider"].includes(key)
    );
  }, []);

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return CURATED_ICONS;
    return allIcons.filter((name) => name.toLowerCase().includes(query));
  }, [search, allIcons]);

  // Limit rendering to 96 items for performant instant rendering
  const visibleIcons = filteredIcons.slice(0, 96);

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-surface cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded bg-surface-2 text-muted">
            <LucideIcon name={selectedIcon} className="h-4 w-4" />
          </span>
          <span className="capitalize">{selectedIcon}</span>
          <Icons.ChevronDown className="ml-auto h-4 w-4 text-muted shrink-0" />
        </button>

        {isOpen && (
          <>
            {/* Click-outside overlay */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Popover */}
            <div className="absolute left-0 z-50 mt-1.5 w-72 rounded-2xl border border-border bg-surface p-3 shadow-xl flex flex-col gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Icons.Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search 1,000+ icons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-brand focus:bg-surface focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto no-scrollbar py-0.5">
                {visibleIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-surface-2 ${selectedIcon === iconName ? "bg-brand/10 text-brand font-bold" : "text-muted"
                      }`}
                    title={iconName}
                  >
                    <LucideIcon name={iconName} className="h-4 w-4" />
                  </button>
                ))}
                {visibleIcons.length === 0 && (
                  <div className="col-span-6 py-6 text-center text-xs text-muted">
                    No matching icons
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LucideIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const IconComponent = (Icons as any)[name] || Icons.Briefcase;
  return <IconComponent className={className} style={style} />;
}
