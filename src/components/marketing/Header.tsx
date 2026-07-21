"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Pin, PinOff, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "./Logo";

const FREEZE_NAV_KEY = "marketing:freeze-nav";

export function Header({ isAuthed = false }: { isAuthed?: boolean }) {
  const [open, setOpen] = useState(false);
  const [frozen, setFrozen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(FREEZE_NAV_KEY);
    if (stored !== null) setFrozen(stored === "true");
  }, []);

  const toggleFrozen = () => {
    setFrozen((v) => {
      const next = !v;
      window.localStorage.setItem(FREEZE_NAV_KEY, String(next));
      return next;
    });
  };

  const cta = isAuthed
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/signin", label: "Create Your Card" };
  return (
    <header
      className={`${
        frozen ? "sticky top-0" : "relative"
      } z-50 border-b border-border/70 bg-surface/80 backdrop-blur`}
    >
      <Container className="flex h-[59px] items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href={cta.href} size="sm">
            {cta.label}
          </ButtonLink>
          <FreezeNavButton frozen={frozen} onToggle={toggleFrozen} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <FreezeNavButton frozen={frozen} onToggle={toggleFrozen} />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href={cta.href} className="mt-2" size="sm">
              {cta.label}
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}

function FreezeNavButton({
  frozen,
  onToggle,
}: {
  frozen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={frozen}
      title={frozen ? "Unfreeze navigation bar" : "Freeze navigation bar"}
      aria-label={frozen ? "Unfreeze navigation bar" : "Freeze navigation bar"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      {frozen ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
    </button>
  );
}
