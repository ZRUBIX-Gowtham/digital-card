/**
 * Dummy users for Phase-1 testing only. Passwords are plain text on purpose —
 * this is a local mock. Phase 2 replaces this with real auth + hashed passwords.
 * Each user owns one card (by `cardSlug`, which is also their public URL: /{slug}).
 */
export interface DummyUser {
  email: string;
  password: string;
  name: string;
  cardSlug: string;
  slugChanges?: number;
}

export const users: DummyUser[] = [
  {
    email: "demo@digitalsite.com",
    password: "demo1234",
    name: "Aarav Mehta",
    cardSlug: "aarav-mehta",
  },
  {
    email: "sara@digitalsite.com",
    password: "demo1234",
    name: "Sara Khan",
    cardSlug: "sara-khan",
  },
  {
    email: "kabir@digitalsite.com",
    password: "demo1234",
    name: "Kabir Nair",
    cardSlug: "pixel-forge",
  },
];

export function getUserByEmail(email: string): DummyUser | undefined {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

export function getUserBySlug(cardSlug: string): DummyUser | undefined {
  return users.find((u) => u.cardSlug === cardSlug);
}
