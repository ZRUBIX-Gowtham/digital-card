import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts, contactLetters, DEFAULT_GALLERY
} from "../signature";


export function renderListings(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const uploaded = (opts?.gallery ?? []).map((s: string) => s.trim()).filter(Boolean).slice(0, 6);
  const gallery = uploaded.length > 0 ? uploaded : DEFAULT_GALLERY;
  const heading = (opts?.galleryHeading ?? "").trim();
  const social = socialBlock(card, 0);

  const thumbs = gallery
    .map(
      (src: string) =>
        `<td style="padding:0 4px; width:16.66%;"><img src="${esc(src)}" alt="" style="display:block;width:100%;max-width:88px;height:auto;aspect-ratio:4/3;border-radius:6px;object-fit:cover;border:1px solid ${HAIR};" /></td>`,
    )
    .join("");

  const galleryRow = `
    <tr>
      <td style="padding:16px 0 0 0;">
        ${heading ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:${INK};margin-bottom:8px;">${esc(heading)}</div>` : ""}
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;"><tr>${thumbs}</tr></table>
      </td>
    </tr>`;

  // Desktop social (hidden on mobile)
  const desktopSocial = social
    ? `<td align="right" valign="middle" class="sig-hide-mobile" style="padding-left:15px;">${social}</td>`
    : "";

  // Mobile social (hidden on desktop)
  const mobileSocial = social
    ? `<!--[if !mso]><!--><div class="sig-show-mobile" style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
         <div style="margin-top:12px;">${socialBlock(card, 0)}</div>
       </div><!--<![endif]-->`
    : "";

  return `
<style>
  @media only screen and (max-width: 500px) {
    .sig-hide-mobile { display: none !important; }
    .sig-show-mobile { display: block !important; max-height: none !important; overflow: visible !important; }
    .sig-stack-column { display: block !important; width: 100% !important; padding-right: 0 !important; }
    .sig-logo-column { margin-bottom: 12px !important; text-align: left !important; }
    .sig-wrapper { padding: 16px !important; }
  }
</style>
<table cellpadding="0" cellspacing="0" border="0" width="100%" class="sig-wrapper" style="border-collapse:separate;width:100%;max-width:600px;background:#ffffff;border:1px solid ${HAIR};border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td style="padding:22px 24px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <!-- Logo Column -->
          <td valign="top" width="100" class="sig-stack-column sig-logo-column" style="padding-right:20px;">
            ${card.avatarImage ? avatarBlock(card, accent, 90, 8) : ""}
          </td>
          
          <!-- Details Column -->
          <td valign="top" class="sig-stack-column">
            
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td valign="middle">
                  <div style="font-size:20px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
                </td>
                ${desktopSocial}
              </tr>
            </table>
            
            ${card.title || card.company ? `<div style="font-size:13px;color:${SUB};margin-top:4px;">${esc(card.title)} ${card.company ? `<span style="font-weight:bold;color:${accent};">${card.title ? ', ' : ''}${esc(card.company)}</span>` : ""}</div>` : ""}
            
            <div style="border-top:1px solid ${HAIR};margin:12px 0;"></div>
            
            ${contactLetters(contactLines(card), accent)}
            
            ${mobileSocial}
            
          </td>
        </tr>
      </table>
      ${galleryRow}
    </td>
  </tr>
</table>`.trim();
}
