"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Phase 1 contact form. Client-only: shows a success state without a backend.
 * Phase 2 will POST this to an API route / CRM.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Thanks — we&apos;ll be in touch!
        </h3>
        <p className="mt-2 text-sm text-muted">
          Our team typically replies within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Aarav Mehta" required />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
        />
      </div>
      <Field
        label="Phone / WhatsApp"
        name="phone"
        placeholder="+91 98XXX XXXXX"
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Tell us what you need…"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring"
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        <Send className="h-4 w-4" /> Send message
      </Button>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
