const fs = require('fs');

let c = fs.readFileSync('src/lib/signatures/video.ts', 'utf8');

const oldUrl = `const ytUrl = (card.youtubeVideos && card.youtubeVideos.length > 0) ? card.youtubeVideos[0] : "https://youtube.com";`;
const newUrl = `const ytUrl = (card.youtubeVideos && card.youtubeVideos.length > 0) ? card.youtubeVideos[0] : "https://www.youtube.com/watch?v=-KflXKhN2Uc";`;

c = c.replace(oldUrl, newUrl);

const oldTitle = `const videoTitle = opts?.bannerText || "Check out my latest video!";`;
const newTitle = `const videoTitle = opts?.bannerText || "5 Zoom, Virtual, or Team Building Activities";`;

c = c.replace(oldTitle, newTitle);

fs.writeFileSync('src/lib/signatures/video.ts', c);
console.log('Fixed ytUrl!');
