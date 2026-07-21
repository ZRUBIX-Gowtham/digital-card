import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderMinimal(card: CardData, accent: string): string {
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
