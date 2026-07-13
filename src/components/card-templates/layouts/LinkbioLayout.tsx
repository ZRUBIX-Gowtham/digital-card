import { Phone, Mail, MessageCircle, Globe, MapPin, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/card/Avatar";
import { QrShare } from "@/components/card/QrShare";
import { avatarRadius, type LayoutProps } from "./shared";
import { CardHeaderSlot } from "@/components/card/CardHeader";
import { socialIcon, socialLabel } from "@/components/card/social-icons";
import { SaveContactButton } from "@/components/card/SaveContactButton";

/** Link-in-bio: big avatar + full-width stacked link buttons (Linktree style). */
export function LinkbioLayout({ card, accent, style }: LayoutProps) {
  const radius = avatarRadius(style);
  const dark = style.surface === "dark";

  const links = [
    card.contact.phone && {
      label: "Call me",
      href: `tel:${card.contact.phone.replace(/\s/g, "")}`,
      icon: Phone,
    },
    card.contact.whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${card.contact.whatsapp}`,
      icon: MessageCircle,
      external: true,
    },
    card.contact.email && {
      label: "Email me",
      href: `mailto:${card.contact.email}`,
      icon: Mail,
    },
    card.contact.website && {
      label: "Visit website",
      href: card.contact.website,
      icon: Globe,
      external: true,
    },
    card.contact.mapUrl && {
      label: "Find me",
      href: card.contact.mapUrl,
      icon: MapPin,
      external: true,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: typeof Phone;
    external?: boolean;
  }[];

  return (
    <div
      className={`mx-auto w-full max-w-[430px] overflow-hidden rounded-[26px] border shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] ${
        dark ? "border-slate-800" : "border-border"
      }`}
      style={{
        background: dark
          ? "#0b1220"
          : `linear-gradient(180deg, ${accent}14, #ffffff 42%)`,
      }}
    >
      <div className="flex flex-col items-center px-6 pb-8 pt-10">
        <CardHeaderSlot card={card} accent={accent}>
          <div className={`${radius} p-1`} style={{ backgroundColor: `${accent}22` }}>
            <Avatar
              name={card.name}
              logoText={card.logoText}
              image={card.avatarImage}
              accent={accent}
              size={104}
              ring={false}
              rounded={radius}
            />
          </div>
          <h1
            className={`mt-4 text-xl font-bold ${dark ? "text-white" : "text-foreground"}`}
          >
            {card.name}
          </h1>
          <p className="text-sm font-medium" style={{ color: accent }}>
            {card.title}
          </p>
          {card.tagline && (
            <p
              className={`mt-2 max-w-[16rem] text-center text-sm ${
                dark ? "text-white/70" : "text-slate-500"
              }`}
            >
              {card.tagline}
            </p>
          )}
        </CardHeaderSlot>

        {/* Primary link buttons */}
        <div className="mt-6 w-full space-y-3">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.label}
                href={l.href}
                {...(l.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                  dark
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-border bg-white text-foreground shadow-sm"
                }`}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accent}1f`, color: accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {l.label}
                <ChevronRight
                  className={`ml-auto h-4 w-4 ${dark ? "text-white/40" : "text-slate-300"}`}
                />
              </a>
            );
          })}
        </div>

        {/* Social row as pill buttons */}
        {card.socials.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {card.socials.map((s) => {
              const Icon = socialIcon[s.platform];
              return (
                <a
                  key={s.platform + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel[s.platform]}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                    dark ? "border-white/10 bg-white/5" : "border-border bg-white"
                  }`}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-6 w-full">
          <SaveContactButton card={card} accent={accent} />
        </div>

        <div className="mt-6 w-full">
          <QrShare slug={card.slug} accent={accent} />
        </div>
      </div>
    </div>
  );
}
