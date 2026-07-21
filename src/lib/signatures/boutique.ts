import type { CardData } from "@/types/card";
import {
  esc, contactLines, initials, monogramSvg, socialHref, socialIconImg,
  INK, SUB, BODY, SignatureStyleOpts, DEFAULT_BOUTIQUE_GALLERY,
} from "../signature";

/**
 * Boutique — a premium brand/storefront signature. A portrait photo sits beside
 * an accent name lockup and icon contacts; a full-width accent bar carries the
 * social icons, and a 2×5 product showcase grid anchors the foot. Ideal for
 * cosmetics, retail and hospitality brands that want their catalogue in-signature.
 */
export function renderBoutique(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Portrait photo (rectangular, contained), with an accent-monogram fallback.
  const photo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.name)}" width="118" height="118" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${monogramSvg(card, accent, 118, 6)}'" style="display:block;width:118px;height:118px;max-width:118px;object-fit:cover;border-radius:6px;" />`
    : `<div style="width:118px;height:118px;border-radius:6px;background:${accent};color:#ffffff;font-family:${font};font-size:42px;font-weight:bold;line-height:118px;text-align:center;">${esc(initials(card))}</div>`;

  // Line-art contact icons (pin / envelope / phone / browser), accent-stroked.
  const iconSvg = (label: string) => {
    let path = "";
    if (label === "Phone") path = `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`;
    else if (label === "Email") path = `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`;
    else if (label === "Web") path = `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`;
    else path = `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // Single-column contact stack (icon + value), ordered for readability. A
  // vertical column keeps every value flush-left regardless of address length.
  const order = ["Address", "Email", "Phone", "Web"];
  const ordered = [...lines].sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  const contactRow = (l: (typeof lines)[number]) =>
    `<tr>
      <td valign="top" style="padding:0 10px 9px 0;line-height:0;"><img src="${iconSvg(l.label)}" width="15" height="15" style="display:block;margin-top:1px;" alt="" /></td>
      <td valign="top" style="padding:0 0 9px 0;font-family:${font};font-size:13px;color:${BODY};line-height:1.4;">${l.href ? `<a href="${esc(l.href)}" style="color:${BODY};text-decoration:none;">${esc(l.text)}</a>` : esc(l.text)}</td>
    </tr>`;
  const contactsHtml = ordered.length
    ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;border-collapse:collapse;">${ordered.map(contactRow).join("")}</table>`
    : "";

  // Accent social bar — white brand icons aligned right over an accent band.
  const socials = (card.socials ?? []).filter((s) => s.url?.trim());
  const glyph: Record<string, string> = {
    linkedin: "in", instagram: "IG", twitter: "X", facebook: "f", youtube: "YT", whatsapp: "WA",
  };
  const socialChips = socials
    .map((s) => {
      const icon = socialIconImg(s.platform, 22, 4);
      const inner = icon
        ? icon
        : `<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;color:#ffffff;font-family:${font};font-size:12px;font-weight:bold;">${esc(glyph[s.platform] ?? s.platform.charAt(0).toUpperCase())}</span>`;
      return `<td style="padding:0 0 0 14px;line-height:0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">${inner}</a></td>`;
    })
    .join("");
  const socialBar = `
  <tr>
    <td style="padding-top:18px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${accent};border-radius:4px;">
        <tr>
          <td style="padding:12px 20px;font-family:${font};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;">${esc(card.company || card.name || "")}</td>
          ${socialChips ? `<td align="right" style="padding:12px 20px;"><table cellpadding="0" cellspacing="0" border="0"><tr>${socialChips}</tr></table></td>` : ""}
        </tr>
      </table>
    </td>
  </tr>`;

  // Product showcase — pad the uploaded gallery out to 10 tiles (2 rows × 5).
  const uploaded = (opts?.gallery ?? []).map((s) => s.trim()).filter(Boolean);
  const source = uploaded.length ? uploaded : DEFAULT_BOUTIQUE_GALLERY;
  const tiles = Array.from({ length: 10 }, (_, i) => source[i % source.length]);
  const galleryRow = (start: number) =>
    `<tr>${tiles
      .slice(start, start + 5)
      .map(
        (src) =>
          `<td style="padding:4px;width:20%;"><img src="${esc(src)}" alt="" style="display:block;width:100%;max-width:110px;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:4px;" /></td>`,
      )
      .join("")}</tr>`;
  const heading = (opts?.galleryHeading ?? "").trim();
  const galleryBlock = `
  <tr>
    <td style="padding-top:18px;">
      ${heading ? `<div style="font-family:${font};font-size:12px;font-weight:bold;color:${INK};margin-bottom:8px;">${esc(heading)}</div>` : ""}
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;">
        ${galleryRow(0)}
        ${galleryRow(5)}
      </table>
    </td>
  </tr>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;font-family:${font};">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="118" valign="top" style="padding:0 20px 0 0;">${photo}</td>
          <td valign="top">
            ${card.title || card.company ? `<div style="font-family:${font};font-size:14px;color:${SUB};line-height:1.3;">${[card.title, card.company].filter(Boolean).map(esc).join(", ")}</div>` : ""}
            <div style="font-family:${font};font-size:26px;font-weight:bold;color:${accent};line-height:1.2;margin-top:2px;">${esc(card.name)}</div>
            ${contactsHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${socialBar}
  ${galleryBlock}
</table>`.trim();
}
