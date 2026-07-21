// One-off generator: rasterise white contact glyphs (phone / website / email)
// to transparent PNG data-URIs. White-on-transparent so they can sit on an
// accent-coloured chip in the signature and follow the chosen accent colour.
// Gmail blocks SVG data-URIs but renders raster PNGs. Paste output into
// CONTACT_ICON_PNG in src/lib/signature.ts.
// Run: node scripts/gen-contact-icons.mjs > tmp-contact-icons.json
import sharp from "sharp";

// Feather-style stroke glyphs (24x24 viewBox).
const ICON = {
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  website:
    '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  email:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/>',
  address:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
};

const SIZE = 72; // 3× the 24px display size for crisp retina rendering
const PAD = Math.round(SIZE * 0.06);
const SCALE = (SIZE - PAD * 2) / 24;

const out = {};
for (const [key, inner] of Object.entries(ICON)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><g transform="translate(${PAD} ${PAD}) scale(${SCALE})" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  out[key] = `data:image/png;base64,${png.toString("base64")}`;
}
process.stdout.write(JSON.stringify(out));
