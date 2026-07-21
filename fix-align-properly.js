const fs = require('fs');

let c = fs.readFileSync('src/lib/signatures/promo.ts', 'utf8');

// Find the boundaries
const startSplit = '// Build grid';
const endSplit = 'const bannerImage = (opts?.bannerImage';

const startIndex = c.indexOf(startSplit);
const endIndex = c.indexOf(endSplit);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

const before = c.substring(0, startIndex);
const after = c.substring(endIndex);

const newMiddle = `// Build grid
  let pLine = lines.find((l) => l.label === 'Phone');
  let eLine = lines.find((l) => l.label === 'Email');
  let wLine = lines.find((l) => l.label === 'Web');
  let aLine = lines.find((l) => l.label === 'Address');

  let rowsHtml = '';
  if (aLine) {
    rowsHtml += \`<tr>
      <td colspan="2" style="padding:0 0 8px 0;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="\${iconSvg('Address', accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:\${font};font-size:13px;color:\${INK};line-height:1.4;">\${esc(aLine.text)}</td>
          </tr>
        </table>
      </td>
    </tr>\`;
  }
  
  let pairs = [];
  let others = [pLine, eLine, wLine].filter(Boolean);
  for (let i = 0; i < others.length; i += 2) {
    pairs.push([others[i], others[i+1]]);
  }

  pairs.forEach(([c1, c2]) => {
    rowsHtml += \`<tr>\`;
    if (c1) {
      rowsHtml += \`<td style="padding:0 24px 8px 0;white-space:nowrap;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="\${iconSvg(c1.label, accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:\${font};font-size:13px;color:\${INK};white-space:nowrap;">\${c1.href ? \\\`<a href="\${esc(c1.href)}" style="color:\${INK};text-decoration:none;">\${esc(c1.text)}</a>\\\` : esc(c1.text)}</td>
          </tr>
        </table>
      </td>\`;
    }
    if (c2) {
      rowsHtml += \`<td style="padding:0 0 8px 0;white-space:nowrap;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="padding-right:6px;line-height:0;"><img src="\${iconSvg(c2.label, accent)}" width="14" height="14" style="display:block;" alt="" /></td>
            <td valign="middle" style="font-family:\${font};font-size:13px;color:\${INK};white-space:nowrap;">\${c2.href ? \\\`<a href="\${esc(c2.href)}" style="color:\${INK};text-decoration:none;">\${esc(c2.text)}</a>\\\` : esc(c2.text)}</td>
          </tr>
        </table>
      </td>\`;
    } else {
      rowsHtml += \`<td></td>\`;
    }
    rowsHtml += \`</tr>\`;
  });

  const contactsHtml = rowsHtml ? \`<table cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">\${rowsHtml}</table>\` : "";

  // Social icons (brand colored)
  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const icon = socialIconImg(s.platform, 28, 14); // circular
        if (!icon) return \`<td style="padding:0 8px 0 0;"><a href="\${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;font-family:\${font};font-size:14px;color:\${accent};">\${esc(s.platform.charAt(0).toUpperCase())}</a></td>\`;
        return \`<td style="padding:0 8px 0 0;"><a href="\${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">\${icon}</a></td>\`;
    }).join("");
    social = \`<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;"><tr>\${chips}</tr></table>\`;
  }

  `;

let finalContent = before + newMiddle + after;
// Also fix avatar gap from 24px to 16px if not already done
finalContent = finalContent.replace('padding:0 24px 0 0;', 'padding:0 16px 0 0;');

fs.writeFileSync('src/lib/signatures/promo.ts', finalContent);
console.log('Fixed properly!');
