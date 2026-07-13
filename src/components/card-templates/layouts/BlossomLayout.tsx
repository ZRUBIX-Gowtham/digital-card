import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Blossom: a premium personal profile. A full diagonal gradient hero carries
 * the portrait and name in white, then a clean white content sheet lifts up
 * over it — polished and modern, made for personal brands.
 */
export function BlossomLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div className={shellBase}>
      {/* Gradient hero */}
      <CardHeaderSlot card={card} accent={accent}>
        <div
          className="relative overflow-hidden px-6 pb-16 pt-11 text-center text-white"
          style={{ background: `linear-gradient(140deg, ${accent}, ${accent2})` }}
        >
          {/* Soft light sheen for depth */}
          <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

          <div className="relative flex flex-col items-center">
            <div className="rounded-full bg-white/15 p-1 ring-1 ring-white/40 backdrop-blur-sm">
              <Avatar
                name={card.name}
                logoText={card.logoText}
                image={card.avatarImage}
                accent={accent}
                size={96}
                ring={false}
                rounded={radius}
                className="ring-2 ring-white/70"
              />
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">{card.name}</h1>
            {card.title && (
              <p className="mt-1 text-sm font-medium text-white/85">{card.title}</p>
            )}
            {card.tagline && (
              <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-white/75">
                {card.tagline}
              </p>
            )}
          </div>
        </div>
      </CardHeaderSlot>

      {/* White content sheet lifted over the hero */}
      <div className="relative z-10 -mt-8 space-y-6 rounded-t-[26px] bg-white px-6 py-7 shadow-[0_-12px_30px_-16px_rgba(0,0,0,0.25)]">
        <SocialsRow card={card} accent={accent} />
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
