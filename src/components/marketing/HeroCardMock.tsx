import { Phone, MessageCircle, Mail, Download, Globe, Lock, Share2 } from "lucide-react";
import { LinkedinIcon } from "@/components/card/brand-icons";

/** Realistic browser-window preview of a public card — for the hero (static). */
export function HeroCardMock() {
  return (
    <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_40px_90px_-30px_rgba(15,23,42,0.55)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted">
          <Lock className="h-3 w-3" />
          <span className="truncate">onlinecard.me/aarav-mehta</span>
        </div>
      </div>

      {/* Public card page body */}
      <div className="bg-grid px-6 py-8">
        <div className="mx-auto max-w-[290px] overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
          {/* Cover */}
          <div className="relative h-20 bg-gradient-to-br from-brand to-[var(--accent)]">
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Share2 className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="relative z-10 -mt-10 flex flex-col items-center px-5 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface text-2xl font-bold text-brand shadow-xl ring-4 ring-surface">
              AM
            </div>
            <p className="mt-3 text-lg font-bold text-foreground">Aarav Mehta</p>
            <p className="text-sm font-semibold text-brand">Financial Advisor</p>
            <p className="text-xs text-muted">Mehta Wealth Partners</p>

            {/* Socials */}
            <div className="mt-4 flex gap-2.5">
              {[Globe, LinkedinIcon, MessageCircle].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-brand"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-5 grid w-full grid-cols-3 gap-2">
              {[
                { icon: Phone, label: "Call" },
                { icon: MessageCircle, label: "Chat" },
                { icon: Mail, label: "Email" },
              ].map((a) => (
                <div
                  key={a.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-2 py-3 text-[11px] font-semibold text-muted"
                >
                  <a.icon className="h-4.5 w-4.5 text-brand" />
                  {a.label}
                </div>
              ))}
            </div>

            {/* Save contact CTA */}
            <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm">
              <Download className="h-4 w-4" /> Save Contact
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
