import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SignatureStudio } from "@/components/dashboard/SignatureStudio";
import { resolveSignatureDraft, resolveSignatureTemplate } from "@/lib/signature";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mail signature" };

export default async function SignaturePage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = await getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const unreadLeads = await countUnreadLeads(card.slug);

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Mail signature</h1>
          <p className="mt-1 text-sm text-muted">
            Turn your card into a professional email signature — pick a design
            and copy it into Gmail, Outlook or Apple Mail.
          </p>
        </div>

        <SignatureStudio
          card={card}
          initialTemplate={resolveSignatureTemplate(card)}
          initialDraft={resolveSignatureDraft(card)}
        />
      </Container>
    </DashboardShell>
  );
}
