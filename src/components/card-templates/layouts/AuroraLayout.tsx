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
 * Aurora: a sleek, centered dark hero. A soft full-width aurora gradient washes
 * behind a glowing avatar and centered name — modern and confident, then clean
 * light content below.
 */
export function AuroraLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div className={`${shellBase} border-slate-800`}>
      {/* Centered dark hero with aurora band */}
      <CardHeaderSlot card={card} accent={accent}>
        <div className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-10 text-center text-white">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-[130%] -translate-x-[12%] rounded-[50%] opacity-40 blur-3xl"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }}
          />
          <div className="relative flex flex-col items-center">
            <div
              className={`${radius} p-[3px]`}
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
            >
              <Avatar
                name={card.name}
                logoText={card.logoText}
                image={card.avatarImage}
                accent={accent}
                size={88}
                ring={false}
                rounded={radius}
                className="ring-2 ring-slate-950"
              />
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">{card.name}</h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: accent2 }}>
              {card.title}
            </p>
            <p className="text-sm text-white/60">{card.company}</p>
            {card.tagline && (
              <p className="mt-3 max-w-[34ch] text-sm text-white/70">{card.tagline}</p>
            )}
          </div>
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 px-6 py-7">
        <SocialsRow card={card} accent={accent} />
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
