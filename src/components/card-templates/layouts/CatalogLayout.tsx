import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { type LayoutProps, avatarRadius, headerBackground, shellBase } from "./shared";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { ProductRow, CatalogLabel } from "./product-parts";

/** Catalog (list): a menu-style vertical product list — great for services. */
export function CatalogLayout({ card, accent, style }: LayoutProps) {
  const bg = headerBackground(style, accent);
  const radius = avatarRadius(style);

  return (
    <div className={shellBase}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className={`px-6 pb-6 pt-8 text-white ${bg.className}`} style={bg.style}>
          <div className="flex items-center gap-3">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent="#ffffff33"
              size={54}
              ring={false}
              rounded={radius}
            />
            <div>
              <p className="text-lg font-bold leading-tight">{card.company}</p>
              <p className="text-sm text-white/80">{card.title}</p>
            </div>
          </div>
          {card.tagline && <p className="mt-4 text-sm text-white/85">{card.tagline}</p>}
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 px-6 py-6">
        <CardActions card={card} accent={accent} />

        {card.services.length > 0 && (card.sectionsOrder === undefined || card.sectionsOrder === null || card.sectionsOrder.includes("services")) && (
          <div>
            <CatalogLabel accent={accent}>Price list</CatalogLabel>
            <div className="space-y-3">
              {card.services.map((p, i) => (
                <ProductRow key={p.title + i} card={card} product={p} accent={accent} index={i} />
              ))}
            </div>
          </div>
        )}

        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} exclude={["services"]} />
        <SocialsRow card={card} accent={accent} />
      </div>
    </div>
  );
}
