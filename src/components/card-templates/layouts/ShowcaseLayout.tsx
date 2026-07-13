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
 * Showcase: a vibrant, portfolio-forward layout. A bold gradient banner with
 * oversized typography introduces the work, then a featured gallery mosaic
 * leads — built to make creative studios & designers pop.
 */
export function ShowcaseLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;
  return (
    <div className={shellBase}>
      <CardHeaderSlot card={card} accent={accent}>
        {/* Bold gradient banner */}
        <div
          className="relative px-6 pb-16 pt-10 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
        >
          <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/70">
            {card.company}
          </p>
          <h1 className="relative mt-2 text-3xl font-black leading-[1.05] tracking-tight">
            {card.name}
          </h1>
          <p className="relative mt-1 text-sm font-semibold text-white/90">
            {card.title}
          </p>
          {card.tagline && (
            <p className="relative mt-3 max-w-[36ch] text-sm text-white/80">
              {card.tagline}
            </p>
          )}
        </div>

        {/* Avatar plate overlapping the banner */}
        <div className="relative z-10 -mt-10 px-6">
          <div className={`inline-block ${radius} bg-white p-1.5 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.45)]`}>
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={84}
              ring={false}
              rounded={radius}
            />
          </div>
        </div>
      </CardHeaderSlot>

      <div className="px-6 pb-8 pt-5">
        <SocialsRow card={card} accent={accent} />

        <div className="mt-6 space-y-6">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} />
        </div>
      </div>
    </div>
  );
}
