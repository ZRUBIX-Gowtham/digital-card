import type { CardData } from "@/types/card";
import {
  esc, contactLines, avatarBlock, socialHref, INK, BODY, SUB, SignatureStyleOpts,
} from "../signature";

/**
 * Disclaimer — a corporate signature. An optional photo/logo sits beside a bold
 * name lockup over a two-column letter-labelled contact grid; a full-width accent
 * bar carries circular white social icons on the right, and a legal
 * confidentiality notice anchors the foot. The notice text is editable via the
 * banner-text field.
 */
export function renderDisclaimer(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Optional photo/logo — only reserves space when the card has one.
  const photoCell = card.avatarImage
    ? `<td width="84" valign="top" style="padding:0 18px 0 0;">${avatarBlock(card, accent, 84, 8)}</td>`
    : "";

  // Two-column letter contacts — phone/email on the left, address/website right.
  const pLine = lines.find((l) => l.label === "Phone");
  const eLine = lines.find((l) => l.label === "Email");
  const aLine = lines.find((l) => l.label === "Address");
  const wLine = lines.find((l) => l.label === "Web");
  const col1 = [pLine, eLine].filter(Boolean) as typeof lines;
  const col2 = [aLine, wLine].filter(Boolean) as typeof lines;

  const cell = (l: (typeof lines)[number] | undefined, padRight: number, wrap: boolean) => {
    if (!l) return `<td style="padding:0 ${padRight}px 8px 0;"></td>`;
    const value = l.href
      ? `<a href="${esc(l.href)}" style="color:${INK};text-decoration:none;">${esc(l.text)}</a>`
      : `<span style="color:${INK};">${esc(l.text)}</span>`;
    return `<td valign="top" style="padding:0 ${padRight}px 8px 0;font-family:${font};font-size:14px;line-height:1.45;${wrap ? "" : "white-space:nowrap;"}"><span style="font-weight:bold;color:${accent};margin-right:8px;">${esc(l.label.charAt(0).toUpperCase())}</span>${value}</td>`;
  };

  let rows = "";
  const maxRows = Math.max(col1.length, col2.length);
  for (let i = 0; i < maxRows; i++) {
    rows += `<tr>${cell(col1[i], 40, false)}${cell(col2[i], 0, col2[i]?.label === "Address")}</tr>`;
  }
  const contactsHtml = rows
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:18px;">${rows}</table>`
    : "";

  // Accent social bar — empty left, circular white social icons aligned right.
  // White glyph icons render cleanly on the coloured bar in every mail client.
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
          <td align="right" style="padding:14px 24px;">${chips ? `<table cellpadding="0" cellspacing="0" border="0" align="right"><tr>${chips}</tr></table>` : "&nbsp;"}</td>
        </tr>
      </table>
    </td>
  </tr>`;

  // Legal confidentiality notice — editable via the banner-text field.
  const notice = (opts?.bannerText && opts.bannerText.trim() !== "")
    ? opts.bannerText.trim()
    : "IMPORTANT: The contents of this email and any attachments are confidential. They are intended for the named recipient(s) only. If you have received this email by mistake, please notify the sender and delete it from your system.";
  const disclaimer = notice
    ? `
  <tr>
    <td style="padding:14px 24px 0 24px;font-family:${font};font-size:11px;color:${SUB};line-height:1.5;">${esc(notice).replace(/\n/g, "<br/>")}</td>
  </tr>`
    : "";

  const roleText = [card.title, card.company].filter(Boolean).map(esc).join(", ");
  const nameBlock = `
    ${roleText ? `<div style="font-family:${font};font-size:14px;font-weight:bold;color:${BODY};line-height:1.3;">${roleText}</div>` : ""}
    <div style="font-family:${font};font-size:30px;font-weight:bold;color:${INK};line-height:1.15;margin-top:2px;">${esc(card.name)}</div>`;

  const header = photoCell
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${photoCell}<td valign="middle">${nameBlock}</td></tr></table>`
    : nameBlock;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;font-family:${font};">
  <tr>
    <td style="padding:0 24px 20px 24px;">
      ${header}
      ${contactsHtml}
    </td>
  </tr>
  ${socialBar}
  ${disclaimer}
</table>`.trim();
}
