import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Horizon: a refined warm-gradient cover. A clean gradient banner with a soft
 * light highlight, a portrait overlapping onto white, and centered details —
 * a polished, professional take for lifestyle personal brands.
 */
export function HorizonLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div className={shellBase}>
      <CardHeaderSlot card={card} accent={accent}>
        {/* Gradient cover band */}
        <div
          className="relative h-32 w-full overflow-hidden"
          style={{ background: `linear-gradient(120deg, ${accent}, ${accent2})` }}
        >
          <span className="pointer-events-none absolute -top-12 right-4 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-black/10 blur-3xl" />
        </div>

        {/* Portrait overlapping onto white */}
        <div className="relative z-10 flex justify-center">
          <div
            className={`-mt-12 ${radius} bg-white p-1.5 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.45)]`}
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
        </div>

        <div className="flex flex-col items-center px-6 pt-3 text-center">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {card.name}
          </h1>
          {card.title && (
            <p className="mt-0.5 text-sm font-semibold" style={{ color: accent }}>
              {card.title}
            </p>
          )}
          {card.tagline && (
            <p className="mt-2 max-w-[32ch] text-sm text-slate-500">{card.tagline}</p>
          )}
        </div>
      </CardHeaderSlot>

      <div className="flex flex-col items-center px-6 pb-8 pt-5 text-center">
        <SocialsRow card={card} accent={accent} />

        <div className="mt-6 w-full space-y-6">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} />
        </div>
      </div>
    </div>
  );
}
