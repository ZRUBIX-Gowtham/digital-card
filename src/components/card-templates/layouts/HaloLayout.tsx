import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Halo: a soft, aesthetic profile. A big centered avatar glows against a gentle
 * tinted wash, with an airy, rounded feel — made for creators and personal
 * brands.
 */
export function HaloLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div
      className={shellBase}
      style={{
        background: `radial-gradient(120% 60% at 50% 0%, ${accent}22, transparent 60%), #ffffff`,
      }}
    >
      <div className="flex flex-col items-center px-6 pb-9 pt-12 text-center">
        {/* Glowing halo behind avatar */}
        <CardHeaderSlot card={card} accent={accent}>
          <div className="relative">
            <span
              className="pointer-events-none absolute inset-0 -z-0 scale-150 rounded-full opacity-60 blur-2xl"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
            />
            <div className={`relative ${radius} bg-white p-1.5 shadow-[0_12px_36px_-12px_rgba(15,23,42,0.35)]`}>
              <Avatar
                name={card.name}
                logoText={card.logoText}
                image={card.avatarImage}
                accent={accent}
                size={108}
                ring={false}
                rounded={radius}
              />
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            {card.name}
          </h1>
          <p className="text-sm font-semibold" style={{ color: accent }}>
            {card.title}
          </p>
          {card.tagline && (
            <p className="mt-3 max-w-[32ch] text-sm text-slate-500">{card.tagline}</p>
          )}
        </CardHeaderSlot>

        <div className="mt-5">
          <SocialsRow card={card} accent={accent} />
        </div>

        <div className="mt-6 w-full space-y-6">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} galleryColumns={2} />
        </div>
      </div>
    </div>
  );
}
