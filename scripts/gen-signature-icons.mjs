// One-off generator: rasterise the brand social icons to PNG data-URIs.
// Gmail blocks SVG (incl. data:image/svg+xml) but renders raster data-URIs
// (same as an uploaded photo), so the signature needs baked PNG tiles.
// Run: node scripts/gen-signature-icons.mjs > tmp-icons.json
import sharp from "sharp";

const ICON = {
  linkedin:
    '<path fill="#fff" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
  facebook:
    '<path fill="#fff" d="M15.4 24V13.6h3.3l.5-3.5h-3.8V7.86c0-.96.47-1.9 1.96-1.9H19.4V2.99s-1.37-.24-2.68-.24c-2.74 0-4.53 1.67-4.53 4.69v2.66H8.9v3.5h3.29V24H15.4z"/>',
  twitter:
    '<path fill="#fff" d="M18.24 2.25h3.31l-7.23 8.26L22.5 21.75h-6.66l-5.22-6.82-5.97 6.82H1.34l7.73-8.84L1.5 2.25h6.83l4.72 6.24 5.19-6.24zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z"/>',
  youtube:
    '<path fill="#fff" d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.25 3.6-6.25 3.6z"/>',
  whatsapp:
    '<path fill="#fff" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>',
  instagram:
    '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="17.3" cy="6.7" r="1.3" fill="#fff"/>',
};

const COLOR = {
  linkedin: "#0a66c2",
  instagram: "#e4405f",
  twitter: "#000000",
  facebook: "#1877f2",
  youtube: "#ff0000",
  whatsapp: "#25d366",
};

const SIZE = 84; // 3× the 28px display size for crisp retina rendering
const PAD = Math.round(SIZE * 0.22);
const SCALE = (SIZE - PAD * 2) / 24;
const RX = Math.round(SIZE * 0.28);

const out = {};
for (const [key, inner] of Object.entries(ICON)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="${RX}" fill="${COLOR[key]}"/><g transform="translate(${PAD} ${PAD}) scale(${SCALE})">${inner}</g></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  out[key] = `data:image/png;base64,${png.toString("base64")}`;
}
process.stdout.write(JSON.stringify(out));
