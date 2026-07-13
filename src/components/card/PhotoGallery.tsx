"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/types/card";

/**
 * Photo gallery grid with a tap-to-zoom lightbox. The grid gives the compact
 * "album" look; tapping any tile opens a full-screen viewer with prev/next so
 * visitors can browse photos properly instead of squinting at thumbnails.
 */
export function PhotoGallery({
  images,
  columns = 3,
  variant = "grid",
}: {
  images: GalleryItem[];
  columns?: 2 | 3;
  /** Visual design: "grid" (square tiles), "masonry" (staggered), "framed". */
  variant?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback(
    (i: number) => setOpen(((i % images.length) + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") show((open ?? 0) + 1);
      if (e.key === "ArrowLeft") show((open ?? 0) - 1);
    }
    window.addEventListener("keydown", onKey);
    // Prevent the card behind the lightbox from scrolling.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, show]);

  const masonry = variant === "masonry";
  const framed = variant === "framed";
  const collage = variant === "collage";
  const rounded = variant === "rounded";
  const gridCols = collage || columns === 2 ? "grid-cols-2" : "grid-cols-3";
  const tileRound = rounded ? "rounded-3xl" : framed ? "rounded-lg" : "rounded-xl";
  const gap = rounded || collage ? "gap-2.5" : "gap-2";

  return (
    <>
      {masonry ? (
        <div className={`grid gap-2 items-start ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className={`flex flex-col gap-2 ${colIndex % 2 !== 0 ? "mt-8" : ""}`}>
              {images
                .map((g, i) => ({ g, i }))
                .filter((_, idx) => idx % columns === colIndex)
                .map(({ g, i }) => (
                  <button
                    key={g.src + i}
                    type="button"
                    onClick={() => setOpen(i)}
                    className="group relative block w-full overflow-hidden rounded-xl border border-border"
                    aria-label={g.alt || `Open photo ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  </button>
                ))}
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${gap} ${gridCols}`}>
          {images.map((g, i) => (
            <button
              key={g.src + i}
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative aspect-square overflow-hidden ${tileRound} ${
                framed
                  ? "border border-border bg-white p-1.5 pb-4 shadow-sm"
                  : "border border-border"
              }`}
              aria-label={g.alt || `Open photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.alt}
                className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  framed ? "rounded" : rounded ? "rounded-3xl" : ""
                }`}
                loading="lazy"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setOpen(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                show(open - 1);
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open].src}
            alt={images[open].alt}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                show(open + 1);
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {images[open].alt && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-center text-xs text-white">
              {images[open].alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}
