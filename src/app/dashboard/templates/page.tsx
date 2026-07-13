import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCardFromStore } from "@/lib/cards-store";
import { countUnreadLeads } from "@/lib/leads-store";
import { templates, categories } from "@/data/templates";
import { getCard } from "@/data/cards";
import { Container } from "@/components/ui/Container";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CardRenderer } from "@/components/card-templates/registry";
import { TemplateGrid, type PickerItem } from "@/components/dashboard/TemplatePicker";

export const metadata: Metadata = { title: "Change template" };

export default async function TemplatesPage() {
  const user = await getSession();
  if (!user) redirect("/signin");

  const card = getCardFromStore(user.cardSlug);
  if (!card) redirect("/dashboard");

  const unreadLeads = countUnreadLeads(card.slug);

  // Build live, top-cropped thumbnails on the server — one per template.
  const pickerItems: PickerItem[] = templates.map((t) => {
    const demo = getCard(t.demoSlug);
    return {
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description,
      bestFor: t.bestFor,
      thumb: demo ? (
        <div className="pointer-events-none h-full w-full overflow-hidden">
          <div className="w-full" style={{ zoom: 0.5 }}>
            <CardRenderer card={demo} templateId={t.id} />
          </div>
        </div>
      ) : null,
    };
  });

  return (
    <DashboardShell
      userName={user.name}
      userEmail={user.email}
      cardSlug={card.slug}
      unreadLeads={unreadLeads}
    >
      <Container className="py-8 lg:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Change template</h1>
          <p className="mt-1 text-sm text-muted">
            Pick a design — your content stays, only the look changes.
          </p>
        </div>

        <TemplateGrid
          items={pickerItems}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          currentTemplateId={card.templateId}
        />
      </Container>
    </DashboardShell>
  );
}
