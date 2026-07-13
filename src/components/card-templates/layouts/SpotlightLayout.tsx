import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/** Spotlight: a bold dark hero with a glow, big avatar and a gallery strip. */
export function SpotlightLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  return (
    <div className={`${shellBase} border-slate-800`}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className="relative overflow-hidden bg-slate-900 px-6 pb-6 pt-9 text-white">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40 blur-3xl"
            style={{ backgroundColor: accent }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full opacity-25 blur-3xl"
            style={{ backgroundColor: style.accent2 ?? accent }}
          />
          <div className="relative flex items-center gap-4">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={78}
              ring={false}
              rounded={radius}
              className="ring-2 ring-white/20"
            />
            <div>
              <h1 className="text-xl font-bold">{card.name}</h1>
              <p className="text-sm text-white/70">{card.title}</p>
              <p className="text-sm font-medium text-white/70">{card.company}</p>
            </div>
          </div>
          {card.tagline && (
            <p className="relative mt-5 text-sm text-white/75">{card.tagline}</p>
          )}
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 px-6 py-7">
        <SocialsRow card={card} accent={accent} />
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} />
      </div>
    </div>
  );
}
