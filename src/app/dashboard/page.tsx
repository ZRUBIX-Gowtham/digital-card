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

  const card = getCardFromStore(user.cardSlug);
  const template = card ? getTemplate(card.templateId) : undefined;
  const unreadLeads = card ? countUnreadLeads(card.slug) : 0;

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card?.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        {card ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
              {/* ============ LEFT: content ============ */}
              <div className="space-y-6">
                {/* Greeting / hero banner */}
                <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-surface to-surface p-6 sm:p-8">
                  <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
                  <div className="relative flex flex-wrap items-center justify-between gap-5">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Card is live
                      </span>
                      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                        Welcome back, {user.name.split(" ")[0]} 👋
                      </h1>
                      <p className="mt-1 text-sm text-muted">
                        Signed in as {user.email}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Link
                        href="/dashboard/edit?tab=content"
                        className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <Pencil className="h-4 w-4" /> Edit card
                      </Link>
                      <a
                        href={`/${card.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
                      >
                        <ExternalLink className="h-4 w-4" /> View live
                      </a>
                    </div>
                  </div>
                </section>

                {/* Stats row */}
                <section className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    icon={<Eye className="h-5 w-5" />}
                    label="Profile views"
                    value={(card.views ?? 0).toLocaleString()}
                    hint="Updates in real time"
                    live
                  />
                  <StatCard
                    icon={<LayoutTemplate className="h-5 w-5" />}
                    label="Active template"
                    value={template?.name ?? "Custom"}
                    hint={template ? `${template.bestFor}` : "—"}
                    accent={template?.style.accent ?? card.accent}
                  />
                  <StatCard
                    icon={
                      (card.theme ?? "light") === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )
                    }
                    label="Card appearance"
                    value={(card.theme ?? "light") === "dark" ? "Dark" : "Light"}
                    hint="What visitors see"
                  />
                </section>

                {/* Card overview + share link + QR */}
                <section className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-foreground">
                        {card.name}
                      </h2>
                      <p className="text-sm text-muted">
                        {card.title}
                        {card.company ? ` · ${card.company}` : ""}
                      </p>
                    </div>
                    {template && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
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

                  <div className="mt-6 border-t border-border pt-6">
                    <ShareLink slug={card.slug} />
                  </div>
                </section>
              </div>

              {/* ============ RIGHT: live preview (bottom on mobile, sticky on desktop) ============ */}
              <section className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
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
                    <div className="h-full [&>div>div]:max-w-none [&>div>div]:overflow-visible [&>div>div]:rounded-none [&>div>div]:sm:rounded-none [&>div>div]:border-0 [&>div>div]:sm:border-0 [&>div>div]:shadow-none [&>div>div]:sm:shadow-none [&>div>div]:min-h-0 [&>div>div]:sm:min-h-0">
                      <CardRenderer card={card} />
                    </div>
                  </PhoneFrame>
                </div>
              </section>
            </div>

          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-8 text-center">
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  live?: boolean;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand"
          style={accent ? { backgroundColor: `${accent}1a`, color: accent } : undefined}
        >
          {icon}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
