const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');
c = c.replace(/\\`<a href=/g, '`<a href=');
c = c.replace(/<\/a>\\`/g, '</a>`');
fs.writeFileSync('src/lib/signature.ts', c);
console.log('Fixed');
