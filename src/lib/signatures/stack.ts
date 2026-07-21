import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderStack(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;width:340px;max-width:100%;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center" style="text-align:center;">
    <div style="display:inline-block;padding:3px;border:1px solid ${HAIR};border-radius:50%;">${avatarBlock(card, accent, 86, 50)}</div>
    <div style="font-size:20px;font-weight:bold;color:${INK};margin-top:12px;">${esc(card.name)}</div>
    ${card.title ? `<div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
    ${card.company ? `<div style="font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
    <div style="border-top:1px solid ${HAIR};width:60px;margin:13px auto;"></div>
    <div style="font-size:12px;">${contactInline(contactLines(card), BODY, accent)}</div>
    ${socialBlock(card, 12, true)}
  </td></tr>
</table>`.trim();
}
