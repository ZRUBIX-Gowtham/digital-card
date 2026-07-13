/**
 * Time-slot helpers shared by the public booking form and the dashboard editor.
 * Slot labels are human-friendly ("9:00 AM") and are also what gets stored on a
 * booking lead, so generation and parsing must round-trip consistently.
 */

import type { BookingConfig } from "@/types/card";

/** Minutes-since-midnight for a "9:00 AM" / "2:30 PM" style label. */
export function slotToMinutes(label: string): number | null {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10) % 12;
  const min = parseInt(m[2], 10);
  if (m[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + min;
}

/** Format minutes-since-midnight back into a "9:00 AM" label. */
export function minutesToLabel(total: number): string {
  const h24 = Math.floor(total / 60) % 24;
  const min = total % 60;
  const ampm = h24 < 12 ? "AM" : "PM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
}

/** Default gap between generated slots, in minutes. */
export const DEFAULT_SLOT_INTERVAL = 60;

/** Interval choices offered in the editor. */
export const SLOT_INTERVALS = [30, 60] as const;

/** Quick working-hours presets shown as chips in the editor. */
export const WORKING_HOUR_PRESETS: { label: string; start: string; end: string }[] = [
  { label: "9 – 5", start: "9:00 AM", end: "5:00 PM" },
  { label: "10 – 6", start: "10:00 AM", end: "6:00 PM" },
  { label: "10 – 7", start: "10:00 AM", end: "7:00 PM" },
  { label: "11 – 8", start: "11:00 AM", end: "8:00 PM" },
];

/** Selectable start/end times for the working-hours pickers (every 30 min). */
export const HOUR_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let t = 6 * 60; t <= 22 * 60; t += 30) out.push(minutesToLabel(t));
  return out;
})();

/**
 * Generate slot labels across a working window. Slots start at `start` and step
 * by `interval` while a full slot still fits before `end` (so a 9–5 / 60-min
 * window yields 9:00 AM … 4:00 PM). Any slot overlapping the optional
 * break window (e.g. lunch) is skipped.
 */
export function generateSlots(
  start: string,
  end: string,
  interval: number = DEFAULT_SLOT_INTERVAL,
  breakStart?: string,
  breakEnd?: string,
): string[] {
  const s = slotToMinutes(start);
  const e = slotToMinutes(end);
  const step = interval > 0 ? interval : DEFAULT_SLOT_INTERVAL;
  if (s == null || e == null || e <= s) return [];
  const bs = breakStart ? slotToMinutes(breakStart) : null;
  const be = breakEnd ? slotToMinutes(breakEnd) : null;
  const hasBreak = bs != null && be != null && be > bs;
  const out: string[] = [];
  for (let t = s; t + step <= e; t += step) {
    // Skip a slot when it overlaps the break window at all.
    if (hasBreak && t < be && t + step > bs) continue;
    out.push(minutesToLabel(t));
  }
  return out;
}

/**
 * The slots a visitor should actually see: generated from the working-hours
 * window when both ends are set, otherwise the manually-listed custom slots.
 */
export function effectiveSlots(cfg: BookingConfig | undefined): string[] {
  if (!cfg) return [];
  if (cfg.dayStart && cfg.dayEnd) {
    return generateSlots(
      cfg.dayStart,
      cfg.dayEnd,
      cfg.slotInterval,
      cfg.breakStart,
      cfg.breakEnd,
    );
  }
  return (cfg.slots ?? []).filter(Boolean);
}

/**
 * True when a slot on the given date (YYYY-MM-DD) has already passed. Only
 * meaningful for today; future dates are always open, past dates fully closed.
 */
export function isSlotInPast(dateISO: string, slotLabel: string): boolean {
  if (!dateISO) return false;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (dateISO > today) return false;
  if (dateISO < today) return true;
  const mins = slotToMinutes(slotLabel);
  if (mins == null) return false;
  return mins <= now.getHours() * 60 + now.getMinutes();
}
