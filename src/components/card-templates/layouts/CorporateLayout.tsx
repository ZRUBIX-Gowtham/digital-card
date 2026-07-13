import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import {
  type LayoutProps,
  avatarRadius,
  headerBackground,
  shellBase,
  fmtHost,
} from "./shared";

/** Corporate: image/gradient header with overlay + a structured info grid. */
export function CorporateLayout({ card, accent, style }: LayoutProps) {
  const bg = headerBackground(style, accent);
  const showImage = style.header === "image" && !!card.coverImage;
  const radius = avatarRadius(style);

  const facts = [
    card.contact.phone && { icon: Phone, value: card.contact.phone },
    card.contact.email && { icon: Mail, value: card.contact.email },
    card.contact.website && { icon: Globe, value: fmtHost(card.contact.website) },
    card.contact.address && { icon: MapPin, value: card.contact.address },
  ].filter(Boolean) as { icon: typeof Phone; value: string }[];

  return (
    <div className={shellBase}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className={`relative h-40 w-full ${bg.className}`} style={bg.style}>
          {showImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.coverImage} alt="" className="h-full w-full object-cover" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, ${accent}22, ${accent}ee)` }}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5 text-white">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent="#ffffff33"
              size={56}
              rounded={radius}
            />
            <div className="pb-0.5">
              <p className="text-lg font-bold leading-tight">{card.company}</p>
              {card.businessType && (
                <p className="text-xs text-white/85">{card.businessType}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeaderSlot>

      <div className="px-6 py-6">
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{card.name}</p>
          <p className="text-xs text-slate-500">{card.title}</p>
        </div>

        {facts.length > 0 && (
          <div className="mt-5 space-y-3">
            {facts.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="truncate text-slate-600">{f.value}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 space-y-6">
          <SocialsRow card={card} accent={accent} />
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} />
        </div>
      </div>
    </div>
  );
}
