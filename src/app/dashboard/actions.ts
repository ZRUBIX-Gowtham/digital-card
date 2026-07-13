import { getSession } from "@/lib/auth";
import { saveCardToStore, getCardFromStore } from "@/lib/cards-store";
import { getTemplate } from "@/data/templates";

export interface ChangeTemplateResult {
  ok: boolean;
  error?: string;
}

export async function changeTemplateAction(
  templateId: string,
): Promise<ChangeTemplateResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "You must be signed in." };

  const existing = getCardFromStore(user.cardSlug);
  if (!existing) return { ok: false, error: "No card is linked to your account." };

  const template = getTemplate(templateId);
  if (!template) return { ok: false, error: "That template no longer exists." };

  saveCardToStore({
    ...existing,
    slug: user.cardSlug,
    views: existing.views,
    templateId,
    accent: template.style.accent,
  });

  return { ok: true };
}
