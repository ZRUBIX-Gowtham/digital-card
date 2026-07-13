import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import {
  OrderedSections,
} from "@/components/card/sections";
import { socialIcon, socialLabel } from "@/components/card/social-icons";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, headerBackground, shellBase } from "./shared";

/** Sidebar: a compact coloured profile rail beside the content column. */
export function SidebarLayout({ card, accent, style }: LayoutProps) {
  const bg = headerBackground(style, accent);
  const radius = avatarRadius(style);

  return (
    <div className={shellBase}>
      <div className="flex items-stretch">
        <aside
          className={`w-[118px] shrink-0 text-center text-white ${bg.className}`}
          style={bg.style}
        >
          {/* Profile + links stay pinned while the content column scrolls. */}
          <div className="sticky top-0 flex flex-col items-center gap-3 px-3 py-6">
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent="#ffffff33"
              size={60}
              ring={false}
              rounded={radius}
            />
            <div>
              <h1 className="text-sm font-bold leading-tight">{card.name}</h1>
              <p className="mt-0.5 text-[11px] text-white/85">{card.title}</p>
            </div>
            {card.socials.length > 0 && (
              <div className="mt-1 flex flex-col gap-2">
                {card.socials.slice(0, 4).map((s) => {
                  const Icon = socialIcon[s.platform];
                  return (
                    <a
                      key={s.platform + s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabel[s.platform]}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
                    >
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4 px-3.5 py-5 text-sm">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {card.company}
            </p>
            {card.tagline && (
              <p className="mt-0.5 text-[13px] text-slate-600">{card.tagline}</p>
            )}
          </div>
          <CardActions card={card} accent={accent} size="sm" />
          <QrShare slug={card.slug} accent={accent} />
          <OrderedSections card={card} accent={accent} galleryColumns={2} />
        </div>
      </div>
    </div>
  );
}
