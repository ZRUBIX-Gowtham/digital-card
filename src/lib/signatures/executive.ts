import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderExecutive(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:22px;vertical-align:top;">${avatarBlock(card, accent, 108, 14)}</td>
    <td style="vertical-align:top;border-left:3px solid ${accent};padding-left:22px;">
      <div style="font-size:22px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
      ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${accent};margin-top:6px;">${esc(card.title)}</div>` : ""}
      ${card.company ? `<div style="font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:14px 0;"></div>
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}
