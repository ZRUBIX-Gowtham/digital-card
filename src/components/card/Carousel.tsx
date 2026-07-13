"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Generic scroll-snap carousel. Slides are rendered by the caller (server or
 * client) and passed in; this component only owns navigation, dots and the
 * optional autoplay. `basis` is a Tailwind width class controlling how many
 * slides show at once (e.g. "basis-full", "basis-1/2", "basis-1/3").
 */
export function Carousel({
  slides,
  accent,
  autoplay = false,
  basis = "basis-full",
  intervalMs = 3500,
}: {
  slides: React.ReactNode[];
  accent: string;
  autoplay?: boolean;
  basis?: string;
  intervalMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  function slideWidth() {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    return first?.clientWidth || el.clientWidth;
  }

  function onScroll() {
    const el = trackRef.current;
    const w = slideWidth();
    if (!el || !w) return;
    setActive(Math.round(el.scrollLeft / w));
  }

  function go(index: number) {
    const el = trackRef.current;
    const w = slideWidth();
    if (!el || !w) return;
    const clamped = Math.max(0, Math.min(index, count - 1));
    el.scrollTo({ left: clamped * w, behavior: "smooth" });
  }

  useEffect(() => {
    if (!autoplay || paused || count <= 1) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      const w = slideWidth();
      if (!el || !w) return;
      const current = Math.round(el.scrollLeft / w);
      el.scrollTo({ left: ((current + 1) % count) * w, behavior: "smooth" });
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoplay, paused, count, intervalMs]);

  if (count === 0) return null;
  const single = count <= 1;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        className="-mx-1 flex snap-x snap-mandatory overflow-x-auto px-1 no-scrollbar"
      >
        {slides.map((s, i) => (
          <div key={i} className={`shrink-0 snap-start px-1 ${basis}`}>
            {s}
          </div>
        ))}
      </div>

      {!single && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-slate-500 transition-colors hover:bg-surface disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === active ? 16 : 6,
                  backgroundColor: i === active ? accent : "#e2e8f0",
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => go(active + 1)}
            disabled={active === count - 1}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-slate-500 transition-colors hover:bg-surface disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
