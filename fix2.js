const fs = require('fs');
let c = fs.readFileSync('src/lib/signature.ts', 'utf8');

c = c.replace('? \\`<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>\\`',
              '? `<a href="${esc(l.href)}" style="color:${valueColor};text-decoration:none;">${esc(l.text)}</a>`');

fs.writeFileSync('src/lib/signature.ts', c);
