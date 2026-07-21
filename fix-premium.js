const fs = require('fs');
let c = fs.readFileSync('src/lib/signatures/premium.ts', 'utf8');
c = c.replace(/\\`<a href=/g, '`<a href=');
c = c.replace(/<\/a>\\`/g, '</a>`');
fs.writeFileSync('src/lib/signatures/premium.ts', c);
console.log('Fixed');
