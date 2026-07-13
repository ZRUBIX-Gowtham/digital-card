const STORAGE_KEY = "zx_leads";

export type LeadType = "enquiry" | "booking";

export interface Lead {
  id: string;
  cardSlug: string;
  type: LeadType;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  service?: string;
  date?: string;
  time?: string;
  createdAt: string;
  read?: boolean;
}

function isServer() {
  return typeof window === "undefined";
}

function readAll(): Lead[] {
  if (isServer()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Lead[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [];
}

function writeAll(leads: Lead[]): void {
  if (isServer()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

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

export function getLeadsForCard(cardSlug: string): Lead[] {
  return readAll()
    .filter((l) => l.cardSlug === cardSlug)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

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

export function countUnreadLeads(cardSlug: string): number {
  return readAll().filter((l) => l.cardSlug === cardSlug && !l.read).length;
}

export function markLeadRead(cardSlug: string, id: string): void {
  const all = readAll();
  const idx = all.findIndex((l) => l.id === id && l.cardSlug === cardSlug);
  if (idx < 0) return;
  all[idx] = { ...all[idx], read: true };
  writeAll(all);
}

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

export function deleteLead(cardSlug: string, id: string): void {
  const all = readAll();
  const next = all.filter((l) => !(l.id === id && l.cardSlug === cardSlug));
  if (next.length !== all.length) writeAll(next);
}
