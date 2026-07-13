import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { productImage, orderUrl, OrderButton, ProductPlaceholder, CatalogLabel } from "./product-parts";

/**
 * Stall: a lively local-shop feed. A bright gradient banner, then big
 * full-width product cards with prices and WhatsApp ordering — energetic and
 * tap-friendly for local sellers.
 */
export function StallLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;
  const showServices =
    card.services.length > 0 &&
    (card.sectionsOrder == null || card.sectionsOrder.includes("services"));

  return (
    <div className={shellBase}>
      {/* Bright shop banner */}
      <CardHeaderSlot card={card} accent={accent}>
        <div
          className="relative flex flex-col items-center px-6 pb-7 pt-9 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
        >
          <Avatar
            name={card.name}
            logoText={card.logoText}
            image={card.avatarImage}
            accent="#ffffff33"
            size={64}
            ring={false}
            rounded={radius}
            className="ring-2 ring-white/50"
          />
          <h1 className="mt-3 text-xl font-bold leading-tight">{card.company}</h1>
          <p className="text-sm text-white/85">{card.title}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Order on WhatsApp
          </span>
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 px-6 py-6">
        <CardActions card={card} accent={accent} />

        {showServices && (
          <div>
            <CatalogLabel accent={accent}>Today&apos;s picks</CatalogLabel>
            <div className="space-y-4">
              {card.services.map((p, i) => {
                const img = productImage(card, p, i);
                return (
                  <div key={p.title + i} className="overflow-hidden rounded-2xl border border-border bg-white">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <ProductPlaceholder accent={accent} />
                      )}
                      {p.price && (
                        <span
                          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-sm font-bold text-white shadow-sm"
                          style={{ backgroundColor: accent }}
                        >
                          {p.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{p.title}</p>
                        {p.description && (
                          <p className="truncate text-xs text-slate-500">{p.description}</p>
                        )}
                      </div>
                      <div className="w-28 shrink-0">
                        <OrderButton href={orderUrl(card, p.title)} accent={accent} />
                      </div>
                    </div>
                  </div>
                );
              })}
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
