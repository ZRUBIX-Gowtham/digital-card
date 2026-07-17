"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Download,
  Printer,
  Check,
  Copy,
  ImageIcon,
  Palette,
  Link2,
  Globe,
  Phone,
  MessageCircle,
  Mail,
  Type,
} from "lucide-react";
import type { CardData } from "@/types/card";

/** What the QR should encode. */
type QrMode = "card" | "url" | "text" | "phone" | "whatsapp" | "email";

const MODES: { id: QrMode; label: string; icon: typeof QrCode }[] = [
  { id: "card", label: "My card", icon: Link2 },
  { id: "url", label: "Website", icon: Globe },
  { id: "text", label: "Text", icon: Type },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "email", label: "Email", icon: Mail },
];

/** A ready-made colour pairing for the QR (foreground / background). */
interface QrPreset {
  id: string;
  label: string;
  fg: string;
  bg: string;
}

/**
 * QR Code Studio — a standalone generator (in the spirit of the Mail Signature
 * tool). Turns the card URL into a branded, downloadable QR code: pick colours,
 * drop the logo in the middle, add a "Scan me" frame, then export a print-ready
 * PNG / SVG or send it straight to the printer. Everything runs on the client;
 * nothing is saved back to the card.
 */
export function QrStudio({ card, accent }: { card: CardData; accent: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  const presets: QrPreset[] = useMemo(
    () => [
      { id: "brand", label: "Brand", fg: accent, bg: "#ffffff" },
      { id: "classic", label: "Classic", fg: "#0f172a", bg: "#ffffff" },
      { id: "ink", label: "Inverted", fg: "#ffffff", bg: "#0f172a" },
      { id: "ocean", label: "Ocean", fg: "#0369a1", bg: "#f0f9ff" },
      { id: "forest", label: "Forest", fg: "#166534", bg: "#f0fdf4" },
      { id: "plum", label: "Plum", fg: "#7c3aed", bg: "#faf5ff" },
    ],
    [accent],
  );

  const [fg, setFg] = useState(accent);
  const [bg, setBg] = useState("#ffffff");
  const [showLogo, setShowLogo] = useState(Boolean(card.avatarImage));
  const [showFrame, setShowFrame] = useState(true);
  const [label, setLabel] = useState("SCAN ME");

  // The high-res canvas rendered off-screen and used for exports.
  const exportSize = 1024;
  const exportRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<QrMode>("card");
  const [raw, setRaw] = useState(""); // custom content typed by the user
  const [waMsg, setWaMsg] = useState(""); // optional WhatsApp pre-filled message

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const cardUrl = origin ? `${origin}/${card.slug}` : `/${card.slug}`;

  // Resolve the typed content into what the QR actually encodes, a friendly
  // label to show under "QR content", and whether it's ready to generate.
  const encoded = useMemo(() => {
    const r = raw.trim();
    switch (mode) {
      case "url": {
        if (!r) return { value: "", display: "", valid: false };
        const v = /^https?:\/\//i.test(r) ? r : `https://${r}`;
        return { value: v, display: v, valid: true };
      }
      case "text":
        return { value: raw, display: r, valid: r.length > 0 };
      case "phone": {
        const digits = r.replace(/[^\d+]/g, "");
        return { value: `tel:${digits}`, display: digits, valid: digits.replace(/\D/g, "").length >= 4 };
      }
      case "whatsapp": {
        const digits = r.replace(/\D/g, "");
        const base = `https://wa.me/${digits}`;
        const v = waMsg.trim() ? `${base}?text=${encodeURIComponent(waMsg.trim())}` : base;
        return { value: v, display: digits ? `wa.me/${digits}` : "", valid: digits.length >= 8 };
      }
      case "email": {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r);
        return { value: `mailto:${r}`, display: r, valid };
      }
      case "card":
      default:
        return {
          value: cardUrl,
          display: origin ? `${origin.replace(/^https?:\/\//, "")}/${card.slug}` : `/${card.slug}`,
          valid: Boolean(origin),
        };
    }
  }, [mode, raw, waMsg, cardUrl, origin, card.slug]);

  const value = encoded.valid ? encoded.value : "";
  const hasLogo = showLogo && Boolean(card.avatarImage);
  // With a logo covering the centre, bump error-correction so it still scans.
  const level: "M" | "H" = hasLogo ? "H" : "M";

  const logoSettings = hasLogo
    ? {
        src: card.avatarImage as string,
        height: 0,
        width: 0,
        excavate: true,
      }
    : undefined;

  function applyPreset(p: QrPreset) {
    setFg(p.fg);
    setBg(p.bg);
  }

  async function copyLink() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  const fileBase = mode === "card" ? `${card.slug}-qr` : "qr-code";

  /** Compose the off-screen QR canvas into a framed poster and return a canvas. */
  function buildPoster(): HTMLCanvasElement | null {
    const qr = exportRef.current?.querySelector("canvas");
    if (!qr) return null;

    const pad = showFrame ? Math.round(exportSize * 0.12) : Math.round(exportSize * 0.04);
    const labelH = showFrame && label.trim() ? Math.round(exportSize * 0.14) : 0;
    const w = exportSize + pad * 2;
    const h = exportSize + pad * 2 + labelH;

    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");
    if (!ctx) return null;

    // Card background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // QR itself
    ctx.drawImage(qr, pad, pad, exportSize, exportSize);

    // "Scan me" label strip
    if (labelH) {
      ctx.fillStyle = fg;
      ctx.font = `700 ${Math.round(labelH * 0.42)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.trim().toUpperCase(), w / 2, pad + exportSize + labelH * 0.55, w - pad);
    }
    return out;
  }

  function downloadPng() {
    const poster = buildPoster();
    if (!poster) return;
    poster.toBlob((blob) => {
      if (!blob) return;
      triggerDownload(URL.createObjectURL(blob), `${fileBase}.png`, true);
    }, "image/png");
  }

  function downloadSvg() {
    // Re-render as SVG at draw time so the QR stays crisp at any print size.
    const svg = exportRef.current?.querySelector("svg");
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
      type: "image/svg+xml",
    });
    triggerDownload(URL.createObjectURL(blob), `${fileBase}.svg`, true);
  }

  function printPoster() {
    const poster = buildPoster();
    if (!poster) return;
    const dataUrl = poster.toDataURL("image/png");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<html><head><title>${card.name} — QR</title><style>
        @page { margin: 24mm; }
        body { margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; }
        img { width: 320px; height:auto; }
      </style></head><body onload="window.print();window.close()">
        <img src="${dataUrl}" />
      </body></html>`,
    );
    win.document.close();
  }

  function triggerDownload(href: string, name: string, revoke = false) {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ============ Controls ============ */}
      <div className="space-y-6">
        {/* Content source */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <QrCode className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-bold text-foreground">QR content</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {MODES.map((m) => {
              const active = mode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-brand bg-brand/5 text-brand ring-1 ring-brand/30"
                      : "border-border text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {mode !== "card" && (
            <div className="mt-4 space-y-3">
              <input
                type={mode === "url" || mode === "email" ? "text" : mode === "text" ? "text" : "tel"}
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder={
                  {
                    url: "example.com  or  https://…",
                    text: "Any text — Wi-Fi password, note, message…",
                    phone: "+91 90000 00000",
                    whatsapp: "919000000000 (with country code)",
                    email: "you@example.com",
                    card: "",
                  }[mode]
                }
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-brand"
                autoFocus
              />
              {mode === "whatsapp" && (
                <input
                  type="text"
                  value={waMsg}
                  onChange={(e) => setWaMsg(e.target.value)}
                  placeholder="Optional pre-filled message"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-brand"
                />
              )}
              {raw.trim() && !encoded.valid && (
                <p className="text-xs font-medium text-amber-600">
                  {mode === "email"
                    ? "Enter a valid email address."
                    : mode === "whatsapp"
                      ? "Enter the full number with country code."
                      : "Enter a valid value to generate the code."}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Colours */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-bold text-foreground">Colours</h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {presets.map((p) => {
              const active = p.fg === fg && p.bg === bg;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-brand ring-1 ring-brand/30"
                      : "border-border hover:bg-surface-hover"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: p.bg }}
                  >
                    <QrCode className="h-5 w-5" style={{ color: p.fg }} />
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <ColorField label="QR colour" value={fg} onChange={setFg} />
            <ColorField label="Background" value={bg} onChange={setBg} />
          </div>
        </section>

        {/* Branding + frame */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-bold text-foreground">Branding</h2>
          </div>

          <div className="space-y-3">
            <ToggleRow
              label="Logo in the centre"
              hint={
                card.avatarImage
                  ? "Uses your card's profile image"
                  : "Add a profile image on your card first"
              }
              checked={hasLogo}
              disabled={!card.avatarImage}
              onChange={setShowLogo}
            />
            <ToggleRow
              label={'"Scan me" frame'}
              hint="Adds a padded frame with a call-to-action label"
              checked={showFrame}
              onChange={setShowFrame}
            />
            {showFrame && (
              <div className="pt-1">
                <label className="mb-1.5 block text-xs font-semibold text-muted">
                  Frame label
                </label>
                <input
                  type="text"
                  value={label}
                  maxLength={24}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="SCAN ME"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-brand"
                />
              </div>
            )}
          </div>
        </section>

        {/* Encoded value + copy */}
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {mode === "card" ? "Points to" : "QR opens"}
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <span className="truncate text-sm font-medium text-foreground">
              {encoded.display || <span className="text-muted">Nothing yet — add content above</span>}
            </span>
            <button
              type="button"
              onClick={copyLink}
              disabled={!value}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover disabled:opacity-40"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-brand" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      </div>

      {/* ============ Preview + export ============ */}
      <section className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-6">
        <h2 className="mb-4 text-sm font-bold text-foreground">Preview</h2>

        <div className="flex justify-center">
          <div
            className="flex flex-col items-center rounded-3xl shadow-sm"
            style={{
              background: bg,
              padding: showFrame ? 28 : 16,
              gap: showFrame ? 16 : 0,
            }}
          >
            {value ? (
              <QRCodeCanvas
                value={value}
                size={200}
                fgColor={fg}
                bgColor={bg}
                level={level}
                marginSize={0}
                imageSettings={
                  hasLogo
                    ? { ...logoSettings!, height: 44, width: 44 }
                    : undefined
                }
              />
            ) : (
              <div
                className="flex h-[200px] w-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center"
                style={{ color: fg }}
              >
                <QrCode className="h-8 w-8 opacity-40" />
                <span className="px-4 text-xs font-medium opacity-70">
                  Add content to generate
                </span>
              </div>
            )}
            {value && showFrame && label.trim() && (
              <span
                className="text-sm font-extrabold uppercase tracking-widest"
                style={{ color: fg }}
              >
                {label.trim()}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-2.5">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!value}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Download PNG
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={downloadSvg}
              disabled={!value}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover disabled:opacity-40"
            >
              <Download className="h-4 w-4 text-brand" /> SVG
            </button>
            <button
              type="button"
              onClick={printPoster}
              disabled={!value}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover disabled:opacity-40"
            >
              <Printer className="h-4 w-4 text-brand" /> Print
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted">
          PNG exports at {exportSize}px — crisp for print & posters.
        </p>
      </section>

      {/* ---- Off-screen high-res renders used only for export ---- */}
      <div
        ref={exportRef}
        aria-hidden
        className="pointer-events-none fixed -left-[9999px] top-0"
      >
        {value && (
          <>
            <QRCodeCanvas
              value={value}
              size={exportSize}
              fgColor={fg}
              bgColor={bg}
              level={level}
              marginSize={0}
              imageSettings={
                hasLogo
                  ? { ...logoSettings!, height: exportSize * 0.22, width: exportSize * 0.22 }
                  : undefined
              }
            />
            <QRCodeSVG
              value={value}
              size={exportSize}
              fgColor={fg}
              bgColor={bg}
              level={level}
              marginSize={2}
              imageSettings={
                hasLogo
                  ? { ...logoSettings!, height: exportSize * 0.22, width: exportSize * 0.22 }
                  : undefined
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-muted">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold uppercase text-foreground outline-none"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4 ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </label>
  );
}
