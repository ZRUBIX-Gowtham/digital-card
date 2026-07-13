"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  markLeadRead,
  markAllLeadsRead,
  deleteLead,
} from "@/lib/leads-store";

/** Mark a single lead (owned by the signed-in user) as read. */
export async function markLeadReadAction(id: string): Promise<{ ok: boolean }> {
  const user = await getSession();
  if (!user) return { ok: false };
  markLeadRead(user.cardSlug, id);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Mark every lead for the signed-in user's card as read. Returns void so it can
 * be used directly as a `<form action>` handler.
 */
export async function markAllLeadsReadAction(): Promise<void> {
  const user = await getSession();
  if (!user) return;
  markAllLeadsRead(user.cardSlug);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

/** Delete a single lead owned by the signed-in user. */
export async function deleteLeadAction(id: string): Promise<{ ok: boolean }> {
  const user = await getSession();
  if (!user) return { ok: false };
  deleteLead(user.cardSlug, id);
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
  return { ok: true };
}
