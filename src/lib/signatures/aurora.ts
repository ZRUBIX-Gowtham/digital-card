import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts
} from "../signature";


export function renderAurora(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const website = card.contact?.website;
  const footer = `
    <tr>
      <td style="background:${accent};padding:11px 24px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:.4px;color:#ffffff;">${esc(card.company || card.name)}</td>
            ${
              website
                ? `<td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="${esc(websiteHref(website))}" style="color:#ffffff;text-decoration:none;opacity:.95;">${esc(displayWebsite(website))}</a></td>`
                : ""
            }
          </tr>
        </table>
      </td>
    </tr>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:540px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:16px;overflow:hidden;">
  <tr>
    <td style="padding:22px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:20px;vertical-align:middle;">
            <div style="padding:3px;border:1px solid ${HAIR};border-radius:16px;display:inline-block;">${avatarBlock(card, accent, 92, 13)}</div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;font-weight:bold;color:${INK};line-height:1.1;">${esc(card.name)}</div>
            ${card.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${accent};margin-top:5px;">${esc(card.title)}</div>` : ""}
            ${card.company ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${SUB};margin-top:3px;">${esc(card.company)}</div>` : ""}
            <div style="border-top:1px solid ${HAIR};margin:13px 0;"></div>
            ${contactGrid(contactLines(card), accent)}
            ${socialBlock(card)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${footer}
</table>`.trim();
}
