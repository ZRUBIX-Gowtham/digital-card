import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, headerBackground, shellBase } from "./shared";

/** Cover header + a large, clearly-visible centered avatar overlapping it. */
export function CoverLayout({ card, accent, style }: LayoutProps) {
  const bg = headerBackground(style, accent);
  const showImage = style.header === "image" && !!card.coverImage;
  const radius = avatarRadius(style);

  return (
    <div className={shellBase}>
      <CardHeaderSlot card={card} accent={accent}>
        {/* Cover band */}
        <div className={`relative h-28 w-full ${bg.className}`} style={bg.style}>
          {showImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          {showImage && <div className="absolute inset-0 bg-black/10" />}
        </div>

        {/* Avatar sits centered, overlapping the cover, with a solid white plate */}
        <div className="relative z-10 flex justify-center">
          <div
            className={`-mt-12 ${radius} bg-white p-1.5 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.4)]`}
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

        <div className="flex flex-col items-center px-6 pt-3">
          <h1 className="text-center text-xl font-bold text-foreground">
            {card.name}
          </h1>
          <p className="text-center text-sm font-semibold" style={{ color: accent }}>
            {card.title}
          </p>
          <p className="text-center text-sm text-slate-500">{card.company}</p>
          {card.tagline && (
            <p className="mt-2 text-center text-sm italic text-slate-500">
              “{card.tagline}”
            </p>
          )}
        </div>
      </CardHeaderSlot>

      <div className="flex flex-col items-center px-6 pb-8 pt-5">
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
