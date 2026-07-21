import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderCorporate(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;border-right:1px solid ${HAIR};">
      ${avatarBlock(card, accent, 60, 10)}
      ${card.company ? `<div style="font-size:13px;font-weight:bold;color:${INK};margin-top:8px;max-width:120px;">${esc(card.company)}</div>` : ""}
    </td>
    <td style="padding-left:16px;vertical-align:top;">
      <div style="font-size:17px;font-weight:bold;color:${INK};">${esc(card.name)}</div>
      ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${accent};margin-top:3px;">${esc(card.title)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:10px 0;"></div>
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}
