"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/** Inline "claim your digitalsite.io/username" bar — routes to sign-in to continue. */
export function ClaimUsername() {
  const router = useRouter();
  const [value, setValue] = useState("");

  // Usernames are lowercase letters, numbers and dashes only.
  const clean = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      clean ? `/signin?username=${encodeURIComponent(clean)}` : "/templates",
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex items-center rounded-full border border-border bg-surface p-1.5 pl-4 shadow-sm transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-ring">
        <span className="shrink-0 select-none text-sm font-medium text-muted">
          digitalsite.io/
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="yourname"
          aria-label="Choose your username"
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-700)]"
        >
          Claim <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
