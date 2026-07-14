import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase-1 file-based persistence for leads (enquiries + booking requests that
 * visitors submit from a public card). Reads/writes `.data/leads.json`, created
 * on first write. Mirrors the pattern in `cards-store.ts` so Phase 2 can swap
 * these functions for database queries without changing any caller.
 */
const DATA_DIR = process.env.VERCEL ? "/tmp/.data" : path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "leads.json");

export type LeadType = "enquiry" | "booking";

export interface Lead {
  id: string;
  /** Card (owner) the lead belongs to. */
  cardSlug: string;
  type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  /** Booking-only: chosen service, date (YYYY-MM-DD) and time slot. */
  service?: string;
  date?: string;
  time?: string;
  /** ISO timestamp of submission. */
  createdAt: string;
  /** Owner has opened/seen it in the dashboard. */
  read?: boolean;
}

function readAll(): Lead[] {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw) as Lead[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* no leads yet */
  }
  return [];
}

function writeAll(leads: Lead[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(leads, null, 2), "utf8");
}

/** Store a new lead, returning the saved record (with generated id + time). */
export function addLead(
  input: Omit<Lead, "id" | "createdAt" | "read">,
): Lead {
  const lead: Lead = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const all = readAll();
  all.push(lead);
  writeAll(all);
  return lead;
}

/** Leads for one card, newest first. */
export function getLeadsForCard(cardSlug: string): Lead[] {
  return readAll()
    .filter((l) => l.cardSlug === cardSlug)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Time slots already booked for a card on a given date (YYYY-MM-DD). Used to
 *  grey out taken slots on the public booking form and block double-booking. */
export function getBookedSlots(cardSlug: string, date: string): string[] {
  if (!date) return [];
  return readAll()
    .filter(
      (l) =>
        l.cardSlug === cardSlug &&
        l.type === "booking" &&
        l.date === date &&
        Boolean(l.time),
    )
    .map((l) => l.time as string);
}

/** Count of unseen leads for a card — used for the dashboard badge. */
export function countUnreadLeads(cardSlug: string): number {
  return readAll().filter((l) => l.cardSlug === cardSlug && !l.read).length;
}

/** Mark a single lead (owned by `cardSlug`) as read. */
export function markLeadRead(cardSlug: string, id: string): void {
  const all = readAll();
  const idx = all.findIndex((l) => l.id === id && l.cardSlug === cardSlug);
  if (idx < 0) return;
  all[idx] = { ...all[idx], read: true };
  writeAll(all);
}

/** Mark every lead for a card as read. */
export function markAllLeadsRead(cardSlug: string): void {
  const all = readAll();
  let changed = false;
  for (let i = 0; i < all.length; i++) {
    if (all[i].cardSlug === cardSlug && !all[i].read) {
      all[i] = { ...all[i], read: true };
      changed = true;
    }
  }
  if (changed) writeAll(all);
}

/** Delete a single lead owned by `cardSlug`. */
export function deleteLead(cardSlug: string, id: string): void {
  const all = readAll();
  const next = all.filter((l) => !(l.id === id && l.cardSlug === cardSlug));
  if (next.length !== all.length) writeAll(next);
}
