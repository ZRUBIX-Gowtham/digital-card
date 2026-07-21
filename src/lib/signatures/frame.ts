import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderFrame(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:#ffffff;border:2px solid ${accent};border-radius:14px;overflow:hidden;">
  <tr>
    <td style="padding:22px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:20px;vertical-align:middle;">${avatarBlock(card, accent, 92, 12)}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${HAIR};margin:12px 0;"></div>
            ${contactBadges(contactLines(card), accent)}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
