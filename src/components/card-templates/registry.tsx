import type { CardData, LayoutId } from "@/types/card";
import { getTemplate, templates } from "@/data/templates";
import { availableLanguages } from "@/lib/i18n";
import { CardNav } from "@/components/card/CardNav";
import { FloatingContact } from "@/components/card/FloatingContact";
import { CardFooter } from "@/components/card/CardFooter";
import type { LayoutProps } from "./layouts/shared";
import { CoverLayout } from "./layouts/CoverLayout";
import { SidebarLayout } from "./layouts/SidebarLayout";
import { SpotlightLayout } from "./layouts/SpotlightLayout";
import { MinimalLayout } from "./layouts/MinimalLayout";
import { CorporateLayout } from "./layouts/CorporateLayout";
import { ProductLayout } from "./layouts/ProductLayout";
import { CatalogLayout } from "./layouts/CatalogLayout";
import { StorefrontLayout } from "./layouts/StorefrontLayout";
import { LinkbioLayout } from "./layouts/LinkbioLayout";
import { AsideLayout } from "./layouts/AsideLayout";
import { EditorialLayout } from "./layouts/EditorialLayout";
import { ShowcaseLayout } from "./layouts/ShowcaseLayout";
import { AuroraLayout } from "./layouts/AuroraLayout";
import { BentoLayout } from "./layouts/BentoLayout";
import { MastheadLayout } from "./layouts/MastheadLayout";
import { LookbookLayout } from "./layouts/LookbookLayout";
import { StallLayout } from "./layouts/StallLayout";
import { HaloLayout } from "./layouts/HaloLayout";
import { FolioLayout } from "./layouts/FolioLayout";
import { BlossomLayout } from "./layouts/BlossomLayout";
import { HorizonLayout } from "./layouts/HorizonLayout";
import { NeonLayout } from "./layouts/NeonLayout";
import { GalleryLayout } from "./layouts/GalleryLayout";
import { VideoLayout } from "./layouts/VideoLayout";

const layouts: Record<LayoutId, (p: LayoutProps) => React.ReactNode> = {
  cover: CoverLayout,
  sidebar: SidebarLayout,
  spotlight: SpotlightLayout,
  minimal: MinimalLayout,
  corporate: CorporateLayout,
  product: ProductLayout,
  catalog: CatalogLayout,
  storefront: StorefrontLayout,
  linkbio: LinkbioLayout,
  aside: AsideLayout,
  editorial: EditorialLayout,
  showcase: ShowcaseLayout,
  aurora: AuroraLayout,
  bento: BentoLayout,
  masthead: MastheadLayout,
  lookbook: LookbookLayout,
  stall: StallLayout,
  halo: HaloLayout,
  folio: FolioLayout,
  blossom: BlossomLayout,
  horizon: HorizonLayout,
  neon: NeonLayout,
  gallery: GalleryLayout,
  videos: VideoLayout,
};

/**
 * Render a card using its template. Pass `templateId` to force a specific
 * template (used by the gallery previews); otherwise the card's own template
 * is used and the card's accent override wins.
 */
export function CardRenderer({
  card,
  templateId,
}: {
  card: CardData;
  templateId?: string;
}) {
  const meta = getTemplate(templateId ?? card.templateId) ?? templates[0];
  const Layout = layouts[meta.layout] ?? CoverLayout;
  const accent = templateId
    ? meta.style.accent
    : (card.accent ?? meta.style.accent);
  const zoom = FONT_SCALE[card.fontScale ?? "md"];
  // Show the view count only on real card renders (not forced-template gallery
  // previews) and when the owner hasn't switched it off.
  const showViews = !templateId && card.showViews !== false;
  const views = card.views ?? 0;
  const badgeBg = card.viewsBadgeBg !== false;
  // Card creators choose whether visitors see their card in light or dark. The
  // card always resolves its own light tokens via `.theme-light` so it never
  // follows the app chrome's dark toggle; `.card-dark` then remaps the neutral
  // surfaces to black for dark cards, leaving accent-coloured headers untouched.
  const darkCard = card.theme === "dark";
  // Nav + footer only appear on real card renders (not gallery template
  // thumbnails), and only when the owner hasn't switched them off. The header
  // design lives inside each layout (see the shared CardHeader), so it needs no
  // wiring here.
  const showNav = !templateId && card.showNav !== false;
  const showFooter = !templateId && card.showFooter !== false;
  // Extra published languages surface a switcher in the nav, so the nav bar must
  // render even when the menu and view counter are both switched off.
  const hasLanguages = !templateId && availableLanguages(card).length > 1;
  return (
    <div
      className={`theme-light relative mx-auto flex w-full max-w-[430px] flex-col overflow-x-hidden ${
        darkCard ? " card-dark bg-surface" : "bg-white"
      }`}
      style={zoom === 1 ? undefined : { zoom }}
    >
      {(showNav || showViews || hasLanguages) && (
        <CardNav
          card={card}
          accent={accent}
          showNav={showNav}
          showViews={showViews}
          views={views}
          badgeBg={badgeBg}
        />
      )}
      <div className={showNav || showViews || hasLanguages ? "[&>div]:!rounded-t-none [&>div>div:first-child]:!rounded-t-none" : ""}>
        <Layout card={card} accent={accent} style={meta.style} />
      </div>
      {showFooter && <CardFooter card={card} accent={accent} />}
      {/* Always-on floating contact button. Its `position: fixed` is pinned to
          the viewport on the live card, and to the phone frame in previews
          (the frame's translateZ(0) screen makes it the fixed containing block),
          so it stays glued to the bottom-right in both. Hidden in gallery
          template thumbnails (forced templateId). */}
      {!templateId && card.floatingWidget?.enabled && (
        <FloatingContact card={card} accent={accent} />
      )}
    </div>
  );
}

/** Zoom factor applied to the whole card for each text-size option. */
const FONT_SCALE: Record<NonNullable<CardData["fontScale"]>, number> = {
  sm: 0.9,
  md: 1,
  lg: 1.12,
};
