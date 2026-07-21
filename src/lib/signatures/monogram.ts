import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderMonogram(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">${avatarBlock(card, accent, 62, 50)}</td>
    <td style="vertical-align:top;">
      <div style="font-size:19px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;color:${SUB};margin-top:2px;">${roleParts(card)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin-top:10px;padding-top:10px;font-size:12px;">${contactInline(contactLines(card), BODY, accent)}</div>
      ${socialBlock(card, 10)}
    </td>
  </tr>
</table>`.trim();
}
