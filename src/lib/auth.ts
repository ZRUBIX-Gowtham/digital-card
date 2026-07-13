import { cookies } from "next/headers";
import { getUserBySlug, type DummyUser } from "@/data/users";

/**
 * Minimal cookie-based session for the dummy auth. The cookie simply stores the
 * logged-in user's cardSlug. Phase 2 swaps this for a real signed session.
 */
const COOKIE = "zx_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getSession(): Promise<DummyUser | null> {
  const store = await cookies();
  const slug = store.get(COOKIE)?.value;
  if (!slug) return null;
  return getUserBySlug(slug) ?? null;
}

export async function createSession(cardSlug: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, cardSlug, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
