"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pencil,
  BarChart3,
  Inbox,
  LayoutTemplate,
  ExternalLink,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/marketing/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { signOutAction } from "@/app/signin/actions";

interface NavItem {
  href: string;
  /** Path prefix used for the active state (defaults to href). */
  match?: string;
  label: string;
  /** Compact label used in the mobile bottom tab bar. */
  short?: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: number;
}

/**
 * Persistent dashboard chrome: a left sidebar on desktop (lg+) and a compact
 * top bar on mobile, with active-link highlighting and the unread-leads badge.
 * Wraps the Overview / Analytics / Leads pages. The full-screen card editor
 * (/dashboard/edit) keeps its own focused layout and is not wrapped here.
 */
export function DashboardShell({
  userName,
  userEmail,
  cardSlug,
  unreadLeads = 0,
  children,
}: {
  userName: string;
  userEmail?: string;
  cardSlug?: string;
  unreadLeads?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/dashboard", label: "Overview", short: "Home", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/edit?tab=content", match: "/dashboard/edit", label: "Edit card", short: "Edit", icon: Pencil },
    { href: "/dashboard/analytics", label: "Analytics", short: "Stats", icon: BarChart3 },
    { href: "/dashboard/leads", label: "Leads", short: "Leads", icon: Inbox, badge: unreadLeads },
    { href: "/dashboard/templates", label: "Change template", short: "Design", icon: LayoutTemplate },
  ];

  const isActive = (item: NavItem) => {
    const base = item.match ?? item.href;
    return item.exact ? pathname === base : pathname.startsWith(base);
  };

  // The full-screen editor has its own fixed mobile action bar, so the shell's
  // bottom tab bar is suppressed there to avoid two overlapping bottom bars.
  const hideMobileTabBar = pathname.startsWith("/dashboard/edit");

  return (
    <div className="min-h-screen bg-surface-2/40 lg:flex">
      {/* ---------------- Desktop sidebar ---------------- */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      active ? "bg-white/25 text-white" : "bg-brand text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}

          {cardSlug && (
            <a
              href={`/${cardSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              <ExternalLink className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">View live card</span>
            </a>
          )}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center justify-between gap-2 px-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              {userEmail && <p className="truncate text-xs text-muted">{userEmail}</p>}
            </div>
            <ThemeToggle />
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ---------------- Main column ---------------- */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur lg:hidden">
          {hideMobileTabBar ? (
            // On the focused editor (no bottom tab bar), give an explicit way back.
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <Logo />
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </form>
          </div>
        </header>

        {/* Extra bottom padding on mobile so content clears the tab bar */}
        <main className={`min-w-0 lg:pb-0 ${hideMobileTabBar ? "" : "pb-24"}`}>{children}</main>

        {/* Mobile bottom tab bar */}
        <nav
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur lg:hidden ${
            hideMobileTabBar ? "hidden" : ""
          }`}
        >
          <div className="mx-auto flex max-w-md items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
            {nav.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors ${
                    active ? "text-brand" : "text-muted"
                  }`}
                >
                  <span className="relative flex h-8 w-full items-center justify-center">
                    <span
                      className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                        active ? "bg-brand/10" : ""
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    {item.badge ? (
                      <span className="absolute right-2 top-0 inline-flex min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                  {item.short ?? item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
