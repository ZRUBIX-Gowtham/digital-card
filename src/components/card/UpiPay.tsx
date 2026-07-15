"use client";

import { useState } from "react";
import { IndianRupee, Smartphone } from "lucide-react";

/**
 * "Pay via UPI" control shown on the public card's Payment section.
 *
 * The visitor can optionally type an amount; tapping Pay opens the UPI deep
 * link (`upi://pay?...`), which on a phone hands off to GPay / PhonePe / any
 * installed UPI app with the payee (and amount, when given) pre-filled.
 */
export function UpiPay({
  upiId,
  payeeName,
  accent,
  fixedAmount,
}: {
  upiId: string;
  payeeName?: string;
  accent: string;
  /** Owner-set amount. When present the field is pre-filled; empty lets the
   *  visitor enter their own amount. */
  fixedAmount?: string;
}) {
  const [amount, setAmount] = useState(fixedAmount ?? "");

  function buildUpiUrl() {
    const params = new URLSearchParams({ pa: upiId, cu: "INR" });
    if (payeeName) params.set("pn", payeeName);
    const amt = Number(amount);
    if (Number.isFinite(amt) && amt > 0) params.set("am", amt.toFixed(2));
    return `upi://pay?${params.toString()}`;
  }

  function pay() {
    // Navigating the top window triggers the OS UPI-app chooser on mobile.
    window.location.href = buildUpiUrl();
  }

  return (
    <div className="mt-3 space-y-2.5">
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-slate-500">
          Amount (optional)
        </span>
        <div className="relative">
          <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3.5 text-sm text-foreground outline-none transition focus:ring-2"
            style={{ ["--tw-ring-color" as string]: `${accent}55` }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
      </label>
      <button
        type="button"
        onClick={pay}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: accent }}
      >
        <Smartphone className="h-4 w-4" />
        Pay via UPI
      </button>
      <p className="text-center text-[11px] text-slate-400">
        Opens GPay, PhonePe or any UPI app on your phone
      </p>
    </div>
  );
}
