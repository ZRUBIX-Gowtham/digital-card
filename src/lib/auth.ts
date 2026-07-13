import { getUserBySlug, type DummyUser } from "@/data/users";
import { users } from "@/data/users";

const COOKIE = "zx_session";

function isServer() {
  return typeof window === "undefined";
}

export async function getSession(): Promise<DummyUser | null> {
  if (isServer()) {
    // During static build, return the first user so dashboard pages render
    return users[0];
  }
  const slug = localStorage.getItem(COOKIE);
  if (!slug) return users[0]; // fallback to dummy user
  return getUserBySlug(slug) ?? users[0];
}

export async function createSession(cardSlug: string): Promise<void> {
  if (!isServer()) {
    localStorage.setItem(COOKIE, cardSlug);
  }
}

export async function destroySession(): Promise<void> {
  if (!isServer()) {
    localStorage.removeItem(COOKIE);
  }
}
