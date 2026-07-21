import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderSplit(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:14px;overflow:hidden;">
  <tr>
    <td width="190" style="background:${accent};padding:24px 18px;text-align:center;vertical-align:middle;">
      <div style="display:inline-block;">${avatarBlock(card, "#ffffff", 84, 50)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;margin-top:12px;line-height:1.2;">${esc(card.name)}</div>
      ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;color:#ffffff;opacity:.85;margin-top:5px;">${esc(card.title)}</div>` : ""}
    </td>
    <td style="padding:24px 22px;vertical-align:middle;">
      ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${INK};margin-bottom:12px;">${esc(card.company)}</div>` : ""}
      ${contactGrid(contactLines(card), accent)}
      ${socialBlock(card)}
    </td>
  </tr>
</table>`.trim();
}
