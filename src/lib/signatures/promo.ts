import type { CardData } from "@/types/card";
import {
  esc, contactLines, initials,
  avatarBlock, socialHref, INK, SignatureStyleOpts, socialIconImg
} from "../signature";

export function renderPromo(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Circular left-aligned avatar
  const logo = avatarBlock(card, accent, 110, 55);

  const iconSvg = (type: string, color: string) => {
    let path = "";
    if (type === 'Phone') path = `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`;
    else if (type === 'Email') path = `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`;
    else if (type === 'Web') path = `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`;
    else path = `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`;
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  // Build grid
  let pLine = lines.find((l) => l.label === 'Phone');
  let eLine = lines.find((l) => l.label === 'Email');
  let wLine = lines.find((l) => l.label === 'Web');
  let aLine = lines.find((l) => l.label === 'Address');

  let rowsHtml = '';
  if (aLine) {
    rowsHtml += `<tr>
      <td colspan="2" style="padding:0 0 8px 0;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="${iconSvg('Address', accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:${font};font-size:13px;color:${INK};line-height:1.4;">${esc(aLine.text)}</td>
          </tr>
        </table>
      </td>
    </tr>`;
  }
  
  let pairs = [];
  let others = [pLine, eLine, wLine].filter(Boolean);
  for (let i = 0; i < others.length; i += 2) {
    pairs.push([others[i], others[i+1]]);
  }

  pairs.forEach(([c1, c2]) => {
    rowsHtml += `<tr>`;
    if (c1) {
      rowsHtml += `<td style="padding:0 24px 8px 0;white-space:nowrap;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="${iconSvg(c1.label, accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:${font};font-size:13px;color:${INK};white-space:nowrap;">${c1.href ? `<a href="${esc(c1.href)}" style="color:${INK};text-decoration:none;">${esc(c1.text)}</a>` : esc(c1.text)}</td>
          </tr>
        </table>
      </td>`;
    }
    if (c2) {
      rowsHtml += `<td style="padding:0 0 8px 0;white-space:nowrap;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="${iconSvg(c2.label, accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:${font};font-size:13px;color:${INK};white-space:nowrap;">${c2.href ? `<a href="${esc(c2.href)}" style="color:${INK};text-decoration:none;">${esc(c2.text)}</a>` : esc(c2.text)}</td>
          </tr>
        </table>
      </td>`;
    } else {
      rowsHtml += `<td></td>`;
    }
    rowsHtml += `</tr>`;
  });

  const contactsHtml = rowsHtml ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">${rowsHtml}</table>` : "";

  // Social icons (brand colored)
  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const icon = socialIconImg(s.platform, 28, 14); // circular
        if (!icon) return `<td style="padding:0 8px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;font-family:${font};font-size:14px;color:${accent};">${esc(s.platform.charAt(0).toUpperCase())}</a></td>`;
        return `<td style="padding:0 8px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">${icon}</a></td>`;
    }).join("");
    social = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;"><tr>${chips}</tr></table>`;
  }

  const bannerImage = (opts?.bannerImage && opts.bannerImage.trim() !== "") ? opts.bannerImage.trim() : "https://placehold.co/600x120/0ea5e9/ffffff/png?text=SPECIAL+SALE+50%25+OFF";
  const banner = bannerImage ? `
  <tr>
    <td style="padding-top:24px;">
      <img src="${esc(bannerImage)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:none;" alt="Banner" />
    </td>
  </tr>` : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="110" valign="top" style="padding:0 16px 0 0;">${logo}</td>
          <td valign="top">
            <div style="font-family:${font};font-size:24px;font-weight:bold;color:#111111;line-height:1.2;margin-bottom:4px;">${esc(card.name)}</div>
            ${card.title || card.company ? `<div style="font-family:${font};font-size:14px;color:${INK};opacity:0.9;">${[card.title, card.company].filter(Boolean).map(esc).join(", ")}</div>` : ""}
            ${contactsHtml}
            ${social}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${banner}
</table>`.trim();
}
