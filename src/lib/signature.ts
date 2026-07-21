import type { CardData, SignatureConfig } from "@/types/card";

/**
 * Email-signature engine.
 *
 * Email clients (Gmail, Outlook, Apple Mail) strip <style> blocks, external CSS
 * and most modern layout. The only reliable way to build a signature that
 * survives a copy-paste into an email client is table-based markup with inline
 * styles. Every template below therefore renders to a self-contained HTML
 * string of nested <table>s with inline `style="…"`; the dashboard copies that
 * string to the clipboard as `text/html` so it pastes with formatting intact.
 *
 * We deliberately avoid emoji/SVG icons (they render inconsistently or get
 * stripped) and instead use crisp typographic labels, accent rules and
 * monogram fallbacks — the look that reads as "designed" in every client.
 */

export interface SignatureStyleOpts {
  font?: string;
  textColor?: string;
  bannerImage: string;
  bannerText: string;
  bannerButton: string;
  gallery: string[];
  galleryHeading: string;
}

export interface SignatureTemplateMeta {
  isNew?: boolean;
  premium?: boolean;
  id: string;
  name: string;
  description: string;
  /** Whether this design shows the profile photo. */
  usesPhoto: boolean;
}

export const signatureTemplates: SignatureTemplateMeta[] = [
  { id: "video", name: "Video Layout", description: "Right aligned photo with a YouTube video block at the bottom.", usesPhoto: true, premium: true },
  { id: "exclusive", name: "Exclusive", description: "Inline contacts with bottom banner and quote.", usesPhoto: true, premium: true },
  { id: "promo", name: "Promo", description: "Classic grid with accent stroke icons and banner.", usesPhoto: true, premium: true },
  { id: "pro", name: "Pro", description: "Edge-to-edge accent block with an elegant contact grid.", usesPhoto: true, premium: true },
  { id: "premium", name: "Premium", description: "Premium layout with public images and clean contacts.", usesPhoto: true, isNew: true, premium: true },
  { id: "campaign", name: "Campaign", description: "Logo lockup, letter contacts & social tiles over an image banner with a quote button.", usesPhoto: true, isNew: true, premium: true },
  { id: "banner", name: "Banner", description: "Letter-label contacts over an accent call-to-action banner.", usesPhoto: true, isNew: true, premium: true },
  { id: "boutique", name: "Boutique", description: "Portrait lockup, accent social bar & a 10-image product showcase — built for brands & shops.", usesPhoto: true, isNew: true, premium: true },
  { id: "disclaimer", name: "Disclaimer", description: "Optional photo, bold name lockup, two-column letter contacts, an accent social bar & a legal confidentiality notice.", usesPhoto: true, isNew: true, premium: true },
  { id: "circles", name: "Circles", description: "Logo lockup with accent underline, letter contacts, round social icons & a strip of circular photo thumbnails — great for cafés & shops.", usesPhoto: true, isNew: true, premium: true },
  { id: "portfolio", name: "Portfolio", description: "Round photo, uppercase name lockup, letter contacts, accent social bar & two call-to-action link boxes — for creatives & freelancers.", usesPhoto: true, isNew: true, premium: true },
  { id: "realtor", name: "Realtor", description: "Photo, contacts & brand social tiles above two recent-listing cards with price & specs — built for real-estate agents.", usesPhoto: true, isNew: true, premium: true },
  { id: "listings", name: "Listings", description: "Logo, social icons & a gallery strip — great for realtors & shops.", usesPhoto: true },

  { id: "aurora", name: "Aurora", description: "Framed photo, hairline & an accent footer bar.", usesPhoto: true },
  { id: "executive", name: "Executive", description: "Bold accent rule with an uppercase title lockup.", usesPhoto: true },
  { id: "classic", name: "Classic", description: "Photo beside a divider and a clean contact grid.", usesPhoto: true },
  { id: "modern", name: "Modern", description: "Full accent header band over a white contact body.", usesPhoto: true },
  { id: "split", name: "Split", description: "Accent name panel beside a white contact column.", usesPhoto: true },
  { id: "spotlight", name: "Spotlight", description: "Premium dark card with light text and accent title.", usesPhoto: true },
  { id: "stack", name: "Stack", description: "Centred portrait lockup with contacts underneath.", usesPhoto: true },
  { id: "compact", name: "Compact", description: "Small footprint — tiny photo and a one-line contact row.", usesPhoto: true },
  { id: "corporate", name: "Corporate", description: "Company-led two-column block for teams & B2B.", usesPhoto: true },
  { id: "monogram", name: "Monogram", description: "Compact round-photo lockup with an inline contact row.", usesPhoto: true },
  { id: "refined", name: "Refined", description: "Small photo with a minimal accent side-bar.", usesPhoto: true },
  { id: "minimal", name: "Minimal", description: "Small photo with a quiet one-line layout.", usesPhoto: true },
];

