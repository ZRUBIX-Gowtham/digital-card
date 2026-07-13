"use client";

import { Download } from "lucide-react";
import type { CardData } from "@/types/card";
import { downloadVCard } from "@/lib/vcard";

/** Standalone "Save Contact" button (vCard download). */
export function SaveContactButton({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadVCard(card)}
      className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: accent }}
    >
      <Download className="h-4 w-4" />
      Save Contact
    </button>
  );
}
