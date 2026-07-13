import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CardEditor } from "@/components/dashboard/CardEditor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit card",
};

export default async function EditPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={countUnreadLeads(card.slug)}
    >
      <CardEditor initialCard={card} />
    </DashboardShell>
  );
}
