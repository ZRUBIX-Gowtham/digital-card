import { Mail, Phone, MapPin } from "lucide-react";
import type { CardData } from "@/types/card";
import { effectiveSectionLayout } from "@/lib/section-layouts";
import { SocialsRow } from "./sections";
import { socialIcon, socialLabel } from "./social-icons";

/**
 * Optional card footer. The look is chosen from the "Footer" design variants in
 * the editor's Design & Layout hub; every variant adapts to light/dark cards via
 * the shared theme tokens. Content (name, company, socials, contact) is the same
 * across designs — only the arrangement and styling change.
 */
export function CardFooter({ card, accent }: { card: CardData; accent: string }) {
  const variant = effectiveSectionLayout(card.sectionLayouts, "footer");
  return <FooterBody card={card} accent={accent} variant={variant} />;
}

/** White-on-accent social buttons for the branded (accent band) footer. The
 *  shared SocialsRow forces light-card styling, so the branded band renders its
 *  own translucent white pills for readable contrast on the accent. */
function BrandedSocials({ card }: { card: CardData }) {
  if (!card.socials.length) return null;
  return (
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <Icon className="h-4.5 w-4.5" />
          </a>
        );
      })}
    </div>
  );
}

function ContactLinks({ card, accent }: { card: CardData; accent: string }) {
  const c = card.contact;
  if (!c || (!c.email && !c.phone && !c.address)) return null;
  return (
    <ul className="mt-4 space-y-2 text-xs text-muted">
      {c.email && (
        <li className="flex items-center justify-center gap-2">
          <Mail className="h-3.5 w-3.5" style={{ color: accent }} />
          <a href={`mailto:${c.email}`} className="hover:text-foreground">
            {c.email}
          </a>
        </li>
      )}
      {c.phone && (
        <li className="flex items-center justify-center gap-2">
          <Phone className="h-3.5 w-3.5" style={{ color: accent }} />
          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
            {c.phone}
          </a>
        </li>
      )}
      {c.address && (
        <li className="flex items-start justify-center gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
          <span className="max-w-[240px]">{c.address}</span>
        </li>
      )}
    </ul>
  );
}

function Credit({ card, tone = "muted" }: { card: CardData; tone?: "muted" | "light" }) {
  const year = new Date().getFullYear();
  const sub = tone === "light" ? "text-white/70" : "text-muted";
  const faint = tone === "light" ? "text-white/50" : "text-muted/70";
  return (
    <>
      <p className={`mt-4 text-[11px] ${sub}`}>
        © {year} {card.name}. All rights reserved.
      </p>
      <p className={`mt-1 text-[10px] ${faint}`}>Powered by Digital Site</p>
    </>
  );
}

/** Renders the footer content in the chosen design variant. Shared by the public
 *  card and the editor's live design previews. */
export function FooterBody({
  card,
  accent,
  variant,
}: {
  card: CardData;
  accent: string;
  variant: string;
}) {
  // Minimal — just a centred name and credit line, no fills or borders.
  if (variant === "minimal") {
    return (
      <footer className="px-6 py-8 text-center">
        <p className="text-sm font-bold text-foreground">{card.name}</p>
        {card.company && <p className="mt-0.5 text-xs text-muted">{card.company}</p>}
        <Credit card={card} />
      </footer>
    );
  }

  // Card — details on the left, socials on the right, inside a bordered card.
  if (variant === "card") {
    return (
      <footer className="border-t border-border bg-surface px-5 py-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{card.name}</p>
            {card.company && (
              <p className="mt-0.5 truncate text-xs text-muted">{card.company}</p>
            )}
          </div>
          {card.socials.length > 0 && <SocialsRow card={card} accent={accent} />}
        </div>
        <p className="mt-4 text-center text-[11px] text-muted">
          © {new Date().getFullYear()} {card.name}. All rights reserved.
        </p>
        <p className="mt-1 text-center text-[10px] text-muted/70">Powered by Digital Site</p>
      </footer>
    );
  }

  // Contact — quick email/phone/address links above the socials.
  if (variant === "contact") {
    return (
      <footer className="border-t border-border bg-surface px-6 py-7 text-center">
        <p className="text-sm font-bold text-foreground">{card.name}</p>
        {card.company && <p className="mt-0.5 text-xs text-muted">{card.company}</p>}
        <ContactLinks card={card} accent={accent} />
        {card.socials.length > 0 && (
          <div className="mt-4 flex justify-center">
            <SocialsRow card={card} accent={accent} />
          </div>
        )}
        <Credit card={card} />
      </footer>
    );
  }

  // Branded — bold accent band with light text and white social buttons.
  if (variant === "branded") {
    return (
      <footer
        className="px-6 py-8 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}c8)` }}
      >
        <p className="text-base font-bold">{card.name}</p>
        {card.company && <p className="mt-0.5 text-xs text-white/80">{card.company}</p>}
        <BrandedSocials card={card} />
        <Credit card={card} tone="light" />
      </footer>
    );
  }

  // Classic (default) — name, company, centred socials and a credit line.
  return (
    <footer className="border-t border-border bg-surface px-6 py-6 text-center">
      <p className="text-sm font-bold text-foreground">{card.name}</p>
      {card.company && <p className="mt-0.5 text-xs text-muted">{card.company}</p>}

      {card.socials.length > 0 && (
        <div className="mt-3 flex justify-center">
          <SocialsRow card={card} accent={accent} />
        </div>
      )}

      <Credit card={card} />
    </footer>
  );
}
