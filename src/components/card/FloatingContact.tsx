"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MessageCircle, X } from "lucide-react";
import { WhatsappIcon } from "./brand-icons";
import type { CardData, FloatingAction } from "@/types/card";
import { trackAction, type TrackAction } from "@/lib/track";

interface FloatingItem {
  key: FloatingAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  external?: boolean;
}

/**
 * Always-on quick-contact button pinned to the bottom-right of the card column.
 * Tapping the FAB fans out the enabled actions (WhatsApp / call / email), each
 * of which is tracked in the owner's analytics just like the inline actions.
 * The overlay is constrained to the 430px card width so it stays glued to the
 * card's edge on desktop instead of drifting to the viewport corner.
 */
export function FloatingContact({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  // Greeting-bubble state: dismissed by the visitor (X), plus a tick that the
  // attention loop flips every ~3s. Visibility is derived so no state is set
  // synchronously in the effect.
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [bubbleTick, setBubbleTick] = useState(true);
  const { contact } = card;
  const cfg = card.floatingWidget;

  const loopBubble = Boolean(cfg?.bubbleLoop && cfg?.label);
  useEffect(() => {
    if (!loopBubble || bubbleDismissed) return;
    const id = setInterval(() => setBubbleTick((t) => !t), 3000);
    return () => clearInterval(id);
  }, [loopBubble, bubbleDismissed]);

  // Whether the bubble should currently be visible. The element stays mounted
  // (while collapsed) so opacity/scale can transition it smoothly both in and
  // out — on the attention loop and on dismiss.
  const bubbleShown = Boolean(cfg?.label) && !bubbleDismissed && (loopBubble ? bubbleTick : true);
  // Undefined actions → sensible default; an explicitly emptied list shows nothing.
  const wanted: FloatingAction[] = cfg?.actions ?? ["whatsapp", "call"];

  const all: Record<FloatingAction, FloatingItem | null> = {
    whatsapp: contact.whatsapp
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          icon: WhatsappIcon,
          href: `https://wa.me/${contact.whatsapp}`,
          color: "#25D366",
          external: true,
        }
      : null,
    call: contact.phone
      ? {
          key: "call",
          label: "Call",
          icon: Phone,
          href: `tel:${contact.phone.replace(/\s/g, "")}`,
          color: accent,
        }
      : null,
    email: contact.email
      ? {
          key: "email",
          label: "Email",
          icon: Mail,
          href: `mailto:${contact.email}`,
          color: accent,
        }
      : null,
  };

  const items = wanted
    .map((k) => all[k])
    .filter(Boolean) as FloatingItem[];

  if (items.length === 0) return null;

  // A single action needs no fan-out — the FAB links straight to it.
  const single = items.length === 1 ? items[0] : null;
  const Fab = single ? single.icon : open ? X : MessageCircle;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="relative mx-auto max-w-[430px]">
        <div className="pointer-events-auto absolute bottom-5 right-4 flex flex-col items-end gap-3">
          {/* Fanned-out actions (multi-action mode) */}
          {!single &&
            items.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => trackAction(card.slug, item.key as TrackAction)}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`flex items-center gap-2.5 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-semibold text-slate-800 shadow-lg ring-1 ring-black/5 transition-all duration-200 ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                >
                  {item.label}
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                </a>
              );
            })}

          {/* Optional greeting bubble — kept mounted while collapsed so it can
              transition smoothly in and out (attention loop + dismiss). The X
              dismisses it for the rest of the visit. */}
          {cfg?.label && !open && (
            <span
              className={`mb-1 inline-flex max-w-[220px] origin-bottom-right items-center gap-1.5 rounded-2xl rounded-br-sm bg-white py-1.5 pl-3 pr-1.5 text-xs font-medium text-slate-700 shadow-lg ring-1 ring-black/5 transition-all duration-500 ease-out ${
                bubbleShown
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-1 scale-90 opacity-0"
              }`}
            >
              <span className="min-w-0">{cfg.label}</span>
              <button
                type="button"
                onClick={() => setBubbleDismissed(true)}
                aria-label="Dismiss message"
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200/70 text-slate-500 transition-colors hover:bg-slate-300 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Main FAB */}
          {single ? (
            <a
              href={single.href}
              onClick={() => trackAction(card.slug, single.key as TrackAction)}
              {...(single.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={single.label}
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: single.color }}
            >
              <Fab className="h-6 w-6" />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close contact menu" : "Contact options"}
              aria-expanded={open}
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: accent }}
            >
              <Fab className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
