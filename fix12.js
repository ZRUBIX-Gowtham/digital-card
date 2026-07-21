const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

c = c.replace(
  '  /** Social handles keyed by platform; empty values are simply not shown. */',
  `  gallery?: string[];
  galleryHeading?: string;
  bannerText?: string;
  bannerButton?: string;
  bannerImage?: string;
  /** Social handles keyed by platform; empty values are simply not shown. */`
);

c = c.replace(
  '    hide: s.hide ?? [],',
  `    hide: s.hide ?? [],
    gallery: s.gallery ?? [],
    galleryHeading: s.galleryHeading ?? "",
    bannerText: s.bannerText ?? "",
    bannerButton: s.bannerButton ?? "",
    bannerImage: s.bannerImage ?? "",`
);

c = c.replace(
  '    hide: d.hide,',
  `    hide: d.hide,
    gallery: d.gallery,
    galleryHeading: d.galleryHeading,
    bannerText: d.bannerText,
    bannerButton: d.bannerButton,
    bannerImage: d.bannerImage,`
);

fs.writeFileSync('src/lib/signature.ts', c);
console.log('Fixed SignatureDraft in signature.ts');
