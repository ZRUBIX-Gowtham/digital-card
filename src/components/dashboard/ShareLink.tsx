"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, ExternalLink, MessageCircle } from "lucide-react";

/** Dashboard widget: shows the user's public card URL + QR + copy/share. */
export function ShareLink({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}/${slug}` : `/${slug}`;
  const display = origin ? `${origin.replace(/^https?:\/\//, "")}/${slug}` : `/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Your card link
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <span className="truncate text-sm font-medium text-foreground">
            {display}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4 text-brand" />
            )}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            <ExternalLink className="h-4 w-4 text-brand" /> View card
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
          >
            <MessageCircle className="h-4 w-4 text-brand" /> Share
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4">
        {url && <QRCodeCanvas value={url} size={128} fgColor="#0f172a" level="M" />}
        <span className="text-xs text-muted">Scan to open</span>
      </div>
    </div>
  );
}
