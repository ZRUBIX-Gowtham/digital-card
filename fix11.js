const fs = require('fs');

// Fix signature.ts: Add premium? to SignatureTemplateMeta
let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');
sig = sig.replace('isNew?: boolean;', 'isNew?: boolean;\n  premium?: boolean;');
fs.writeFileSync('src/lib/signature.ts', sig);

// Fix types/card.ts: Add gallery to SignatureDraft properly
let cardType = fs.readFileSync('src/types/card.ts', 'utf8');
if (!cardType.includes('gallery?:')) {
  cardType = cardType.replace('bannerImage?: string;', 'bannerImage?: string;\n  gallery?: string[];\n  galleryHeading?: string;\n  bannerText?: string;\n  bannerButton?: string;');
  fs.writeFileSync('src/types/card.ts', cardType);
}

// Fix SignatureStudio.tsx
let studio = fs.readFileSync('src/components/dashboard/SignatureStudio.tsx', 'utf8');
studio = studio.replace(/\(img, i\) =>/g, '(img: string, i: number) =>');
fs.writeFileSync('src/components/dashboard/SignatureStudio.tsx', studio);

console.log('Fixed final types part 2');
