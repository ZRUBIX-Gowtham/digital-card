import type { CardData } from "@/types/card";
import {
  esc, contactLines, displayWebsite, websiteHref, avatarBlock, socialHref,
  socialIconImg, INK, BODY, SUB, HAIR, SignatureStyleOpts, DEFAULT_BOUTIQUE_GALLERY,
} from "../signature";

/** Sample recent-listing details shown until the agent supplies their own. */
const SAMPLE_LISTINGS = [
  { addr: "3335 Taylor St\nNew York, NY 10010", price: "$1,829,000", specs: "2.5bd / 1.5ba / 1,442 sqft" },
  { addr: "1627 Webster St\nNew Brunswick, NJ 08901", price: "$1,119,000", specs: "1bd / 1.5ba / 1,022 sqft" },
];

/**
 * Realtor — a real-estate signature. A photo sits beside a name lockup, plain
 * contacts and brand social tiles; a "recent listings" heading introduces two
 * property cards (image + address + price + specs). Listing photos come from the
 * showcase-images field; the heading is editable via the gallery-heading field.
 */
export function renderRealtor(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);
  const c = card.contact ?? {};

  const photo = avatarBlock(card, accent, 150, 4);

  // Plain contacts: address, phone | email, website (accent).
  const phone = c.phone?.trim();
  const email = c.email?.trim();
  const web = c.website?.trim();
  const addr = c.address?.trim();
  const pipe = `<span style="color:${accent};padding:0 10px;">|</span>`;
  const contactBlock = `
    <div style="font-family:${font};font-size:15px;color:${BODY};line-height:1.6;">
      ${addr ? `<div>${esc(addr)}</div>` : ""}
      ${(phone || email) ? `<div>${phone ? `<a href="tel:${esc(phone.replace(/\s+/g, ""))}" style="color:${BODY};text-decoration:none;">${esc(phone)}</a>` : ""}${phone && email ? pipe : ""}${email ? `<a href="mailto:${esc(email)}" style="color:${BODY};text-decoration:none;">${esc(email)}</a>` : ""}</div>` : ""}
      ${web ? `<div><a href="${esc(websiteHref(web))}" style="color:${accent};font-weight:bold;text-decoration:none;">${esc(displayWebsite(web))}</a></div>` : ""}
    </div>`;

  // Brand-coloured square social tiles.
  const socials = (card.socials ?? []).filter((s) => s.url?.trim());
  const chips = socials
    .map((s) => {
      const icon = socialIconImg(s.platform, 32, 4);
      const inner = icon
        ? icon
        : `<span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;background:${accent};color:#ffffff;border-radius:4px;font-family:${font};font-size:13px;font-weight:bold;">${esc(s.platform.charAt(0).toUpperCase())}</span>`;
      return `<td style="padding:0 8px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">${inner}</a></td>`;
    })
    .join("");
  const social = chips
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;"><tr>${chips}</tr></table>`
    : "";

  // Recent-listings heading with a small house icon.
  const heading = (opts?.galleryHeading || "My Recent Listings").trim();
  const houseSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></svg>`,
  )}`;
  const headingRow = heading
    ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
        <td valign="middle" style="padding-right:8px;line-height:0;"><img src="${houseSvg}" width="18" height="18" alt="" style="display:block;" /></td>
        <td valign="middle" style="font-family:${font};font-size:16px;color:${INK};">${esc(heading)}</td>
      </tr></table>`
    : "";

  // Two listing cards: image + address (accent) + price + specs.
  const imgs = (opts?.gallery ?? []).map((s) => s.trim()).filter(Boolean);
  const defaultImages = [DEFAULT_BOUTIQUE_GALLERY[0], DEFAULT_BOUTIQUE_GALLERY[4]];
  const listings = SAMPLE_LISTINGS.map((l, i) => ({ ...l, img: imgs[i] || defaultImages[i] }));
  const listingCard = (l: (typeof listings)[number]) => `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
      <td width="104" valign="top" style="padding-right:14px;">
        <img src="${esc(l.img)}" alt="" width="104" height="78" style="display:block;width:104px;max-width:104px;height:78px;object-fit:cover;border-radius:4px;" />
      </td>
      <td valign="top" style="font-family:${font};">
        <div style="font-size:13px;font-weight:bold;color:${accent};line-height:1.35;">${esc(l.addr).replace(/\n/g, "<br/>")}</div>
        <div style="font-size:13px;color:${BODY};margin-top:8px;">For sale: <span style="font-weight:bold;color:${INK};">${esc(l.price)}</span></div>
        <div style="font-size:12px;color:${SUB};margin-top:2px;">${esc(l.specs)}</div>
      </td>
    </tr></table>`;
  const listingsBlock = `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;table-layout:fixed;margin-top:12px;"><tr>
      <td width="48%" valign="top">${listingCard(listings[0])}</td>
      <td width="4%">&nbsp;</td>
      <td width="48%" valign="top">${listingCard(listings[1])}</td>
    </tr></table>`;

  const role = card.title || card.company
    ? `<div style="font-family:${font};font-size:16px;color:${BODY};margin-top:4px;">${esc(card.title || "")}${card.title && card.company ? " at " : ""}${card.company ? `<span style="color:${accent};">${esc(card.company)}</span>` : ""}</div>`
    : "";

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;font-family:${font};">
  <tr>
    <td style="padding:0 0 8px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td width="150" valign="top" style="padding:0 22px 0 0;">${photo}</td>
          <td valign="top">
            <div style="font-family:${font};font-size:24px;font-weight:bold;color:${INK};line-height:1.15;">${esc(card.name)}</div>
            ${role}
            <div style="border-top:1px solid ${HAIR};margin:14px 0;"></div>
            ${contactBlock}
            ${social}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 0 0 0;">${headingRow}</td>
  </tr>
  <tr>
    <td>${listingsBlock}</td>
  </tr>
</table>`.trim();
}
