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
  Monitor,
  Smartphone,
  Laptop,
  Download,
  IndianRupee,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import {
  analyticsForCard,
  toRangeKey,
  RANGE_DAYS,
  RANGE_LABELS,
  type EventType,
  type Breakdown,
} from "@/lib/analytics-store";
import { getTemplate } from "@/data/templates";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { VisitorMap } from "@/components/dashboard/VisitorMap";
import { LiveRefresh } from "@/components/dashboard/LiveRefresh";
import { RangeFilter } from "@/components/dashboard/RangeFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Analytics" };

const ACTION_META: Record<EventType, { label: string; icon: typeof Phone }> = {
  view: { label: "Views", icon: Eye },
  call: { label: "Calls", icon: Phone },
  whatsapp: { label: "WhatsApp", icon: MessageSquare },
  email: { label: "Emails", icon: Mail },
  map: { label: "Directions", icon: MapPin },
  "save-contact": { label: "Contact saved", icon: UserPlus },
  pay: { label: "UPI payments", icon: IndianRupee },
  enquiry: { label: "Enquiries", icon: Send },
  booking: { label: "Bookings", icon: CalendarCheck },
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = await getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const range = toRangeKey((await searchParams).range);
  const accent = getTemplate(card.templateId)?.style.accent ?? card.accent ?? "#4f46e5";
  const data = await analyticsForCard(card.slug, RANGE_DAYS[range]);
  const maxDaily = Math.max(1, ...data.daily.map((d) => d.views));
  const unreadLeads = await countUnreadLeads(card.slug);

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="mt-1 text-sm text-muted">
              How visitors are engaging with your card.
            </p>
          </div>
          <LiveRefresh cardSlug={card.slug} />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <RangeFilter active={range} />
          <span className="text-xs text-muted">Showing {RANGE_LABELS[range]}</span>
        </div>

        {/* Top stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat icon={<Eye className="h-5 w-5" />} label="Total views" value={data.totalViews.toLocaleString()} accent={accent} hint="Every open, incl. repeats" />
          <Stat icon={<UserPlus className="h-5 w-5" />} label="Unique visits" value={data.uniqueVisits.toLocaleString()} accent={accent} hint="Repeat loads merged" />
          <Stat icon={<MousePointerClick className="h-5 w-5" />} label="Interactions" value={data.totalActions.toLocaleString()} accent={accent} hint="Taps on call, WhatsApp, etc." />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* Daily views bar chart */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold text-foreground">Views · {RANGE_LABELS[range]}</h2>
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

        {/* Audience: device / browser / OS breakdowns */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <BreakdownCard
            title="Devices"
            icon={<Smartphone className="h-4 w-4" />}
            items={data.devices}
            accent={accent}
            empty="No device data yet."
          />
          <BreakdownCard
            title="Browsers"
            icon={<Laptop className="h-4 w-4" />}
            items={data.browsers}
            accent={accent}
            empty="No browser data yet."
          />
          <BreakdownCard
            title="Operating systems"
            icon={<Monitor className="h-4 w-4" />}
            items={data.operatingSystems}
            accent={accent}
            empty="No OS data yet."
          />
        </section>

        {/* Location: map report + top locations list */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <MapPin className="h-4 w-4 text-muted" /> Visitor map
              </h2>
              {data.points.length > 0 && (
                <span className="text-xs text-muted">
                  {data.points.length.toLocaleString()} located visit
                  {data.points.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {data.points.length === 0 ? (
              <EmptyNote text="No location data yet. Each visitor appears here as a dot once your card is live — locations come from the visitor's network, so local previews don't count." />
            ) : (
              <div className="mt-4">
                <VisitorMap points={data.points} accent={accent} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-bold text-foreground">Top locations</h2>
            {data.locations.length === 0 ? (
              <EmptyNote text="No location data yet." />
            ) : (
              <>
                <BreakdownBars items={data.locations} accent={accent} />
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Approximate — based on the visitor&apos;s network (IP), not GPS.
                  Mobile visitors often show as their carrier&apos;s regional hub
                  (e.g. a Salem visitor may appear as Chennai).
                </p>
              </>
            )}
          </div>
        </section>

        {/* Recent visitors — one row per visit with their device / OS / place */}
        <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-foreground">Recent visitors</h2>
            {data.visits.length > 0 && (
              <a
                href={`/api/analytics/export?range=${range}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </a>
            )}
          </div>
          {data.visits.length === 0 ? (
            <EmptyNote text="No visits recorded yet. Once people open your card, each visit shows here with its device, OS and location." />
          ) : (
            <div className="mt-4 max-h-[420px] overflow-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                    <th className="pb-2 pr-4 font-semibold">When</th>
                    <th className="pb-2 pr-4 font-semibold">Location</th>
                    <th className="pb-2 pr-4 font-semibold">Device</th>
                    <th className="pb-2 pr-4 font-semibold">OS</th>
                    <th className="pb-2 font-semibold">Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {data.visits.map((v, i) => (
                    <tr key={i} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-4 whitespace-nowrap text-muted">{formatWhen(v.at)}</td>
                      <td className="py-2.5 pr-4 text-foreground">{v.location ?? "—"}</td>
                      <td className="py-2.5 pr-4 text-foreground">{v.device ?? "—"}</td>
                      <td className="py-2.5 pr-4 text-foreground">{v.os ?? "—"}</td>
                      <td className="py-2.5 text-foreground">{v.browser ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </DashboardShell>
  );
}

function BreakdownCard({
  title,
  icon,
  items,
  accent,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  items: Breakdown[];
  accent: string;
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className="text-muted">{icon}</span>
        {title}
      </h2>
      {items.length === 0 ? <EmptyNote text={empty} /> : <BreakdownBars items={items} accent={accent} />}
    </div>
  );
}

function BreakdownBars({ items, accent }: { items: Breakdown[]; accent: string }) {
  const total = items.reduce((n, i) => n + i.count, 0) || 1;
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => {
        const pct = Math.round((item.count / total) * 100);
        return (
          <li key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-foreground">{item.name}</span>
              <span className="shrink-0 font-semibold text-muted">
                {item.count.toLocaleString()}
                <span className="ml-1 text-xs font-normal">({pct}%)</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2/60">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(4, pct)}%`, backgroundColor: accent }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  hint?: string;
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
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="mt-4 text-sm leading-relaxed text-muted">{text}</p>;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
