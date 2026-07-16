"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import {
  Check,
  Copy,
  Loader2,
  AlertCircle,
  Trash2,
  Plus,
  Save,
  LayoutTemplate,
  Pencil,
  Share2,
  ChevronDown,
  ArrowUpRight,
  Palette,
} from "lucide-react";
import type { CardData } from "@/types/card";
import {
  signatureTemplates,
  SIGNATURE_FIELDS,
  SIGNATURE_ACCENTS,
  SIGNATURE_TEXT_COLORS,
  SIGNATURE_FONTS,
  SOCIAL_PLATFORMS,
  renderSignature,
  renderSignatureText,
  buildSignatureCard,
  draftToConfig,
  type SignatureDraft,
} from "@/lib/signature";
import { saveSignatureAction } from "@/app/dashboard/actions";

/** Input styling shared with the rest of the dashboard editor. */
const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-brand focus:bg-surface focus:ring-1 focus:ring-ring";

/**
 * A collapsible dashboard-style section card, matching the Edit-card panels.
 * Open/closed state is controlled by the parent so only one panel is open at a
 * time (opening one collapses the others).
 */
function Section({
  icon: Icon,
  title,
  desc,
  action,
  open,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  action?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-3 p-5 sm:px-6">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {open && action}
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? "Collapse" : "Expand"}
            className="rounded-lg p-1 text-muted transition-colors hover:text-foreground cursor-pointer"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border px-5 py-5 sm:px-6">{children}</div>
      )}
    </section>
  );
}

/**
 * A labelled colour picker: brand swatches + a native eyedropper + a hex input.
 * Every swatch carries a border so pure white stays visible against the panel.
 */
function ColorField({
  label,
  hint,
  value,
  onChange,
  swatches,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  swatches: readonly string[];
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted">{label}</span>
        {hint && <span className="text-[11px] font-medium text-muted">{hint}</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {swatches.map((c) => {
          const active = value.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              title={c}
              aria-label={`Use ${c}`}
              style={{ backgroundColor: c }}
              className={`h-7 w-7 rounded-full border border-border transition-transform hover:scale-110 cursor-pointer ${
                active ? "ring-2 ring-brand ring-offset-2 ring-offset-surface" : ""
              }`}
            />
          );
        })}
        <span className="mx-1 h-6 w-px bg-border" />
        <label
          className="relative inline-flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border"
          title="Pick a custom colour"
          style={{ backgroundColor: value }}
        >
          <Palette className="h-3.5 w-3.5 text-white mix-blend-difference" />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className={`${inputCls} w-28 font-mono uppercase`}
        />
      </div>
    </div>
  );
}

/**
 * Dashboard "Mail Signature" studio. A single-screen editor matching the rest
 * of the dashboard: stacked section cards on the left (design, details, social)
 * and a sticky email-style live preview on the right. Edits fold into the
 * preview live and are persisted to the card on save.
 */
