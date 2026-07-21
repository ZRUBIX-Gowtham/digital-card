const fs = require('fs');

let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

// 1. Export helpers
const helpers = [
  'function esc(', 'function displayWebsite(', 'function websiteHref(',
  'function contactLines(', 'function accentOf(', 'function initials(',
  'function roleParts(', 'function monogramSvg(', 'function avatarBlock(',
  'function contactGrid(', 'function contactBadges(', 'function socialIconImg(',
  'function socialHref(', 'function socialBlock(', 'function contactInline(',
  'const INK =', 'const SUB =', 'const BODY =', 'const HAIR ='
];
helpers.forEach(h => {
  c = c.replace(h, 'export ' + h);
});

// tint function
c = c.replace('function tint(', 'export function tint(');

// 2. Remove all templates
// Find "/* ------------------------------------------------------------- templates */"
const tmplStart = c.indexOf('/* ------------------------------------------------------------- templates */');
const tmplEndStr = 'function applySignatureStyle';
const tmplEnd = c.indexOf(tmplEndStr);

const templatesSection = c.slice(tmplStart, tmplEnd);
c = c.replace(templatesSection, `/* ------------------------------------------------------------- templates */\nimport * as templates from "./signatures";\n\n`);

// 3. Update applySignatureStyle and renderSignature
// applySignatureStyle stays as is. We just need to replace renderSignature.
const renderSigRegex = /export function renderSignature\([\s\S]*?\)\s*:\s*string\s*\{[\s\S]*?return applySignatureStyle\(html, opts\);\n\}/;
const newRenderSig = `export function renderSignature(
  card: CardData,
  templateId?: string,
  opts?: SignatureStyleOpts,
): string {
  const accent = accentOf(card);
  let html: string;
  const id = getSignatureTemplate(templateId).id;
  
  const methodName = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const funcName = "render" + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  
  if (funcName in templates) {
    html = (templates as any)[funcName](card, accent, opts);
  } else {
    html = templates.renderAurora(card, accent);
  }
  return applySignatureStyle(html, opts);
}`;

c = c.replace(renderSigRegex, newRenderSig);

// 4. Update signatureTemplates array with the new templates
const sigArrayRegex = /export const signatureTemplates: SignatureTemplateMeta\[\] = \[([\s\S]*?)\];/;
const newSigArray = `export const signatureTemplates: SignatureTemplateMeta[] = [
  { id: "premium", name: "Premium", description: "Premium layout with public images and clean contacts.", usesPhoto: true, isNew: true, premium: true },
  { id: "campaign", name: "Campaign", description: "Logo lockup, letter contacts & social tiles over an image banner with a quote button.", usesPhoto: true, isNew: true, premium: true },
  { id: "banner", name: "Banner", description: "Letter-label contacts over an accent call-to-action banner.", usesPhoto: true, isNew: true, premium: true },
  { id: "listings", name: "Listings", description: "Logo, social icons & a gallery strip — great for realtors & shops.", usesPhoto: true },
$1];`;
c = c.replace(sigArrayRegex, newSigArray);

fs.writeFileSync('src/lib/signature.ts', c);
console.log('Fixed clean signature.ts');
