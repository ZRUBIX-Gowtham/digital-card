const fs = require('fs');
let c = fs.readFileSync('src/lib/signatures/premium.ts', 'utf8');
c = c.replace(/\\\${/g, '${');
fs.writeFileSync('src/lib/signatures/premium.ts', c);
console.log('Fixed interpolation');
