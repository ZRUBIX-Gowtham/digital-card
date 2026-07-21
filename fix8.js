const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

const oldSwitch = `switch (getSignatureTemplate(templateId).id) {
    case "executive": html = renderExecutive(card, accent); break;
    case "classic": html = renderClassic(card, accent); break;
    case "modern": html = renderModern(card, accent); break;
    case "split": html = renderSplit(card, accent); break;
    case "spotlight": html = renderSpotlight(card, accent); break;
    case "stack": html = renderStack(card, accent); break;
    case "compact": html = renderCompact(card, accent); break;
    case "corporate": html = renderCorporate(card, accent); break;
    case "monogram": html = renderMonogram(card, accent); break;
    case "refined": html = renderRefined(card, accent); break;
    case "minimal": html = renderMinimal(card, accent); break;
    case "aurora":
    default: html = renderAurora(card, accent); break;
  }`;

const newLogic = `const id = getSignatureTemplate(templateId).id;
  const methodName = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const funcName = "render" + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  
  if (funcName in templates) {
    html = (templates as any)[funcName](card, accent, opts);
  } else {
    html = templates.renderAurora(card, accent, opts);
  }`;

c = c.replace(oldSwitch, newLogic);

const ctaHrefStr = `\nexport function ctaHref(card: CardData): string {
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
}\n`;

if (!c.includes('export function ctaHref')) {
  c += ctaHrefStr;
}

fs.writeFileSync('src/lib/signature.ts', c);
console.log('Fixed renderSignature and ctaHref');
