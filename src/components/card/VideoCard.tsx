"use client";

import { useEffect, useState } from "react";

/**
 * A single YouTube video presented as a lightweight "facade": we show the
 * thumbnail with a real YouTube play button and the video title, and only swap
 * in the heavy <iframe> once the visitor taps play. This keeps the card fast
 * (no third-party embeds until wanted) and gives the polished "video gallery"
 * look — a thumbnail list rather than a stack of raw players.
 */
export function VideoCard({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  // Fetch the real video title via YouTube's public oEmbed endpoint (no API
  // key required). Best-effort: if it fails we simply omit the title.
  useEffect(() => {
    let alive = true;
    fetch(
      `https://www.youtube.com/oembed?url=https://youtu.be/${id}&format=json`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data?.title) setTitle(data.title as string);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  // `hqdefault` exists for every video (unlike maxres) so the thumbnail never
  // 404s to a grey box.
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={title ?? "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={title ? `Play ${title}` : "Play video"}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={title ?? "Video thumbnail"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            <span className="absolute left-1/2 top-1/2 flex h-11 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#ff0000] shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {title && (
        <div className="flex items-start gap-2 p-3">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-5 shrink-0 fill-[#ff0000]">
            <path d="M23 12s0-3.9-.5-5.8a3 3 0 0 0-2.1-2.1C18.5 3.6 12 3.6 12 3.6s-6.5 0-8.4.5A3 3 0 0 0 1.5 6.2C1 8.1 1 12 1 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8zM9.8 15.5v-7l6 3.5-6 3.5z" />
          </svg>
          <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
