import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Folio: a refined, editorial personal card. A thin accent hairline, a
 * centered portrait, an oversized name and a small ornamental rule — quiet
 * luxury with lots of whitespace. Made for minimalists who still want polish.
 */
export function FolioLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  return (
    <div className={shellBase}>
      {/* Accent hairline across the top edge */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      <div className="flex flex-col items-center px-7 pb-9 pt-10 text-center">
        <CardHeaderSlot card={card} accent={accent}>
          {card.title && (
            <span
              className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: accent }}
            >
              {card.title}
            </span>
          )}

          <div
            className={`${radius} bg-white p-1 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.3)] ring-1 ring-border`}
          >
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={96}
              ring={false}
              rounded={radius}
            />
          </div>

          <h1 className="mt-5 text-[28px] font-bold leading-tight tracking-tight text-foreground">
            {card.name}
          </h1>

          {/* Ornamental rule */}
          <div className="mt-3 flex items-center gap-2">
            <span className="h-px w-8 bg-border" />
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <span className="h-px w-8 bg-border" />
          </div>

          {card.tagline && (
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-slate-500">
              {card.tagline}
            </p>
          )}
        </CardHeaderSlot>

        <div className="mt-6">
          <SocialsRow card={card} accent={accent} />
        </div>

        <div className="mt-7 w-full space-y-6 text-left">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} galleryColumns={2} />
        </div>
      </div>
    </div>
  );
}
