import type { CardData } from "@/types/card";

/** Build a vCard 3.0 string from card data (for "Save Contact"). */
export function buildVCard(card: CardData): string {
  const [firstName, ...rest] = card.name.split(" ");
  const lastName = rest.join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${card.name}`,
    card.company && `ORG:${card.company}`,
    card.title && `TITLE:${card.title}`,
    card.contact.phone && `TEL;TYPE=CELL:${card.contact.phone}`,
    card.contact.email && `EMAIL;TYPE=INTERNET:${card.contact.email}`,
    card.contact.website && `URL:${card.contact.website}`,
    card.contact.address && `ADR;TYPE=WORK:;;${card.contact.address};;;;`,
    card.tagline && `NOTE:${card.tagline}`,
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\n");
}

/** Trigger a client-side download of the vCard file. */
export function downloadVCard(card: CardData) {
  const blob = new Blob([buildVCard(card)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.slug}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
