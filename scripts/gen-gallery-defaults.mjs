// One-off generator: default placeholder thumbnails for the Listings design's
// gallery strip, as PNG data-URIs (Gmail-safe raster, like the brand icons).
// Run: node scripts/gen-gallery-defaults.mjs > tmp-gallery.json
import sharp from "sharp";

// Muted two-tone gradients so the strip reads as "your photos go here".
const HUES = [
  ["#e2e8f0", "#cbd5e1"],
  ["#dbeafe", "#bfdbfe"],
  ["#ccfbf1", "#99f6e4"],
  ["#fef3c7", "#fde68a"],
];

const W = 264; // 3× the 88px display width
const H = 198; // 3× the 66px display height

const out = [];
for (let i = 0; i < HUES.length; i++) {
  const [c1, c2] = HUES[i];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 176 132">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <rect width="176" height="132" rx="14" fill="url(#g)"/>
    <circle cx="54" cy="46" r="11" fill="#64748b" fill-opacity="0.5"/>
    <path d="M22 106 L64 62 L96 92 L120 74 L154 106 Z" fill="#64748b" fill-opacity="0.5"/>
  </svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  out.push(`data:image/png;base64,${png.toString("base64")}`);
}
process.stdout.write(JSON.stringify(out));
