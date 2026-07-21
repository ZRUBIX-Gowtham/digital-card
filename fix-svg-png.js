const fs = require('fs');

let c = fs.readFileSync('src/lib/signatures/exclusive.ts', 'utf8');

const socialOld = `        const iconWhiteSvg = (p: string) => {
          let path = "";
          if (p === 'linkedin') path = \`<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>\`;
          else if (p === 'facebook') path = \`<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>\`;
          else if (p === 'twitter' || p === 'x') path = \`<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>\`;
          else if (p === 'youtube') path = \`<path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6c.9-.9 2-.9 2.5-1C9.6 3.4 12 3.4 12 3.4s2.4 0 6.5.2c.5.1 1.6.1 2.5 1 .7.8.9 2.5.9 2.5s.2 2.1.2 4.1v1.5c0 2-.2 4.1-.2 4.1s-.2 1.7-.9 2.5c-.9.9-2.1.9-2.6 1-3.6.3-6.4.3-6.4.3s-2.4 0-6.5-.2c-.5-.1-1.6-.1-2.5-1-.7-.8-.9-2.5-.9-2.5S2 13.5 2 11.5V10c0-2 .2-4.1.2-4.1zM10 14l5-3-5-3v6z"/>\`;
          else if (p === 'instagram') path = \`<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>\`;
          else if (p === 'whatsapp') path = \`<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>\`;
          else return \`\`;

          const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\${path}</svg>\`;
          return \`data:image/svg+xml,\${encodeURIComponent(svg)}\`;
        };
        const svgIcon = iconWhiteSvg(platform);`;

const socialNew = `        const iconWhiteUrl = (p: string) => {
          if (p === 'linkedin') return "https://img.icons8.com/ios-filled/24/ffffff/linkedin.png";
          if (p === 'facebook') return "https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png";
          if (p === 'twitter' || p === 'x') return "https://img.icons8.com/ios-filled/24/ffffff/twitterx.png";
          if (p === 'youtube') return "https://img.icons8.com/ios-filled/24/ffffff/youtube-play.png";
          if (p === 'instagram') return "https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png";
          if (p === 'whatsapp') return "https://img.icons8.com/ios-filled/24/ffffff/whatsapp.png";
          return "";
        };
        const svgIcon = iconWhiteUrl(platform);`;

c = c.replace(socialOld, socialNew);

const bannerOld = `"https://images.unsplash.com/photo-1548187834-4b53c61301c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=120&q=80";`;
const bannerNew = `"https://placehold.co/600x120/0f172a/ffffff/png?text=MARTIN+LUTHER+KING+DAY";`;
c = c.replace(bannerOld, bannerNew);

fs.writeFileSync('src/lib/signatures/exclusive.ts', c);
console.log('Fixed exclusive.ts images!');
