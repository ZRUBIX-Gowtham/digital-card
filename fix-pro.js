const fs = require('fs');
let c = fs.readFileSync('src/lib/signatures/pro.ts', 'utf8');

c = c.replace(/\\`<a href=/g, '`<a href=');
c = c.replace(/<\/a>\\`/g, '</a>`');
c = c.replace(/\\\${/g, '${');
c = c.replace(/\\`<td style=/g, '`<td style=');
c = c.replace(/<\/a><\/td>\\`/g, '</a></td>`');
c = c.replace(/<\/table>\\`/g, '</table>`');

fs.writeFileSync('src/lib/signatures/pro.ts', c);
console.log('Fixed pro.ts interpolation');
