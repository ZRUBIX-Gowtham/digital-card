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
 * Aside: a horizontal profile hero — the avatar sits beside the name on a soft
 * accent-tinted rounded panel, topped by a slim accent strip. Warm and calm,
 * a good fit for clinics and wellness.
 */
export function AsideLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  return (
    <div className={`${shellBase} p-5 sm:p-6`}>
      {/* Profile panel */}
      <CardHeaderSlot card={card} accent={accent}>
        <div
          className="overflow-hidden rounded-3xl border border-border"
          style={{ backgroundColor: `${accent}0f` }}
        >
          <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
          <div className="flex items-center gap-4 p-5">
            <div className={`shrink-0 ${radius} bg-white p-1 shadow-sm`}>
              <Avatar
                name={card.name}
                logoText={card.logoText}
                image={card.avatarImage}
                accent={accent}
                size={72}
                ring={false}
                rounded={radius}
              />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground">
                {card.name}
              </h1>
              <p className="truncate text-sm font-semibold" style={{ color: accent }}>
                {card.title}
              </p>
              <p className="truncate text-sm text-slate-500">{card.company}</p>
            </div>
          </div>
          {card.tagline && (
            <p className="px-5 pb-5 text-sm italic text-slate-500">
              “{card.tagline}”
            </p>
          )}
        </div>
      </CardHeaderSlot>

      <div className="mt-5">
        <SocialsRow card={card} accent={accent} />
      </div>

      <div className="mt-6 space-y-6">
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} galleryColumns={2} />
      </div>
    </div>
  );
}
