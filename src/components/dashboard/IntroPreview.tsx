"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw, Check } from "lucide-react";
import type { CardData, IntroStyle } from "@/types/card";
import { IntroStage } from "@/components/card/CardIntro";

/**
 * Full preview of a loading-animation design. Plays the splash on a loop inside
 * a phone frame — in → hold → reveal → repeat — over a mock card page so the
 * owner sees exactly what a visitor gets before choosing it.
 */
export function IntroPreview({
  style,
  label,
  card,
  accent,
  active,
  onSelect,
  onClose,
}: {
  style: IntroStyle;
  label: string;
  card: CardData;
  accent: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  // `cycle` remounts the stage to replay the CSS entrance each loop; `out`
  // drives the reveal (exit) animation before the next cycle.
  const [cycle, setCycle] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    setOut(false);
    const toOut = setTimeout(() => setOut(true), 3200);
    const toNext = setTimeout(() => setCycle((c) => c + 1), 4100);
    return () => {
      clearTimeout(toOut);
      clearTimeout(toNext);
    };
  }, [cycle]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <p className="text-xs font-medium text-muted">Loading animation</p>
            <p className="text-sm font-bold text-foreground">{label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Phone frame with looping splash over a mock page */}
        <div className="flex justify-center bg-surface-2/50 px-6 py-6">
          <div className="relative h-[520px] w-[264px] overflow-hidden rounded-[2.2rem] border-[6px] border-slate-900 bg-white shadow-xl">
            {/* notch */}
            <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
            <MockPage card={card} accent={accent} />
            <IntroStage
              key={cycle}
              style={style}
              card={card}
              accent={accent}
              out={out}
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 border-t border-border px-5 py-3.5">
          <button
            type="button"
            onClick={() => setCycle((c) => c + 1)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replay
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect();
              onClose();
            }}
            className={`ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90 ${
              active ? "bg-emerald-600 text-white" : "bg-brand text-white"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            {active ? "Selected" : "Use this design"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Lightweight mock of a card page shown behind the splash in the preview. */
function MockPage({ card, accent }: { card: CardData; accent: string }) {
  const dark = card.theme === "dark";
  return (
    <div className={`h-full w-full ${dark ? "bg-black" : "bg-slate-50"}`}>
      <div className="h-28 w-full" style={{ backgroundColor: accent }} />
      <div className="-mt-10 flex flex-col items-center px-5">
        <div
          className={`h-20 w-20 rounded-full border-4 ${
            dark ? "border-black bg-slate-800" : "border-white bg-slate-200"
          }`}
        />
        <div
          className={`mt-3 h-3.5 w-32 rounded-full ${dark ? "bg-slate-700" : "bg-slate-300"}`}
        />
        <div
          className={`mt-2 h-2.5 w-24 rounded-full ${dark ? "bg-slate-800" : "bg-slate-200"}`}
        />
        <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-9 rounded-xl ${dark ? "bg-slate-800" : "bg-white shadow-sm"}`}
            />
          ))}
        </div>
        <div
          className={`mt-3 h-10 w-full rounded-xl`}
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  );
}
