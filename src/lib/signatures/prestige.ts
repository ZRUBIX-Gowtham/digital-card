import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderPrestige(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:560px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:16px;overflow:hidden;">
  <tr><td style="height:6px;line-height:6px;font-size:0;background:${accent};">&nbsp;</td></tr>
  <tr>
    <td style="padding:24px 26px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:22px;vertical-align:middle;">
            <div style="padding:3px;border:2px solid ${accent};border-radius:50%;display:inline-block;">${avatarBlock(card, accent, 88, 50)}</div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:${accent};margin-top:6px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${HAIR};margin:13px 0;"></div>
            ${contactGrid(contactLines(card), accent)}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
