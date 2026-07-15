"use client";

import { Phone, Mail, MapPin, Download, IndianRupee } from "lucide-react";
import { WhatsappIcon } from "./brand-icons";
import type { CardData } from "@/types/card";
import { downloadVCard } from "@/lib/vcard";
import { trackAction, type TrackAction } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * Primary contact actions rendered on every card template.
 * `accent` is passed as inline style so each template keeps its own colour.
 */
export function CardActions({
  card,
  accent,
  variant = "grid",
  size = "md",
}: {
  card: CardData;
  accent: string;
  variant?: "grid" | "stack";
  /** `sm` renders more compact buttons — used in the narrow sidebar column. */
  size?: "md" | "sm";
}) {
  const { contact } = card;
  const compact = size === "sm";

  const actions = [
    contact.phone && {
      key: "call",
      label: "Call",
      icon: Phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    contact.whatsapp && {
      key: "whatsapp",
      label: "WhatsApp",
      icon: WhatsappIcon,
      href: `https://wa.me/${contact.whatsapp}`,
      external: true,
    },
    contact.email && {
      key: "email",
      label: "Email",
      icon: Mail,
      href: `mailto:${contact.email}`,
    },
    contact.mapUrl && {
      key: "map",
      label: "Location",
      icon: MapPin,
      href: contact.mapUrl,
      external: true,
    },
    card.payment?.upiId && card.payment.showPayButton !== false && {
      key: "pay",
      label: "Pay",
      icon: IndianRupee,
      href: `upi://pay?${(() => {
        const params = new URLSearchParams({
          pa: card.payment.upiId,
          pn: card.payment.accountName || card.name,
          cu: "INR",
        });
        const amt = Number(card.payment.amount);
        if (Number.isFinite(amt) && amt > 0) params.set("am", amt.toFixed(2));
        return params.toString();
      })()}`,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: typeof Phone;
    href: string;
    external?: boolean;
  }[];

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div
        className={cn(
          variant === "grid"
            ? cn("grid grid-cols-2", compact ? "gap-2" : "gap-3")
            : cn("flex flex-col", compact ? "gap-2" : "gap-3"),
        )}
      >
        {actions.map((a, i) => {
          const Icon = a.icon;
          // A lone button on the last row of a 2-col grid (odd count) spans the
          // full width and centres its content instead of leaving an empty cell.
          const loneLast =
            variant === "grid" &&
            actions.length % 2 === 1 &&
            i === actions.length - 1;
          return (
            <a
              key={a.key}
              href={a.href}
              onClick={() => trackAction(card.slug, a.key as TrackAction)}
              {...(a.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "flex items-center justify-start gap-2.5 rounded-xl border border-border bg-white font-semibold text-foreground transition-colors hover:bg-surface",
                compact ? "pl-3 pr-2 py-2 text-[10px]" : "pl-3 pr-3 py-2.5 text-[11px] sm:text-xs sm:pl-3.5",
                loneLast ? "col-span-2 mx-auto w-1/2 justify-center" : "w-full",
              )}
              style={{ justifyContent: loneLast ? "center" : "flex-start" }}
            >
              <Icon
                className={compact ? "h-3 w-3 shrink-0" : "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"}
                style={{ color: accent }}
              />
              {a.label}
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          trackAction(card.slug, "save-contact");
          downloadVCard(card);
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition-opacity hover:opacity-90",
          compact ? "px-3 py-2.5 text-xs" : "px-3 py-3 text-xs sm:text-sm sm:px-4 sm:py-3.5",
        )}
        style={{ backgroundColor: accent }}
      >
        <Download className={compact ? "h-3.5 w-3.5 shrink-0" : "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"} />
        Save Contact
      </button>
    </div>
  );
}
