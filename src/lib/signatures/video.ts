import type { CardData } from "@/types/card";
import {
  esc, contactLines, initials,
  socialHref, INK, SignatureStyleOpts
} from "../signature";

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  return match ? match[1] : null;
}

export function renderVideo(card: CardData, accent: string, opts?: SignatureStyleOpts): string {
  const font = "Arial,Helvetica,sans-serif";
  const lines = contactLines(card);

  // Right-aligned photo (Square)
  const logo = card.avatarImage
    ? `<img src="${esc(card.avatarImage)}" alt="${esc(card.company || card.name)}" width="140" height="140" referrerpolicy="no-referrer" style="display:block;width:140px;max-width:140px;height:140px;object-fit:cover;" />`
    : `<div style="width:140px;height:140px;background:${accent};color:#ffffff;font-family:${font};font-size:48px;font-weight:bold;line-height:140px;text-align:center;">${esc(initials(card))}</div>`;

  // Social icons (square, accent colored background)
  const items = (card.socials ?? []).filter((s) => s.url?.trim());
  let social = "";
  if (items.length > 0) {
    const chips = items.map((s) => {
        const platform = s.platform.toLowerCase();
        const iconWhiteUrl = (p: string) => {
          if (p === 'linkedin') return "https://img.icons8.com/ios-filled/24/ffffff/linkedin.png";
          if (p === 'facebook') return "https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png";
          if (p === 'twitter' || p === 'x') return "https://img.icons8.com/ios-filled/24/ffffff/twitterx.png";
          if (p === 'youtube') return "https://img.icons8.com/ios-filled/24/ffffff/youtube-play.png";
          if (p === 'instagram') return "https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png";
          if (p === 'whatsapp') return "https://img.icons8.com/ios-filled/24/ffffff/whatsapp.png";
          return "";
        };
        const svgIcon = iconWhiteUrl(platform);
        let glyph = platform.charAt(0).toUpperCase();
        if (platform === 'linkedin') glyph = 'in';
        if (platform === 'twitter' || platform === 'x') glyph = 'X';
        if (platform === 'youtube') glyph = 'YT';
        
        if (svgIcon) {
           return `<td style="padding:0 6px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="24" height="24" valign="middle" align="center" style="background-color:${accent};line-height:0;"><img src="${svgIcon}" width="14" height="14" style="display:block;" alt="" /></td></tr></table></a></td>`;
        }
        return `<td style="padding:0 6px 0 0;"><a href="${esc(socialHref(s.platform, s.url))}" style="text-decoration:none;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="24" height="24" valign="middle" align="center" style="background-color:${accent};color:#ffffff;font-family:${font};font-size:12px;font-weight:bold;line-height:1;">${esc(glyph)}</td></tr></table></a></td>`;
    }).join("");
    social = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${chips}</tr></table>`;
  }

  // Inline contacts with accent letters
  let contactHtml = "";
  if (lines.length > 0) {
    const contactItems = lines.map(l => {
      let letter = l.label.charAt(0).toUpperCase();
      return `<span style="white-space:nowrap;display:inline-block;margin-right:16px;margin-bottom:6px;"><span style="font-weight:bold;color:${accent};margin-right:6px;">${esc(letter)}</span><span style="color:${INK};">${l.href ? `<a href="${esc(l.href)}" style="color:${INK};text-decoration:none;">${esc(l.text)}</a>` : esc(l.text)}</span></span>`;
    }).join(` `);
    
    contactHtml = `
      <div style="font-family:${font};font-size:12px;line-height:1.4;">
        ${contactItems}
      </div>
    `;
  }

  // YouTube Video Block
  const ytUrl = (card.youtubeVideos && card.youtubeVideos.length > 0) ? card.youtubeVideos[0] : "https://www.youtube.com/watch?v=-KflXKhN2Uc";
  const ytId = getYoutubeId(ytUrl);
  const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : "https://placehold.co/160x90/f87171/ffffff/png?text=YouTube+Video";
  
  const videoTitle = opts?.bannerText || "5 Zoom, Virtual, or Team Building Activities";
  const channelName = card.company || card.name || "YouTube Channel";

  const videoBlock = `
  <tr>
    <td style="padding-top:16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td width="160" valign="top" style="padding-right:12px;">
            <a href="${esc(ytUrl)}"><img src="${thumbnail}" width="160" height="90" style="display:block;width:160px;height:90px;object-fit:cover;border:1px solid #e2e8f0;" alt="Video Thumbnail" /></a>
          </td>
          <td valign="top">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="20" valign="top" style="padding-top:2px;">
                  <img src="https://img.icons8.com/color/48/000000/youtube-play.png" width="16" height="16" style="display:block;" alt="Play" />
                </td>
                <td valign="top" style="font-family:${font};font-size:14px;font-weight:bold;color:#111111;line-height:1.2;">
                  <a href="${esc(ytUrl)}" style="color:#111111;text-decoration:none;">${esc(videoTitle)}</a>
                </td>
              </tr>
            </table>
            <div style="font-family:${font};font-size:11px;color:${INK};margin-top:6px;line-height:1.4;max-height:30px;overflow:hidden;">
              In this video, we talk about some of our top strategies and activities that you can apply right now. Click to watch the full video!
            </div>
            <div style="font-family:${font};font-size:11px;color:#3b82f6;margin-top:6px;">
              ${esc(channelName)} <span style="color:${INK};">• 10k views • 1 month ago</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;

  return `
<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;width:600px;max-width:100%;background:#ffffff;">
  <tr>
    <td valign="top">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td valign="top" style="padding:0 16px 0 0;">
            <div style="font-family:'Brush Script MT', 'Comic Sans MS', cursive;font-size:26px;color:#111111;margin-bottom:8px;">Thanks So Much,</div>
            <div style="font-family:${font};font-size:18px;font-weight:bold;color:${accent};line-height:1.2;margin-bottom:2px;">${esc(card.name)}</div>
            ${card.title || card.company ? `<div style="font-family:${font};font-size:13px;color:${INK};margin-bottom:12px;">${esc(card.title)}${(card.title && card.company) ? ', ' : ''}${card.company ? `<span style="font-weight:bold;color:${accent};">${esc(card.company)}</span>` : ''}</div>` : ""}
            <div style="margin-bottom:12px;">
              ${contactHtml}
            </div>
            ${social}
          </td>
          <td width="140" valign="top" style="padding-top:24px;">
            ${logo}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  ${videoBlock}
</table>`.trim();
}
