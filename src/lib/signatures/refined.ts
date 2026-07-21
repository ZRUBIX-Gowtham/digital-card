import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderRefined(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:16px;vertical-align:middle;">${avatarBlock(card, accent, 66, 12)}</td>
    <td style="border-left:3px solid ${accent};padding-left:16px;vertical-align:middle;">
      <div style="font-size:17px;font-weight:bold;color:${INK};">${esc(card.name)}</div>
      ${card.title || card.company ? `<div style="font-size:12px;font-weight:bold;letter-spacing:.5px;color:${accent};margin-top:3px;">${roleParts(card)}</div>` : ""}
      <div style="font-size:12px;margin-top:9px;">${contactInline(contactLines(card), BODY, "#cbd5e1", "|")}</div>
      ${socialBlock(card, 9)}
    </td>
  </tr>
</table>`.trim();
}
