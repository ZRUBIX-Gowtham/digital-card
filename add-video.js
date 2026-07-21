const fs = require('fs');

// 1. Update index.ts
let idx = fs.readFileSync('src/lib/signatures/index.ts', 'utf8');
if (!idx.includes('renderVideo')) {
  idx += 'export { renderVideo } from "./video";\n';
  fs.writeFileSync('src/lib/signatures/index.ts', idx);
}

// 2. Update signature.ts
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

if (!sig.includes('"video"')) {
  const newEntry = '  { id: "video", name: "Video Layout", description: "Right aligned photo with a YouTube video block at the bottom.", usesPhoto: true, premium: true },\n';
  sig = sig.replace('export const signatureTemplates: SignatureTemplateMeta[] = [\n', 'export const signatureTemplates: SignatureTemplateMeta[] = [\n' + newEntry);
}

fs.writeFileSync('src/lib/signature.ts', sig);

console.log('Added Video template!');
