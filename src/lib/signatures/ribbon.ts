import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderRibbon(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:18px;vertical-align:middle;">${avatarBlock(card, accent, 84, 16)}</td>
    <td style="vertical-align:middle;">
      <div style="display:inline-block;background:${accent};border-radius:999px;padding:6px 16px;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;letter-spacing:.3px;">${esc(card.name)}</span>
      </div>
      ${card.title || card.company ? `<div style="font-size:12px;color:${SUB};margin-top:8px;">${roleParts(card)}</div>` : ""}
      <div style="border-top:1px solid ${HAIR};margin:11px 0;"></div>
      <div style="font-size:12px;">${contactInline(contactLines(card), BODY, accent)}</div>
      ${socialBlock(card, 10)}
    </td>
  </tr>
</table>`.trim();
}
