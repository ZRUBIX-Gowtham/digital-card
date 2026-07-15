import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { getLeadsForCard, countUnreadLeads } from "@/lib/leads-store";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LeadsList } from "@/components/dashboard/LeadsList";
import { markAllLeadsReadAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = await getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const leads = await getLeadsForCard(card.slug);
  const unread = await countUnreadLeads(card.slug);

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unread}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Leads
              {unread > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-brand px-2.5 py-0.5 align-middle text-sm font-bold text-white">
                  {unread} new
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Enquiries and booking requests from your card.
            </p>
          </div>
          {unread > 0 && (
            <form action={markAllLeadsReadAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
              >
                <CheckCheck className="h-4 w-4" /> Mark all read
              </button>
            </form>
          )}
        </div>

        <LeadsList leads={leads} />
      </Container>
    </DashboardShell>
  );
}
