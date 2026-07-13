import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Eye,
  MousePointerClick,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  UserPlus,
  CalendarCheck,
  Send,
  Globe,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { analyticsForCard, type EventType } from "@/lib/analytics-store";
import { getTemplate } from "@/data/templates";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = { title: "Analytics" };

const ACTION_META: Record<EventType, { label: string; icon: typeof Phone }> = {
  view: { label: "Views", icon: Eye },
  call: { label: "Calls", icon: Phone },
  whatsapp: { label: "WhatsApp", icon: MessageSquare },
  email: { label: "Emails", icon: Mail },
  map: { label: "Directions", icon: MapPin },
  "save-contact": { label: "Contact saved", icon: UserPlus },
  enquiry: { label: "Enquiries", icon: Send },
  booking: { label: "Bookings", icon: CalendarCheck },
};

export default async function AnalyticsPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const accent = getTemplate(card.templateId)?.style.accent ?? card.accent ?? "#4f46e5";
  const data = analyticsForCard(card.slug, 14);
  const maxDaily = Math.max(1, ...data.daily.map((d) => d.views));
  const last7 = data.daily.slice(-7).reduce((n, d) => n + d.views, 0);
  const unreadLeads = countUnreadLeads(card.slug);

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            How visitors are engaging with your card.
          </p>
        </div>

        {/* Top stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat icon={<Eye className="h-5 w-5" />} label="Total views" value={data.totalViews.toLocaleString()} accent={accent} />
          <Stat icon={<MousePointerClick className="h-5 w-5" />} label="Total interactions" value={data.totalActions.toLocaleString()} accent={accent} />
          <Stat icon={<Globe className="h-5 w-5" />} label="Views · last 7 days" value={last7.toLocaleString()} accent={accent} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Daily views bar chart */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold text-foreground">Views · last 14 days</h2>
            {data.totalViews === 0 ? (
              <EmptyNote text="No views yet. Share your card link to start seeing traffic here." />
            ) : (
              <div className="mt-6 flex h-44 items-end gap-1.5">
                {data.daily.map((d) => (
                  <div key={d.date} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md transition-all group-hover:opacity-80"
                        style={{
                          height: `${Math.max(4, (d.views / maxDaily) * 100)}%`,
                          backgroundColor: accent,
                          opacity: d.views === 0 ? 0.15 : 1,
                        }}
                        title={`${d.views} view${d.views === 1 ? "" : "s"} on ${d.label}`}
                      />
                    </div>
                    <span className="text-[9px] leading-none text-muted">
                      {d.label.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Referrers */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold text-foreground">Top referrers</h2>
            {data.referrers.length === 0 ? (
              <EmptyNote text="No referrer data yet — most visits are direct (from your link or QR)." />
            ) : (
              <ul className="mt-4 space-y-3">
                {data.referrers.map((r) => (
                  <li key={r.host} className="flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-2 text-sm text-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0 text-muted" />
                      <span className="truncate">{r.host}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-muted">{r.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Interaction breakdown */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-bold text-foreground">What visitors tapped</h2>
          {data.actions.length === 0 ? (
            <EmptyNote text="No taps recorded yet. When visitors call, message or save your contact, it'll show here." />
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.actions.map((a) => {
                const meta = ACTION_META[a.type];
                const Icon = meta.icon;
                return (
                  <div key={a.type} className="rounded-xl border border-border bg-surface-2/40 p-4">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${accent}1a`, color: accent }}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="mt-3 text-xl font-bold text-foreground">{a.count.toLocaleString()}</p>
                    <p className="text-xs text-muted">{meta.label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </Container>
    </DashboardShell>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </span>
      <p className="mt-4 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="mt-4 text-sm leading-relaxed text-muted">{text}</p>;
}