export const DEFAULT_SIGNATURE_TEMPLATE = "premium";

/** Accent colour used when the card has no accent set. */
export const DEFAULT_SIGNATURE_ACCENT = "#4f46e5";

/** Default primary text colour (name + contact values). */
export const DEFAULT_SIGNATURE_TEXT = "#0f172a";

/** Curated accent swatches offered in the editor's colour picker. Includes
 *  black and white; the free-form picker below covers everything else. */
export const SIGNATURE_ACCENTS = [
  "#4f46e5", "#0ea5e9", "#0d9488", "#16a34a", "#ea580c",
  "#e11d48", "#9333ea", "#0f172a", "#64748b", "#ffffff",
] as const;

/** Text-colour swatches offered in the editor's picker. */
export const SIGNATURE_TEXT_COLORS = [
  "#0f172a", "#334155", "#475569", "#64748b", "#1e293b",
  "#3f3f46", "#1e3a8a", "#7c2d12", "#134e4a", "#ffffff",
] as const;

/** Email-safe font stacks offered in the editor. `stack` is the exact
 *  `font-family` value swapped into the rendered signature. */
export const SIGNATURE_FONTS = [
  { label: "Arial", stack: "Arial,Helvetica,sans-serif" },
  { label: "Verdana", stack: "Verdana,Geneva,sans-serif" },
  { label: "Tahoma", stack: "Tahoma,Geneva,sans-serif" },
  { label: "Trebuchet", stack: "'Trebuchet MS',Helvetica,sans-serif" },
  { label: "Georgia", stack: "Georgia,'Times New Roman',serif" },
  { label: "Times", stack: "'Times New Roman',Times,serif" },
  { label: "Courier", stack: "'Courier New',Courier,monospace" },
] as const;

/** The default font stack (matches every template's hard-coded family). */
export const DEFAULT_SIGNATURE_FONT = SIGNATURE_FONTS[0].stack;

export function getSignatureTemplate(id?: string): SignatureTemplateMeta {
  return signatureTemplates.find((t) => t.id === id) ?? signatureTemplates[0];
}

/* ---------------------------------------------------------------- editing */

/** The editable fields the dashboard exposes. `name` is always shown. */
export interface SignatureDraft {
  name: string;
  /** Accent colour (hex) applied to the chosen design. */
  accent: string;
  /** Font-family stack applied across the signature. */
  font: string;
  /** Primary text colour (name + contact values). */
  textColor: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  photo: string;
  gallery: string[];
  galleryHeading: string;
  bannerText: string;
  bannerButton: string;
  bannerImage: string;
  /** Social handles keyed by platform; empty values are simply not shown. */
  socials: Record<string, string>;
  /** Field keys the user removed from the signature. */
  hide: string[];
}

/** Social platforms offered in the editor, with brand colour + short glyph. */
export const SOCIAL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", glyph: "in", color: "#0a66c2", placeholder: "linkedin.com/in/you" },
  { key: "instagram", label: "Instagram", glyph: "IG", color: "#e4405f", placeholder: "instagram.com/you" },
  { key: "twitter", label: "X / Twitter", glyph: "X", color: "#000000", placeholder: "x.com/you" },
  { key: "facebook", label: "Facebook", glyph: "f", color: "#1877f2", placeholder: "facebook.com/you" },
  { key: "youtube", label: "YouTube", glyph: "YT", color: "#ff0000", placeholder: "youtube.com/@you" },
  { key: "whatsapp", label: "WhatsApp", glyph: "WA", color: "#25d366", placeholder: "919000000000" },
] as const;

const SOCIAL_META: Record<string, { glyph: string; color: string }> = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.key, { glyph: p.glyph, color: p.color }]),
);

