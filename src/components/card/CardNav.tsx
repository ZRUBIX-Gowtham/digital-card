"use client";

import { useState, useEffect } from "react";
import { Menu, X, Eye } from "lucide-react";
import type { CardData } from "@/types/card";
import { effectiveSectionLayout } from "@/lib/section-layouts";
import { navSections, sectionAnchorId } from "@/lib/section-nav";
import { availableLanguages } from "@/lib/i18n";
import { SocialsRow } from "./sections";
import { LanguageSwitcher } from "./LanguageSwitcher";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/**
 * Optional hamburger menu shown at the top-left of the card. Tapping it slides a
 * side drawer in from the left listing the card's non-empty sections; tapping a
 * section smooth-scrolls to it. Hidden when there are fewer than two sections.
 */
export function CardNav({
  card,
  accent,
  showNav = true,
  showViews = false,
  views = 0,
  badgeBg = true,
}: {
  card: CardData;
  accent: string;
  showNav?: boolean;
  showViews?: boolean;
  views?: number;
  badgeBg?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const items = navSections(card);
  
  useEffect(() => {
    // Only lock the main body scroll on the live card, never inside a dashboard
    // preview (overview or editor) where the card renders inside a phone frame.
    const inDashboard =
      typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard");

    if (open && !inDashboard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasMenu = showNav && items.length >= 2;
  // A language dropdown appears whenever the owner has published extra languages.
  const hasLanguages = availableLanguages(card).length > 1;
  if (!hasMenu && !showViews && !hasLanguages) return null;

  const variant = effectiveSectionLayout(card.sectionLayouts, "nav");
  const isFixed = card.navFixed !== false;

  function go(key: string) {
    setOpen(false);
    const el =
      typeof document !== "undefined"
        ? document.getElementById(sectionAnchorId(key))
        : null;
    if (!el) return;
    // Defer the scroll until the drawer has closed and the body scroll-lock
    // (set in the effect above) has been released — otherwise scrollIntoView
    // runs while the page is still locked and does nothing.
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <>
      {/* Top Navbar */}
      <div 
        className={`flex items-center justify-between w-full px-5 py-3.5 z-30 bg-surface ${isFixed ? "sticky top-0" : "relative"}`}
        style={{
          boxShadow: isFixed ? "0 4px 20px -2px rgba(0,0,0,0.1)" : "none"
        }}
      >
        <div className="flex-1">
          {hasMenu && (
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-transparent transition-colors hover:bg-foreground/5"
            >
              <Menu className="h-6 w-6" style={{ color: accent }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher card={card} accent={accent} />
          {showViews && (
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide"
              style={{
                backgroundColor: `${accent}15`,
                color: accent
              }}
            >
              <Eye className="h-4 w-4" />
              {views.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {open && hasMenu && (
        <div className="fixed inset-0 z-[100] animate-fade-in">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50 cursor-default outline-none"
          />

          {/* Centered constraints for the drawer (matches CardRenderer max-width) */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="relative flex h-full w-full max-w-[430px]">
              {/* Side drawer */}
              <div className="relative flex w-[74%] max-w-[300px] flex-col h-full bg-surface shadow-2xl animate-drawer-in overscroll-contain pointer-events-auto">
                <NavPreviewBody card={card} accent={accent} variant={variant} items={items} onNavigate={go} onClose={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Nav component used for the live preview in the Layout Hub. */
export function NavPreviewBody({
  card,
  accent,
  variant,
  items,
  onNavigate,
  onClose,
}: {
  card: CardData;
  accent: string;
  variant: string;
  items?: { key: string; label: string }[];
  onNavigate?: (key: string) => void;
  onClose?: () => void;
}) {
  const navItems = items ?? [
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
    { key: "gallery", label: "Gallery" },
    { key: "contact", label: "Contact" },
  ];

  if (variant === "modern") {
    return (
      <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
        <div className="relative flex flex-col items-center justify-center p-8 pb-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-surface-2 p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
          {card.avatarImage ? (
            <img
              src={card.avatarImage}
              alt={card.name}
              className="mb-3 h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-black/5"
            />
          ) : (
            <span
              className="mb-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm ring-1 ring-black/5"
              style={{ backgroundColor: accent }}
            >
              {initials(card.name || card.logoText || "?")}
            </span>
          )}
          <p className="text-center text-lg font-bold text-foreground">{card.name}</p>
          {card.title && (
            <p className="mt-0.5 text-center text-xs font-semibold text-muted">{card.title}</p>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 py-2">
          <ul className="space-y-1">
            {navItems.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(it.key)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-bold tracking-tight text-foreground opacity-90 transition-colors hover:bg-surface-2 hover:text-foreground hover:opacity-100"
                >
                  {it.label}
                  <div className="h-1.5 w-1.5 rounded-full opacity-50" style={{ backgroundColor: accent }} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {card.socials && card.socials.length > 0 && (
          <div className="p-6">
            <SocialsRow card={card} accent={accent} />
          </div>
        )}
      </aside>
    );
  }

  if (variant === "minimal") {
    return (
      <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-foreground">{card.name}</p>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-4 pt-2">
          <ul className="space-y-3">
            {navItems.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(it.key)}
                  className="block w-full text-left text-sm font-semibold text-muted hover:text-foreground"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {card.socials && card.socials.length > 0 && (
          <div className="p-4 pt-0">
            <SocialsRow card={card} accent={accent} />
          </div>
        )}
      </aside>
    );
  }

  if (variant === "card") {
    return (
      <aside className="flex h-full w-full flex-col bg-surface-2 border-r border-border">
        <div className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{card.name}</p>
            {card.company && <p className="truncate text-[11px] text-muted">{card.company}</p>}
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-full bg-surface p-1.5 text-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
          <ul className="space-y-2">
            {navItems.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(it.key)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-surface-hover"
                >
                  {it.label}
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  if (variant === "compact") {
    return (
      <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-4 bg-surface-2">
          {card.avatarImage ? (
            <img src={card.avatarImage} alt={card.name} className="h-8 w-8 shrink-0 rounded-full border border-border object-cover" />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: accent }}>
              {initials(card.name || card.logoText || "?")}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{card.name}</p>
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-2 py-1">
          <ul className="divide-y divide-border">
            {navItems.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(it.key)}
                  className="block w-full py-2.5 px-2 text-left text-sm font-medium text-foreground hover:bg-surface-2"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  if (variant === "branded") {
    return (
      <aside className="flex h-full w-full flex-col border-r border-border" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-3 border-b border-white/20 p-5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-white">{card.name}</p>
            {card.company && <p className="truncate text-xs text-white/80">{card.company}</p>}
          </div>
          {onClose && (
            <button type="button" onClick={onClose} className="rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20">
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-3">
          <ul className="space-y-1">
            {navItems.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  onClick={() => onNavigate?.(it.key)}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {card.socials && card.socials.length > 0 && (
          <div className="p-4 border-t border-white/20">
            <SocialsRow card={card} accent="#ffffff" />
          </div>
        )}
      </aside>
    );
  }

  // classic (default)
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border p-4">
        {card.avatarImage ? (
          <img
            src={card.avatarImage}
            alt={card.name}
            className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {initials(card.name || card.logoText || "?")}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{card.name}</p>
          {card.company && (
            <p className="truncate text-[11px] text-muted">{card.company}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-2">
        <ul className="space-y-0.5">
          {navItems.map((it) => (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onNavigate?.(it.key)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {card.socials && card.socials.length > 0 && (
        <div className="border-t border-border p-4">
          <SocialsRow card={card} accent={accent} />
        </div>
      )}
    </aside>
  );
}
