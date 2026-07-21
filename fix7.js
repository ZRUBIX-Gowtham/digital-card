const fs = require('fs');

let sig = fs.readFileSync('src/lib/signature.ts', 'utf8');

// Replace renderSignature fully
const rs = `export function renderSignature(
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
    html = templates.renderAurora(card, accent, opts);
  }
  return applySignatureStyle(html, opts);
}

export function ctaHref(card: CardData): string {
  const cta = card.cta;
  const c = card.contact ?? {};
  const v = cta?.value?.trim();
  switch (cta?.action) {
    case "phone":
      return \`tel:\${(v || c.phone || "").replace(/\\s+/g, "")}\`;
    case "email":
      return \`mailto:\${v || c.email || ""}\`;
    case "whatsapp": {
      const d = (v || c.whatsapp || "").replace(/[^\\d]/g, "");
      return d ? \`https://wa.me/\${d}\` : "#";
    }
    default:
      return v ? websiteHref(v) : c.website ? websiteHref(c.website) : "#";
  }
}`;

sig = sig.replace(/export function renderSignature\([\s\S]*?return applySignatureStyle\(html, opts\);\n\}/, rs);

fs.writeFileSync('src/lib/signature.ts', sig);

// Export ctaHref and import in campaign.ts
let camp = fs.readFileSync('src/lib/signatures/campaign.ts', 'utf8');
camp = camp.replace('DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts', 'DEFAULT_BANNER_PROMO, DEFAULT_CAMPAIGN_BANNER, SignatureStyleOpts, ctaHref');
fs.writeFileSync('src/lib/signatures/campaign.ts', camp);

console.log("Fixed renderSignature");
