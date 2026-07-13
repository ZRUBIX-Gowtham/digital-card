import { cards as seedCards } from "@/data/cards";
import type { CardData } from "@/types/card";

const STORAGE_KEY = "zx_cards";

function isServer() {
  return typeof window === "undefined";
}

function readAll(): CardData[] {
  if (isServer()) return seedCards;
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CardData[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return seedCards;
}

function writeAll(cards: CardData[]): void {
  if (isServer()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function getCardFromStore(slug: string): CardData | undefined {
  return readAll().find((c) => c.slug === slug);
}

export function getAllCardSlugsFromStore(): string[] {
  return readAll().map((c) => c.slug);
}

export function saveCardToStore(card: CardData): void {
  const all = readAll();
  const idx = all.findIndex((c) => c.slug === card.slug);
  if (idx >= 0) all[idx] = card;
  else all.push(card);
  writeAll(all);
}

export function incrementCardViews(slug: string): number | undefined {
  const all = readAll();
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx < 0) return undefined;
  const next = (all[idx].views ?? 0) + 1;
  all[idx] = { ...all[idx], views: next };
  writeAll(all);
  return next;
}
