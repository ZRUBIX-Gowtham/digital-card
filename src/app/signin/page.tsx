import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/marketing/Logo";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your OnlineCard digital business card.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ username?: string }>;
}) {
  // Already signed in? Go straight to the dashboard.
  if (await getSession()) redirect("/dashboard");

  const { username } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface bg-grid px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {username && (
          <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand">
            You&apos;re claiming{" "}
            <span className="font-mono font-semibold">onlinecard.me/{username}</span>{" "}
            — sign in to finish.
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm sm:p-9">
          <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage and share your digital card.
          </p>

          <div className="mt-6">
            <SignInForm />
          </div>


        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have a card yet?{" "}
          <Link href="/templates" className="font-semibold text-brand cursor-pointer">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
