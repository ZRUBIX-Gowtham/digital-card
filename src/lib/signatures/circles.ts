import type { CardData } from "@/types/card";
import {
  esc, contactLines, initials, monogramSvg, socialHref,
  INK, BODY, SUB, SignatureStyleOpts, DEFAULT_BOUTIQUE_GALLERY,
} from "../signature";

/**
 * Circles — a logo-led signature. A contained logo sits beside a name lockup with
 * an accent underline and letter-labelled contacts; accent-filled round social
 * icons follow, and a strip of circular photo thumbnails anchors the foot. Built
 * for cafés, bakeries and shops that want a warm, rounded catalogue look.
 */
export function renderCircles(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Contained logo (never cropped), with an accent-monogram fallback.
  const logo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.company || card.name)}" width="150" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${monogramSvg(card, accent, 150, 8)}'" style="display:block;width:150px;max-width:150px;height:auto;" />`
    : `<div style="width:150px;height:150px;border-radius:8px;background:${accent};color:#ffffff;font-family:${font};font-size:52px;font-weight:bold;line-height:150px;text-align:center;">${esc(initials(card))}</div>`;

  // Letter contacts — address on its own line, phone + website paired below.
  const pLine = lines.find((l) => l.label === "Phone");
  const eLine = lines.find((l) => l.label === "Email");
  const aLine = lines.find((l) => l.label === "Address");
  const wLine = lines.find((l) => l.label === "Web");

  const item = (l: typeof lines[number]) => {
    const value = l.href
      ? `<a href="${esc(l.href)}" style="color:${INK};text-decoration:none;">${esc(l.text)}</a>`
      : `<span style="color:${INK};">${esc(l.text)}</span>`;
    return `<span style="font-weight:bold;color:${accent};margin-right:8px;">${esc(l.label.charAt(0).toUpperCase())}</span>${value}`;
  };
  const cellStyle = `font-family:${font};font-size:14px;line-height:1.45;color:${INK};vertical-align:top;`;

  let rows = "";
  if (aLine) rows += `<tr><td colspan="2" style="padding:0 0 8px 0;${cellStyle}">${item(aLine)}</td></tr>`;
  if (pLine || wLine) {
    rows += `<tr>
      <td style="padding:0 32px 8px 0;white-space:nowrap;${cellStyle}">${pLine ? item(pLine) : ""}</td>
      <td style="padding:0 0 8px 0;white-space:nowrap;${cellStyle}">${wLine ? item(wLine) : ""}</td>
    </tr>`;
  }
  if (eLine) rows += `<tr><td colspan="2" style="padding:0 0 8px 0;${cellStyle}">${item(eLine)}</td></tr>`;
  const contactsHtml = rows
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:14px;">${rows}</table>`
    : "";

  // Accent-filled round social icons with white glyphs.
  const iconWhiteUrl = (p: string) => {
    if (p === "linkedin") return "https://img.icons8.com/ios-filled/28/ffffff/linkedin.png";
    if (p === "facebook") return "https://img.icons8.com/ios-filled/28/ffffff/facebook-new.png";
    if (p === "twitter" || p === "x") return "https://img.icons8.com/ios-filled/28/ffffff/twitterx.png";
    if (p === "youtube") return "https://img.icons8.com/ios-filled/28/ffffff/youtube-play.png";
    if (p === "instagram") return "https://img.icons8.com/ios-filled/28/ffffff/instagram-new.png";
    if (p === "whatsapp") return "https://img.icons8.com/ios-filled/28/ffffff/whatsapp.png";
    return "";
  };
  const glyph: Record<string, string> = {
    linkedin: "in", instagram: "IG", twitter: "X", facebook: "f", youtube: "YT", whatsapp: "WA",
  };
  const socials = (card.socials ?? []).filter((s) => s.url?.trim());
  const chips = socials
    .map((s) => {
      const url = iconWhiteUrl(s.platform);
      const inner = url
        ? `<img src="${url}" width="15" height="15" style="display:block;" alt="${esc(s.platform)}" />`
        : `<span style="color:#ffffff;font-family:${font};font-size:12px;font-weight:bold;">${esc(glyph[s.platform] ?? s.platform.charAt(0).toUpperCase())}</span>`;
      return `<td style="padding:0 10px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="30" height="30" align="center" valign="middle" style="background:${accent};border-radius:50%;line-height:0;">${inner}</td></tr></table></a></td>`;
    })
    .join("");
  const social = chips
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;"><tr>${chips}</tr></table>`
    : "";

  // Circular photo strip — up to 5 round thumbnails, padded from the defaults.
  const uploaded = (opts?.gallery ?? []).map((s) => s.trim()).filter(Boolean);
  const source = uploaded.length ? uploaded : DEFAULT_BOUTIQUE_GALLERY;
  const tiles = Array.from({ length: 5 }, (_, i) => source[i % source.length]);
  const heading = (opts?.galleryHeading ?? "").trim();
  const galleryRow = `
  <tr>
    <td style="padding-top:22px;">
      ${heading ? `<div style="font-family:${font};font-size:12px;font-weight:bold;color:${INK};margin-bottom:10px;">${esc(heading)}</div>` : ""}
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;">
        <tr>
          ${tiles
            .map(
              (src) =>
                `<td align="center" style="padding:0 6px;width:20%;"><img src="${esc(src)}" alt="" width="110" height="110" style="display:block;width:100%;max-width:110px;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:50%;" /></td>`,
            )
            .join("")}
        </tr>
      </table>
    </td>
  </tr>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;font-family:${font};">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="150" valign="top" style="padding:0 24px 0 0;">${logo}</td>
          <td valign="top">
            <div style="font-family:${font};font-size:28px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
            ${card.title || card.company ? `<div style="font-family:${font};font-size:15px;color:${SUB};margin-top:4px;">${[card.title, card.company].filter(Boolean).map(esc).join(", ")}</div>` : ""}
            <div style="border-bottom:2px solid ${accent};margin:12px 0 0 0;"></div>
            ${contactsHtml}
            ${social}
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        ${galleryRow}
      </table>
    </td>
  </tr>
</table>`.trim();
}
