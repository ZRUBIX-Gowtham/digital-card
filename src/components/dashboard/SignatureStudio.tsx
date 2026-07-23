"use client";

import { useId, useMemo, useRef, useState, useTransition } from "react";
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
  ImagePlus,
  Images,
  X,
  Crown,
  Megaphone,
  Eye,
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

/** Read a picked image file as a data-URI and hand it back. */
function readImage(file: File, onDone: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onloadend = () => onDone(reader.result as string);
  reader.readAsDataURL(file);
}

/**
 * Single image uploader for the photo/logo — shows a preview, an Upload button
 * and a Remove button, and stores the picked image inline as a data-URI so it
 * travels with the copied signature.
 */
function PhotoUpload({
  value,
  onChange,
  label = "Photo / Logo",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const inputId = useId();
  return (
    <div className="mb-4">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-3">
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="h-14 w-14 rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-muted">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readImage(file, onChange);
              e.target.value = "";
            }}
          />
          <div className="flex gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand/50"
            >
              {value ? "Replace" : "Upload"}
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                Remove
              </button>
            )}
          </div>
          <span className="mt-1 block text-[10px] text-muted">PNG, JPG, or WEBP.</span>
        </div>
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
  // Designs with a photo showcase strip, and how many images each allows.
  const galleryTemplate =
    template === "listings" || template === "boutique" || template === "circles" || template === "realtor" || template === "portfolio" || template === "premium";
  const galleryMax = template === "boutique" ? 10 : template === "circles" ? 5 : template === "realtor" ? 2 : 6;
  // Design-picker filter: show all designs, or only premium / free ones.
  const [filter, setFilter] = useState<"all" | "premium" | "free">("all");
  // Single-open accordion for the editor sections; opening one closes the rest.
  const [openPanel, setOpenPanel] = useState<string | null>("design");
  const togglePanel = (id: string) => setOpenPanel((cur) => (cur === id ? null : id));
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const previewRef = useRef<HTMLDivElement>(null);

  const visibleTemplates = useMemo(
    () =>
      signatureTemplates.filter((t) =>
        filter === "premium" ? t.premium : filter === "free" ? !t.premium : true,
      ),
    [filter],
  );

  const hidden = useMemo(() => new Set(draft.hide), [draft.hide]);
  const previewCard = useMemo(() => buildSignatureCard(card, draft), [card, draft]);
  const styleOpts = useMemo(
    () => ({
      font: draft.font,
      textColor: draft.textColor,
      gallery: draft.gallery,
      galleryHeading: draft.galleryHeading,
      bannerText: draft.bannerText,
      bannerButton: draft.bannerButton,
      bannerImage: draft.bannerImage,
    }),
    [
      draft.font,
      draft.textColor,
      draft.gallery,
      draft.galleryHeading,
      draft.bannerText,
      draft.bannerButton,
      draft.bannerImage,
    ],
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
    setOpenPanel("template-customization");
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
  function addGalleryImages(urls: string[]) {
    setDraft((d) => ({ ...d, gallery: [...d.gallery, ...urls].slice(0, galleryMax) }));
    mark();
  }
  function removeGalleryImage(index: number) {
    setDraft((d) => ({ ...d, gallery: d.gallery.filter((_, i) => i !== index) }));
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

  const previewBlock = (
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
        <div className="p-3 sm:p-5">
          <p className="mb-3 text-xs sm:text-sm text-slate-600">Hi there,</p>
          <div className="overflow-x-auto overflow-y-auto max-h-[320px] sm:max-h-none overscroll-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
            <div className="max-sm:[zoom:0.52] sm:[zoom:0.78]">
              <div 
                ref={previewRef} 
                dangerouslySetInnerHTML={{ __html: html }}
                className="[&_table]:!max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const actionsBlock = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-all hover:bg-surface-hover hover:border-brand/40 active:scale-[0.98] disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={copySignature}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-indigo-600 to-brand px-5 text-sm font-bold text-white shadow-md shadow-brand/20 transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy signature"}
        </button>
      </div>
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200/80 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );

  const howToBlock = (
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
  );

  return (
    <div>
      {/* Mobile-only Segmented View Switcher */}
      <div className="mb-5 flex rounded-2xl border border-border bg-surface-2 p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "edit"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Pencil className="h-4 w-4" /> Edit Details
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "preview"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Eye className="h-4 w-4" /> Live Preview
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] lg:items-start">
        
        {/* Mobile View: Preview Mode */}
        <div className={`space-y-6 lg:hidden ${mobileTab === "preview" ? "block" : "hidden"}`}>
          {previewBlock}
          {actionsBlock}
          {howToBlock}
        </div>

        {/* ============================= LEFT: editor sections */}
        <div className={`min-w-0 space-y-6 lg:order-1 ${mobileTab === "edit" ? "block" : "hidden lg:block"}`}>
          {/* Mobile top actions */}
          <div className="block lg:hidden">{actionsBlock}</div>
        {/* Design */}
        <Section
          icon={LayoutTemplate}
          title="Design"
          desc="Pick a look — the preview updates instantly."
          open={openPanel === "design"}
          onToggle={() => togglePanel("design")}
        >
          {/* Filter tabs — All / Premium / Free. */}
          <div className="mb-4 inline-flex rounded-xl border border-border bg-surface-2 p-1">
            {([
              { key: "all", label: "All" },
              { key: "premium", label: "Premium" },
              { key: "free", label: "Free" },
            ] as const).map((f) => {
              const active = filter === f.key;
              const count = signatureTemplates.filter((t) =>
                f.key === "premium" ? t.premium : f.key === "free" ? !t.premium : true,
              ).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? "bg-surface text-foreground shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {f.key === "premium" && <Crown className="h-3 w-3 text-amber-500" />}
                  {f.label}
                  <span className={`text-[10px] ${active ? "text-muted" : "text-muted/70"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="max-h-[650px] sm:max-h-[400px] overflow-y-auto overscroll-contain rounded-xl pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTemplates.map((t) => {
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
                  <div className="relative flex min-h-[190px] sm:min-h-0 sm:h-28 items-center justify-start sm:justify-center overflow-hidden border-b border-border bg-white p-3">
                    <div className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center justify-start sm:justify-center py-1 px-0.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <div
                        className="pointer-events-none shrink-0 max-sm:[zoom:0.44] sm:[zoom:0.35]"
                        dangerouslySetInnerHTML={{ __html: renderSignature(previewCard, t.id, styleOpts) }}
                      />
                    </div>
                    {t.isNew && (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow pointer-events-none">
                        New
                      </span>
                    )}
                    {t.premium && (
                      <span className="absolute bottom-2.5 left-2.5 z-10 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow pointer-events-none">
                        <Crown className="h-2.5 w-2.5" /> Premium
                      </span>
                    )}
                    {active && (
                      <span className="absolute right-2.5 top-2.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow pointer-events-none">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <span className="bg-surface px-3 py-2 text-xs font-semibold text-foreground">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
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

        {/* Dynamic Template Customization Section — Panel #2 */}
        <Section
          icon={Megaphone}
          title={`Template Options — ${signatureTemplates.find((t) => t.id === template)?.name ?? "Custom"}`}
          desc={
            template === "video"
              ? "Set YouTube video URL, title, channel name & thumbnail."
              : template === "exclusive"
              ? "Edit quote text and bottom banner image."
              : template === "disclaimer"
              ? "Edit legal confidentiality notice."
              : template === "portfolio"
              ? "Edit website & email link box labels and showcase photos."
              : galleryTemplate
              ? "Edit showcase heading and product/listing photos."
              : "Edit promo banner text, button label & banner background image."
          }
          open={openPanel === "template-customization"}
          onToggle={() => togglePanel("template-customization")}
        >
          {template === "video" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">YouTube Video Link (URL)</span>
                <input
                  value={draft.bannerButton}
                  onChange={(e) => setField("bannerButton", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=-KflXKhN2Uc"
                  className={inputCls}
                />
                <span className="mt-1 block text-[11px] text-muted">
                  Paste any YouTube link (e.g. watch?v=...) — play button & thumbnail are generated automatically!
                </span>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Video Title</span>
                <input
                  value={draft.bannerText}
                  onChange={(e) => setField("bannerText", e.target.value)}
                  placeholder="5 Zoom, Virtual, or Team Building Activities"
                  className={inputCls}
                />
              </label>
              <PhotoUpload
                value={draft.bannerImage}
                onChange={(v) => setField("bannerImage", v)}
                label="Custom Thumbnail Image (Optional)"
              />
            </div>
          ) : template === "exclusive" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Quote / Extra Text</span>
                <textarea
                  value={draft.bannerText}
                  onChange={(e) => setField("bannerText", e.target.value)}
                  rows={3}
                  placeholder='"the time is always right to do what is right"\n- Martin Luther King'
                  className={`${inputCls} resize-y`}
                />
              </label>
              <PhotoUpload
                value={draft.bannerImage}
                onChange={(v) => setField("bannerImage", v)}
                label="Bottom Banner Graphic / Image"
              />
            </div>
          ) : template === "disclaimer" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Legal Confidentiality Notice</span>
                <textarea
                  value={draft.bannerText}
                  onChange={(e) => setField("bannerText", e.target.value)}
                  rows={4}
                  placeholder="IMPORTANT: The contents of this email and any attachments are confidential…"
                  className={`${inputCls} resize-y`}
                />
              </label>
            </div>
          ) : template === "portfolio" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Left Link Box Label (→ Website)</span>
                <input
                  value={draft.bannerText}
                  onChange={(e) => setField("bannerText", e.target.value)}
                  placeholder="My portfolio"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Right Link Box Label (→ Email)</span>
                <input
                  value={draft.bannerButton}
                  onChange={(e) => setField("bannerButton", e.target.value)}
                  placeholder="Get in touch"
                  className={inputCls}
                />
              </label>
              <div className="border-t border-border pt-4">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Portfolio Showcase Photos</span>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {draft.gallery.map((src, i) => (
                    <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {draft.gallery.length < galleryMax && (
                    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface-2 text-muted transition-colors hover:border-brand/50 hover:text-brand">
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-[11px] font-semibold">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []);
                          const remaining = Math.max(0, galleryMax - draft.gallery.length);
                          const toRead = files.slice(0, remaining);
                          e.target.value = "";
                          if (toRead.length === 0) return;
                          const collected: string[] = [];
                          let done = 0;
                          toRead.forEach((file) =>
                            readImage(file, (url) => {
                              collected.push(url);
                              done += 1;
                              if (done === toRead.length) addGalleryImages(collected);
                            }),
                          );
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Banner Text / Headline</span>
                <input
                  value={draft.bannerText}
                  onChange={(e) => setField("bannerText", e.target.value)}
                  placeholder="Get 20% off this month"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted">Button Label</span>
                <input
                  value={draft.bannerButton}
                  onChange={(e) => setField("bannerButton", e.target.value)}
                  placeholder={template === "campaign" ? "Get a free quote" : "Call us"}
                  className={inputCls}
                />
              </label>
              
              {galleryTemplate && (
                <div className="border-t border-border pt-4">
                  <span className="mb-1.5 block text-xs font-semibold text-muted">Showcase Gallery Strip</span>
                  <label className="mb-3 block">
                    <span className="mb-1 block text-[11px] font-medium text-muted">Gallery Heading</span>
                    <input
                      value={draft.galleryHeading}
                      onChange={(e) => setField("galleryHeading", e.target.value)}
                      placeholder="Check out our latest listings"
                      className={inputCls}
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {draft.gallery.map((src, i) => (
                      <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          aria-label="Remove image"
                          className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {draft.gallery.length < galleryMax && (
                      <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface-2 text-muted transition-colors hover:border-brand/50 hover:text-brand">
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            const remaining = Math.max(0, galleryMax - draft.gallery.length);
                            const toRead = files.slice(0, remaining);
                            e.target.value = "";
                            if (toRead.length === 0) return;
                            const collected: string[] = [];
                            let done = 0;
                            toRead.forEach((file) =>
                              readImage(file, (url) => {
                                collected.push(url);
                                done += 1;
                                if (done === toRead.length) addGalleryImages(collected);
                              }),
                            );
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <PhotoUpload
                value={draft.bannerImage}
                onChange={(v) => setField("bannerImage", v)}
                label="Banner / Footer Graphic Image"
              />
            </div>
          )}
        </Section>

        {/* Your details */}
        <Section
          icon={Pencil}
          title="Your details"
          desc="Edit what appears. Remove anything you don't need."
          open={openPanel === "details"}
          onToggle={() => togglePanel("details")}
        >
          <PhotoUpload value={draft.photo} onChange={(v) => setField("photo", v)} />
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
      <div className="flex flex-col gap-8 lg:gap-4 lg:order-2 lg:sticky lg:top-6 lg:self-start">
        
        {/* Desktop-only Preview */}
        <div className="hidden lg:block">
          {previewBlock}
        </div>

        {/* Actions */}
        {actionsBlock}

        {/* How to use it */}
        {howToBlock}
        
      </div>
    </div>
    </div>
  );
}
