const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

c = c.replace(/\\\\/g, '\\');
c = c.replace(/\\`/g, '`');

fs.writeFileSync('src/lib/signature.ts', c);
console.log("Fixed!");
