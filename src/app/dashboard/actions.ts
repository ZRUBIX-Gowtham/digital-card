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

  const existing = await getCardFromStore(user.cardSlug);
  if (!existing) return { ok: false, error: "No card is linked to your account." };

  const template = getTemplate(templateId);
  if (!template) return { ok: false, error: "That template no longer exists." };

  await saveCardToStore({
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

export async function changeSlugAction(newSlug: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getSession();
  if (!user) return { ok: false, error: "You must be signed in." };

  if ((user.slugChanges || 0) >= 2) {
    return { ok: false, error: "You have reached the maximum limit of 2 link changes." };
  }

  // Basic validation for slug (alphanumeric and hyphens only, min 3 chars)
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(newSlug) || newSlug.length < 3) {
    return { ok: false, error: "Link name can only contain lowercase letters, numbers, and hyphens, and must be at least 3 characters long." };
  }

  if (newSlug === user.cardSlug) {
    return { ok: false, error: "This is already your link name." };
  }

  try {
    const { db } = await import("@/lib/firebase");
    const { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc, increment } = await import("firebase/firestore");
    const { createSession } = await import("@/lib/auth");

    // 1. Check if the new slug is already taken by someone else
    const q = query(collection(db, "users"), where("cardSlug", "==", newSlug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { ok: false, error: "This link name is already taken. Please try another one." };
    }

    // 2. Fetch current card
    const currentCard = await getCardFromStore(user.cardSlug);
    if (!currentCard) {
       return { ok: false, error: "Could not find your current card." };
    }

    // 3. Save card under new slug
    currentCard.slug = newSlug;
    await saveCardToStore(currentCard);

    // 4. Update the user document
    const userRef = doc(db, "users", user.email);
    await updateDoc(userRef, {
      cardSlug: newSlug,
      slugChanges: increment(1)
    });

    // 5. Delete the old card document
    await deleteDoc(doc(db, "cards", user.cardSlug));

    // 6. Update session cookie
    await createSession(newSlug);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/edit");
    revalidatePath(`/${user.cardSlug}`); // revalidate old path
    revalidatePath(`/${newSlug}`); // revalidate new path

    return { ok: true };
  } catch (error) {
    console.error("Error changing slug:", error);
    return { ok: false, error: "An unexpected error occurred while changing your link name." };
  }
}
