const fs = require('fs');
const path = require('path');
const dir = 'src/lib/signatures';

// Export Line in signature.ts
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');
sig = sig.replace('interface Line {', 'export interface Line {');

// We also need SignatureStyleOpts in signature.ts. It's actually there!
// Wait, no it's not. I'll just append it to signature.ts
if (!sig.includes('export interface SignatureStyleOpts')) {
  sig = sig.replace('export interface SignatureTemplateMeta', 'export interface SignatureStyleOpts {\n  font?: string;\n  textColor?: string;\n  bannerImage?: string;\n}\n\nexport interface SignatureTemplateMeta');
}
fs.writeFileSync('src/lib/signature.ts', sig);

// Update templates to import SignatureStyleOpts from ../signature
const files = fs.readdirSync(dir);
for (const file of files) {
  if (file === 'index.ts' || !file.endsWith('.ts')) continue;
  const p = path.join(dir, file);
  let c = fs.readFileSync(p, 'utf8');
  
  c = c.replace('import type { CardData, SignatureStyleOpts } from "@/types/card";', 'import type { CardData } from "@/types/card";');
  c = c.replace('DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER', 'DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts');
  
  fs.writeFileSync(p, c);
}
console.log("Fixed exports and imports");
