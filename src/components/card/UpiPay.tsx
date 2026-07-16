"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Smartphone } from "lucide-react";

/**
 * "Pay via UPI" control shown on the public card's Payment section.
 *
 * Shows a scannable UPI QR code plus a Pay button. When the owner has set a
 * fixed amount in the builder, that amount is baked into both the QR and the
 * Pay button so the visitor's UPI app opens pre-filled — but the amount is not
 * shown anywhere on the card. When no amount is set, the visitor enters it
 * inside their own UPI app after scanning / tapping Pay. On a phone, tapping
 * Pay opens the UPI deep link (`upi://pay?...`) which hands off to GPay /
 * PhonePe / any installed UPI app. On desktop the QR lets the visitor scan and
 * pay from their phone instead.
 */
export function UpiPay({
  upiId,
  payeeName,
  accent,
  fixedAmount,
  showButton = true,
  showQr = true,
}: {
  upiId: string;
  payeeName?: string;
  accent: string;
  /** Owner-set amount. When a valid positive number it is baked into the QR and
   *  Pay link (auto-filled in the UPI app); otherwise the visitor enters it. */
  fixedAmount?: string;
  /** Whether the "Pay via UPI" button is shown. Defaults to true. */
  showButton?: boolean;
  /** Whether the scan-to-pay QR code is shown. Defaults to true. */
  showQr?: boolean;
}) {
  const lockedAmount = Number(fixedAmount);
  const isLocked = Number.isFinite(lockedAmount) && lockedAmount > 0;

  // The same UPI intent string is used for both the QR code and the Pay button,
  // so scanning and tapping always hand off an identical payment request. When
  // no amount is locked, `am` is omitted so the UPI app prompts for it.
  function buildUpiUrl() {
    const params = new URLSearchParams({ pa: upiId, cu: "INR" });
    if (payeeName) params.set("pn", payeeName);
    if (isLocked) params.set("am", lockedAmount.toFixed(2));
    return `upi://pay?${params.toString()}`;
  }

  const upiUrl = buildUpiUrl();

  function pay() {
    // Navigating the top window triggers the OS UPI-app chooser on mobile.
    window.location.href = upiUrl;
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Scannable UPI QR — carries the owner's amount when set. */}
      {showQr && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4">
          <QRCodeCanvas
            value={upiUrl}
            size={168}
            fgColor="#0f172a"
            bgColor="#ffffff"
            level="M"
            marginSize={4}
          />
          <p className="text-center text-[11px] font-medium text-slate-500">
            Scan with any UPI app to pay
          </p>
        </div>
      )}

      {showButton && (
        <>
          <button
            type="button"
            onClick={pay}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            <Smartphone className="h-4 w-4" />
            Pay via UPI
          </button>
          <p className="text-center text-[11px] text-slate-400">
            Opens GPay, PhonePe or any UPI app on your phone
          </p>
        </>
      )}
    </div>
  );
}
