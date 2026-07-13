import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { VideoCard } from "@/components/card/VideoCard";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { getYouTubeId } from "@/lib/youtube";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Video: a YouTube-first template. A compact identity header sits above a
 * "VIDEOS" feed of thumbnail cards (tap to play) that leads the card — built
 * for creators, coaches & channels who want their videos front and centre.
 */
export function VideoLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;
  const ids = (card.youtubeVideos ?? [])
    .map(getYouTubeId)
    .filter((id): id is string => Boolean(id));
  const showVideos =
    ids.length > 0 &&
    (card.sectionsOrder == null || card.sectionsOrder.includes("youtubeVideos"));

  return (
    <div className={shellBase}>
      {/* Compact identity header */}
      <CardHeaderSlot card={card} accent={accent}>
        <div
          className="relative flex items-center gap-3 px-5 pb-5 pt-6 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}
        >
          <div className={`shrink-0 ${radius} bg-white/15 p-1 backdrop-blur-sm`}>
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={54}
              ring={false}
              rounded={radius}
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black leading-tight">{card.name}</h1>
            <p className="truncate text-xs font-semibold text-white/90">{card.title}</p>
            <p className="truncate text-xs text-white/70">{card.company}</p>
          </div>
        </div>
      </CardHeaderSlot>

      <div className="px-5 pb-8 pt-5">
        {/* Videos as the hero */}
        {showVideos && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-6 fill-[#ff0000]">
                <path d="M23 12s0-3.9-.5-5.8a3 3 0 0 0-2.1-2.1C18.5 3.6 12 3.6 12 3.6s-6.5 0-8.4.5A3 3 0 0 0 1.5 6.2C1 8.1 1 12 1 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 8.4.5 8.4.5s6.5 0 8.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8zM9.8 15.5v-7l6 3.5-6 3.5z" />
              </svg>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-800">
                Videos
              </h2>
              <span className="ml-auto text-[11px] font-medium text-slate-400">
                {ids.length} videos
              </span>
            </div>
            <div className="space-y-3">
              {ids.map((id, i) => (
                <VideoCard key={i} id={id} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <SocialsRow card={card} accent={accent} />
        </div>

        <div className="mt-6 space-y-6">
          <CardActions card={card} accent={accent} />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} exclude={["youtubeVideos"]} />
        </div>
      </div>
    </div>
  );
}
