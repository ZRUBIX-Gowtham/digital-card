import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { PhotoGallery } from "@/components/card/PhotoGallery";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Gallery: a photo-first template. A compact identity header sits above a large
 * "GALLERY" grid that leads the card (tap any photo to zoom), so the visitor's
 * work/portfolio is the hero — built for photographers, studios & makers.
 */
export function GalleryLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;
  const showGallery =
    card.gallery.length > 0 &&
    (card.sectionsOrder == null || card.sectionsOrder.includes("gallery"));

  return (
    <div className={shellBase}>
      {/* Compact identity header */}
      <CardHeaderSlot card={card} accent={accent}>
        <div
          className="relative flex items-center gap-3 px-5 pb-5 pt-6 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
        >
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={62}
            ring={false}
            rounded={radius}
            className="shrink-0"
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black leading-tight">{card.name}</h1>
            <p className="truncate text-xs font-semibold text-white/90">{card.title}</p>
            <p className="truncate text-xs text-white/70">{card.company}</p>
          </div>
        </div>
      </CardHeaderSlot>

      <div className="px-5 pb-8 pt-5">
        <div className="mt-6">
          <SocialsRow card={card} accent={accent} />
        </div>

        <div className="mt-6 space-y-6">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} />
        </div>
      </div>
    </div>
  );
}
