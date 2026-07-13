import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Bento: a modern tile-grid hero. A colourful accent tile holds the avatar
 * beside a name tile, with a wide tagline tile beneath — playful and current,
 * a great fit for content creators.
 */
export function BentoLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div className={`${shellBase} p-4 sm:p-5`}>
      {/* Bento hero grid */}
      <CardHeaderSlot card={card} accent={accent}>
        <div className="grid grid-cols-3 gap-2.5">
          <div
            className="col-span-1 flex items-center justify-center rounded-3xl p-3"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
          >
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={64}
              ring={false}
              rounded={radius}
              className="ring-2 ring-white/40"
            />
          </div>
          <div className="col-span-2 flex flex-col justify-center rounded-3xl border border-border bg-surface-2/40 p-4">
            <h1 className="text-lg font-bold leading-tight text-foreground">
              {card.name}
            </h1>
            <p className="text-sm font-semibold" style={{ color: accent }}>
              {card.title}
            </p>
            <p className="truncate text-sm text-slate-500">{card.company}</p>
          </div>
          {card.tagline && (
            <div
              className="col-span-3 rounded-3xl p-4 text-sm font-medium leading-snug"
              style={{ backgroundColor: `${accent}12`, color: accent }}
            >
              “{card.tagline}”
            </div>
          )}
        </div>
      </CardHeaderSlot>

      <div className="mt-4">
        <SocialsRow card={card} accent={accent} />
      </div>

      <div className="mt-5 space-y-5">
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
