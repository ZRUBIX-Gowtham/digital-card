const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'lib', 'signature.ts');
const sigDir = path.join(__dirname, 'src', 'lib', 'signatures');
if (!fs.existsSync(sigDir)) {
  fs.mkdirSync(sigDir, { recursive: true });
}

let content = fs.readFileSync(srcPath, 'utf8');

// Find the start of templates
const templatesMarker = '/* ------------------------------------------------------------- templates */';
const templatesStart = content.indexOf(templatesMarker);

let topPart = content.slice(0, templatesStart + templatesMarker.length);
let restPart = content.slice(templatesStart + templatesMarker.length);

// We need to export many helpers in topPart
const helpersToExport = [
  'const INK =', 'const SUB =', 'const BODY =', 'const HAIR =',
  'function esc(', 'function displayWebsite(', 'function websiteHref(',
  'function contactLines(', 'function accentOf(', 'function initials(',
  'function roleParts(', 'function monogramSvg(', 'function avatarBlock(',
  'function contactGrid(', 'function contactBadges(', 'function socialIconImg(',
  'function socialHref(', 'function socialBlock(', 'function contactInline(',
  'function tint('
];
helpersToExport.forEach(h => {
  topPart = topPart.replace(h, 'export ' + h);
});

// We must also extract tint which might be somewhere. Let's see if it gets exported.

// Now find all template functions
const regex = /(?:function\s+(render[a-zA-Z0-9_]+)\s*\([\s\S]*?\)\s*:\s*string\s*\{[\s\S]*?\n\})/g;
let match;
const imports = [];
const templates = [];

let cleanRest = restPart;

while ((match = regex.exec(restPart)) !== null) {
  const fullFunc = match[0];
  const funcName = match[1];
  templates.push({ name: funcName, code: fullFunc });
  cleanRest = cleanRest.replace(fullFunc, '');
}

// Write each template to a file
const indexExports = [];
templates.forEach(t => {
  // Convert name (e.g. renderPremiumCreative -> premiumCreative) to filename
  const fileName = t.name.replace(/^render/, '');
  const kebabName = fileName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  
  const fileCode = `import type { CardData } from "@/types/card";
import { SignatureStyleOpts } from "@/lib/signature";
import {
  esc, displayWebsite, websiteHref, contactLines, accentOf, initials, roleParts,
  monogramSvg, avatarBlock, contactGrid, contactBadges, socialIconImg,
  socialHref, socialBlock, contactInline, INK, SUB, BODY, HAIR
} from "../signature";

// Note: You may need to import 'tint' if it's used, but let's just import all from signature.ts if needed.
// Actually, let's just import everything that is exported.
// We'll rely on the IDE/tsc to catch minor missing imports, or we can just import * as utils.

export ${t.code}
`;

  // We should fix the tint import if it's there
  const finalFileCode = fileCode.includes('tint(') 
    ? fileCode.replace('} from "../signature";', ', tint } from "../signature";')
    : fileCode;

  fs.writeFileSync(path.join(sigDir, kebabName + '.ts'), finalFileCode, 'utf8');
  indexExports.push(`export { ${t.name} } from "./${kebabName}";`);
  imports.push(`import { ${t.name} } from "./signatures/${kebabName}";`);
});

// Write index.ts for signatures directory
fs.writeFileSync(path.join(sigDir, 'index.ts'), indexExports.join('\n') + '\n', 'utf8');

// Reconstruct signature.ts
const finalImports = imports.join('\n') + '\n';
const finalContent = topPart + '\n' + finalImports + '\n' + cleanRest;

fs.writeFileSync(srcPath, finalContent, 'utf8');

console.log('Refactoring complete!');
