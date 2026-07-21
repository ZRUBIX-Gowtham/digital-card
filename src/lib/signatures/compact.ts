import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderCompact(card: CardData, accent: string): string {
  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding-right:14px;vertical-align:middle;">${avatarBlock(card, accent, 54, 50)}</td>
    <td style="vertical-align:middle;">
      <div style="font-size:16px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}${card.title ? `<span style="font-size:12px;font-weight:normal;color:${accent};"> &nbsp;·&nbsp; ${esc(card.title)}</span>` : ""}</div>
      ${card.company ? `<div style="font-size:12px;color:${SUB};margin-top:1px;">${esc(card.company)}</div>` : ""}
      <div style="font-size:12px;margin-top:6px;">${contactInline(contactLines(card), BODY, "#cbd5e1", "|")}</div>
      ${socialBlock(card, 8)}
    </td>
  </tr>
</table>`.trim();
}
