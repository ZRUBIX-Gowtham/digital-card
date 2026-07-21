const fs = require('fs');
let c = fs.readFileSync('src/lib/signatures/premium.ts', 'utf8');

c = c.replace('avatarBlock, socialHref, INK, tint, SignatureStyleOpts', 'avatarBlock, socialHref, INK, tint, SignatureStyleOpts, socialIconImg');

const oldSocialCode = `  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const SOCIAL_META: Record<string, { glyph: string }> = {
            linkedin: { glyph: "in" },
            instagram: { glyph: "IG" },
            twitter: { glyph: "X" },
            facebook: { glyph: "f" },
            youtube: { glyph: "YT" },
            whatsapp: { glyph: "WA" },
        };
        const m = SOCIAL_META[s.platform] || { glyph: s.platform.charAt(0).toUpperCase() };
        return \`<td style="padding:0 12px 0 0;"><a href="\${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><span style="display:inline-block;color:#ffffff;font-family:\${font};font-size:16px;font-weight:bold;">\${esc(m.glyph)}</span></a></td>\`;
    }).join("");
    social = \`<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>\${chips}</tr></table>\`;
  }`;

const newSocialCode = `  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const icon = socialIconImg(s.platform, 24, 12);
        if (!icon) return \`<td style="padding:0 12px 0 0;"><a href="\${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;color:#ffffff;font-family:\${font};font-size:16px;font-weight:bold;">\${esc(s.platform.charAt(0).toUpperCase())}</a></td>\`;
        return \`<td style="padding:0 8px 0 0;"><a href="\${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;">\${icon}</a></td>\`;
    }).join("");
    social = \`<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>\${chips}</tr></table>\`;
  }`;

c = c.replace(oldSocialCode, newSocialCode);
fs.writeFileSync('src/lib/signatures/premium.ts', c);
console.log('Fixed social icons');
