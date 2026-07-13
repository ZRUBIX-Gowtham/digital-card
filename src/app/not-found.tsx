import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/marketing/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface bg-grid px-6 text-center">
      <Logo />
      <p className="mt-8 text-6xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-2xl font-bold text-foreground">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        The card or page you&apos;re looking for may have moved or never existed.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/templates" variant="outline">
          Browse templates
        </ButtonLink>
      </div>
      <Link href="/contact" className="mt-6 text-sm text-muted hover:text-brand">
        Need help? Contact us
      </Link>
    </main>
  );
}
