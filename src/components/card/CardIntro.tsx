"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, Globe } from "lucide-react";
import type { CardData, IntroStyle } from "@/types/card";

/**
 * A one-time loading splash shown while a public card page loads. It animates
 * in, holds for a few seconds, then reveals the full page rendered underneath.
 * Purely decorative: the real page content is already in the DOM below, so this
 * never blocks reading or SEO. Plays on every page load and is skipped for
 * reduced-motion users. The owner picks the design (`card.introStyle`).
 */
export function CardIntro({ card, accent }: { card: CardData; accent: string }) {
  const style: IntroStyle = card.introStyle ?? "card";
  // `null` until we know whether to show it (avoids a flash on repeat visits).
  const [phase, setPhase] = useState<"in" | "out" | "done" | null>(null);
  // Guards the "should we run?" decision so it's made only once per mount.
  // Without this, React StrictMode's double-invoked effect sees the "seen" flag
  // it set on the first pass and wrongly skips the splash on the second.
  const startedRef = useRef(false);

  useEffect(() => {
    if (style === "none") {
      setPhase("done");
      return;
    }
    if (!startedRef.current) {
      // Plays on every page load / refresh. Only skipped for reduced-motion
      // users (accessibility).
      const reduce = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        setPhase("done");
        return;
      }
      startedRef.current = true;
      setPhase("in");
    }
    // Timers are (re)created on every run so a StrictMode cleanup can't leave
    // the splash stuck on screen.
    document.body.style.overflow = "hidden";
    const toOut = setTimeout(() => setPhase("out"), 4300);
    const toDone = setTimeout(() => setPhase("done"), 5000);
    return () => {
      clearTimeout(toOut);
      clearTimeout(toDone);
      document.body.style.overflow = "";
    };
  }, [style]);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === null || phase === "done" || style === "none") return null;

  return (
    <IntroStage
      style={style}
      card={card}
      accent={accent}
      out={phase === "out"}
      className="fixed inset-y-0 left-1/2 z-[100] w-full max-w-[430px] -translate-x-1/2"
    />
  );
}

