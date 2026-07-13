import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ClaimUsername } from "@/components/marketing/ClaimUsername";

const avatars = [1, 2, 3, 4];

// Two rows of real template previews, scrolling in opposite directions.
const rowTop = [
  "biz-meridian", "pro-noir", "crea-nova", "shop-luxe", "me-sunset", "biz-onyx", "pro-clinic",
];
const rowBottom = [
  "pro-verdant", "crea-canvas", "shop-boutique", "me-aura", "shop-fresh", "crea-studio", "biz-summit",
];

function Tile({ id }: { id: string }) {
  return (
    <Link
      href={`/preview/${id}`}
      className="group relative h-72 w-56 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:h-80 sm:w-64"
    >
      <img
        src={`/preview-images/${id}.png`}
        alt=""
        loading="lazy"
        className="block h-full w-full rounded-xl bg-surface-2 object-cover object-top"
      />
    </Link>
  );
}

function MarqueeRow({ ids, reverse }: { ids: string[]; reverse?: boolean }) {
  return (
    <div className="marquee-row flex overflow-hidden py-2">
      <div
        className={`flex w-max items-start gap-4 pr-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {[...ids, ...ids].map((id, i) => (
          <Tile key={`${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-8 sm:pt-16">
      {/* Grid texture (light only) */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 dark:hidden" />
      {/* Brand spotlight glow behind the headline */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[520px] max-w-4xl rounded-full bg-brand opacity-[0.14] blur-[130px] dark:opacity-30" />

      {/* Centred copy */}
      <Container className="relative flex flex-col items-center text-center">
        <div className="animate-fade-up flex w-full flex-col items-center">
          <Badge>
            <Sparkles className="h-3.5 w-3.5" /> #1 Digital Business Card
          </Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Your business card,{" "}
            <span className="text-shine">reimagined for a tap.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Create a beautiful digital business card in minutes. Share your
            contact, portfolio, products and payments with a single link or QR
            code — no printing, no app, no waste.
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3">
            <ClaimUsername />
            <p className="text-sm text-muted">
              Free forever · or{" "}
              <Link
                href="/aarav-mehta"
                className="font-semibold text-brand hover:underline"
              >
                view a live demo
              </Link>
            </p>
          </div>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex -space-x-3">
              {avatars.map((n) => (
                <img
                  key={n}
                  src={`/avatars/avatar-${n}.jpg`}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-background object-cover shadow-sm"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-0.5 text-amber-400 sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-medium text-muted">
                Loved by{" "}
                <span className="font-semibold text-foreground">12,000+</span>{" "}
                professionals
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Full-bleed template showcase marquee */}
      <div className="relative mt-16 pb-16">
        <div className="flex flex-col gap-5">
          <MarqueeRow ids={rowTop} />
          <MarqueeRow ids={rowBottom} reverse />
        </div>
        {/* Edge fades so the strip melts into the page */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />
      </div>
    </section>
  );
}
