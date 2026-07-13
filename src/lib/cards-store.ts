import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cards as seedCards } from "@/data/cards";
import type { CardData } from "@/types/card";

/**
 * Phase-1 file-based persistence for cards. Reads/writes `.data/cards.json`,
 * seeded from `src/data/cards.ts` on first use. This makes editor changes real
 * (the public `/{slug}` page reflects saves) while running locally with no DB.
 *
 * Phase 2 replaces these four functions with database queries — callers and the
 * `CardData` contract stay the same.
 *
 * Note: works with `next dev` and `next start` (Node runtime with a writable
 * filesystem). A serverless/read-only host would need the DB swap.
 */
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "cards.json");

function readAll(): CardData[] {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw) as CardData[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* not seeded yet */
  }
  return seedCards;
}

function writeAll(cards: CardData[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(cards, null, 2), "utf8");
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

/**
 * Increment and persist the public view count for a card, returning the new
 * total. No-op (returns undefined) if the slug is unknown.
 */
export function incrementCardViews(slug: string): number | undefined {
  const all = readAll();
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx < 0) return undefined;
  const next = (all[idx].views ?? 0) + 1;
  all[idx] = { ...all[idx], views: next };
  writeAll(all);
  return next;
}