export function SignatureStudio({
  card,
  initialTemplate,
  initialDraft,
}: {
  card: CardData;
  initialTemplate: string;
  initialDraft: SignatureDraft;
}) {
  const [template, setTemplate] = useState(initialTemplate);
  const [draft, setDraft] = useState<SignatureDraft>(initialDraft);
  // Single-open accordion for the editor sections; opening one closes the rest.
  const [openPanel, setOpenPanel] = useState<string | null>("design");
  const togglePanel = (id: string) => setOpenPanel((cur) => (cur === id ? null : id));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const previewRef = useRef<HTMLDivElement>(null);

  const hidden = useMemo(() => new Set(draft.hide), [draft.hide]);
  const previewCard = useMemo(() => buildSignatureCard(card, draft), [card, draft]);
  const styleOpts = useMemo(
    () => ({ font: draft.font, textColor: draft.textColor }),
    [draft.font, draft.textColor],
  );
  const html = useMemo(
    () => renderSignature(previewCard, template, styleOpts),
    [previewCard, template, styleOpts],
  );

  function mark() {
    setDirty(true);
    setSaved(false);
  }
  function pickTemplate(id: string) {
    setTemplate(id);
    mark();
  }
  function setField(key: keyof SignatureDraft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    mark();
  }
  function setAccent(value: string) {
    setDraft((d) => ({ ...d, accent: value }));
    mark();
  }
  function setFont(value: string) {
    setDraft((d) => ({ ...d, font: value }));
    mark();
  }
  function setTextColor(value: string) {
    setDraft((d) => ({ ...d, textColor: value }));
    mark();
  }
  function setSocial(platform: string, value: string) {
    setDraft((d) => ({ ...d, socials: { ...d.socials, [platform]: value } }));
    mark();
  }
  function toggleHide(key: string) {
    setDraft((d) => {
      const next = new Set(d.hide);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...d, hide: [...next] };
    });
    mark();
  }

  function save() {
    setError(null);
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        const res = await saveSignatureAction(draftToConfig(template, draft));
        if (res.ok) {
          setDirty(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2200);
          resolve(true);
        } else {
          setError(res.error ?? "Could not save. Please try again.");
          resolve(false);
        }
      });
    });
  }

  async function copySignature() {
    setError(null);
    if (dirty) await save();
    const plain = renderSignatureText(previewCard);
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
      } else if (previewRef.current) {
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        document.execCommand("copy");
        sel?.removeAllRanges();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setError("Couldn't copy automatically — select the preview and copy manually.");
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)]">
      {/* ============================= LEFT: editor sections */}
      <div className="order-2 min-w-0 space-y-6 lg:order-1">
        {/* Design */}
        <Section
          icon={LayoutTemplate}
          title="Design"
          desc="Pick a look — the preview updates instantly."
          open={openPanel === "design"}
          onToggle={() => togglePanel("design")}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {signatureTemplates.map((t) => {
              const active = t.id === template;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => pickTemplate(t.id)}
                  title={t.description}
                  className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-all cursor-pointer ${
                    active ? "border-brand ring-2 ring-brand/30" : "border-border hover:border-brand/50"
                  }`}
                >
                  <div className="relative flex h-24 items-center justify-center overflow-hidden border-b border-border bg-white p-2">
                    <div
                      className="pointer-events-none"
                      style={{ zoom: 0.34 } as React.CSSProperties}
                      dangerouslySetInnerHTML={{ __html: renderSignature(previewCard, t.id, styleOpts) }}
                    />
                    {active && (
                      <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <span className="bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Colour + type controls — applied to the design and copied with it. */}
          <div className="mt-5 space-y-5 border-t border-border pt-5">
            <ColorField
              label="Accent colour"
              hint="Rules, titles & icons"
              value={draft.accent}
              onChange={setAccent}
              swatches={SIGNATURE_ACCENTS}
            />
            <ColorField
              label="Text colour"
              hint="Name & contact text"
              value={draft.textColor}
              onChange={setTextColor}
              swatches={SIGNATURE_TEXT_COLORS}
            />
            <div>
              <div className="mb-2.5 text-xs font-semibold text-muted">Font family</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SIGNATURE_FONTS.map((f) => {
                  const active = draft.font === f.stack;
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setFont(f.stack)}
                      style={{ fontFamily: f.stack }}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer ${
                        active
                          ? "border-brand text-foreground ring-1 ring-brand/30"
                          : "border-border text-muted hover:border-brand/50"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* Your details */}
        <Section
          icon={Pencil}
          title="Your details"
          desc="Edit what appears. Remove anything you don't need."
          open={openPanel === "details"}
          onToggle={() => togglePanel("details")}
        >
          <label className="mb-4 block">
            <span className="mb-1 block text-xs font-semibold text-muted">Name</span>
            <input
              value={draft.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {SIGNATURE_FIELDS.map((f) => {
              const isHidden = hidden.has(f.key);
              return (
                <div key={f.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">{f.label}</span>
                    <button
                      type="button"
                      onClick={() => toggleHide(f.key)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                        isHidden ? "text-brand hover:bg-brand/10" : "text-muted hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      {isHidden ? (
                        <>
                          <Plus className="h-3 w-3" /> Add
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3" /> Remove
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    value={draft[f.key as keyof SignatureDraft] as string}
                    onChange={(e) => setField(f.key as keyof SignatureDraft, e.target.value)}
                    placeholder={f.placeholder}
                    disabled={isHidden}
                    className={`${inputCls} ${isHidden ? "opacity-40 line-through" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        </Section>

        {/* Social links */}
        <Section
          icon={Share2}
          title="Social links"
          desc="Add a link to show its icon. Empty fields are skipped."
          open={openPanel === "social"}
          onToggle={() => togglePanel("social")}
          action={
            <button
              type="button"
              onClick={() => toggleHide("socials")}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                hidden.has("socials")
                  ? "text-brand hover:bg-brand/10"
                  : "text-muted hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {hidden.has("socials") ? (
                <>
                  <Plus className="h-3 w-3" /> Show
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3" /> Hide all
                </>
              )}
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIAL_PLATFORMS.map((p) => (
              <div key={p.key} className="flex items-center gap-2">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                  style={{ backgroundColor: p.color }}
                  title={p.label}
                >
                  {p.glyph}
                </span>
                <input
                  value={draft.socials[p.key] ?? ""}
                  onChange={(e) => setSocial(p.key, e.target.value)}
                  placeholder={p.placeholder}
                  disabled={hidden.has("socials")}
                  className={`${inputCls} ${hidden.has("socials") ? "opacity-40" : ""}`}
                />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ============================= RIGHT: sticky preview + actions */}
      <div className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50 cursor-pointer"
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={copySignature}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy signature"}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Live preview inside a mock email window */}
        <div className="rounded-2xl border border-border bg-surface-2/60 p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
            Live preview
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_16px_40px_rgba(2,6,23,0.12)]">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-semibold text-slate-500">New Message</span>
            </div>
            <div className="px-5 py-5">
              <p className="mb-4 text-sm text-slate-600">Hi there,</p>
              <div className="overflow-x-auto">
                <div style={{ zoom: 0.78 } as React.CSSProperties}>
                  <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to use it — one step per line, with links that open the mail
            client's signature settings in a new tab. */}
        <div className="rounded-2xl border border-border bg-surface-2/60 p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
            How to use it
          </div>
          <ol className="space-y-2.5">
            {[
              <>
                Click <span className="font-semibold text-foreground">Copy signature</span> above.
              </>,
              <>Open your email&apos;s signature settings (links below).</>,
              <>Paste it into the signature box and save.</>,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
            {[
              { label: "Gmail → Settings → Signature", href: "https://mail.google.com/mail/u/0/#settings/general" },
              { label: "Outlook → Signature", href: "https://outlook.office.com/mail/options/mail/messageContent" },
            ].map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/50 hover:text-brand"
              >
                {m.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Apple Mail: Mail → Settings → Signatures → paste. Edits here only affect the signature —
            your public card stays unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}
