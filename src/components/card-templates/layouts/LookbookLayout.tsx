import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { type LayoutProps, avatarRadius } from "./shared";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { ProductHero, ProductCard, CatalogLabel } from "./product-parts";

/**
 * Like `shellBase` but WITHOUT `overflow-hidden` — a clipping ancestor would
 * disable the sticky hero. Inner pieces round their own corners instead.
 */
const lookbookShell =
  "relative mx-auto w-full max-w-[430px] min-h-screen sm:min-h-0 sm:rounded-[26px] sm:border sm:border-slate-800 sm:shadow-[0_20px_60px_-20px_rgba(2,6,23,0.6)]";

/**
 * Lookbook: a premium, dark editorial storefront. A sleek black masthead, a
 * large featured piece, then a refined grid — made to make jewellery and
 * luxury goods feel exclusive.
 */
export function LookbookLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const showServices =
    card.services.length > 0 &&
    (card.sectionsOrder == null || card.sectionsOrder.includes("services"));
  const [feature, ...rest] = card.services;
  // When on (default), the hero stays pinned while the content sheet scrolls up
  // over it — a premium parallax reveal.
  const sticky = card.stickyHero !== false;

  return (
    <div className={lookbookShell} style={{ backgroundColor: "#020617" }}>
      {/* White masthead */}
      <CardHeaderSlot card={card} accent={accent}>
        <div className={`bg-white px-6 pb-7 pt-8 text-center text-slate-900 sm:rounded-t-[26px] ${sticky ? "sticky top-0 z-0" : ""}`}>
          <div className="flex justify-center">
            <div className={`${radius} p-[2px]`} style={{ background: `linear-gradient(135deg, ${accent}, ${style.accent2 ?? accent})` }}>
              <Avatar
                name={card.name}
                logoText={card.logoText}
                image={card.avatarImage}
                accent={accent}
                size={64}
                ring={false}
                rounded={radius}
                className="ring-2 ring-slate-950"
              />
            </div>
          </div>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: accent }}>
            {card.title}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-wide">{card.company}</h1>
          <div className="mx-auto mt-3 h-px w-16" style={{ backgroundColor: `${accent}88` }} />
          {card.tagline && (
            <p className="mt-3 text-sm text-slate-500">{card.tagline}</p>
          )}
        </div>
      </CardHeaderSlot>

      {/* Content sheet — scrolls up over the pinned hero */}
      <div className={`relative z-10 space-y-6 rounded-t-[26px] bg-slate-900 px-6 py-7 shadow-[0_-16px_40px_-12px_rgba(0,0,0,0.6)] sm:rounded-b-[26px] ${sticky ? "-mt-6" : ""}`}>
        <CardActions card={card} accent={accent} />

        {showServices && (
          <div className="space-y-4">
            <CatalogLabel accent={accent}>The Collection</CatalogLabel>
            {feature && <ProductHero card={card} product={feature} accent={accent} />}
            {rest.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {rest.map((p, i) => (
                  <ProductCard key={p.title + i} card={card} product={p} accent={accent} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} exclude={["services"]} />
        <SocialsRow card={card} accent={accent} />
      </div>
    </div>
  );
}
