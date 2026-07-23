import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Pencil,
  Eye,
  LayoutTemplate,
  ExternalLink,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { analyticsForCard } from "@/lib/analytics-store";
import { getTemplate } from "@/data/templates";

export const dynamic = "force-dynamic";
import { Container } from "@/components/ui/Container";
import { ShareLink } from "@/components/dashboard/ShareLink";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { CardRenderer } from "@/components/card-templates/registry";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = await getCardFromStore(user.cardSlug);
  const template = card ? getTemplate(card.templateId) : undefined;
  const unreadLeads = card ? await countUnreadLeads(card.slug) : 0;
  // Same source as the Analytics page so the two never disagree: all-time views
  // from the event log, not the raw `card.views` counter (which can drift).
  const totalViews = card ? (await analyticsForCard(card.slug)).totalViews : 0;

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card?.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="px-3.5 py-4 sm:px-8 lg:py-10">
        {card ? (
          <>
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_360px] lg:items-start min-w-0">
              {/* ============ LEFT: content ============ */}
              <div className="space-y-4 sm:space-y-6 min-w-0">
                {/* Greeting / hero banner */}
                <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-surface to-surface p-4 sm:p-7 min-w-0">
                  <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
                  <div className="relative flex flex-wrap items-center justify-between gap-3 sm:gap-5 min-w-0">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Card is live
                      </span>
                      <h1 className="mt-2 text-lg sm:text-3xl font-bold text-foreground truncate">
                        Welcome back, {user.name.split(" ")[0]} 👋
                      </h1>
                      <p className="mt-0.5 text-xs sm:text-sm text-muted truncate">
                        Signed in as {user.email}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:w-auto shrink-0">
                      <Link
                        href="/dashboard/edit?tab=content"
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Edit card
                      </Link>
                      <a
                        href={`/${card.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-surface px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> View live
                      </a>
                    </div>
                  </div>
                </section>

                {/* Stats row */}
                <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 min-w-0">
                  <StatCard
                    icon={<Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Profile views"
                    value={totalViews.toLocaleString()}
                    hint="All-time"
                    live
                  />
                  <StatCard
                    icon={<LayoutTemplate className="h-4 w-4 sm:h-5 sm:w-5" />}
                    label="Active template"
                    value={template?.name ?? "Custom"}
                    hint={template ? `${template.bestFor}` : "—"}
                    accent={template?.style.accent ?? card.accent}
                  />
                  <StatCard
                    className="col-span-2 sm:col-span-1"
                    horizontal
                    icon={
                      (card.theme ?? "light") === "dark" ? (
                        <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                      )
                    }
                    label="Card appearance"
                    value={(card.theme ?? "light") === "dark" ? "Dark" : "Light"}
                    hint="What visitors see"
                  />
                </section>

                {/* Card overview + share link + QR */}
                <section className="rounded-2xl border border-border bg-surface p-4 sm:p-7 min-w-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">
                        {card.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted truncate">
                        {card.title}
                        {card.company ? ` · ${card.company}` : ""}
                      </p>
                    </div>
                    {template && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white shrink-0"
                        style={{
                          background: template.style.accent2
                            ? `linear-gradient(135deg, ${template.style.accent}, ${template.style.accent2})`
                            : template.style.accent,
                        }}
                      >
                        <LayoutTemplate className="h-3.5 w-3.5" />
                        {template.name}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-6 border-t border-border pt-4 sm:pt-6 min-w-0">
                    <ShareLink slug={card.slug} slugChanges={user.slugChanges || 0} />
                  </div>
                </section>
              </div>

              {/* ============ RIGHT: live preview (hidden on mobile, sticky on desktop) ============ */}
              <section className="hidden lg:block rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground">Live preview</h2>
                  <a
                    href={`/${card.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                  >
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex justify-center">
                  <PhoneFrame
                    className="h-[520px] w-[268px] shadow-lg"
                    screenClassName="min-h-0 flex-1 !p-0"
                  >
                    <div
                      className="[&>div>div]:max-w-none [&>div>div]:overflow-visible [&>div>div]:rounded-none [&>div>div]:sm:rounded-none [&>div>div]:border-0 [&>div>div]:sm:border-0 [&>div>div]:shadow-none [&>div>div]:sm:shadow-none [&>div>div]:min-h-0 [&>div>div]:sm:min-h-0"
                      style={{ width: 360, zoom: 0.689, minHeight: "145%" }}
                    >
                      <CardRenderer card={card} />
                    </div>
                  </PhoneFrame>
                </div>
              </section>
            </div>

          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center min-w-0">
            <p className="text-muted">No card is linked to this account yet.</p>
            <Link href="/templates" className="mt-3 inline-block font-semibold text-brand">
              Create your card
            </Link>
          </div>
        )}
      </Container>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  live,
  accent,
  className,
  horizontal,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  live?: boolean;
  accent?: string;
  className?: string;
  horizontal?: boolean;
}) {
  const iconBadge = (
    <span
      className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-brand-50 text-brand"
      style={accent ? { backgroundColor: `${accent}1a`, color: accent } : undefined}
    >
      {icon}
    </span>
  );

  const liveBadge = live ? (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-emerald-700">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      Live
    </span>
  ) : null;

  if (horizontal) {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-border bg-surface p-3 sm:block sm:p-5 min-w-0 overflow-hidden ${className ?? ""}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          {iconBadge}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{label}</p>
            {hint && <p className="truncate text-[10px] sm:text-xs text-muted">{hint}</p>}
          </div>
        </div>
        <div className="shrink-0 text-right sm:mt-4 sm:text-left">
          <span className="inline-block rounded-full bg-surface-hover px-2.5 py-1 text-xs sm:p-0 sm:bg-transparent sm:text-2xl sm:font-bold text-foreground font-semibold">
            {value}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl sm:rounded-2xl border border-border bg-surface p-3 sm:p-5 min-w-0 overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-1">
        {iconBadge}
        {liveBadge}
      </div>
      <p className="mt-2 sm:mt-4 truncate text-lg sm:text-2xl font-bold text-foreground">{value}</p>
      <p className="truncate text-xs sm:text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 truncate text-[10px] sm:text-xs text-muted">{hint}</p>}
    </div>
  );
}
