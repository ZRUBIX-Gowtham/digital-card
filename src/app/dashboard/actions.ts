"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { saveCardToStore, getCardFromStore } from "@/lib/cards-store";
import { getTemplate } from "@/data/templates";

export interface ChangeTemplateResult {
  ok: boolean;
  error?: string;
}

/**
 * Switch the signed-in user's card to a different template. Ownership is taken
 * from the session (never the client), and the new card adopts the template's
 * own accent so the design fully changes — matching what the gallery preview
 * shows. The view counter and slug stay server-owned.
 */
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

  revalidatePath(`/${user.cardSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");

  return { ok: true };
}
