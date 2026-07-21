import type { CardData } from "@/types/card";
import {
  esc, contactLines, websiteHref, avatarBlock, socialHref,
  INK, BODY, SUB, HAIR, SignatureStyleOpts,
} from "../signature";

/**
 * Portfolio — a creative/freelancer signature. A round photo sits beside an
 * uppercase name lockup over letter-labelled contacts; a full-width accent bar
 * carries circular white social icons, and two call-to-action link boxes anchor
 * the foot. The box labels are editable via the banner-text / banner-button
 * fields; they link to the card's website and email.
 */
export function renderPortfolio(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Round photo, with an accent monogram fallback.
  const photo = avatarBlock(card, accent, 120, 60);

  // Letter contacts — address, then phone + email paired, then website.
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
  const cs = `font-family:${font};font-size:14px;line-height:1.5;color:${INK};vertical-align:top;`;

  let rows = "";
  if (aLine) rows += `<tr><td colspan="2" style="padding:0 0 6px 0;${cs}">${item(aLine)}</td></tr>`;
  if (pLine || eLine) {
    rows += `<tr>
      <td style="padding:0 28px 6px 0;white-space:nowrap;${cs}">${pLine ? item(pLine) : ""}</td>
      <td style="padding:0 0 6px 0;white-space:nowrap;${cs}">${eLine ? item(eLine) : ""}</td>
    </tr>`;
  }
  if (wLine) rows += `<tr><td colspan="2" style="padding:0 0 6px 0;${cs}">${item(wLine)}</td></tr>`;
  const contactsHtml = rows
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;">${rows}</table>`
    : "";

  // Accent social bar — empty left, circular white social icons aligned right.
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
      return `<td style="padding:0 0 0 10px;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="30" height="30" align="center" valign="middle" style="border:1.5px solid #ffffff;border-radius:50%;line-height:0;">${inner}</td></tr></table></a></td>`;
    })
    .join("");
  const socialBar = `
  <tr>
    <td style="padding:0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${accent};">
        <tr>
          <td style="font-size:0;line-height:0;">&nbsp;</td>
          <td align="right" style="padding:12px 24px;">${chips ? `<table cellpadding="0" cellspacing="0" border="0" align="right"><tr>${chips}</tr></table>` : "&nbsp;"}</td>
        </tr>
      </table>
    </td>
  </tr>`;

  // Two call-to-action boxes: icon | divider | label. Labels come from the
  // banner-text / banner-button fields; links use the website and email.
  const iconSvg = (type: "web" | "mail") => {
    const path = type === "mail"
      ? `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`
      : `<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };
  const web = card.contact?.website?.trim();
  const email = card.contact?.email?.trim();
  const box = (icon: "web" | "mail", label: string, href: string) => `
    <a href="${esc(href)}" style="display:block;text-decoration:none;border:1px solid ${HAIR};border-radius:8px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
        <td valign="middle" style="padding:12px 14px;line-height:0;"><img src="${iconSvg(icon)}" width="22" height="22" alt="" style="display:block;" /></td>
        <td valign="middle" style="border-left:1px solid ${HAIR};padding:12px 16px;font-family:${font};font-size:14px;color:${BODY};">${esc(label)}</td>
      </tr></table>
    </a>`;
  const label1 = (opts?.bannerText || "My portfolio").trim();
  const label2 = (opts?.bannerButton || "Get in touch").trim();
  const href1 = web ? websiteHref(web) : "#";
  const href2 = email ? `mailto:${email}` : (web ? websiteHref(web) : "#");
  const ctaBoxes = `
  <tr>
    <td style="padding:18px 24px 0 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;">
        <tr>
          <td width="49%" valign="top">${box("web", label1, href1)}</td>
          <td width="2%">&nbsp;</td>
          <td width="49%" valign="top">${box("mail", label2, href2)}</td>
        </tr>
      </table>
    </td>
  </tr>`;

  const roleText = [card.title, card.company].filter(Boolean).map(esc).join(", ");

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;font-family:${font};">
  <tr>
    <td style="padding:0 24px 18px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="120" valign="top" style="padding:0 22px 0 0;">${photo}</td>
          <td valign="top">
            ${roleText ? `<div style="font-family:${font};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${SUB};line-height:1.3;">${roleText}</div>` : ""}
            <div style="font-family:${font};font-size:26px;font-weight:bold;text-transform:uppercase;color:${INK};line-height:1.15;margin-top:2px;">${esc(card.name)}</div>
            ${contactsHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${socialBar}
  ${ctaBoxes}
  <tr><td style="height:20px;line-height:20px;font-size:0;">&nbsp;</td></tr>
</table>`.trim();
}
