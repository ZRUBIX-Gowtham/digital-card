/**
 * Per-section display styles. Sections listed here let the user pick how the
 * items are laid out: a static list/grid, a manual carousel, or an auto-playing
 * carousel. Sections not listed have a single fixed layout.
 */

export interface DisplayOption {
  value: string;
  label: string;
}

/** Which sections support display styles, and the choices offered for each. */
export const DISPLAY_STYLE_OPTIONS: Record<string, DisplayOption[]> = {
  testimonials: [
    { value: "list", label: "List" },
    { value: "carousel", label: "Carousel" },
    { value: "carousel-auto", label: "Auto-play" },
  ],
  team: [
    { value: "grid", label: "Grid" },
    { value: "carousel", label: "Carousel" },
    { value: "carousel-auto", label: "Auto-play" },
  ],
  brands: [
    { value: "grid", label: "Grid" },
    { value: "carousel", label: "Carousel" },
    { value: "carousel-auto", label: "Auto-play" },
  ],
  gallery: [
    { value: "grid", label: "Grid" },
    { value: "carousel", label: "Carousel" },
    { value: "carousel-auto", label: "Auto-play" },
  ],
  youtubeVideos: [
    { value: "list", label: "List" },
    { value: "carousel", label: "Carousel" },
    { value: "carousel-auto", label: "Auto-play" },
  ],
};

/** Fallback style used when the card hasn't set one for a section. */
export const DEFAULT_SECTION_STYLE: Record<string, string> = {
  testimonials: "carousel",
  youtubeVideos: "carousel",
  team: "grid",
  brands: "grid",
  gallery: "grid",
};

/** Resolve the effective display style for a section on a given card. */
export function effectiveSectionStyle(
  sectionStyles: Record<string, string> | undefined,
  sectionId: string,
): string {
  return sectionStyles?.[sectionId] ?? DEFAULT_SECTION_STYLE[sectionId] ?? "grid";
}

/** True when the style should render a carousel (manual or auto). */
export function isCarousel(style: string): boolean {
  return style === "carousel" || style === "carousel-auto";
}
