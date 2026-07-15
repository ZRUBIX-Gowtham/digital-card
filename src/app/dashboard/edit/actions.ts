"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { saveCardToStore, getCardFromStore } from "@/lib/cards-store";
import type { CardData } from "@/types/card";

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/**
 * Persist edits to the signed-in user's own card. Ownership is enforced from
 * the session (a user can only edit the card whose slug matches their account),
 * and the slug itself is never taken from the client payload.
 */
export async function saveCardAction(draft: CardData): Promise<SaveResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "You must be signed in." };

  const existing = await getCardFromStore(user.cardSlug);
  if (!existing) return { ok: false, error: "No card is linked to your account." };

  const next: CardData = {
    ...draft,
    slug: user.cardSlug, // lock the slug to the owner's card
    views: existing.views, // counter is server-owned; never trust the draft
  };

  await saveCardToStore(next);

  // Refresh the public card and dashboard so changes appear immediately.
  revalidatePath(`/${user.cardSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");

  return { ok: true };
}
