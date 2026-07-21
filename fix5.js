const fs = require('fs');

let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

// Update SignatureStyleOpts
sig = sig.replace('bannerImage?: string;', 'bannerImage?: string;\n  bannerText?: string;\n  bannerButton?: string;\n  gallery?: string[];\n  galleryHeading?: string;');

// Add contactLetters and DEFAULT_GALLERY
if (!sig.includes('contactLetters')) {
  sig = sig.replace('/* ------------------------------------------------------------- templates */',
  `export const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
];

export function contactLetters(lines: Line[], accent: string, valueColor: string = BODY): string {
  const rows = lines
    .map(
      (l) => \`
        <tr>
          <td style="padding:2px 8px 2px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:\${accent};vertical-align:middle;">\${esc(l.label.charAt(0).toUpperCase())}</td>
          <td style="padding:2px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:\${valueColor};line-height:1.4;vertical-align:middle;">\${
            l.href
              ? \\\`<a href="\${esc(l.href)}" style="color:\${valueColor};text-decoration:none;">\${esc(l.text)}</a>\\\`
              : esc(l.text)
          }</td>
        </tr>\`,
    )
    .join("");
  return \`<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">\${rows}</table>\`;
}

/* ------------------------------------------------------------- templates */`);
}

fs.writeFileSync('src/lib/signature.ts', sig);

// Update listings.ts
let lst = fs.readFileSync('src/lib/signatures/listings.ts', 'utf8');
lst = lst.replace('DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts', 'DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts, contactLetters, DEFAULT_GALLERY');
lst = lst.replace('(s) =>', '(s: string) =>');
lst = lst.replace('(src) =>', '(src: string) =>');
fs.writeFileSync('src/lib/signatures/listings.ts', lst);

// Fix premium.ts
let prem = fs.readFileSync('src/lib/signatures/premium.ts', 'utf8');
prem = prem.replace('socialBlock(card, 16, false, 100)', 'socialBlock(card, 16, false)');
fs.writeFileSync('src/lib/signatures/premium.ts', prem);

console.log("Fixed all remaining errors");
