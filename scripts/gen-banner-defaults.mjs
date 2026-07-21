// One-off generator: default promo-banner background images as PNG data-URIs.
// These are the fallback graphics the Banner / Festive signature designs show
// when the user hasn't uploaded their own banner image. Raster so they survive
// a paste into Gmail. Paste output into src/lib/signature-assets.ts.
// Run: node scripts/gen-banner-defaults.mjs > tmp-banners.json
import sharp from "sharp";

const W = 640;
const H = 150;

// A scattered heart (24x24 unit path) at (x,y) with scale s and opacity o.
const HEART =
  "M12 21s-7.5-4.9-10-9.5C.5 8 2 4 5.5 4 7.5 4 9 5.2 12 8c3-2.8 4.5-4 6.5-4C22 4 23.5 8 22 11.5 19.5 16.1 12 21 12 21z";
const heart = (x, y, s, o, fill = "#ffffff") =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="${HEART}" fill="${fill}" fill-opacity="${o}"/></g>`;

// Festive: warm red gradient with scattered translucent hearts.
const festiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e11d48"/><stop offset="1" stop-color="#b0111d"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${heart(18, 84, 2.6, 0.14)}
  ${heart(70, 20, 1.6, 0.1)}
  ${heart(540, 16, 3.2, 0.12)}
  ${heart(600, 92, 2.2, 0.16)}
  ${heart(470, 96, 1.5, 0.1)}
  ${heart(360, -6, 1.8, 0.08)}
  ${heart(120, 110, 1.3, 0.12)}
</svg>`;

// Promo: deep slate with a soft diagonal light sweep + faint dots.
const promoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="0.4">
    <stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#1e293b"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#p)"/>
  <polygon points="0,0 260,0 120,${H} 0,${H}" fill="#ffffff" fill-opacity="0.03"/>
  <circle cx="560" cy="30" r="90" fill="#ffffff" fill-opacity="0.03"/>
  <circle cx="610" cy="120" r="50" fill="#ffffff" fill-opacity="0.03"/>
</svg>`;

const out = {};
for (const [key, svg] of Object.entries({ festive: festiveSvg, promo: promoSvg })) {
  const png = await sharp(Buffer.from(svg)).png({ quality: 82, compressionLevel: 9 }).toBuffer();
  out[key] = `data:image/png;base64,${png.toString("base64")}`;
}
process.stdout.write(JSON.stringify(out));
