const fs = require('fs');

// 1. Update index.ts
let idx = fs.readFileSync('src/lib/signatures/index.ts', 'utf8');
if (!idx.includes('renderExclusive')) {
  idx += 'export { renderExclusive } from "./exclusive";\n';
  fs.writeFileSync('src/lib/signatures/index.ts', idx);
}

// 2. Update signature.ts
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

if (!sig.includes('"exclusive"')) {
  const newEntry = '  { id: "exclusive", name: "Exclusive", description: "Inline contacts with bottom banner and quote.", usesPhoto: true, premium: true },\n';
  sig = sig.replace('export const signatureTemplates: SignatureTemplateMeta[] = [\n', 'export const signatureTemplates: SignatureTemplateMeta[] = [\n' + newEntry);
}

fs.writeFileSync('src/lib/signature.ts', sig);

console.log('Added Exclusive template!');
