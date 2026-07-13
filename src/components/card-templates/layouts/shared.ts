import type { CardData, TemplateStyle } from "@/types/card";

export interface LayoutProps {
  card: CardData;
  /** Effective accent (card override or template default). */
  accent: string;
  style: TemplateStyle;
}

/** Map the avatar style option to a rounding class. */
export function avatarRadius(style: TemplateStyle): string {
  switch (style.avatar) {
    case "square":
      return "rounded-xl";
    case "rounded":
      return "rounded-2xl";
    case "circle":
    default:
      return "rounded-full";
  }
}

/** Build a header background style from the template style. */
export function headerBackground(
  style: TemplateStyle,
  accent: string,
): { className: string; style?: React.CSSProperties } {
  switch (style.header) {
    case "gradient":
      return {
        className: "",
        style: {
          background: `linear-gradient(135deg, ${accent}, ${style.accent2 ?? accent})`,
        },
      };
    case "dark":
      return { className: "bg-slate-900" };
    case "plain":
      return { className: "bg-surface" };
    case "image":
    case "solid":
    default:
      return { className: "", style: { backgroundColor: accent } };
  }
}

export const shellBase =
  "mx-auto w-full max-w-[430px] overflow-hidden bg-white min-h-screen sm:min-h-0 sm:rounded-[26px] sm:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]";

export function fmtHost(url?: string): string {
  return (url ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
}
