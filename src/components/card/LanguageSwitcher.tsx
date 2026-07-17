"use client";

import { useEffect, useRef, useState } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Languages, Check, ChevronDown } from "lucide-react";
import type { CardData, LangCode } from "@/types/card";
import { availableLanguages, languageMeta } from "@/lib/i18n";

/**
 * Language dropdown shown in the card's top nav (next to the views count).
 * Tapping the globe icon opens a menu of the languages the owner enabled;
 * picking one updates the `?lang=` query param, which the (force-dynamic) card
 * page reads to overlay the matching AI translation.
 *
 * Self-contained: it derives the available languages from the card and the
 * current language from the URL, so no extra props need threading through the
 * template layouts. Renders nothing unless at least one extra language exists,
 * and stays hidden inside the dashboard preview (where `?lang=` does nothing).
 */
export function LanguageSwitcher({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const languages = availableLanguages(card);
  if (languages.length < 2) return null;
  // The dropdown drives a real navigation, which the dashboard preview can't act
  // on — hide it there so the editor preview isn't misleading.
  if (pathname.startsWith("/dashboard")) return null;

  const raw = params.get("lang");
  const current: LangCode =
    raw && languages.includes(raw as LangCode) ? (raw as LangCode) : "en";
  const currentMeta = languageMeta(current);

  function switchTo(lang: LangCode) {
    setOpen(false);
    if (lang === current) return;
    const next = new URLSearchParams(params);
    if (lang === "en") next.delete("lang");
    else next.set("lang", lang);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold tracking-wide transition-opacity hover:opacity-80"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        <Languages className="h-4 w-4" />
        <span>{currentMeta?.label ?? current.toUpperCase()}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-[110] mt-2 min-w-[150px] overflow-hidden rounded-xl border border-black/5 bg-surface py-1 shadow-xl animate-fade-in"
          role="menu"
        >
          {languages.map((code) => {
            const meta = languageMeta(code);
            const active = code === current;
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => switchTo(code)}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
              >
                <span>{meta?.native ?? code}</span>
                {active && (
                  <Check className="h-4 w-4 shrink-0" style={{ color: accent }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
