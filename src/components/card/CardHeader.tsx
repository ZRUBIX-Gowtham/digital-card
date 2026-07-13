import type { CardData } from "@/types/card";
import { effectiveSectionLayout } from "@/lib/section-layouts";
import { Avatar } from "./Avatar";

/**
 * Shared, template-agnostic card header. Every template can swap its built-in
 * hero for one of these common designs from the editor's Design & Layout hub
 * (the "Header" row) — the same way the About / Footer sections offer designs.
 * When the card's header variant is "default" (or unset) the template keeps its
 * own hero and this component is not used.
 *
 * The header shows identity only (avatar, name, role, company); each template's
 * own social row / actions stay where they are, so nothing is duplicated.
 */

/** The chosen header design, or `null` when the template's own hero should show. */
export function headerOverride(card: CardData): string | null {
  const v = effectiveSectionLayout(card.sectionLayouts, "header");
  return v && v !== "default" ? v : null;
}

/**
 * Wraps a template's built-in hero. When the card has chosen a shared header
 * design, that design renders in place of `children`; otherwise the template's
 * own hero (`children`) is shown unchanged.
 */
export function CardHeaderSlot({
  card,
  accent,
  children,
}: {
  card: CardData;
  accent: string;
  children: React.ReactNode;
}) {
  const variant = headerOverride(card);
  if (!variant) return <>{children}</>;
  return <HeaderBody card={card} accent={accent} variant={variant} />;
}

/** Renders one of the shared header designs. Used by every template layout and
 *  by the editor's live design previews. */
export function HeaderBody({
  card,
  accent,
  variant,
}: {
  card: CardData;
  accent: string;
  variant: string;
}) {
  // Aside — horizontal accent band, avatar left, details right in white.
  if (variant === "aside") {
    return (
      <header
        className="flex items-center gap-3 px-5 pb-5 pt-6 text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}d0)` }}
      >
        <Avatar
          name={card.name}
          logoText={card.logoText}
          image={card.avatarImage}
          accent={accent}
          size={62}
          ring={false}
          rounded="rounded-2xl"
          className="shrink-0"
        />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black leading-tight">{card.name}</h1>
          {card.title && (
            <p className="truncate text-xs font-semibold text-white/90">{card.title}</p>
          )}
          {card.company && <p className="truncate text-xs text-white/70">{card.company}</p>}
        </div>
      </header>
    );
  }

  // Banner — bold full accent gradient, centred, large avatar.
  if (variant === "banner") {
    return (
      <header
        className="flex flex-col items-center px-6 pb-7 pt-8 text-center text-white"
        style={{ background: `linear-gradient(160deg, ${accent}, ${accent}c0)` }}
      >
        <Avatar
          name={card.name}
          logoText={card.logoText}
          image={card.avatarImage}
          accent={accent}
          size={88}
          ring={false}
          rounded="rounded-full"
          className="ring-4 ring-white/30"
        />
        <h1 className="mt-3 text-2xl font-black leading-tight">{card.name}</h1>
        {card.title && <p className="mt-1 text-sm font-semibold text-white/90">{card.title}</p>}
        {card.company && <p className="text-sm text-white/75">{card.company}</p>}
      </header>
    );
  }

  // Modern — edge-to-edge native app style with clean typography and no borders.
  if (variant === "modern") {
    return (
      <header className="bg-surface px-6 pb-5 pt-8">
        <div className="flex flex-col items-center text-center">
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={76}
            ring={false}
            rounded="rounded-[24px]"
            className="mb-4 shadow-sm"
          />
          <h1 className="text-[22px] font-black tracking-tight text-foreground">{card.name}</h1>
          {card.title && (
            <p className="mt-0.5 text-[13px] font-bold" style={{ color: accent }}>
              {card.title}
            </p>
          )}
          {card.company && <p className="mt-1 text-[13px] font-medium text-muted">{card.company}</p>}
        </div>
      </header>
    );
  }

  // Minimal — clean, no fill: a thin accent rule and left-aligned identity.
  if (variant === "minimal") {
    return (
      <header className="bg-surface px-6 pb-5 pt-7">
        <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        <div className="mt-5 flex items-center gap-3.5">
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={58}
            ring={false}
            rounded="rounded-2xl"
            className="shrink-0"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
              {card.name}
            </h1>
            {card.title && (
              <p className="truncate text-sm font-semibold" style={{ color: accent }}>
                {card.title}
              </p>
            )}
            {card.company && <p className="truncate text-sm text-muted">{card.company}</p>}
          </div>
        </div>
      </header>
    );
  }

  // Card — surface with a thin accent strip; avatar left inside a bordered panel.
  if (variant === "card") {
    return (
      <header className="bg-surface px-5 pb-1 pt-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
          <div className="flex items-center gap-3.5 p-4">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={58}
              ring={false}
              rounded="rounded-2xl"
              className="shrink-0"
            />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground">{card.name}</h1>
              {card.title && (
                <p className="truncate text-sm font-semibold" style={{ color: accent }}>
                  {card.title}
                </p>
              )}
              {card.company && <p className="truncate text-xs text-muted">{card.company}</p>}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Cover (default of the 5) — accent cover band with a centred avatar plate.
  return (
    <header className="bg-surface">
      <div
        className="h-24 w-full"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      />
      <div className="flex justify-center">
        <div className="-mt-12 rounded-full bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.4)]">
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={92}
            ring={false}
            rounded="rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col items-center px-6 pb-6 pt-3">
        <h1 className="text-center text-xl font-bold text-foreground">{card.name}</h1>
        {card.title && (
          <p className="text-center text-sm font-semibold" style={{ color: accent }}>
            {card.title}
          </p>
        )}
        {card.company && <p className="text-center text-sm text-muted">{card.company}</p>}
      </div>
    </header>
  );
}
