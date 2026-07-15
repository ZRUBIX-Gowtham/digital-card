"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { pulseDocPath } from "@/lib/pulse";

/**
 * Keeps a `force-dynamic` server page live without a manual reload.
 *
 * Two triggers, both calling `router.refresh()` (which re-runs the server
 * component and re-fetches its data, merging without losing scroll/state):
 *
 *  1. Real-time — subscribes to the card's tiny "pulse" doc; the moment a new
 *     visit bumps it, the page refreshes. No visitor data is read on the client.
 *  2. Polling fallback — a slow interval in case the listener is unavailable
 *     (e.g. security rules deny the read). Pauses while the tab is hidden.
 *
 * Renders a small "Live" pill that pulses on each refresh.
 */
export function LiveRefresh({
  cardSlug,
  pollMs = 30000,
}: {
  cardSlug?: string;
  pollMs?: number;
}) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      setRefreshing(true);
      router.refresh();
      window.setTimeout(() => setRefreshing(false), 600);
    };

    // 1. Real-time pulse listener. The first snapshot is the current value, so
    // skip it; only later bumps mean a genuinely new event arrived.
    let unsubscribe: (() => void) | undefined;
    if (cardSlug) {
      let primed = false;
      unsubscribe = onSnapshot(
        doc(db, ...pulseDocPath(cardSlug)),
        () => {
          if (!primed) {
            primed = true;
            return;
          }
          refresh();
        },
        () => {
          /* listener unavailable (e.g. rules) — polling still covers us */
        },
      );
    }

    // 2. Polling fallback + catch-up when the tab regains focus.
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (!timer) timer = setInterval(refresh, pollMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      unsubscribe?.();
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router, cardSlug, pollMs]);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-emerald-500 ${
            refreshing ? "animate-ping opacity-75" : "opacity-0"
          }`}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}
