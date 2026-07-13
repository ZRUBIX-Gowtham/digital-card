"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle } from "lucide-react";
import type { CategoryId } from "@/types/card";
import { changeTemplateAction } from "@/app/dashboard/actions";

export interface PickerItem {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  bestFor: string;
  /** Server-rendered live thumbnail for the template. */
  thumb: ReactNode;
}

type Filter = "all" | CategoryId;

/**
 * Inline template gallery for the dashboard "Change template" page. Renders a
 * filterable grid directly in the page (no overlay/drawer). Choosing a template
 * applies it to the user's card and jumps to the editor.
 */
export function TemplateGrid({
  items,
  categories,
  currentTemplateId,
}: {
  items: PickerItem[];
  categories: { id: CategoryId; name: string }[];
  currentTemplateId: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, startTransition] = useTransition();
  const [choosingId, setChoosingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function choose(id: string) {
    setChoosingId(id);
    setError(null);
    startTransition(async () => {
      const res = await changeTemplateAction(id);
      if (res.ok) {
        router.push("/dashboard/edit?tab=content");
      } else {
        setError(res.error ?? "Could not switch template. Please try again.");
        setChoosingId(null);
      }
    });
  }

  const options: { id: Filter; name: string }[] = [
    { id: "all", name: "All" },
    ...categories.map((c) => ({ id: c.id as Filter, name: c.name })),
  ];

  const filtered =
    filter === "all" ? items : items.filter((it) => it.category === filter);

  return (
    <div>
      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {options.map((o) => {
          const active = o.id === filter;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setFilter(o.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {o.name}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Template grid */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((it) => {
          const isCurrent = it.id === currentTemplateId;
          const isChoosing = choosingId === it.id;
          return (
            <div
              key={it.id}
              className={`group flex flex-col overflow-hidden rounded-xl border bg-surface transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.1)] ${
                isCurrent ? "border-brand ring-2 ring-brand/30" : "border-border"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-2">
                {it.thumb}
                {isCurrent && (
                  <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
                    <Check className="h-2.5 w-2.5" /> Current
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="truncate text-[13px] font-semibold leading-tight text-foreground">
                  {it.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-[11px] leading-snug text-muted">
                  {it.description}
                </p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => choose(it.id)}
                  className={`mt-auto inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-60 cursor-pointer ${
                    isCurrent
                      ? "border border-border bg-surface text-foreground hover:bg-surface-hover"
                      : "bg-brand text-white hover:opacity-90"
                  }`}
                >
                  {isChoosing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Applying…
                    </>
                  ) : isCurrent ? (
                    "Edit this"
                  ) : (
                    "Choose"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
