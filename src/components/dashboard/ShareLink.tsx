"use client";

import { useEffect, useState, useTransition } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, ExternalLink, MessageCircle, Pencil, Loader2, AlertCircle, X } from "lucide-react";
import { changeSlugAction } from "@/app/dashboard/actions";

/** Dashboard widget: shows the user's public card URL + QR + copy/share. */
export function ShareLink({ slug, slugChanges }: { slug: string; slugChanges: number }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newSlug, setNewSlug] = useState(slug);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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

  function handleSave() {
    if (newSlug === slug) {
      setIsEditing(false);
      return;
    }
    
    setError(null);
    startTransition(async () => {
      const res = await changeSlugAction(newSlug);
      if (res.ok) {
        setIsEditing(false);
      } else {
        setError(res.error || "Failed to update link.");
      }
    });
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-[1fr_auto] sm:items-center min-w-0 overflow-hidden">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted truncate">
            Your card link
          </p>
          {slugChanges < 2 && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-brand flex items-center gap-1 hover:underline cursor-pointer shrink-0"
            >
              <Pencil className="w-3 h-3" /> Edit Link ({2 - slugChanges} left)
            </button>
          )}
          {slugChanges >= 2 && !isEditing && (
            <span className="text-[10px] font-semibold text-muted bg-surface-hover px-2 py-0.5 rounded-full shrink-0">
              Link changes maxed out
            </span>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2 space-y-3 min-w-0">
            <div className="flex items-center gap-2 rounded-xl border border-brand/50 ring-1 ring-brand/20 bg-surface px-3 py-2 min-w-0">
              <span className="text-xs sm:text-sm font-medium text-muted whitespace-nowrap">
                {origin ? `${origin.replace(/^https?:\/\//, "")}/` : "/"}
              </span>
              <input 
                type="text" 
                value={newSlug} 
                onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name"
                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-bold text-foreground outline-none"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </div>
            )}
            
            <div className="flex gap-2 min-w-0">
              <button
                onClick={handleSave}
                disabled={pending || newSlug.length < 3}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Link
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewSlug(slug);
                  setError(null);
                }}
                disabled={pending}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs sm:text-sm font-bold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 min-w-0">
              <span className="truncate text-xs sm:text-sm font-medium text-foreground min-w-0 flex-1">
                {display}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 min-w-0">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />
                )}
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" /> View card
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" /> Share
              </a>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3 sm:p-4 shrink-0">
        {url && <QRCodeCanvas value={url} size={110} fgColor="#0f172a" level="M" />}
        <span className="text-[10px] sm:text-xs text-muted">Scan to open</span>
      </div>
    </div>
  );
}