/** Fields that can be edited & individually removed (in display order). */
export const SIGNATURE_FIELDS = [
  { key: "photo", label: "Photo URL", placeholder: "https://…/photo.jpg" },
  { key: "title", label: "Job title", placeholder: "Marketing Expert" },
  { key: "company", label: "Company", placeholder: "Your Company" },
  { key: "phone", label: "Phone", placeholder: "000 123 456 7890" },
  { key: "email", label: "Email", placeholder: "you@email.com" },
  { key: "website", label: "Website", placeholder: "www.yoursite.com" },
  { key: "address", label: "Address", placeholder: "Street, City, ZIP" },
] as const;

/** Build the initial editor draft from the card + any saved signature config. */
export function resolveSignatureDraft(card: CardData): SignatureDraft {
  const s = card.signature ?? {};
  const c = card.contact ?? {};

  // Seed social handles from the saved config, else from the card's socials.
  const socials: Record<string, string> = {};
  for (const p of SOCIAL_PLATFORMS) {
    const saved = s.socials?.[p.key];
    const fromCard = card.socials?.find((l) => l.platform === p.key)?.url;
    socials[p.key] = saved ?? fromCard ?? "";
  }

  return {
    name: s.name ?? card.name ?? "",
    accent: s.accent ?? card.accent ?? DEFAULT_SIGNATURE_ACCENT,
    font: s.font ?? DEFAULT_SIGNATURE_FONT,
    textColor: s.textColor ?? DEFAULT_SIGNATURE_TEXT,
    title: s.title ?? card.title ?? "",
    company: s.company ?? card.company ?? "",
    phone: s.phone ?? c.phone ?? "",
    email: s.email ?? c.email ?? "",
    website: s.website ?? c.website ?? "",
    address: s.address ?? c.address ?? "",
    photo: s.photo ?? card.avatarImage ?? "",
    socials,
    hide: s.hide ?? [],
    gallery: s.gallery ?? [],
    galleryHeading: s.galleryHeading ?? "",
    bannerText: s.bannerText ?? "",
    bannerButton: s.bannerButton ?? "",
    bannerImage: s.bannerImage ?? "",
  };
}

/** The template id currently saved on the card (or the default). */
export function resolveSignatureTemplate(card: CardData): string {
  return card.signature?.template ?? DEFAULT_SIGNATURE_TEMPLATE;
}

/**
 * Fold a live editor draft onto the base card, producing the CardData the
 * renderers consume. Removed/empty fields are cleared so they simply drop out.
 */
export function buildSignatureCard(base: CardData, d: SignatureDraft): CardData {
  const hide = new Set(d.hide);
  const val = (key: string, v: string) => (hide.has(key) ? "" : v.trim());

  const socials = hide.has("socials")
    ? []
    : SOCIAL_PLATFORMS.filter((p) => (d.socials[p.key] ?? "").trim()).map((p) => ({
        platform: p.key as CardData["socials"][number]["platform"],
        url: d.socials[p.key].trim(),
      }));

  return {
    ...base,
    accent: d.accent?.trim() || base.accent,
    name: d.name.trim() || base.name,
    title: val("title", d.title),
    company: val("company", d.company),
    avatarImage: hide.has("photo") ? undefined : d.photo.trim() || undefined,
    contact: {
      ...base.contact,
      phone: val("phone", d.phone) || undefined,
      email: val("email", d.email) || undefined,
      website: val("website", d.website) || undefined,
      address: val("address", d.address) || undefined,
    },
    socials,
  };
}

/** Turn an editor draft into the config we persist on the card. */
export function draftToConfig(template: string, d: SignatureDraft): SignatureConfig {
  return {
    template,
    accent: d.accent,
    font: d.font,
    textColor: d.textColor,
    name: d.name,
    title: d.title,
    company: d.company,
    phone: d.phone,
    email: d.email,
    website: d.website,
    address: d.address,
    photo: d.photo,
    socials: d.socials,
    hide: d.hide,
    gallery: d.gallery,
    galleryHeading: d.galleryHeading,
    bannerText: d.bannerText,
    bannerButton: d.bannerButton,
    bannerImage: d.bannerImage,
  };
}

/* ------------------------------------------------------------------ helpers */

export const INK = "#0f172a"; // primary text
export const SUB = "#64748b"; // secondary text
export const BODY = "#334155"; // contact values
export const HAIR = "#e8ebf0"; // hairline borders

