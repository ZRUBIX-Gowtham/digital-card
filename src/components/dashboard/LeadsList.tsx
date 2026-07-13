"use client";

import { useState, useTransition } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  CalendarCheck,
  Send,
  Trash2,
  Check,
  Clock,
} from "lucide-react";
import type { Lead } from "@/lib/leads-store";
import {
  markLeadReadAction,
  deleteLeadAction,
} from "@/app/dashboard/leads/actions";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function waLink(phone?: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function LeadsList({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<"all" | "enquiry" | "booking">("all");
  const shown = leads.filter((l) => filter === "all" || l.type === filter);

  const counts = {
    all: leads.length,
    enquiry: leads.filter((l) => l.type === "enquiry").length,
    booking: leads.filter((l) => l.type === "booking").length,
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <Send className="mx-auto h-8 w-8 text-muted" />
        <p className="mt-3 font-semibold text-foreground">No leads yet</p>
        <p className="mt-1 text-sm text-muted">
          Enable the Enquiry or Booking section on your card, and submissions will
          land here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["all", "enquiry", "booking"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${
              filter === f
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-foreground hover:bg-surface-hover"
            }`}
          >
            {f === "all" ? "All" : f === "enquiry" ? "Enquiries" : "Bookings"}
            <span className={filter === f ? "text-white/80" : "text-muted"}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const [gone, setGone] = useState(false);
  const wa = waLink(lead.phone);
  if (gone) return null;

  return (
    <div
      className={`rounded-2xl border bg-surface p-4 transition-colors ${
        lead.read ? "border-border" : "border-brand/40 bg-brand/5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                lead.type === "booking"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-sky-100 text-sky-700"
              }`}
            >
              {lead.type === "booking" ? (
                <CalendarCheck className="h-3 w-3" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              {lead.type === "booking" ? "Booking" : "Enquiry"}
            </span>
            {!lead.read && (
              <span className="h-2 w-2 rounded-full bg-brand" title="New" />
            )}
          </div>
          <p className="mt-2 text-base font-bold text-foreground">{lead.name}</p>
          <p className="inline-flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" /> {timeAgo(lead.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {!lead.read && (
            <button
              type="button"
              disabled={pending}
              onClick={() => start(async () => void (await markLeadReadAction(lead.id)))}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" /> Mark read
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await deleteLeadAction(lead.id);
                if (res.ok) setGone(true);
              })
            }
            className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            aria-label="Delete lead"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {lead.type === "booking" && (lead.service || lead.date || lead.time) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {lead.service && (
            <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-medium text-foreground">
              {lead.service}
            </span>
          )}
          {lead.date && (
            <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-medium text-foreground">
              📅 {lead.date}
            </span>
          )}
          {lead.time && (
            <span className="rounded-lg bg-surface-2 px-2.5 py-1 font-medium text-foreground">
              🕐 {lead.time}
            </span>
          )}
        </div>
      )}

      {lead.message && (
        <p className="mt-3 rounded-xl bg-surface-2/60 p-3 text-sm leading-relaxed text-foreground">
          {lead.message}
        </p>
      )}

      {(lead.phone || lead.email) && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
          {lead.phone && (
            <a
              href={`tel:${lead.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              <Phone className="h-3.5 w-3.5" /> {lead.phone}
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
            >
              <Mail className="h-3.5 w-3.5" /> {lead.email}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
