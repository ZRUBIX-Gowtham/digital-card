import {
  Phone,
  Mail,
  Download,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

const paperCons = [
  "Reprint the whole stack for one typo",
  "Details go stale the day they're printed",
  "Easily lost, tossed or forgotten",
];

const digitalPros = [
  "Edit once — every card updates instantly",
  "Share by link, QR or a single tap",
  "Always in a pocket, never runs out",
];

export function BeforeAfter() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Paper vs digital"
        title="Ditch the stack of dead cards"
        description="A printed card is out of date the second it leaves the press. Here's the upgrade."
      />

      <div className="relative mx-auto mt-16 grid max-w-4xl items-stretch gap-6 md:grid-cols-2 md:gap-5">
        {/* Centre VS divider */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold uppercase tracking-wide text-muted shadow-lg">
            vs
          </span>
        </div>

        {/* ---------- Paper card ---------- */}
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface-2/50 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-bold text-muted">
              <X className="h-3.5 w-3.5" /> Paper card
            </span>
            <span className="rounded border border-red-300 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500 dark:border-red-500/40 dark:bg-red-500/10">
              Outdated
            </span>
          </div>

          {/* Paper mockup */}
          <div className="relative mx-auto flex h-[190px] w-full max-w-[300px] flex-col justify-between rounded-xl border border-slate-300 bg-[#f7f5f0] p-6 shadow-md">
            <div>
              <div className="h-1.5 w-10 rounded-full bg-slate-400" />
              <p className="mt-4 font-serif text-xl font-bold text-slate-700">
                Aarav Mehta
              </p>
              <p className="text-sm text-slate-500">Financial Advisor</p>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p>+91 98••• •••••</p>
              <p className="line-through decoration-red-400">
                old-email@firm.in
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {paperCons.map((con) => (
              <li key={con} className="flex items-start gap-2.5 text-sm text-muted">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/15">
                  <X className="h-3 w-3" />
                </span>
                {con}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Digital card ---------- */}
        <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-brand/30 bg-surface p-6 shadow-xl shadow-brand/5 ring-1 ring-brand/10 sm:p-8">
          {/* soft glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand opacity-20 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> {siteConfig.brand}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              ● Live
            </span>
          </div>

          {/* Digital mockup */}
          <div className="relative mx-auto w-full max-w-[300px]">
            <div className="rounded-[1.4rem] bg-gradient-to-br from-brand to-[var(--accent)] p-[2px] shadow-lg">
              <div className="overflow-hidden rounded-[1.3rem] border border-border bg-surface">
                <div className="h-12 bg-gradient-to-br from-brand to-[var(--accent)]" />
                <div className="relative z-10 -mt-6 flex flex-col items-center px-4 pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[var(--accent)] text-lg font-bold text-white shadow-md ring-4 ring-surface">
                    AM
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    Aarav Mehta
                  </p>
                  <p className="text-xs font-semibold text-brand">
                    Financial Advisor
                  </p>
                  <div className="mt-3 grid w-full grid-cols-2 gap-2">
                    {[
                      { icon: Phone, label: "Call" },
                      { icon: Mail, label: "Email" },
                    ].map((a) => (
                      <div
                        key={a.label}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-surface-2 py-1.5 text-[11px] font-semibold text-muted"
                      >
                        <a.icon className="h-3.5 w-3.5 text-brand" /> {a.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand py-1.5 text-[11px] font-semibold text-white">
                    <Download className="h-3.5 w-3.5" /> Save Contact
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ul className="relative space-y-2.5">
            {digitalPros.map((pro) => (
              <li
                key={pro}
                className="flex items-start gap-2.5 text-sm font-medium text-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
                  <Check className="h-3 w-3" />
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
