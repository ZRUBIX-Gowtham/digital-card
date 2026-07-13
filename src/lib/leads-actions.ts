"use server";

import { getCardFromStore } from "@/lib/cards-store";
import { addLead, getBookedSlots, type LeadType } from "@/lib/leads-store";
import { logEvent } from "@/lib/analytics-store";

export interface SubmitLeadInput {
  cardSlug: string;
  type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  service?: string;
  date?: string;
  time?: string;
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

const clip = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/**
 * Store a lead submitted from a public card's Enquiry or Booking form. This is
 * called from an untrusted (public) client, so everything is validated here:
 * the card must exist, a name is required, and all text is length-capped. The
 * matching analytics event is logged so the owner sees it in their breakdown.
 */
export async function submitLeadAction(
  input: SubmitLeadInput,
): Promise<SubmitLeadResult> {
  const cardSlug = clip(input.cardSlug, 120);
  const type: LeadType = input.type === "booking" ? "booking" : "enquiry";

  if (!cardSlug || !getCardFromStore(cardSlug)) {
    return { ok: false, error: "This card is no longer available." };
  }

  const name = clip(input.name, 120);
  if (!name) return { ok: false, error: "Please enter your name." };

  const phone = clip(input.phone, 40);
  const email = clip(input.email, 160);
  const message = clip(input.message, 2000);

  const date = clip(input.date, 40);
  const time = clip(input.time, 40);

  // A booking needs at least a preferred date so it's actionable.
  if (type === "booking" && !date) {
    return { ok: false, error: "Please choose a preferred date." };
  }

  // Guard against two visitors grabbing the same slot on the same day.
  if (type === "booking" && time && getBookedSlots(cardSlug, date).includes(time)) {
    return { ok: false, error: "Sorry, that slot was just taken. Please pick another." };
  }

  addLead({
    cardSlug,
    type,
    name,
    phone: phone || undefined,
    email: email || undefined,
    message: message || undefined,
    service: type === "booking" ? clip(input.service, 160) || undefined : undefined,
    date: type === "booking" ? date || undefined : undefined,
    time: type === "booking" ? time || undefined : undefined,
  });

  logEvent(cardSlug, type);

  return { ok: true };
}

/**
 * Public: the time slots already taken for a card on a given date, so the
 * booking form can grey them out before the visitor submits.
 */
export async function getBookedSlotsAction(
  cardSlug: string,
  date: string,
): Promise<string[]> {
  const slug = clip(cardSlug, 120);
  const day = clip(date, 40);
  if (!slug || !day || !getCardFromStore(slug)) return [];
  return getBookedSlots(slug, day);
}