/** Escape user text so it can't break out of the HTML/attribute context. */
export function esc(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface Line {
  label: string;
  text: string;
  href?: string;
}

export function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function websiteHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Collect the card's contact details into an ordered, labelled list. */
export function contactLines(card: CardData): Line[] {
  const c = card.contact ?? {};
  const lines: Line[] = [];
  if (c.phone)
    lines.push({ label: "Phone", text: c.phone, href: `tel:${c.phone.replace(/\s+/g, "")}` });
  if (c.email) lines.push({ label: "Email", text: c.email, href: `mailto:${c.email}` });
  if (c.website)
    lines.push({ label: "Web", text: displayWebsite(c.website), href: websiteHref(c.website) });
  if (c.address) lines.push({ label: "Address", text: c.address });
  return lines;
}

export function accentOf(card: CardData): string {
  return card.accent || "#4f46e5";
}

export function initials(card: CardData): string {
  const src = card.name || card.company || card.logoText || "?";
  return src
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

export function roleParts(card: CardData): string {
  return [card.title, card.company].filter(Boolean).map(esc).join(" &middot; ");
}

/** An accent circle with the person's initials — used as the no-photo badge and
 *  as the graceful fallback if a photo URL fails to load. */
export function monogramSvg(card: CardData, accent: string, size: number, radius: number): string {
  const fs = Math.round(size * 0.4);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${radius}" fill="${accent}"/><text x="50%" y="52%" dy=".35em" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fs}" font-weight="bold" fill="#ffffff">${initials(card)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A rounded photo, or an accent monogram badge when no photo is set. The photo
 *  uses referrerpolicy (fixes many blocked external avatars) and an onerror
 *  fallback to the initials badge, so it never renders a broken-image icon. */
export function avatarBlock(card: CardData, accent: string, size: number, radius: number): string {
  if (card.avatarImage) {
    const fallback = monogramSvg(card, accent, size, radius);
    // `min/max-width` + `max-height` are set inline so Tailwind Preflight
    // (img{max-width:100%;height:auto}) can't squash the fixed-size photo into
    // a strip inside the narrow dashboard preview column. Mail clients ignore
    // these extra rules, so the copied signature is unchanged.
    return `<img src="${esc(card.avatarImage)}" alt="${esc(card.name)}" width="${size}" height="${size}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallback}'" style="display:block;width:${size}px;height:${size}px;min-width:${size}px;max-width:${size}px;max-height:${size}px;border-radius:${radius}px;object-fit:cover;background:${accent};" />`;
  }
  return `<div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${accent};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:${Math.round(size * 0.4)}px;font-weight:bold;line-height:${size}px;text-align:center;">${esc(initials(card))}</div>`;
}

/** Vertical label/value contact grid — the crisp, universally-safe treatment. */
export function contactGrid(lines: Line[], accent: string, valueColor: string = BODY): string {
  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:3px 14px 3px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${accent};white-space:nowrap;line-height:1.45;vertical-align:baseline;">${esc(l.label)}</td>
          <td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${valueColor};line-height:1.45;vertical-align:baseline;">${
            l.href
              ? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`
              : esc(l.text)
          }</td>
        </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>`;
}

/** Absolute href for a social handle (bare handles become https / wa.me). */
export function socialHref(platform: string, url: string): string {
  const v = url.trim();
  if (platform === "whatsapp") {
    const digits = v.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : v;
  }
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/**
 * A row of brand-coloured social chips (LinkedIn, Instagram, X, …). Rendered as
 * bgcolor table cells with a short white glyph — the email-safe alternative to
 * SVG/emoji icons, which Gmail strips. Returns "" when there are no socials.
 */
export function socialBlock(card: CardData, marginTop = 12, center = false): string {
  const items = (card.socials ?? []).filter((s) => SOCIAL_META[s.platform] && s.url?.trim());
  if (!items.length) return "";
  const chips = items
    .map((s) => {
      const m = SOCIAL_META[s.platform];
      return `<td style="padding:0 3px;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><span style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;border-radius:6px;background:${m.color};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;">${esc(m.glyph)}</span></a></td>`;
    })
    .join("");
  const margin = center ? `margin:${marginTop}px auto 0;` : `margin-top:${marginTop}px;`;
  return `<table cellpadding="0" cellspacing="0" border="0" ${center ? 'align="center" ' : ""}style="border-collapse:collapse;${margin}"><tr>${chips}</tr></table>`;
}

/** Inline contact row separated by a coloured glyph. */
export function contactInline(lines: Line[], valueColor: string, sepColor: string, sep = "&bull;"): string {
  return lines
    .map((l) =>
      l.href
        ? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`
        : `<span style="color:${valueColor};">${esc(l.text)}</span>`,
    )
    .join(`<span style="color:${sepColor};padding:0 8px;">${sep}</span>`);
}


export function tint(hex: string, intensity: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const blend = Math.round(255 * intensity);
  const nr = Math.round(r + (255 - r) * intensity);
  const ng = Math.round(g + (255 - g) * intensity);
  const nb = Math.round(b + (255 - b) * intensity);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

export function contactBadges(lines: Line[], accent: string, valueColor: string = BODY): string {
  const chip = tint(accent, 0.86);
  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:4px 11px 4px 0;vertical-align:middle;">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:7px;background:${chip};color:${accent};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;">${esc(l.label.charAt(0).toUpperCase())}</span>
          </td>
          <td style="padding:4px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${valueColor};line-height:1.4;vertical-align:middle;">${
            l.href
              ? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`
              : esc(l.text)
          }</td>
        </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>`;
}

export const BRAND_ICON_PNG: Record<string, string> = {
  linkedin: "data:image/png;base64,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",
  facebook: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEmklEQVR4nO2dz4sURxTH+5Afd6NTb9f1IKiRBPIHCLkm5BIMgpIgkoCYEN0EWade70bRBG/+mDXJUUg0whCSHOLBsASPQd1l/XUQjXoweBHJMvV6enacHafkzSzq4vTs7NrT1dVTD77HgW99+lW9qm7qjefFEKv2lSGHpU8A6YSQNAGSbgtJM4CqBkg6XVK1preWxwn2nPNLH/MYPJMx6Ks3hFRfCaQp85AoFglJkwJLwzy2xECuluEQSBoXkkLTAKB3KgukwtBYuLp3JHfpV3OovgZJQQoGrBPK2FCgOrRuWL8eK8vBvHoTpLpqeoBgCiyqK4O+2hALTEDa0k9ZCdGiAaSPXgqmQPUpSDWXgsHodEjVwacvlpeZkj43PwBKpXgnsPRpzk8jBeYhlVL1gTxt7grmKr+0DiQp86Yp3ZIUDIzSxo4w3zqoX+vnag5LlJDqMm8nI4EKJN+0SbBNUu1rC5NPBXxCMG4QLZOkYOVYeeDFQiRp3Lg5tFMC6VibFx2ZPpvrHqu84IUKvzVKgSltswQGu58vRpl5BQfmdKkJkxdUQNVIgSFtt1QjNxoIb/5NewoMkfUSfrCNj5knTBuBjIhfSnvz31WMm4EMSCCd4/3nXdNGICuSdJsr/P/GjWA2JFA95D3oI9NG4CX0zuFA7zxT0d/8WdWHz1X1/rNVvefXWb3j54p+/4dQbzgUJAm06qUBCixD23+q6Kl7db1YXLtfT9SXdUDXjJH+5VJtUZAOKHYH9Mxk9zBdhmJnmJ+driwJpgOKnYFev7/4mumAYndTfdORclcAqdrQpcoz/XPXFSXdDujIH7OREKtzWh84W9Ubv01ui2R9lR8//ygS6N7fZo37sw7oqYvtq3ul1tBDo+b9WQe0ONUe6K0Hj417yxTQawmfhBxQdEC1y1A35XUq19B3j5Wba2I7zYSNyCof9RvWtpOV/l1D3/s+1HHHBz+GDmickfTpKdMZOhM2Eh9DpoFO/5f8HjXTQH+/XHNA44wjf1f7G+ja/UEzS9tp4sZcW2j/Pngc+Zu3vwv6Gyh0kDvLowNqPAvBZagDCm4NJVeUwBUlcmuo6aIDrig5oOA29tTzmeROSuiALgj3GRldUTJe4cGmfagtlxaKFgBtXlqw5VpN0Q6gD7nK3zFtBDICtHXxy5KriUULgLauJlpyebZoB9CCx81ITRuBrACVwVaPL827BgQUXwOCVs8RmjT9dMF+XXiu50hpOAWGtNXK05cL2gy5JlgUX5uh+c44BeNPGe2UkHTUtWrD2IBSZMt24ROaftpgndRIZHdGbt3ILRzNmyQrJJCmO7a75HANWak7oJIC7p7udRPcDdu1DKZO07yey6sPu4L5FKpPu0xPKUilVCOHtNNbTri26/RCZnL39GXBfJqpedrMWwPzmUFmJUkteZpHxcq8Wt/P1V8gTXOx9mKNg/qV5p+r9FG2ivk/V+Hu6V6vgvuNCknHM372L3Nf5UT/tKrVt7m0ByRdzMb7VMVjuMCtf4f2llZ4JkOMBDluRiqQCkLSXwLpJn9NTeMnavbU9MYeW14LTe8jQS4OGE8AYCbfGqxcSpUAAAAASUVORK5CYII=",
  twitter: "data:image/png;base64,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",
  youtube: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEj0lEQVR4nO2dTWhVRxiG30Vq3dqCVhNBpWmyU3AvKoK7ohRajZsuSixt0yAttDuDogtpmmTpRlRQxJ2oKUVd56dqulEKSZa6MCaiTTQ1wUc+zgle0/xnzr3fnHs+eHfJzDvPPXPnzN93pQCB9AlSE1IX0p9Ig0hjSK+RcKbXqbfB1Kt5PmxtCMFiNRA/RvoR6S8HkAikfqQWa1s5QdYhdSJNOABARhpH6kCqzRLkB0itSP86aDBlkj00bUgfhobZgPS3gwZSIQ0gfRYK5hdV9lQyj14gHVwtzK+Rphw0BieaRvp2pTCPOmgATtWykm4+7cA4TmVsDiwV5qdIzx2YxrlsXGlcDOaaKh/NWabu2+vkQkB/dWCSyPTzfDBr0xlCpQ0SYdffOBfQTgfmiFTtcy105HluTsYaf29BJV01qrQpItf3pUDztARHhdQ3A3Mj0hsHhohcxnCD0pX2SpshJ/pK6RZApY2QE3Uo3VeptBFyom4DOuzACDnRoAEddWCEnGjEgP7nwAg50aQcmCBPyh5oXR3s2QNHjsCxY3DyJLS3w9mzcOUKXL8Od+7A3bvvNDAAw8MLy/6m9H+sDCvLyrSyrY4TJ5I6rW7zYF6iBLp5M3R1wcgI7uLJk8SbeYwC6N698PQp7sM82lPrGui2bfDsGdHE2Bhs3eoY6MWLRBfnzzsFunYtvHpFdGGezbs7oDt2EG1s3+4QqL2axBpNTQ6Bnj5NtGHe3QG9cCFcA1++pKxh3t0B7e4O18Bdu6CtDSYnKUvcvOkQaH9/uAbu3JmUWV8PV6+SefT1OQQ6NBQe6Iz274cHD8gszLs7oI8fZwfUVFMDzc3JXDx0PHrkEKhN47IEOqN165LFjampYNUxOuoQ6MREeYDOqKEhGUxCxPi4Q6DT05QV6Iz27Vv996s97QVQvQP68GEOgZa7yzc25rzLF4MSYYEWr02EBVq82BMWaG8v0U49e3ocfoeGGiAqsThy44ZDoMXyHWGBnjpFtGHe3T2hxRYIYYEWm3SEBVpsIxMWaKwHHc6dC9f+4ijOGGzZ4hiolBzAiuGwmJ0M3L07kuOMdXXQ2ZnNdsVqwzyZt9raSA/cbtqUzHwOHYLWVjh+HM6cSQ7FXr4M167B7dvvH541LXbgdvbf37qVlHXpUlK21WF1WZ1Wt3kwLxm3tzgSrvBAi0sLCntpobhWo7DXaoYy/x5VdV38Kq4mKuzVxOLyrMJenj3soKuQE31pQDcUCQgULgFBmtWh38GnS+TqKc050uLAEJHru9lphookWAqUZiiF2uHgUyZS/VakalPQzLdzp2xH+sXBp01k+mmxTOD3HZgkEt1bMN1lCrVIyKolZ2VsWBBmCdSDRcpgLZYy+PMlwSyB2uygS+F0RvTNsmCWQC3Srut/T+bRFcEsgXogfTWgyvV82d18Aaj1VT7637PBOgjMEqg16Y+rvKjCH1dZExTmLLCWb/T3nM/9xy2vcll/tCpdUPkBqTcn66lvbAnOUv8ifVQ2kPPAXW/JSEkWWP5A+ifdTfW4RW2ezJt5NK/m2byvDwHjLUrVgi25N6GIAAAAAElFTkSuQmCC",
  whatsapp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFWklEQVR4nO2d22tcVRTG58HLu4JaFMRmr+kQteIFH1T0DxC0oVipKIqZvSYkTWKrJn0Rr40+tMaCL7WCFQVp9MEna5AqCtKLxiZ7n1xq0qQm6bQ1cWTS3DOdJXsyNZe5kGlPss4+OQu+p5mBtX9n7bPPXsP+TijkQtzpVN8mOvA5oXE/KGwFhb2gZUJonAWN5CXN5yQTmRwVtmZydmLbzRhCnBHpqrkZFNYJLX/jhgRuwVZ4EhTWmrGtGUjREb0DFH4EGie4AcDqVfE4KNkMp2K3rxrIB3/H64WW9ULJS9wDhrXTBGj5lviz9kZXYW7qqNoklGz3wACJpWIVnoq0R8OuwBRabl1nVUkFoI6BilZcE0zoiL4ktJzjHgx4RymhsOrqYCoZ88AAyJNSWFvyNDdXgz1x7Vmlwgq3rAhmmVMpQMmkB5ImL8usK2GFkaIwy51nbljPqzmUKiX/MI+Thae6wt3sSWrbJF/LC9PsCjI7BPYE0bqpH+nCDblA57eT7AmChRJa7sttdPh4bw6rDhTHlzRUTNeIOymwXGEHaxYWIx+14IBJQskT2emOG0BhmjshsF0K03epyltDptPOnoz2h8Ianw1l/gLwQDLgBynZbBakVvZEtD8kNH5nFqQz3ImAX6Sw12w3/2FPRPtDQuGIATrDnQj4RUpOh9iT0P5SAFQHQIm7CoMK1QFQ4q60oEI1P0xPLErlTjVtO/MBvTjQTI90v84OxGqgj3Y3UPfUEF2Jkbkk3d9Zxw7FSqARp4raJ/tpebwT/4odipVAG4Y+o3zRNx2nsI6xg7EO6Inx01QoXujfxw7GOqCJ1KWCQI8k29jBWAU04lRRsZhLp2hzZy07HGuAgkZKpiYKAj09dc7a+ygb0J/HdF6Yk5dnqKJvDzsY64DWD36SF+iuoU/ZoVgJtNyppvhsIgfoywP72aFYCRQ00s7BgzlAz85cpM2dO9jBWAkUNNLRsY4cqIcTv7CDsRbow1276OLcvzlQm+It7HCsBAoaaWtfE01dnl0CNE1p2hM/XPR3D3TV0/P9ezPPtdxj8BRQ0Eh1gwcyEJfHN4lf6d7OmpzvG4jHs9vXwZkReuPcl3S3U80+Ds8ABY3UdL4l76OUWajw7MdLvvv56NGc75lbx/vnv6b7GHdZngIKBmq8JW+lmnAm/6LG4UPUfOHbvJ8vBpuvqtclUMg+9C+/p5YaD3XtDIDCIqhb+t7L9EavJoZnRtmKwZMVClmZaXvg7+9LrlbzmwCoLgz2sZ4G+mL0x6IdqivxQ7Kd7nF47p+er1BYJgPqlcGDmU7VbHpuCciB6Qu0e/gQe9vPKqCwSGa//2Tv2/R077v0eE8jez7WAwWPKgCqA6DEXYVBheoAKHFXWlCh2iOLUnBoAd09tBAcq0F3j9WAwj7uaQJ+OvgVHE1Et48mBodnwdXDs05sO/tU0f5QmYpuC5lD84EBAbpnQJD1azrJfXXBfh1bbOJS64GEyGYJLauX2AwFJljons3QfJXKZu6rDJZKaNwbWLVpl2AqHCto2S4UNnJfbbBNCl8t6M5orBuNhSN7ktoatRW1uzQRGLLiil0ZjXt6UZgLC1S0IrAMxmJAU2WOfGpFMBegInpgSpHnpDAd1hgtCeb/UAPbdVpemcY9PXQtYdywM6b43JWhuStTJkue5oViY2cM1vnq32YW65Cb8cRPb143/3KVdVWtE+blKsY9PbRakfRakfUb/dDPe3+hcdz4Kq/pS6vmX1AldwiFx33RT1WZMRwz1r/lTuVNIc7Y2F51izEjBdNgUfKI0LLH/Jvqxb+oTU6Z3LTsMbmanE3uZgxuwPgP+5Il4BUSozcAAAAASUVORK5CYII=",
  instagram: "data:image/png;base64,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",
};

export function socialIconImg(platform: string, size = 28, radius?: number): string {
  const src = BRAND_ICON_PNG[platform];
  if (!src) return "";
  const r = radius !== undefined ? radius : Math.round(size * 0.28);
  return `<img src="${src}" width="${size}" height="${size}" alt="${esc(platform)}" style="display:block;border:0;outline:none;text-decoration:none;border-radius:${r}px;" />`;
}

export const DEFAULT_BANNER_PROMO = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80";
export const DEFAULT_CAMPAIGN_BANNER = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80";
export const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
];

/** A 10-tile product/lifestyle showcase used by the Boutique design when the
 *  user hasn't uploaded their own images. Cosmetics/retail themed to read as a
 *  brand storefront strip. */
export const DEFAULT_BOUTIQUE_GALLERY = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=220&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=220&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=220&q=80",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=220&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=220&q=80",
  "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=220&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=220&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=220&q=80"
];

export function contactLetters(lines: Line[], accent: string, valueColor: string = BODY): string {
  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:2px 8px 2px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:${accent};vertical-align:middle;">${esc(l.label.charAt(0).toUpperCase())}</td>
          <td style="padding:2px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${valueColor};line-height:1.4;vertical-align:middle;">${
            l.href
              ? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`
              : esc(l.text)
          }</td>
        </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table>`;
}

/* ------------------------------------------------------------- templates */
import * as templates from "./signatures";

function applySignatureStyle(html: string, opts?: SignatureStyleOpts): string {
  let out = html;
  const font = opts?.font?.trim();
  if (font && font !== DEFAULT_SIGNATURE_FONT) {
    out = out.split(`font-family:${DEFAULT_SIGNATURE_FONT}`).join(`font-family:${font}`);
  }
  const tc = opts?.textColor?.trim();
  if (tc && tc.toLowerCase() !== DEFAULT_SIGNATURE_TEXT) {
    out = out.split(`color:${INK}`).join(`color:${tc}`).split(`color:${BODY}`).join(`color:${tc}`);
  }
  return out;
}

/**
 * Render the given card as an email signature HTML string for `templateId`.
 * The output is a self-contained block of inline-styled tables safe to paste
 * into Gmail, Outlook and Apple Mail. `opts` recolours text and swaps the font.
 */
export function renderSignature(
  card: CardData,
  templateId?: string,
  opts?: SignatureStyleOpts,
): string {
  const accent = accentOf(card);
  let html: string;
  const id = getSignatureTemplate(templateId).id;
  const methodName = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const funcName = "render" + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  
  if (funcName in templates) {
    html = (templates as any)[funcName](card, accent, opts);
  } else {
    html = templates.renderAurora(card, accent, opts);
  }
  return applySignatureStyle(html, opts);
}

/** Plain-text fallback copied alongside the HTML for clients that strip it. */
export function renderSignatureText(card: CardData): string {
  const parts = [
    card.name,
    [card.title, card.company].filter(Boolean).join(" · "),
    ...contactLines(card).map((l) => `${l.label}: ${l.text}`),
  ];
  return parts.filter(Boolean).join("\n");
}

export function ctaHref(card: CardData): string {
  const cta = card.cta;
  const c = card.contact ?? {};
  const v = cta?.value?.trim();
  switch (cta?.action) {
    case "phone":
      return `tel:${(v || c.phone || "").replace(/\s+/g, "")}`;
    case "email":
      return `mailto:${v || c.email || ""}`;
    case "whatsapp": {
      const d = (v || c.whatsapp || "").replace(/[^\d]/g, "");
      return d ? `https://wa.me/${d}` : "#";
    }
    default:
      return v ? websiteHref(v) : c.website ? websiteHref(c.website) : "#";
  }
}
