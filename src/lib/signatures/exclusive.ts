import type { CardData } from "@/types/card";
import {
  esc, contactLines, initials,
  socialHref, INK, SignatureStyleOpts
} from "../signature";

export function renderExclusive(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Square left-aligned avatar
  const logo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.company || card.name)}" width="90" height="90" referrerpolicy="no-referrer" style="display:block;width:90px;max-width:90px;height:90px;object-fit:cover;" />`
    : `<div style="width:90px;height:90px;background:${accent};color:#ffffff;font-family:${font};font-size:32px;font-weight:bold;line-height:90px;text-align:center;">${esc(initials(card))}</div>`;

  // Social icons (square, accent colored background)
  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const platform = s.platform.toLowerCase();
        let glyph = platform.charAt(0).toUpperCase();
        if (platform === 'linkedin') glyph = 'in';
        if (platform === 'twitter' || platform === 'x') glyph = 'X';
        if (platform === 'youtube') glyph = 'YT';
        if (platform === 'whatsapp') glyph = 'WA';
        if (platform === 'facebook') glyph = 'f';
        if (platform === 'instagram') glyph = 'IG';

        const iconWhiteUrl = (p: string) => {
          if (p === 'linkedin') return "https://img.icons8.com/ios-filled/24/ffffff/linkedin.png";
          if (p === 'facebook') return "https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png";
          if (p === 'twitter' || p === 'x') return "https://img.icons8.com/ios-filled/24/ffffff/twitterx.png";
          if (p === 'youtube') return "https://img.icons8.com/ios-filled/24/ffffff/youtube-play.png";
          if (p === 'instagram') return "https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png";
          if (p === 'whatsapp') return "https://img.icons8.com/ios-filled/24/ffffff/whatsapp.png";
          return "";
        };
        const svgIcon = iconWhiteUrl(platform);
        if (svgIcon) {
           return `<td style="padding:0 0 0 6px;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="24" height="24" valign="middle" align="center" style="background-color:${accent};line-height:0;"><img src="${svgIcon}" width="14" height="14" style="display:block;" alt="" /></td></tr></table></a></td>`;
        }
        return `<td style="padding:0 0 0 6px;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="24" height="24" valign="middle" align="center" style="background-color:${accent};color:#ffffff;font-family:${font};font-size:12px;font-weight:bold;line-height:1;">${esc(glyph)}</td></tr></table></a></td>`;
    }).join("");
    social = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${chips}</tr></table>`;
  }

  // Inline contacts with accent letters. Each label+value is an inline-block
  // unit so items wrap as a whole between entries instead of breaking mid-value
  // (which previously merged one value's tail into the next item's letter).
  let contactHtml = "";
  if (lines.length > 0) {
    const contactItems = lines.map(l => {
      const letter = l.label.charAt(0).toUpperCase();
      // Keep short values on one line; let the long address wrap internally.
      const nowrap = l.label !== "Address";
      const value = l.href
        ? `<a href="${esc(l.href)}" style="color:${INK};text-decoration:none;">${esc(l.text)}</a>`
        : `<span style="color:${INK};">${esc(l.text)}</span>`;
      return `<span style="display:inline-block;vertical-align:top;margin:0 20px 6px 0;font-family:${font};font-size:13px;line-height:1.5;${nowrap ? "white-space:nowrap;" : ""}"><span style="font-weight:bold;color:${accent};margin-right:6px;">${esc(letter)}</span>${value}</span>`;
    }).join("");

    contactHtml = `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:10px;">
        <tr>
          <td style="padding:8px 0;border-top:1px solid ${accent};border-bottom:1px solid ${accent};">
            <div style="font-size:0;">${contactItems}</div>
          </td>
        </tr>
      </table>
    `;
  }

  const bannerImage = (opts?.bannerImage && opts.bannerImage.trim() !== "") ? opts.bannerImage.trim() : "https://placehold.co/600x120/0f172a/ffffff/png?text=MARTIN+LUTHER+KING+DAY";
  const banner = bannerImage ? `
  <tr>
    <td style="padding-top:16px;">
      <img src="${esc(bannerImage)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:none;" alt="Banner" />
    </td>
  </tr>` : "";

  // Support multiline text for quote by splitting on newlines or just replacing them with <br/>
  const quoteText = (opts?.bannerText && opts.bannerText.trim() !== "") ? opts.bannerText.trim() : '"the time is always right to do what is right"\n- Martin Luther King';
  const quote = quoteText ? `
  <tr>
    <td style="padding-top:12px;font-family:${font};font-size:12px;color:${INK};font-style:italic;line-height:1.4;">
      ${esc(quoteText).replace(/\\n/g, "<br/>")}
    </td>
  </tr>` : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;">
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="90" valign="middle" style="padding:0 16px 0 0;">${logo}</td>
          <td valign="middle">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              <tr>
                <td valign="middle">
                  <div style="font-family:${font};font-size:18px;font-weight:bold;color:${accent};line-height:1.2;margin-bottom:2px;">${esc(card.name)}</div>
                  ${card.title || card.company ? `<div style="font-family:${font};font-size:13px;color:${INK};">${esc(card.title)}${(card.title && card.company) ? ', ' : ''}${card.company ? `<span style="color:${accent};">${esc(card.company)}</span>` : ''}</div>` : ""}
                </td>
                <td valign="middle" align="right">
                  ${social}
                </td>
              </tr>
            </table>
            ${contactHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${banner}
  ${quote}
</table>`.trim();
}
