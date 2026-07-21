const fs = require('fs');

// 1. Update index.ts
let idx = fs.readFileSync('src/lib/signatures/index.ts', 'utf8');
if (!idx.includes('renderPro')) {
  idx += 'export { renderPro } from "./pro";\n';
  fs.writeFileSync('src/lib/signatures/index.ts', idx);
}

// 2. Update signature.ts
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

// Add Pro to the templates array right after Premium
const premiumEntry = '{ id: "premium", name: "Premium", description: "Impactful banner with a modern contact grid.", usesPhoto: true, premium: true },';
if (sig.includes(premiumEntry) && !sig.includes('"pro"')) {
  const proEntry = '{ id: "pro", name: "Pro", description: "Edge-to-edge accent block with an elegant contact grid.", usesPhoto: true, premium: true },';
  sig = sig.replace(premiumEntry, premiumEntry + '\n  ' + proEntry);
} else if (!sig.includes('"pro"')) {
  // If we couldn't find exact premium entry, just add it at the start of the array
  sig = sig.replace('export const signatureTemplates: SignatureTemplateMeta[] = [', 'export const signatureTemplates: SignatureTemplateMeta[] = [\n  { id: "pro", name: "Pro", description: "Edge-to-edge accent block with an elegant contact grid.", usesPhoto: true, premium: true },');
}

// Ensure the switch statement / render logic calls renderPro
// Our dynamic render logic already handles `funcName in templates` and dispatches correctly!
// `renderPro` will be available in `templates.renderPro`. Wait, is it?
// `templates` is `import * as templates from "./signatures";`. Yes, since we exported it in index.ts, it will automatically work!

fs.writeFileSync('src/lib/signature.ts', sig);

console.log('Restored template and added Pro template!');
