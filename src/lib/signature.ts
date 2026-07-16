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

export interface SignatureTemplateMeta {
  id: string;
  name: string;
  description: string;
  /** Whether this design shows the profile photo. */
  usesPhoto: boolean;
}

export const signatureTemplates: SignatureTemplateMeta[] = [
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

export const DEFAULT_SIGNATURE_TEMPLATE = "aurora";

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
  };
}

/* ------------------------------------------------------------------ helpers */

const INK = "#0f172a"; // primary text
const SUB = "#64748b"; // secondary text
const BODY = "#334155"; // contact values
const HAIR = "#e8ebf0"; // hairline borders

/** Escape user text so it can't break out of the HTML/attribute context. */
function esc(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Line {
  label: string;
  text: string;
  href?: string;
}

function displayWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function websiteHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Collect the card's contact details into an ordered, labelled list. */
function contactLines(card: CardData): Line[] {
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

function accentOf(card: CardData): string {
  return card.accent || "#4f46e5";
}

function initials(card: CardData): string {
  const src = card.name || card.company || card.logoText || "?";
  return src
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

function roleParts(card: CardData): string {
  return [card.title, card.company].filter(Boolean).map(esc).join(" &middot; ");
}

/** An accent circle with the person's initials — used as the no-photo badge and
 *  as the graceful fallback if a photo URL fails to load. */
function monogramSvg(card: CardData, accent: string, size: number, radius: number): string {
  const fs = Math.round(size * 0.4);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${radius}" fill="${accent}"/><text x="50%" y="52%" dy=".35em" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="${fs}" font-weight="bold" fill="#ffffff">${initials(card)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A rounded photo, or an accent monogram badge when no photo is set. The photo
 *  uses referrerpolicy (fixes many blocked external avatars) and an onerror
 *  fallback to the initials badge, so it never renders a broken-image icon. */
function avatarBlock(card: CardData, accent: string, size: number, radius: number): string {
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
function contactGrid(lines: Line[], accent: string, valueColor: string = BODY): string {
  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:3px 14px 3px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${accent};white-space:nowrap;vertical-align:top;">${esc(l.label)}</td>
          <td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${valueColor};line-height:1.45;">${
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
function socialHref(platform: string, url: string): string {
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
function socialBlock(card: CardData, marginTop = 12, center = false): string {
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
function contactInline(lines: Line[], valueColor: string, sepColor: string, sep = "&bull;"): string {
  return lines
    .map((l) =>
      l.href
        ? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`
        : `<span style="color:${valueColor};">${esc(l.text)}</span>`,
    )
    .join(`<span style="color:${sepColor};padding:0 8px;">${sep}</span>`);
}

/* ------------------------------------------------------------- templates */

function renderAurora(card: CardData, accent: string): string {
  const website = card.contact?.website;
  const footer = `
    <tr>
      <td style="background:${accent};padding:11px 24px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:.4px;color:#ffffff;">${esc(card.company || card.name)}</td>
            ${
              website
                ? `<td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="${esc(websiteHref(website))}" style="color:#ffffff;text-decoration:none;opacity:.95;">${esc(displayWebsite(website))}</a></td>`
                : ""
            }
          </tr>
        </table>
      </td>
    </tr>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:16px;overflow:hidden;">
  <tr>
    <td style="padding:22px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:20px;vertical-align:middle;">
            <div style="padding:3px;border:1px solid ${HAIR};border-radius:16px;display:inline-block;">${avatarBlock(card, accent, 92, 13)}</div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${HAIR};margin:13px 0;"></div>
            ${contactGrid(contactLines(card), accent)}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${footer}
</table>`.trim();
}

function renderExecutive(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:22px;vertical-align:top;">${avatarBlock(card, accent, 108, 14)}</td>
    <td style="vertical-align:top;border-left:3px solid ${accent};padding-left:22px;">
      <div style="font-size:22px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
      ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${accent};margin-top:6px;">${esc(card.title)}</div>` : ""}
      ${card.company ? `<div style="font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:14px 0;"></div>
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}

function renderClassic(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:18px;vertical-align:middle;">${avatarBlock(card, accent, 90, 50)}</td>
    <td style="vertical-align:middle;border-left:1px solid ${HAIR};padding-left:18px;">
      <div style="font-size:19px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;color:${SUB};margin-top:2px;">${roleParts(card)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:11px 0;"></div>
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}

function renderModern(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:520px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:14px;overflow:hidden;">
  <tr>
    <td style="background:${accent};padding:18px 22px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:16px;vertical-align:middle;">${avatarBlock(card, "#ffffff", 64, 50)}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;line-height:1.1;">${esc(card.name)}</div>
            ${card.title || card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;opacity:.9;margin-top:3px;letter-spacing:.4px;">${[card.title, card.company].filter(Boolean).map(esc).join(" &middot; ")}</div>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="padding:16px 22px;">${contactGrid(contactLines(card), accent)}${socialBlock(card)}</td></tr>
</table>`.trim();
}

function renderSplit(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:14px;overflow:hidden;">
  <tr>
    <td width="190" style="background:${accent};padding:24px 18px;text-align:center;vertical-align:middle;">
      <div style="display:inline-block;">${avatarBlock(card, "#ffffff", 84, 50)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;margin-top:12px;line-height:1.2;">${esc(card.name)}</div>
      ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#ffffff;opacity:.85;margin-top:5px;">${esc(card.title)}</div>` : ""}
    </td>
    <td style="padding:24px 22px;vertical-align:middle;">
      ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${INK};margin-bottom:12px;">${esc(card.company)}</div>` : ""}
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}

function renderSpotlight(card: CardData, accent: string): string {
  const hairline = "rgba(255,255,255,.14)";
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:${INK};border-radius:16px;overflow:hidden;">
  <tr>
    <td style="padding:24px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:20px;vertical-align:middle;">${avatarBlock(card, accent, 92, 13)}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;color:#ffffff;line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#94a3b8;margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${hairline};margin:13px 0;"></div>
            ${contactGrid(contactLines(card), accent, "#cbd5e1")}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

function renderStack(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;width:340px;max-width:100%;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center" style="text-align:center;">
    <div style="display:inline-block;padding:3px;border:1px solid ${HAIR};border-radius:50%;">${avatarBlock(card, accent, 86, 50)}</div>
    <div style="font-size:20px;font-weight:bold;color:${INK};margin-top:12px;">${esc(card.name)}</div>
    ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
    ${card.company ? `<div style="font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
    <div style="border-top:1px solid ${HAIR};width:60px;margin:13px auto;"></div>
    <div style="font-size:12px;">${contactInline(contactLines(card), BODY, accent)}</div>
    ${socialBlock(card, 12, true)}
  </td></tr>
</table>`.trim();
}

function renderCompact(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:14px;vertical-align:middle;">${avatarBlock(card, accent, 54, 50)}</td>
    <td style="vertical-align:middle;">
      <div style="font-size:16px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}${card.title ? `<span style="font-size:12px;font-weight:normal;color:${accent};"> &nbsp;·&nbsp; ${esc(card.title)}</span>` : ""}</div>
      ${card.company ? `<div style="font-size:12px;color:${SUB};margin-top:1px;">${esc(card.company)}</div>` : ""}
      <div style="font-size:12px;margin-top:6px;">${contactInline(contactLines(card), BODY, "#cbd5e1", "|")}</div>
      ${socialBlock(card, 8)}
    </td>
  </tr>
</table>`.trim();
}

function renderCorporate(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;border-right:1px solid ${HAIR};">
      ${avatarBlock(card, accent, 60, 10)}
      ${card.company ? `<div style="font-size:13px;font-weight:bold;color:${INK};margin-top:8px;max-width:120px;">${esc(card.company)}</div>` : ""}
    </td>
    <td style="padding-left:16px;vertical-align:top;">
      <div style="font-size:17px;font-weight:bold;color:${INK};">${esc(card.name)}</div>
      ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${accent};margin-top:3px;">${esc(card.title)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:10px 0;"></div>
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}

function renderMonogram(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">${avatarBlock(card, accent, 62, 50)}</td>
    <td style="vertical-align:top;">
      <div style="font-size:19px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;color:${SUB};margin-top:2px;">${roleParts(card)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin-top:10px;padding-top:10px;font-size:12px;">${contactInline(contactLines(card), BODY, accent)}</div>
      ${socialBlock(card, 10)}
    </td>
  </tr>
</table>`.trim();
}

function renderRefined(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:middle;">${avatarBlock(card, accent, 66, 12)}</td>
    <td style="border-left:3px solid ${accent};padding-left:16px;vertical-align:middle;">
      <div style="font-size:17px;font-weight:bold;color:${INK};">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;font-weight:bold;letter-spacing:.5px;color:${accent};margin-top:3px;">${roleParts(card)}</div>` : ""}
      <div style="font-size:12px;margin-top:9px;">${contactInline(contactLines(card), BODY, "#cbd5e1", "|")}</div>
      ${socialBlock(card, 9)}
    </td>
  </tr>
</table>`.trim();
}

function renderMinimal(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:14px;vertical-align:middle;">${avatarBlock(card, accent, 56, 12)}</td>
    <td style="vertical-align:middle;">
      <span style="font-size:15px;font-weight:bold;color:${INK};">${esc(card.name)}</span>${card.title || card.company ? `<span style="font-size:13px;color:${SUB};"> &nbsp;—&nbsp; ${roleParts(card)}</span>` : ""}
      <div style="height:2px;width:34px;background:${accent};margin:8px 0;"></div>
      <div style="font-size:12px;">${contactInline(contactLines(card), BODY, "#cbd5e1", "·")}</div>
      ${socialBlock(card, 8)}
    </td>
  </tr>
</table>`.trim();
}

/** Optional font-family / text-colour overrides applied after rendering. */
export interface SignatureStyleOpts {
  font?: string;
  textColor?: string;
}

/**
 * Swap the chosen font stack and text colour into the rendered markup. Every
 * template hard-codes the same base font (`Arial,Helvetica,sans-serif`) and the
 * same text hexes (INK for names, BODY for contact values), so a targeted
 * find/replace recolours all templates uniformly without touching accent fills
 * or dark-card backgrounds (the `background:` uses are never matched here).
 */
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
  switch (getSignatureTemplate(templateId).id) {
    case "executive": html = renderExecutive(card, accent); break;
    case "classic": html = renderClassic(card, accent); break;
    case "modern": html = renderModern(card, accent); break;
    case "split": html = renderSplit(card, accent); break;
    case "spotlight": html = renderSpotlight(card, accent); break;
    case "stack": html = renderStack(card, accent); break;
    case "compact": html = renderCompact(card, accent); break;
    case "corporate": html = renderCorporate(card, accent); break;
    case "monogram": html = renderMonogram(card, accent); break;
    case "refined": html = renderRefined(card, accent); break;
    case "minimal": html = renderMinimal(card, accent); break;
    case "aurora":
    default: html = renderAurora(card, accent); break;
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
