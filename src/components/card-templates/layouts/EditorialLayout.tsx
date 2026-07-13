import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { initials } from "@/lib/utils";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Editorial: elegant and spacious. A large faint monogram sits behind a
 * centered portrait, with the name framed by thin accent rules — a refined,
 * magazine-like feel for consultants and advisors.
 */
export function EditorialLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  return (
    <div className={`${shellBase} px-7 pb-9 pt-10 sm:px-9`}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className="relative flex flex-col items-center">
          {/* Faint background monogram */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-4 select-none text-[128px] font-black leading-none tracking-tighter"
            style={{ color: `${accent}12` }}
          >
            {initials(card.name)}
          </span>

          <div className="relative z-10 flex flex-col items-center">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={92}
              ring={false}
              rounded={radius}
            />

            {/* Name framed by thin rules */}
            <div className="mt-6 flex w-full items-center gap-3">
              <span className="h-px flex-1" style={{ backgroundColor: `${accent}40` }} />
              <h1 className="text-center text-xl font-bold tracking-tight text-foreground">
                {card.name}
              </h1>
              <span className="h-px flex-1" style={{ backgroundColor: `${accent}40` }} />
            </div>

            <p className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: accent }}>
              {card.title}
            </p>
            <p className="text-center text-sm text-slate-500">{card.company}</p>
            {card.tagline && (
              <p className="mt-4 max-w-[34ch] text-center text-sm italic leading-relaxed text-slate-500">
                “{card.tagline}”
              </p>
            )}
          </div>
        </div>
      </CardHeaderSlot>

      <div className="mt-7 flex justify-center">
        <SocialsRow card={card} accent={accent} />
      </div>

      <div className="mt-7 space-y-7">
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
