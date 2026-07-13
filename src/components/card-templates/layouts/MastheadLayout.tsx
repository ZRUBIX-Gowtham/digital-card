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
 * Masthead: an editorial, typography-first layout. A tiny role label sits above
 * an oversized name and a bold rule — monochrome and confident, made for
 * writers and minimalists.
 */
export function MastheadLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);

  return (
    <div className={`${shellBase} px-7 pb-9 pt-10 sm:px-9`}>
      <CardHeaderSlot card={card} accent={accent}>
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-slate-400">
          {card.title}
        </p>
        <h1 className="mt-2 text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground">
          {card.name}
        </h1>
        <div className="mt-4 h-1 w-full rounded-full" style={{ backgroundColor: accent }} />

        <div className="mt-4 flex items-center gap-3">
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={44}
            ring={false}
            rounded={radius}
          />
          <p className="text-sm font-medium text-slate-500">{card.company}</p>
        </div>
      </CardHeaderSlot>

      {card.tagline && (
        <p className="mt-5 text-lg font-medium leading-snug text-foreground">
          {card.tagline}
        </p>
      )}

      <div className="mt-6">
        <SocialsRow card={card} accent={accent} />
      </div>

      <div className="mt-6 space-y-7">
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
