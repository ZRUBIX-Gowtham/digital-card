import { ShoppingBag, MessageCircle } from "lucide-react";
import type { CardData, Service } from "@/types/card";

export function orderUrl(card: CardData, title: string): string | undefined {
  if (!card.contact.whatsapp) return undefined;
  return `https://wa.me/${card.contact.whatsapp}?text=${encodeURIComponent(
    `Hi, I'm interested in "${title}".`,
  )}`;
}

export function productImage(
  card: CardData,
  product: Service,
  index: number,
): string | undefined {
  return product.image ?? card.gallery[index]?.src;
}

export function OrderButton({
  href,
  accent,
  compact,
  dense,
}: {
  href?: string;
  accent: string;
  compact?: boolean;
  /** Full-width but small — used in the compact grid cards. */
  dense?: boolean;
}) {
  if (!href) return null;
  const size = compact
    ? "h-8 px-3 text-xs"
    : dense
      ? "w-full py-1.5 text-xs"
      : "w-full py-2.5 text-sm";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 ${size}`}
      style={{ backgroundColor: accent }}
    >
      <MessageCircle className={dense ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Order
    </a>
  );
}

export function ProductPlaceholder({ accent }: { accent: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ backgroundColor: `${accent}12` }}
    >
      <ShoppingBag className="h-8 w-8" style={{ color: accent }} />
    </div>
  );
}

/** Compact product card for grid catalogues. */
export function ProductCard({
  card,
  product,
  accent,
  index,
}: {
  card: CardData;
  product: Service;
  accent: string;
  index: number;
}) {
  const img = productImage(card, product, index);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-square overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <ProductPlaceholder accent={accent} />
        )}
        {product.price && (
          <span
            className="absolute left-2 top-2 rounded-full bg-white/95 px-1.5 py-0.5 text-[11px] font-bold shadow-sm"
            style={{ color: accent }}
          >
            {product.price}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 min-h-[2rem] text-xs font-semibold leading-tight text-foreground">
          {product.title}
        </p>
        {product.description && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <OrderButton href={orderUrl(card, product.title)} accent={accent} dense />
        </div>
      </div>
    </div>
  );
}

/** Horizontal product row for list catalogues. */
export function ProductRow({
  card,
  product,
  accent,
  index,
}: {
  card: CardData;
  product: Service;
  accent: string;
  index: number;
}) {
  const img = productImage(card, product, index);
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-white p-2.5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <ProductPlaceholder accent={accent} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-sm font-semibold leading-tight text-foreground">
          {product.title}
        </p>
        {product.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          {product.price && (
            <span className="text-base font-bold" style={{ color: accent }}>
              {product.price}
            </span>
          )}
          <OrderButton href={orderUrl(card, product.title)} accent={accent} compact />
        </div>
      </div>
    </div>
  );
}

/** Large featured product used at the top of storefront layouts. */
export function ProductHero({
  card,
  product,
  accent,
}: {
  card: CardData;
  product: Service;
  accent: string;
}) {
  const img = productImage(card, product, 0);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <ProductPlaceholder accent={accent} />
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: accent }}
        >
          Featured
        </span>
      </div>
      <div className="p-4">
        <p className="text-base font-bold leading-tight text-foreground">
          {product.title}
        </p>
        {product.description && (
          <p className="mt-1 text-sm text-slate-500">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          {product.price && (
            <span className="text-xl font-bold" style={{ color: accent }}>
              {product.price}
            </span>
          )}
          <div className="w-32">
            <OrderButton href={orderUrl(card, product.title)} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogLabel({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" style={{ color: accent }} />
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {children}
      </h3>
    </div>
  );
}
