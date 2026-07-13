import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  SocialsRow,
  OrderedSections,
} from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/** Minimal: quiet, left-aligned, generous whitespace, a thin accent rule. */
export function MinimalLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  return (
    <div className={`${shellBase} p-7 sm:p-9`}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className="h-1 w-12 rounded-full" style={{ backgroundColor: accent }} />
        <div className="mt-6 flex items-center gap-4">
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent={accent}
            size={64}
            ring={false}
            rounded={radius}
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {card.name}
            </h1>
            <p className="text-sm text-slate-500">
              {card.title}
              {card.company && card.company !== "Independent"
                ? ` · ${card.company}`
                : ""}
            </p>
          </div>
        </div>
      </CardHeaderSlot>

      {card.tagline && (
        <p className="mt-6 text-lg font-medium leading-snug text-foreground">
          {card.tagline}
        </p>
      )}

      <div className="mt-6">
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
