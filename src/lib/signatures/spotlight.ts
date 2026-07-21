import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderSpotlight(card: CardData, accent: string): string {
  const hairline = "rgba(255,255,255,.14)";
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:${INK};border-radius:16px;overflow:hidden;">
  <tr>
    <td style="padding:24px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:20px;vertical-align:middle;">${avatarBlock(card, accent, 92, 13)}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;color:#ffffff;line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#94a3b8;margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${hairline};margin:13px 0;"></div>
            ${contactGrid(contactLines(card), accent, "#cbd5e1")}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
