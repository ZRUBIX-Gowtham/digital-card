const fs = require('fs');

// 1. Update index.ts
let idx = fs.readFileSync('src/lib/signatures/index.ts', 'utf8');
if (!idx.includes('renderPromo')) {
  idx += 'export { renderPromo } from "./promo";\n';
  fs.writeFileSync('src/lib/signatures/index.ts', idx);
}

// 2. Update signature.ts
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

if (!sig.includes('"promo"')) {
  const newEntry = '  { id: "promo", name: "Promo", description: "Classic grid with accent stroke icons and banner.", usesPhoto: true, premium: true },\n';
  sig = sig.replace('export const signatureTemplates: SignatureTemplateMeta[] = [\n', 'export const signatureTemplates: SignatureTemplateMeta[] = [\n' + newEntry);
}

fs.writeFileSync('src/lib/signature.ts', sig);

console.log('Added Promo template!');
