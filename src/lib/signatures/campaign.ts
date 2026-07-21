import type { CardData } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts, ctaHref
} from "../signature";


export function renderCampaign(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);
  const social = socialBlock(card, 0);

  // Company logo (contained, never cropped), with an accent-monogram fallback.
  const logo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.company || card.name)}" width="132" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${monogramSvg(card, accent, 132, 6)}'" style="display:block;width:132px;max-width:132px;height:auto;" />`
    : `<div style="width:132px;height:132px;border-radius:6px;background:${accent};color:#ffffff;font-family:${font};font-size:48px;font-weight:bold;line-height:132px;text-align:center;">${esc(initials(card))}</div>`;

  // Inline P/E/W-labelled contacts (accent letter + value), wrapping naturally.
  const contacts = lines.length
    ? `<div style="font-size:0;">${lines
        .map(
          (l) => `<span style="display:inline-block;margin:0 20px 6px 0;font-family:${font};font-size:13px;line-height:1.4;white-space:nowrap;"><span style="font-weight:bold;color:${accent};padding-right:6px;">${esc(l.label.charAt(0).toUpperCase())}</span>${
            l.href
              ? `<a href="${esc(l.href)}" style="color:${BODY};text-decoration:none;">${esc(l.text)}</a>`
              : `<span style="color:${BODY};">${esc(l.text)}</span>`
          }</span>`,
        )
        .join("")}</div>`
    : "";

  const headline = (opts?.bannerText ?? card.cta?.title ?? card.tagline ?? "").trim();
  const btnLabel = (opts?.bannerButton || card.cta?.buttonLabel || "Get a free quote").trim();
  const bannerImage = (opts?.bannerImage ?? "").trim();
  const button = `<a href="${esc(ctaHref(card))}" style="display:inline-block;background:${accent};color:#ffffff;font-family:${font};font-size:13px;font-weight:bold;letter-spacing:.6px;text-transform:uppercase;text-decoration:none;padding:12px 26px;border-radius:4px;">${esc(btnLabel)}</a>`;

  // The image panel is only shown when a banner graphic is set; otherwise the
  // call-to-action panel spans the full banner width on its own.
  const imagePanel = bannerImage
    ? `<td width="44%" valign="middle" background="${esc(bannerImage)}" style="width:44%;background:${accent};background-image:url('${esc(bannerImage)}');background-size:cover;background-position:center;">
            <div style="height:150px;line-height:150px;font-size:0;">&nbsp;</div>
          </td>`
    : "";
  const banner =
    headline || bannerImage
      ? `
  <tr>
    <td style="padding:0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;">
        <tr>
          ${imagePanel}
          <td valign="middle" style="background:#eef2f6;padding:26px 30px;">
            ${headline ? `<div style="font-family:${font};font-size:22px;color:${INK};line-height:1.28;letter-spacing:.3px;">${esc(headline)}</div>` : ""}
            <div style="margin-top:${headline ? "16px" : "0"};">${button}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
      : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:620px;max-width:100%;background:#ffffff;border:1px solid ${HAIR};border-radius:6px;overflow:hidden;">
  <tr>
    <td style="padding:26px 30px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="156" valign="middle" style="padding-right:24px;">${logo}</td>
          <td valign="middle">
            <div style="font-family:${font};font-size:23px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
            ${
              card.title || card.company
                ? `<div style="font-family:${font};font-size:14px;color:${SUB};margin-top:3px;">${esc(card.title)}${card.title && card.company ? ", " : ""}${card.company ? `<span style="color:${accent};font-weight:bold;">${esc(card.company)}</span>` : ""}</div>`
                : ""
            }
            <div style="border-top:1px solid ${HAIR};margin:14px 0;"></div>
            ${contacts}
            ${social ? `<div style="margin-top:12px;">${social}</div>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>${banner}
</table>`.trim();
}
