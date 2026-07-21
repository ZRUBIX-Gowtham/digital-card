const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

const switchStart = c.indexOf('switch (getSignatureTemplate(templateId).id) {');
const switchEnd = c.indexOf('  return applySignatureStyle(html, opts);', switchStart);

if (switchStart > -1 && switchEnd > -1) {
  const newLogic = `const id = getSignatureTemplate(templateId).id;
  const methodName = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const funcName = "render" + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  
  if (funcName in templates) {
    html = (templates as any)[funcName](card, accent, opts);
  } else {
    html = templates.renderAurora(card, accent, opts);
  }
`;
  c = c.substring(0, switchStart) + newLogic + c.substring(switchEnd);
  fs.writeFileSync('src/lib/signature.ts', c);
  console.log('Replaced switch successfully');
} else {
  console.log('Could not find switch boundaries');
}
