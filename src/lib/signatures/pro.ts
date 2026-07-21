import type { CardData } from "@/types/card";
import {
  esc, websiteHref, contactLines, initials,
  avatarBlock, socialHref, INK, tint, SignatureStyleOpts, socialIconImg
} from "../signature";

export function renderPro(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);
  
  // Circular left-aligned avatar
  const logo = avatarBlock(card, accent, 120, 60);

  // Contact list with single lowercase letter labels
  const contactRows = lines
    .map((l) => {
      // Use semi-transparent white (or tint of white if needed, but rgba is supported enough for this)
      return `
        <tr>
          <td style="padding:6px 12px 6px 0;font-family:${font};font-size:13px;font-weight:normal;color:rgba(255,255,255,0.7);vertical-align:middle;width:15px;text-align:left;">${esc(l.label.charAt(0).toLowerCase())}</td>
          <td style="padding:6px 0;font-family:${font};font-size:14px;color:#ffffff;line-height:1.4;vertical-align:middle;">${
            l.href
              ? `<a href="${esc(l.href)}" style="color:#ffffff;text-decoration:none;">${esc(l.text)}</a>`
              : esc(l.text)
          }</td>
        </tr>`;
    })
    .join("");

  const contactsHtml = contactRows ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:24px;">${contactRows}</table>` : "";

  // Social icons: render as white text glyphs to match the image's "white icons on accent bg" look
  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const icon = socialIconImg(s.platform, 24, 12);
        if (!icon) return `<td style="padding:0 12px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;color:#ffffff;font-family:${font};font-size:16px;font-weight:bold;">${esc(s.platform.charAt(0).toUpperCase())}</a></td>`;
        return `<td style="padding:0 8px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">${icon}</a></td>`;
    }).join("");
    social = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${chips}</tr></table>`;
  }

  // The banner image is used for the bottom disclaimer/footer image
  const bannerImage = (opts?.bannerImage && opts.bannerImage.trim() !== "") ? opts.bannerImage.trim() : "";
  const banner = bannerImage ? `
  <tr>
    <td style="padding-top:15px;">
      <img src="${esc(bannerImage)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:none;" alt="Banner" />
    </td>
  </tr>` : "";

  // Instead of a dot separator, the image uses a colon and a comma or similar.
  const roleText = [card.title, card.company].filter(Boolean).map(esc).join(": ");

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;">
  <tr>
    <td style="padding: 0 32px 16px 32px;">
      <div style="font-family:${font};font-size:26px;font-weight:bold;color:${accent};line-height:1.2;margin-bottom:4px;">${esc(card.name)}</div>
      ${roleText ? `<div style="font-family:${font};font-size:15px;color:${INK};opacity:0.9;">${roleText}</div>` : ""}
    </td>
  </tr>
  <tr>
    <td style="padding: 0 32px 24px 32px;">
      ${logo}
    </td>
  </tr>
  <tr>
    <td style="background:${accent};padding:24px 32px;">
      ${contactsHtml}
      ${social}
    </td>
  </tr>
  ${banner}
</table>`.trim();
}
