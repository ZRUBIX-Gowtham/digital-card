import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { getTemplate } from "@/data/templates";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { QrStudio } from "@/components/dashboard/QrStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "QR code" };

export default async function QrPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = await getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const unreadLeads = await countUnreadLeads(card.slug);
  const accent = card.accent ?? getTemplate(card.templateId)?.style.accent ?? "#4f46e5";

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">QR code studio</h1>
          <p className="mt-1 text-sm text-muted">
            Turn your card into a branded QR code — pick colours, drop in your
            logo, then download a print-ready PNG / SVG for posters, flyers and
            visiting cards.
          </p>
        </div>

        <QrStudio card={card} accent={accent} />
      </Container>
    </DashboardShell>
  );
}
