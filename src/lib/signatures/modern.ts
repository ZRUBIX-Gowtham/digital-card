import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderModern(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:520px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:14px;overflow:hidden;">
  <tr>
    <td style="background:${accent};padding:18px 22px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:16px;vertical-align:middle;">${avatarBlock(card, "#ffffff", 64, 50)}</td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;line-height:1.1;">${esc(card.name)}</div>
            ${card.title || card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;opacity:.9;margin-top:3px;letter-spacing:.4px;">${[card.title, card.company].filter(Boolean).map(esc).join(" &middot; ")}</div>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="padding:16px 22px;">${contactBadges(contactLines(card), accent)}${socialBlock(card)}</td></tr>
</table>`.trim();
}
