import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

/**
 * Shared, attractive page hero used across all marketing/inner pages.
 * Glassy white theme: dotted grid + soft colour blobs behind a gradient
 * headline, with an optional badge, description and action row.
 */
export function PageHero({
  badge,
  title,
  highlight,
  description,
  align = "center",
  backgroundImage,
  children,
}: {
  badge?: ReactNode;
  title: ReactNode;
  /** Gradient-highlighted phrase appended after the title. */
  highlight?: string;
  description?: ReactNode;
  align?: "center" | "left";
  backgroundImage?: string;
  /** Action buttons rendered below the copy. */
  children?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden border-b border-border min-h-[480px] flex items-center">
      {/* Background Image & Overlay */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Subtle gradient overlay to soften edges and fade into content below.
             Light mode fades to white; dark mode fades to pure black. */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/75 to-background/95 backdrop-blur-[2px] dark:from-black/70 dark:via-black/80 dark:to-black" />
        </>
      ) : (
        <>
          {/* glassy ambient decoration — light mode only, so dark stays pure black */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 dark:hidden" />
          <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-100 opacity-60 blur-3xl dark:hidden" />
          <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl dark:hidden" />
        </>
      )}

      <Container
        className={`relative z-10 w-full py-16 sm:py-20 ${centered ? "text-center" : "text-left"}`}
      >
        {badge && (
          <div className={centered ? "flex justify-center" : ""}>
            <Badge>{badge}</Badge>
          </div>
        )}
        <h1
          className={`mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl ${
            centered ? "mx-auto max-w-3xl" : "max-w-3xl"
          }`}
        >
          {title}
          {highlight && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </h1>
        {description && (
          <p
            className={`mt-6 text-lg sm:text-xl leading-relaxed text-foreground font-medium ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={`mt-8 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}
          >
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
