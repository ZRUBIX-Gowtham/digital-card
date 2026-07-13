"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Send, CalendarCheck, CheckCircle2, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CardData } from "@/types/card";
import { effectiveSectionLayout } from "@/lib/section-layouts";
import { effectiveSlots, isSlotInPast } from "@/lib/slots";
import {
  submitLeadAction,
  getBookedSlotsAction,
  type SubmitLeadInput,
} from "@/lib/leads-actions";

/** Shared section heading, matching the card's other section labels. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
      {children}
    </h3>
  );
}

const fieldCls =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:ring-2";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

/** Variants that render their own title/subtitle inside the frame (no label above). */
const HEADING_INSIDE = new Set(["boxed", "gradient", "split"]);

/**
 * Visual chrome for a lead form. It renders the heading + wrapper for the chosen
 * design variant; the caller passes the fields, error and submit button as
 * `children`. Both the live forms and the editor preview share this so a variant
 * always looks identical in the picker and on the public card.
 */
function FormShell({
  variant,
  accent,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  variant: string;
  accent: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  if (variant === "gradient") {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div
          className="px-4 py-4 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}c8)` }}
        >
          <h3 className="flex items-center gap-2 text-base font-bold">
            <Icon className="h-4.5 w-4.5" /> {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-white/85">{subtitle}</p>}
        </div>
        <div className="space-y-3 p-4">{children}</div>
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <div
          className="flex items-center gap-3 border-b border-border p-4"
          style={{ backgroundColor: `${accent}0d` }}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: accent }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="space-y-3 p-4">{children}</div>
      </div>
    );
  }

  if (variant === "boxed") {
    return (
      <div
        className="rounded-2xl border border-border p-5"
        style={{ backgroundColor: `${accent}0d` }}
      >
        <div className="mb-4 flex flex-col items-center text-center">
          <span
            className="mb-2 flex h-11 w-11 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: accent }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 max-w-xs text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    );
  }

  // Heading-above variants: card (default), minimal, elevated.
  const wrapperCls =
    variant === "minimal"
      ? "space-y-3"
      : variant === "elevated"
        ? "space-y-3 rounded-2xl border border-border bg-white p-4 shadow-lg"
        : "space-y-3 rounded-2xl border border-border bg-white p-4 shadow-sm";
  const wrapperStyle =
    variant === "elevated" ? { borderTop: `3px solid ${accent}` } : undefined;

  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div className={wrapperCls} style={wrapperStyle}>
        {subtitle && (
          <p className="text-xs leading-relaxed text-slate-500">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}

/** Accent submit button, styled per variant. */
function SubmitButton({
  variant,
  accent,
  icon: Icon,
  label,
  pending,
}: {
  variant: string;
  accent: string;
  icon: LucideIcon;
  label: string;
  pending?: boolean;
}) {
  const radius = variant === "minimal" ? "rounded-full" : "rounded-xl";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex w-full items-center justify-center gap-2 ${radius} px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60`}
      style={{ backgroundColor: accent }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/** Green confirmation shown after a successful submit. */
function SubmittedCard({ accent, text }: { accent: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      <p className="text-sm font-semibold text-emerald-800">{text}</p>
      <p className="text-xs text-emerald-600" style={{ color: accent }}>
        We&apos;ll be in touch shortly.
      </p>
    </div>
  );
}

/** Success state — keeps the section heading for heading-above variants. */
function DoneBlock({
  variant,
  title,
  accent,
  text,
}: {
  variant: string;
  title: string;
  accent: string;
  text: string;
}) {
  if (HEADING_INSIDE.has(variant)) {
    return <SubmittedCard accent={accent} text={text} />;
  }
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <SubmittedCard accent={accent} text={text} />
    </div>
  );
}

/**
 * Visitor time-slot picker with five design styles. Booked / past slots are
 * passed in `disabled` and rendered greyed-out and unselectable.
 */
function SlotPicker({
  style,
  slots,
  value,
  onChange,
  accent,
  disabled,
}: {
  style: string;
  slots: string[];
  value: string;
  onChange: (v: string) => void;
  accent: string;
  disabled: Set<string>;
}) {
  if (style === "dropdown") {
    return (
      <select
        className={fieldCls}
        style={{ ["--tw-ring-color" as string]: `${accent}55` }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Any time</option>
        {slots.map((s) => (
          <option key={s} value={s} disabled={disabled.has(s)}>
            {s}
            {disabled.has(s) ? " — booked" : ""}
          </option>
        ))}
      </select>
    );
  }

  const btnClass = (s: string) => {
    const off = disabled.has(s);
    const on = value === s;
    if (off)
      return "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300 line-through";
    if (on) return "text-white shadow-sm";
    return "border-border bg-white text-slate-600 hover:border-slate-300";
  };
  const btnStyle = (s: string) =>
    !disabled.has(s) && value === s
      ? { backgroundColor: accent, borderColor: accent }
      : undefined;
  const toggle = (s: string) => {
    if (disabled.has(s)) return;
    onChange(value === s ? "" : s);
  };

  if (style === "grid") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled.has(s)}
            onClick={() => toggle(s)}
            className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${btnClass(s)}`}
            style={btnStyle(s)}
          >
            {s}
          </button>
        ))}
      </div>
    );
  }

  if (style === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled.has(s)}
            onClick={() => toggle(s)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition ${btnClass(s)}`}
            style={btnStyle(s)}
          >
            <Clock className="h-4 w-4 opacity-80" />
            {s}
            {disabled.has(s) && <span className="text-[9px] font-medium">Booked</span>}
          </button>
        ))}
      </div>
    );
  }

  if (style === "list") {
    return (
      <div className="space-y-1.5">
        {slots.map((s) => {
          const off = disabled.has(s);
          const on = !off && value === s;
          return (
            <button
              key={s}
              type="button"
              disabled={off}
              onClick={() => toggle(s)}
              className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${btnClass(s)}`}
              style={btnStyle(s)}
            >
              <span className="inline-flex items-center gap-2.5">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full border"
                  style={{ borderColor: on ? "#fff" : "currentColor" }}
                >
                  {on && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                {s}
              </span>
              {off && <span className="text-[10px] font-medium">Booked</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // pills (default for non-dropdown)
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled.has(s)}
          onClick={() => toggle(s)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${btnClass(s)}`}
          style={btnStyle(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/** Lead-capture enquiry form (public card). */
export function EnquiryForm({ card, accent }: { card: CardData; accent: string }) {
  const cfg = card.enquiry ?? {};
  const variant = effectiveSectionLayout(card.sectionLayouts, "enquiry");
  const askPhone = cfg.askPhone !== false;
  const askEmail = cfg.askEmail !== false;
  const title = cfg.title || "Send an Enquiry";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: SubmitLeadInput = {
      cardSlug: card.slug,
      type: "enquiry",
      name,
      phone: askPhone ? phone : undefined,
      email: askEmail ? email : undefined,
      message,
    };
    start(async () => {
      const res = await submitLeadAction(payload);
      if (res.ok) setDone(true);
      else setError(res.error ?? "Something went wrong. Please try again.");
    });
  }

  if (done) {
    return (
      <DoneBlock
        variant={variant}
        title={title}
        accent={accent}
        text="Thanks — your enquiry has been sent!"
      />
    );
  }

  return (
    <form onSubmit={submit}>
      <FormShell
        variant={variant}
        accent={accent}
        title={title}
        subtitle={cfg.subtitle}
        icon={Send}
      >
        <Field label="Your name" required>
          <input
            className={fieldCls}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            required
          />
        </Field>
        {askPhone && (
          <Field label="Phone">
            <input
              type="tel"
              className={fieldCls}
              style={{ ["--tw-ring-color" as string]: `${accent}55` }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
          </Field>
        )}
        {askEmail && (
          <Field label="Email">
            <input
              type="email"
              className={fieldCls}
              style={{ ["--tw-ring-color" as string]: `${accent}55` }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
        )}
        <Field label="Message">
          <textarea
            className={`${fieldCls} min-h-[84px] resize-y`}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
          />
        </Field>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        <SubmitButton
          variant={variant}
          accent={accent}
          icon={Send}
          label={pending ? "Sending…" : cfg.buttonLabel || "Send enquiry"}
          pending={pending}
        />
      </FormShell>
    </form>
  );
}

/** Appointment / booking request form (public card). */
export function BookingForm({ card, accent }: { card: CardData; accent: string }) {
  const cfg = card.booking ?? {};
  const variant = effectiveSectionLayout(card.sectionLayouts, "booking");
  const services = (cfg.services ?? []).filter(Boolean);
  const slots = useMemo(() => effectiveSlots(card.booking), [card.booking]);
  const slotStyle = cfg.slotStyle ?? "dropdown";
  const title = cfg.title || "Book an Appointment";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const today = new Date().toISOString().slice(0, 10);

  // Which slots the visitor can't pick: already booked, or already past today.
  const disabledSlots = useMemo(() => {
    const set = new Set(booked);
    if (date) for (const s of slots) if (isSlotInPast(date, s)) set.add(s);
    return set;
  }, [booked, date, slots]);

  // Fetch the taken slots for the chosen date so we can grey them out.
  useEffect(() => {
    if (!date || slots.length === 0) return;
    let active = true;
    getBookedSlotsAction(card.slug, date).then((b) => {
      if (active) setBooked(b);
    });
    return () => {
      active = false;
    };
  }, [date, slots.length, card.slug]);

  function pickDate(v: string) {
    setDate(v);
    setTime("");
    setBooked([]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: SubmitLeadInput = {
      cardSlug: card.slug,
      type: "booking",
      name,
      phone,
      service: service || undefined,
      date,
      time: time || undefined,
      message,
    };
    start(async () => {
      const res = await submitLeadAction(payload);
      if (res.ok) setDone(true);
      else setError(res.error ?? "Something went wrong. Please try again.");
    });
  }

  if (done) {
    return (
      <DoneBlock
        variant={variant}
        title={title}
        accent={accent}
        text="Your booking request has been sent!"
      />
    );
  }

  return (
    <form onSubmit={submit}>
      <FormShell
        variant={variant}
        accent={accent}
        title={title}
        subtitle={cfg.subtitle}
        icon={CalendarCheck}
      >
        <Field label="Your name" required>
          <input
            className={fieldCls}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            required
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            className={fieldCls}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />
        </Field>
        {services.length > 0 && (
          <Field label="Service">
            <select
              className={fieldCls}
              style={{ ["--tw-ring-color" as string]: `${accent}55` }}
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Select a service…</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Preferred date" required>
          <input
            type="date"
            min={today}
            className={fieldCls}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={date}
            onChange={(e) => pickDate(e.target.value)}
            required
          />
        </Field>
        {slots.length > 0 ? (
          <div>
            <span className="mb-1.5 block text-[11px] font-semibold text-slate-500">
              Preferred time
            </span>
            {!date ? (
              <p className="rounded-xl border border-dashed border-border bg-slate-50 px-3.5 py-2.5 text-xs text-slate-400">
                Pick a date to see available times.
              </p>
            ) : disabledSlots.size >= slots.length ? (
              <p className="rounded-xl border border-dashed border-border bg-slate-50 px-3.5 py-2.5 text-xs text-slate-400">
                No slots left on this date — please choose another day.
              </p>
            ) : (
              <SlotPicker
                style={slotStyle}
                slots={slots}
                value={time}
                onChange={setTime}
                accent={accent}
                disabled={disabledSlots}
              />
            )}
          </div>
        ) : (
          <Field label="Preferred time">
            <input
              type="time"
              className={fieldCls}
              style={{ ["--tw-ring-color" as string]: `${accent}55` }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
        )}
        <Field label="Notes">
          <textarea
            className={`${fieldCls} min-h-[72px] resize-y`}
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything we should know?"
          />
        </Field>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        <SubmitButton
          variant={variant}
          accent={accent}
          icon={CalendarCheck}
          label={pending ? "Sending…" : cfg.buttonLabel || "Request booking"}
          pending={pending}
        />
      </FormShell>
    </form>
  );
}

/** Static, non-interactive field used only in the editor's layout preview. */
function PreviewField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</span>
      <div className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-slate-400">
        {placeholder}
      </div>
    </label>
  );
}

/**
 * Non-interactive representation of a lead form used by the editor's
 * "Design & Layout" picker so each variant shows an accurate thumbnail.
 */
export function LeadFormPreview({
  variant,
  accent,
  type,
}: {
  variant: string;
  accent: string;
  type: "enquiry" | "booking";
}) {
  const isBooking = type === "booking";
  const title = isBooking ? "Book an Appointment" : "Send an Enquiry";
  const Icon = isBooking ? CalendarCheck : Send;
  return (
    <div className="pointer-events-none">
      <FormShell
        variant={variant}
        accent={accent}
        title={title}
        subtitle="We'd love to hear from you."
        icon={Icon}
      >
        <PreviewField label="Your name" placeholder="e.g. Priya Sharma" />
        <PreviewField
          label={isBooking ? "Preferred date" : "Email"}
          placeholder={isBooking ? "Pick a date" : "you@example.com"}
        />
        <SubmitButton
          variant={variant}
          accent={accent}
          icon={Icon}
          label={isBooking ? "Request booking" : "Send enquiry"}
        />
      </FormShell>
    </div>
  );
}

/** Section wrappers (guard on `enabled`) used by OrderedSections. */
export function EnquirySection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.enquiry?.enabled) return null;
  return <EnquiryForm card={card} accent={accent} />;
}

export function BookingSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.booking?.enabled) return null;
  return <BookingForm card={card} accent={accent} />;
}
