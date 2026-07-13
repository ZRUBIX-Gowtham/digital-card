import { Star } from "lucide-react";
import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { type LayoutProps, avatarRadius, headerBackground, shellBase } from "./shared";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { ProductHero, ProductCard, CatalogLabel } from "./product-parts";

/** Storefront: a shop-landing look — banner, featured product, then a grid. */
export function StorefrontLayout({ card, accent, style }: LayoutProps) {
  const bg = headerBackground(style, accent);
  const showImage = style.header === "image" && !!card.coverImage;
  const radius = avatarRadius(style);
  const [featured, ...rest] = card.services;

  return (
    <div className={shellBase}>
      {/* Banner */}
      <CardHeaderSlot card={card} accent={accent}>
        <div className={`relative px-6 pb-8 pt-9 text-white ${bg.className}`} style={bg.style}>
          {showImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}
          <div className="relative flex flex-col items-center text-center">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent="#ffffff33"
              size={64}
              ring={false}
              rounded={radius}
              className="ring-2 ring-white/40"
            />
            <p className="mt-3 text-xl font-bold">{card.company}</p>
            {card.tagline && (
              <p className="mt-1 max-w-[18rem] text-sm text-white/85">{card.tagline}</p>
            )}
            <div className="mt-2 flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
              <span className="ml-1 text-xs text-white/80">Trusted seller</span>
            </div>
          </div>
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 px-6 py-6">
        <CardActions card={card} accent={accent} />

        {featured && (card.sectionsOrder === undefined || card.sectionsOrder === null || card.sectionsOrder.includes("services")) && (
          <div>
            <ProductHero card={card} product={featured} accent={accent} />
          </div>
        )}

        {rest.length > 0 && (card.sectionsOrder === undefined || card.sectionsOrder === null || card.sectionsOrder.includes("services")) && (
          <div>
            <CatalogLabel accent={accent}>More products</CatalogLabel>
            <div className="grid grid-cols-2 gap-3">
              {rest.map((p, i) => (
                <ProductCard key={p.title + i} card={card} product={p} accent={accent} index={i + 1} />
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
