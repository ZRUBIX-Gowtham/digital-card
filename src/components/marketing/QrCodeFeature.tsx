import {
  QrCode,
  Check,
  Download,
  Printer,
  Link2,
  Globe,
  Type,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Section } from "@/components/ui/Section";

const qrPros = [
  "Encode a card, link, phone, WhatsApp, email or text",
  "Add your logo and match your brand colours",
  "Download a print-ready PNG or crisp SVG",
  "Perfect for posters, flyers, packaging & cards",
];

const qrModes = [
  { label: "My card", icon: Link2 },
  { label: "Website", icon: Globe },
  { label: "Text", icon: Type },
  { label: "Phone", icon: Phone },
  { label: "WhatsApp", icon: MessageCircle },
  { label: "Email", icon: Mail },
];

export function QrCodeFeature() {
  return (
    <Section id="qr-code" className="py-[60px]">
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-8">
        {/* ---------- Left side mockup ---------- */}
        <div className="relative order-last flex flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-surface-2 p-6 shadow-xl ring-1 ring-black/5 sm:p-8 md:order-first">
          {/* soft glow */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-brand opacity-20 blur-3xl" />

          {/* Content-type chips */}
          <div className="relative flex flex-wrap gap-2">
            {qrModes.map((m, i) => {
              const Icon = m.icon;
              const active = i === 1; // "Website" highlighted
              return (
                <span
                  key={m.label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "bg-surface text-muted ring-1 ring-inset ring-border"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {m.label}
                </span>
              );
            })}
          </div>

          {/* QR poster preview */}
          <div className="relative flex justify-center">
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-xl bg-slate-900">
                <QrCode className="h-32 w-32 text-white" strokeWidth={1.25} />
                {/* centre logo badge */}
                <span className="absolute flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-[var(--accent)] text-sm font-bold text-white shadow-md ring-2 ring-white">
                  AM
                </span>
              </div>
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
                Scan me
              </span>
            </div>
          </div>

          {/* Colour presets + export buttons */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              {["var(--accent)", "#0f172a", "#0369a1", "#166534", "#7c3aed"].map(
                (c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ background: c }}
                  />
                ),
              )}
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                <Download className="h-3.5 w-3.5" /> PNG
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-inset ring-border">
                <Printer className="h-3.5 w-3.5 text-brand" /> Print
              </span>
            </div>
          </div>
        </div>

        {/* ---------- Right side text ---------- */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand ring-1 ring-inset ring-brand/20 dark:bg-brand-500/10 dark:ring-brand-500/30">
            <QrCode className="h-4 w-4" /> QR Code Studio
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One branded QR code for everything you share
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Generate a custom QR code in seconds — for your digital card or any
            link, number, WhatsApp chat or message. Style it with your logo and
            brand colours, add a &ldquo;Scan me&rdquo; frame, then download it
            print-ready for anywhere your customers meet you offline.
          </p>

          <ul className="mt-8 space-y-4">
            {qrPros.map((pro) => (
              <li
                key={pro}
                className="flex items-center gap-3 text-sm text-foreground sm:text-base"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="whitespace-nowrap">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
