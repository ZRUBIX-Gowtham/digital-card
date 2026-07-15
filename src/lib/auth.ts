import { cookies } from "next/headers";
import { getUserBySlug, type DummyUser } from "@/data/users";

/**
 * Minimal cookie-based session for the dummy auth. The cookie simply stores the
 * logged-in user's cardSlug. Phase 2 swaps this for a real signed session.
 */
const COOKIE = "zx_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getSession(): Promise<DummyUser | null> {
  const store = await cookies();
  const slug = store.get(COOKIE)?.value;
  if (!slug) return null;
  
  // First check mock data
  const localUser = getUserBySlug(slug);
  if (localUser) return localUser;

  // If not found in mock data, check Firestore
  try {
    const q = query(collection(db, "users"), where("cardSlug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return {
        email: userData.email,
        name: userData.name,
        cardSlug: userData.cardSlug,
        password: "", // No password for Google users
        slugChanges: userData.slugChanges || 0,
      };
    }
  } catch (error) {
    console.error("Error fetching session from Firestore:", error);
  }

  return null;
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