/** Compute avatar-fallback initials from the card's brand text. */
function initialsFor(card: CardData): string {
  const src = card.logoText || card.company || card.name || "";
  return (
    src
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

/** Shared dark backdrop so every design looks consistent. */
function introBg(dark: boolean): string {
  return dark ? "bg-black" : "bg-slate-950";
}

/**
 * The visual stage of a loading splash — background + the chosen design. Used
 * full-screen by the live page and inside a phone frame by the editor preview.
 * `out` triggers the exit (reveal) animation; `className` positions it.
 */
export function IntroStage({
  style,
  card,
  accent,
  out,
  className = "",
}: {
  style: IntroStyle;
  card: CardData;
  accent: string;
  out: boolean;
  className?: string;
}) {
  const dark = card.theme === "dark";
  const initials = initialsFor(card);
  if (style === "none") return null;
  return (
    <div
      aria-hidden
      className={`ci-overlay flex items-center justify-center overflow-hidden px-6 ${
        out ? "ci-overlay-out" : ""
      } ${introBg(dark)} ${className}`}
    >
      {style === "card" && (
        <CardSplash card={card} accent={accent} initials={initials} />
      )}
      {style === "spotlight" && (
        <Spotlight card={card} accent={accent} initials={initials} dark={dark} />
      )}
      {style === "curtain" && (
        <Curtain card={card} accent={accent} initials={initials} />
      )}
      {style === "minimal" && (
        <Minimal card={card} accent={accent} initials={initials} dark={dark} />
      )}
      {style === "ripple" && (
        <Ripple card={card} accent={accent} initials={initials} />
      )}
    </div>
  );
}

type SplashProps = {
  card: CardData;
  accent: string;
  initials: string;
  dark?: boolean;
};

/**
 * The shared compact business card. Every design uses this same card as its
 * centerpiece so they all look consistent — only the surrounding animation
 * (passed via `anim` on the card, plus each variant's backdrop flourish)
 * differs. `anim` is the CSS entrance class, e.g. "ci-card" or "ci-rise".
 */
function MiniCard({
  card,
  accent,
  initials,
  anim = "ci-rise",
}: SplashProps & { anim?: string }) {
  const { contact } = card;
  return (
    <div
      className={`relative z-10 w-full max-w-[210px] overflow-hidden rounded-xl p-3 shadow-2xl ${anim}`}
      style={{
        backgroundColor: accent,
        boxShadow: `0 20px 50px -16px ${accent}80, 0 6px 18px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Corner flourish + gloss sweep */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ci-shine absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 blur-[2px]" />
      </div>

      {/* Header: name/title left, avatar right — never overlap */}
      <div className="relative flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-extrabold leading-tight text-white">
            {card.name}
          </p>
          {card.title && (
            <p className="mt-0.5 truncate text-[8px] font-semibold uppercase tracking-[0.1em] text-white/75">
              {card.title}
            </p>
          )}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white/10">
          <Logo card={card} initials={initials} className="text-xs" />
        </div>
      </div>

      <div className="relative mt-2.5 h-px w-full bg-white/20" />

      <div className="relative mt-2.5 space-y-1.5">
        {contact.phone && <Row icon={Phone} text={contact.phone} />}
        {contact.email && <Row icon={Mail} text={contact.email} />}
        {(contact.website || card.company) && (
          <Row icon={Globe} text={contact.website || card.company} />
        )}
      </div>

      <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-white/20">
        <div className="ci-shine h-full w-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

/* ---------------- 1. Business card — card flips in ---------------- */
function CardSplash(p: SplashProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute h-[320px] w-[320px] rounded-full opacity-40 blur-[80px]"
        style={{ backgroundColor: p.accent }}
      />
      <MiniCard {...p} anim="ci-card" />
    </>
  );
}

/* ---------------- 2. Spotlight — pulsing rings behind the card ---------------- */
function Spotlight(p: SplashProps) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        className="ci-pulse-ring absolute h-52 w-52 rounded-full"
        style={{ backgroundColor: `${p.accent}33` }}
      />
      <span
        className="ci-pulse-ring absolute h-52 w-52 rounded-full"
        style={{ backgroundColor: `${p.accent}33`, animationDelay: "1s" }}
      />
      <MiniCard {...p} anim="ci-rise" />
    </div>
  );
}

/* ---------------- 3. Curtain — accent panel lifts to reveal the card ------- */
function Curtain(p: SplashProps) {
  return (
    <>
      <MiniCard {...p} anim="ci-rise" />
      <div
        className="ci-curtain-in absolute inset-0 z-20"
        style={{ backgroundColor: p.accent }}
      />
    </>
  );
}

/* ---------------- 4. Minimal — clean fade-up, no flourish ---------------- */
function Minimal(p: SplashProps) {
  return <MiniCard {...p} anim="ci-rise" />;
}

/* ---------------- 5. Ripple — accent burst behind the card ---------------- */
function Ripple(p: SplashProps) {
  return (
    <>
      <div
        className="ci-ripple absolute left-1/2 top-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{ backgroundColor: p.accent }}
      />
      <MiniCard {...p} anim="ci-rise" />
    </>
  );
}

/* ---------------- shared bits ---------------- */
function Logo({
  card,
  initials,
  className = "",
}: {
  card: CardData;
  initials: string;
  className?: string;
}) {
  if (card.avatarImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={card.avatarImage}
        alt=""
        className="h-full w-full rounded-full object-cover"
      />
    );
  }
  return (
    <span className={`font-extrabold tracking-wide text-white ${className}`}>
      {initials}
    </span>
  );
}

function Row({ icon: Icon, text }: { icon: typeof Phone; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10.5px] text-white/90">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/15">
        <Icon className="h-2.5 w-2.5" />
      </span>
      <span className="min-w-0 truncate">{text}</span>
    </div>
  );
}
