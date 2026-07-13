"use server";

import { redirect } from "next/navigation";
import { getUserByEmail } from "@/data/users";
import { createSession, destroySession } from "@/lib/auth";

export interface SignInState {
  error?: string;
}

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    return { error: "Invalid email or password. Try the demo details below." };
  }

  await createSession(user.cardSlug);
  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/signin");
}
