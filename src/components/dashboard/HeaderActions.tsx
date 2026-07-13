"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Eye, LogOut, UserRound, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { signOutAction } from "@/app/signin/actions";

/**
 * Dashboard header actions.
 *
 * On desktop (lg+) it keeps the original chrome: theme toggle + a labelled
 * "Sign out" button. On mobile it becomes a compact icon row — a Preview
 * button that opens the phone preview in a modal, a profile icon whose
 * dropdown shows the user's name with Sign out underneath, and the theme
 * switcher pinned to the far right.
 */
export function HeaderActions({
  userName,
  userEmail,
  cardSlug,
  preview,
}: {
  userName: string;
  userEmail?: string;
  cardSlug: string;
  /** Ready-to-render phone preview (server-built) shown in the mobile modal. */
  preview: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close the profile dropdown on outside-click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Lock scroll + Escape-to-close while the preview modal is open.
  useEffect(() => {
    if (!previewOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [previewOpen]);

  return (
    <>
      {/* ---------- Desktop (lg+): unchanged chrome ---------- */}
      <div className="hidden items-center gap-3 lg:flex">
        <ThemeToggle />
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>

      {/* ---------- Mobile: compact icon row ---------- */}
      <div className="flex items-center gap-2 lg:hidden">
        {/* Preview */}
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          aria-label="Preview card"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
        >
          <Eye className="h-[18px] w-[18px]" />
        </button>

        {/* Profile + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Account"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
          >
            <UserRound className="h-[18px] w-[18px]" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {userName}
                </p>
                {userEmail && (
                  <p className="mt-0.5 truncate text-xs text-muted">{userEmail}</p>
                )}
              </div>
              <div className="my-1 border-t border-border" />
              <form action={signOutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Theme switcher — far right */}
        <ThemeToggle />
      </div>

      {/* ---------- Mobile preview modal (full screen) ----------
          Rendered via a portal to <body> so it escapes the sticky header's
          backdrop-filter stacking/containing context and can truly cover the
          page. */}
      {previewOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col bg-surface lg:hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold text-foreground">Live preview</h2>
            <div className="flex items-center gap-2">
              <a
                href={`/${cardSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
              >
                Open <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
            <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-4">
              {preview}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
