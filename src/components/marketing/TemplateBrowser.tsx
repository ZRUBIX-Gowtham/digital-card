"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, LayoutGrid, Check, CheckCircle2 } from "lucide-react";
import type { CategoryId, TemplateMeta } from "@/types/card";
import { chooseTemplateAction } from "@/app/(marketing)/templates/actions";

export interface BrowserItem {
  template: TemplateMeta;
  /** Live-rendered thumbnail used when no pre-rendered PNG exists. */
  fallback?: React.ReactNode;
}

type Filter = "all" | CategoryId;

interface SpotlightInfo {
  title: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
}

const categorySpotlights: Record<Filter, SpotlightInfo> = {
  all: {
    title: "Curated Designs for Every Purpose",
    tagline: "Explore all template categories",
    description: "Browse our hand-crafted, high-performance templates designed to serve your business, creative, or personal brand. Filter by category to view custom highlights and tailored features for your specific field.",
    image: "/images/templates-hero-bg.png",
    features: ["Fully editable and customizable", "Responsive mobile-first layouts", "One-tap contact saving & sharing"]
  },
  business: {
    title: "Corporate & Enterprise Cards",
    tagline: "Designed for Companies, Teams & B2B professionals",
    description: "Sleek, structured, and formal layouts optimized for executive networking, B2B sales pipelines, and organization directories. These cards place team alignment and corporate identity at the forefront, featuring clean info-grids and professional branding structures.",
    image: "/images/category-business.png",
    features: ["Team Directory linking", "Official email & direct phone actions", "Clean, high-trust branding layouts"]
  },
  professional: {
    title: "Expert & Consultant Profiles",
    tagline: "Designed for Doctors, Lawyers, Accountants & Advisors",
    description: "Authority-building digital profiles tailored for service professionals who rely on direct booking, client meetings, and credentials. These layouts highlight official bios, medical or legal registrations, and seamless integration with calendar booking tools.",
    image: "/images/category-professional.png",
    features: ["Direct calendar appointment integration", "Authority badge & credential space", "Secure document and policy links"]
  },
  creative: {
    title: "Creative Portfolios & Showcases",
    tagline: "Designed for Studios, Designers, Artists & Photographers",
    description: "Vibrant, high-impact, and visually-driven designs created to make your projects stand out. Perfect for visual creators, agencies, and artists, these templates feature dedicated picture galleries, rich social media linkage, and interactive portfolio grids.",
    image: "/images/category-creative.png",
    features: ["Responsive visual gallery section", "Instagram & Pinterest showcase links", "Gradient spotlights and unique dark modes"]
  },
  products: {
    title: "Digital Catalogues & Shop Menus",
    tagline: "Designed for Retail, Boutiques, Cafés & Local Services",
    description: "Conversion-first templates that transform your digital business card into a mini storefront. Showcase products with pricing and description grids, and enable customers to send orders or service requests directly to your WhatsApp with one tap.",
    image: "/images/category-products.png",
    features: ["WhatsApp order & service request system", "Featured product price list grids", "Boutique catalog header designs"]
  },
  personal: {
    title: "Creator Pages & Link-in-Bios",
    tagline: "Designed for Influencers, Content Creators & Personal Brands",
    description: "Mobile-first, high-engagement link-in-bios optimized for driving traffic to your social channels, YouTube videos, and personal brand. Focused on high-visibility call-to-action stack, video embeds, and creator bio summaries.",
    image: "/images/category-personal.png",
    features: ["Optimized link-in-bio button stacks", "Social media video integration", "Playful layout shapes and custom light themes"]
  },
  gallery: {
    title: "Photo Galleries & Portfolios",
    tagline: "Designed for Photographers, Studios & Visual Makers",
    description: "Photo-first templates that put your work centre stage. A large, tap-to-zoom gallery leads the card with a full-screen lightbox, so visitors can browse your portfolio like a proper album before reaching your contact details.",
    image: "/images/category-creative.png",
    features: ["Large tap-to-zoom gallery grid", "Full-screen lightbox with swipe navigation", "Compact identity header keeps focus on photos"]
  },
  video: {
    title: "Video Galleries & Channels",
    tagline: "Designed for Creators, Coaches & YouTube Channels",
    description: "YouTube-first templates that lead with your videos. A feed of thumbnail cards with tap-to-play playback — titles pulled straight from YouTube — keeps your channel front and centre without slowing the page down.",
    image: "/images/category-personal.png",
    features: ["Tap-to-play video feed with real thumbnails", "Live video titles from YouTube", "Lightweight — players load only when tapped"]
  }
};

