import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderClassic(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:18px;vertical-align:middle;">${avatarBlock(card, accent, 90, 50)}</td>
    <td style="vertical-align:middle;border-left:1px solid ${HAIR};padding-left:18px;">
      <div style="font-size:19px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;color:${SUB};margin-top:2px;">${roleParts(card)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:11px 0;"></div>
      ${contactBadges(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}
