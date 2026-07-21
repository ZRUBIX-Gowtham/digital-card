const fs = require('fs');

let c = fs.readFileSync('src/lib/signature.ts', 'utf8');
c = c.replace('gallery?: string[];', 'gallery: string[];');
c = c.replace('galleryHeading?: string;', 'galleryHeading: string;');
c = c.replace('bannerText?: string;', 'bannerText: string;');
c = c.replace('bannerButton?: string;', 'bannerButton: string;');
c = c.replace('bannerImage?: string;', 'bannerImage: string;');
fs.writeFileSync('src/lib/signature.ts', c);

console.log('Fixed SignatureDraft strict types');
