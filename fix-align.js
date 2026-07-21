const fs = require('fs');

let c = fs.readFileSync('src/lib/signatures/promo.ts', 'utf8');

const oldGridStart = `  let rowsHtml = '';
  if (aLine) {
    rowsHtml += \`<tr>
      <td colspan="2" style="padding:0 0 8px 0;font-family:\${font};font-size:13px;color:\${INK};line-height:1.4;">
        <img src="\${iconSvg('Address', accent)}" width="14" height="14" style="vertical-align:middle;margin-right:6px;" alt="" />
        <span style="vertical-align:middle;">\${esc(aLine.text)}</span>
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
      rowsHtml += \`<td style="padding:0 24px 8px 0;font-family:\${font};font-size:13px;color:\${INK};white-space:nowrap;">
        <img src="\${iconSvg(c1.label, accent)}" width="14" height="14" style="vertical-align:middle;margin-right:6px;" alt="" />
        <span style="vertical-align:middle;">\${c1.href ? \\\`<a href="\${esc(c1.href)}" style="color:\${INK};text-decoration:none;">\${esc(c1.text)}</a>\\\` : esc(c1.text)}</span>
      </td>\`;
    }
    if (c2) {
      rowsHtml += \`<td style="padding:0 0 8px 0;font-family:\${font};font-size:13px;color:\${INK};white-space:nowrap;">
        <img src="\${iconSvg(c2.label, accent)}" width="14" height="14" style="vertical-align:middle;margin-right:6px;" alt="" />
        <span style="vertical-align:middle;">\${c2.href ? \\\`<a href="\${esc(c2.href)}" style="color:\${INK};text-decoration:none;">\${esc(c2.text)}</a>\\\` : esc(c2.text)}</span>
      </td>\`;
    } else {
      rowsHtml += \`<td></td>\`;
    }
    rowsHtml += \`</tr>\`;
  });`;

const newGridStart = `  let rowsHtml = '';
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
  });`;

c = c.replace(oldGridStart, newGridStart);

// Let's also fix the gap between avatar and text to 16px instead of 24px so it looks more balanced
c = c.replace('padding:0 24px 0 0;', 'padding:0 16px 0 0;');

fs.writeFileSync('src/lib/signatures/promo.ts', c);
console.log('Fixed alignments');
