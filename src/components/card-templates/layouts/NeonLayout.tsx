import { Avatar } from "@/components/card/Avatar";
import { CardActions } from "@/components/card/CardActions";
import { QrShare } from "@/components/card/QrShare";
import { SocialsRow, OrderedSections } from "@/components/card/sections";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { type LayoutProps, avatarRadius, shellBase } from "./shared";

/**
 * Neon: a nightlife-inspired dark profile. A near-black hero lit by neon
 * accent glows, a glowing gradient-ringed portrait and a gradient name, over a
 * crisp white content sheet. Made for influencers and bold personal brands.
 */
export function NeonLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const accent2 = style.accent2 ?? accent;

  return (
    <div className={`${shellBase} border-slate-800`}>
      <CardHeaderSlot card={card} accent={accent}>
        <div className="relative overflow-hidden bg-[#0b1020] px-6 pb-9 pt-10 text-center">
          {/* Neon glows */}
          <span
            className="pointer-events-none absolute -top-16 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
            style={{ backgroundColor: accent }}
          />
          <span
            className="pointer-events-none absolute -bottom-4 right-0 h-40 w-40 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: accent2 }}
          />

          <div className="relative flex flex-col items-center">
            <div
              className="rounded-full p-[2px]"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                boxShadow: `0 0 26px ${accent}88`,
              }}
            >
              <div className="rounded-full bg-[#0b1020] p-1">
                <Avatar
                  name={card.name}
                  logoText={card.logoText}
                  image={card.avatarImage}
                  accent={accent}
                  size={96}
                  ring={false}
                  rounded={radius}
                />
              </div>
            </div>

            <h1
              className="mt-4 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, #ffffff, ${accent})` }}
            >
              {card.name}
            </h1>
            <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
              {card.title}
            </p>
            {card.tagline && (
              <p className="mt-3 max-w-[32ch] text-sm text-white/60">{card.tagline}</p>
            )}

            <div className="mt-5">
              <SocialsRow card={card} accent={accent} />
            </div>
          </div>
        </div>
      </CardHeaderSlot>

      <div className="space-y-6 bg-white px-6 py-7">
        <CardActions card={card} accent={accent} />
        <QrShare slug={card.slug} accent={accent} />
        <OrderedSections card={card} accent={accent} />
      </div>
    </div>
  );
}