/** Templates page browser: a category dropdown + filterable grid. */
export function TemplateBrowser({
  items,
  categories,
  isLoggedIn = false,
}: {
  items: BrowserItem[];
  categories: { id: CategoryId; name: string; tagline: string }[];
  isLoggedIn?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const options: { id: Filter; name: string }[] = [
    { id: "all", name: "All templates" },
    ...categories.map((c) => ({ id: c.id as Filter, name: c.name })),
  ];

  const visible =
    filter === "all"
      ? items
      : items.filter((it) => it.template.category === filter);

  const activeCount = visible.length;
  const activeLabel = options.find((o) => o.id === filter)?.name ?? "All templates";
  // Fall back to the "all" panel if a category has no bespoke spotlight yet, so
  // adding a new category can never crash the gallery.
  const spotlight = categorySpotlights[filter] ?? categorySpotlights.all;

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category dropdown */}
        <div ref={dropdownRef} className="relative w-full sm:w-56">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Filter templates by category"
            className="flex w-full items-center gap-2 rounded-full border border-border bg-surface py-2.5 pl-9 pr-9 text-left text-sm font-semibold text-foreground outline-none transition-colors hover:bg-surface-hover focus:border-brand focus:ring-2 focus:ring-ring"
          >
            <LayoutGrid className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <span className="truncate">{activeLabel}</span>
            <ChevronDown
              className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              aria-label="Template categories"
              className="absolute right-0 z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
            >
              {options.map((o) => {
                const active = o.id === filter;
                return (
                  <li key={o.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(o.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand text-white"
                          : "text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      <span className="truncate">{o.name}</span>
                      {active && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Category Spotlight Panel */}
      <div className="mb-12 overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl transition-all duration-300 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="inline-block rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold text-brand">
              {spotlight.tagline}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {spotlight.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {spotlight.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {spotlight.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm font-medium text-muted">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface shadow-md lg:aspect-[4/3]">
              <img
                src={spotlight.image}
                alt={spotlight.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted">
        Showing <span className="font-semibold text-foreground">{activeCount}</span>{" "}
        {activeLabel.toLowerCase()}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map(({ template: t, fallback }) => (
          // A "stretched link" overlay is used instead of wrapping the whole
          // card in a <Link>, because the live preview render contains its own
          // <a> tags (social icons) — nesting anchors is invalid HTML and
          // triggers a hydration error.
          <div
            key={t.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]"
          >
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (!isLoggedIn) {
                  window.location.href = "/signin";
                  return;
                }
                setLoadingId(t.id);
                await chooseTemplateAction(t.id);
              }}
              disabled={loadingId === t.id}
              className="absolute right-3 top-3 z-20 rounded-full bg-brand/90 backdrop-blur-sm px-4 py-1.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-brand hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer shadow-sm"
            >
              {loadingId === t.id ? "Saving..." : "Choose"}
            </button>

            <div className="aspect-[4/3] overflow-hidden border-b border-border bg-surface-2">
              {fallback ?? (
                <img
                  src={`/preview-images/${t.id}.png`}
                  alt={`${t.name} template preview`}
                  loading="lazy"
                  className="block h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-brand" />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {t.description}
              </p>
              <p className="mt-3 text-xs font-medium text-muted">
                Best for {t.bestFor}
              </p>
            </div>
            <Link
              href={`/preview/${t.id}`}
              aria-label={`Preview ${t.name} template`}
              className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
