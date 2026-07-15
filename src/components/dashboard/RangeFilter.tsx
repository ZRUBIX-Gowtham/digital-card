import Link from "next/link";
import { RANGE_LABELS, type RangeKey } from "@/lib/analytics-store";

/** Order the range options appear in the segmented control. */
const ORDER: RangeKey[] = ["today", "7d", "30d", "all"];

/**
 * Segmented control that filters the analytics page by date range. Each option
 * is a plain link that sets `?range=…`, so the whole page re-renders on the
 * server with the new window — and `LiveRefresh` keeps polling the same URL.
 */
export function RangeFilter({ active }: { active: RangeKey }) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs font-medium">
      {ORDER.map((key) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={`?range=${key}`}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              isActive
                ? "bg-brand text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {RANGE_LABELS[key]}
          </Link>
        );
      })}
    </div>
  );
}
