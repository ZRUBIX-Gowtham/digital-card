import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";

export function renderPremium(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);
  const social = socialBlock(card, 16, false); // Circular icons

  const logo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.company || card.name)}" width="110" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${monogramSvg(card, accent, 110, 0)}'" style="display:block;width:110px;max-width:110px;height:110px;object-fit:cover;" />`
    : `<div style="width:110px;height:110px;background:${accent};color:#ffffff;font-family:${font};font-size:38px;font-weight:bold;line-height:110px;text-align:center;">${esc(initials(card))}</div>`;

  const pLine = lines.find((l) => l.label === 'Phone');
  const wLine = lines.find((l) => l.label === 'Web');
  const eLine = lines.find((l) => l.label === 'Email');
  const aLine = lines.find((l) => l.label === 'Address');

  let col1 = [pLine, eLine].filter(Boolean);
  let col2 = [wLine, aLine].filter(Boolean);
  
  let rowsHtml = '';
  const maxRows = Math.max(col1.length, col2.length);
  for (let i = 0; i < maxRows; i++) {
     let c1 = col1[i];
     let c2 = col2[i];
     rowsHtml += `<tr>`;
     if (c1) {
       rowsHtml += `<td style="padding:0 24px 10px 0;font-family:${font};font-size:13px;white-space:nowrap;vertical-align:middle;">`;
       rowsHtml += `<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border:1px solid ${accent};border-radius:50%;color:${accent};font-size:11px;font-weight:bold;margin-right:8px;vertical-align:middle;">${c1.label[0].toUpperCase()}</span>`;
       rowsHtml += `<span style="color:${BODY};vertical-align:middle;">${c1.href ? `<a href="${esc(c1.href)}" style="color:${BODY};text-decoration:none;">${esc(c1.text)}</a>` : esc(c1.text)}</span></td>`;
     } else {
       rowsHtml += `<td style="padding:0 24px 10px 0;"></td>`;
     }
     
     if (c2) {
       rowsHtml += `<td style="padding:0 0 10px 0;font-family:${font};font-size:13px;white-space:nowrap;vertical-align:middle;">`;
       rowsHtml += `<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border:1px solid ${accent};border-radius:50%;color:${accent};font-size:11px;font-weight:bold;margin-right:8px;vertical-align:middle;">${c2.label[0].toUpperCase()}</span>`;
       rowsHtml += `<span style="color:${BODY};vertical-align:middle;">${c2.href ? `<a href="${esc(c2.href)}" style="color:${BODY};text-decoration:none;">${esc(c2.text)}</a>` : esc(c2.text)}</span></td>`;
     } else {
       rowsHtml += `<td style="padding:0 0 10px 0;"></td>`;
     }
     rowsHtml += `</tr>`;
  }
  const contactsHtml = maxRows > 0 ? `<table cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">${rowsHtml}</table>` : "";

  const bannerImage = (opts?.bannerImage && opts.bannerImage.trim() !== "") ? opts.bannerImage.trim() : "https://placehold.co/600x100/FDF2F8/DB2777/png?text=HAPPY+PRIDE+MONTH";
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
          <td width="110" valign="top" style="padding:0 12px 0 0;">${logo}</td>
          <td valign="top">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${accent};">
              <tr>
                <td style="padding:20px 24px;">
                  ${card.title || card.company ? `<div style="font-family:${font};font-size:15px;color:#ffffff;opacity:0.95;margin-bottom:6px;">${[card.title, card.company].filter(Boolean).map(esc).join(", ")}</div>` : ""}
                  <div style="font-family:${font};font-size:28px;font-weight:bold;color:#ffffff;line-height:1.1;">${esc(card.name)}</div>
                </td>
              </tr>
            </table>
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
