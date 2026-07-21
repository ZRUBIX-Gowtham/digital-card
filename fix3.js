const fs = require('fs');
const path = require('path');
const dir = 'src/lib/signatures';

const unifiedImports = `import type { CardData, SignatureStyleOpts } from "@/types/card";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR, tint, Line,
  DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER
} from "../signature";

`;

let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');
if (!sig.includes('DEFAULT_BANNER_PROMO')) {
  sig = sig.replace('/* ------------------------------------------------------------- templates */', 
  `export const DEFAULT_BANNER_PROMO = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80";\nexport const DEFAULT_CAMPAIGN_BANNER = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80";\n/* ------------------------------------------------------------- templates */`);
  fs.writeFileSync('src/lib/signature.ts', sig);
}

const files = fs.readdirSync(dir);
for (const file of files) {
  if (file === 'index.ts' || !file.endsWith('.ts')) continue;
  const p = path.join(dir, file);
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace old imports
  c = c.replace(/^import type \{ CardData \}.*?\n/m, "");
  c = c.replace(/^import \{ SignatureStyleOpts \}.*?\n/m, "");
  c = c.replace(/^import \{[\s\S]*?\} from "\.\.\/signature";\n/m, "");
  // Note: You may need to import 'tint' comment
  c = c.replace(/\/\/ Note: You may need to import 'tint'[\s\S]*?\n\n/m, "");
  
  c = unifiedImports + c;
  fs.writeFileSync(p, c);
}
console.log("Fixed templates");
