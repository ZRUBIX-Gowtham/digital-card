const fs = require('fs');

// Fix signature.ts: Add isNew? to SignatureTemplateMeta
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');
sig = sig.replace('export interface SignatureTemplateMeta {', 'export interface SignatureTemplateMeta {\n  isNew?: boolean;');
fs.writeFileSync('src/lib/signature.ts', sig);

// Fix types/card.ts: Add gallery to SignatureDraft
let cardType = fs.readFileSync('src/types/card.ts', 'utf8');
if (!cardType.includes('gallery?:')) {
  cardType = cardType.replace('bannerImage?: string;', 'bannerImage?: string;\n  gallery?: string[];');
  fs.writeFileSync('src/types/card.ts', cardType);
}

// Fix aurora.ts: Add opts
let aurora = fs.readFileSync('src/lib/signatures/aurora.ts', 'utf8');
aurora = aurora.replace('export function renderAurora(card: CardData, accent: string): string {', 'export function renderAurora(card: CardData, accent: string, opts?: SignatureStyleOpts): string {');
fs.writeFileSync('src/lib/signatures/aurora.ts', aurora);

console.log('Fixed final types');
