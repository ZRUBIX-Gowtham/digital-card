"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Share2, Check, Copy, MessageCircle } from "lucide-react";

/**
 * QR code + share controls. Builds the absolute card URL on the client so it
 * works on any host (localhost or production) without extra config.
 */
export function QrShare({ slug, accent }: { slug: string; accent: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/${slug}`);
  }, [slug]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My digital card", url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copyLink();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-2 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
        >
          <QrCode className="h-5 w-5" style={{ color: accent }} />
          QR
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-2 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
        >
          {copied ? (
            <Check className="h-5 w-5 text-emerald-600" />
          ) : (
            <Copy className="h-5 w-5" style={{ color: accent }} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={share}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-2 py-3 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
        >
          <Share2 className="h-5 w-5" style={{ color: accent }} />
          Share
        </button>
      </div>

      {showQr && url && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-5">
          <QRCodeCanvas value={url} size={168} fgColor="#0f172a" level="M" />
          <p className="text-center text-xs text-muted">
            Scan to open this card
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: accent }}
          >
            <MessageCircle className="h-4 w-4" />
            Send on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
