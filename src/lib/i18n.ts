import type { CardData, CardTranslation, LangCode } from "@/types/card";

/** Language metadata for the switcher and the AI translator. */
export const LANGUAGES: {
  code: LangCode;
  /** Short label shown on the switcher pill, e.g. "EN". */
  label: string;
  /** Name in its own script, e.g. "தமிழ்". */
  native: string;
  /** Full English name handed to the AI translator. */
  name: string;
}[] = [
  { code: "en", label: "EN", native: "English", name: "English" },
  { code: "ta", label: "த", native: "தமிழ்", name: "Tamil" },
  { code: "hi", label: "हि", native: "हिन्दी", name: "Hindi" },
];

/** The extra (non-base) languages a card can be translated into. */
export const TRANSLATABLE_LANGUAGES = LANGUAGES.filter((l) => l.code !== "en");

export function languageMeta(code: string) {
  return LANGUAGES.find((l) => l.code === code);
}

/**
 * Pull the translatable narrative text out of a card into the exact shape a
 * `CardTranslation` uses. This is what we hand to the AI translator, and its
 * output is stored back under `card.translations[lang]`. Keeping the shape
 * identical means `applyTranslation` can overlay it field-for-field.
 */
export function collectTranslatable(card: CardData): CardTranslation {
  return {
    title: card.title,
    tagline: card.tagline,
    about: card.about,
    businessType: card.businessType,
    services: card.services?.map((s) => ({
      title: s.title,
      description: s.description,
    })),
    testimonials: card.testimonials?.map((t) => ({
      role: t.role,
      feedback: t.feedback,
    })),
    faqs: card.faqs?.map((f) => ({ question: f.question, answer: f.answer })),
    cta: card.cta
      ? {
          title: card.cta.title,
          subtitle: card.cta.subtitle,
          buttonLabel: card.cta.buttonLabel,
        }
      : undefined,
    businessHours: card.businessHours?.map((b) => ({
      day: b.day,
      hours: b.hours,
    })),
    brochures: card.brochures?.map((b) => ({ title: b.title })),
    team: card.team?.map((t) => ({ role: t.role })),
    stats: card.stats?.map((s) => ({ label: s.label })),
    awards: card.awards?.map((a) => ({ title: a.title, issuer: a.issuer })),
    gallery: card.gallery?.map((g) => ({ alt: g.alt })),
    shop: card.shop?.map((c) => ({
      name: c.name,
      products: c.products?.map((p) => ({ name: p.name, ctaLabel: p.ctaLabel })),
    })),
    enquiry: card.enquiry
      ? {
          title: card.enquiry.title,
          subtitle: card.enquiry.subtitle,
          buttonLabel: card.enquiry.buttonLabel,
        }
      : undefined,
    booking: card.booking
      ? {
          title: card.booking.title,
          subtitle: card.booking.subtitle,
          buttonLabel: card.booking.buttonLabel,
          services: card.booking.services,
        }
      : undefined,
  };
}

/** Prefer the translated value, falling back to the base string. */
function pick(translated: string | undefined, base: string | undefined) {
  const t = translated?.trim();
  return t ? t : base;
}

/**
 * Overlay a card's stored translation for `lang` on top of the base card,
 * returning a new card safe to render. Untranslated fields (and everything
 * that is never translated — names, numbers, links, images) fall through to
 * the base values. Passing the base language, or a language with no stored
 * translation, returns the card unchanged.
 */
export function applyTranslation(card: CardData, lang?: string): CardData {
  if (!lang || lang === "en") return card;
  const tr = card.translations?.[lang];
  if (!tr) return card;

  return {
    ...card,
    title: pick(tr.title, card.title) ?? card.title,
    tagline: pick(tr.tagline, card.tagline),
    about: pick(tr.about, card.about),
    businessType: pick(tr.businessType, card.businessType),
    services: card.services?.map((s, i) => ({
      ...s,
      title: pick(tr.services?.[i]?.title, s.title) ?? s.title,
      description: pick(tr.services?.[i]?.description, s.description),
    })),
    testimonials: card.testimonials?.map((t, i) => ({
      ...t,
      role: pick(tr.testimonials?.[i]?.role, t.role),
      feedback: pick(tr.testimonials?.[i]?.feedback, t.feedback) ?? t.feedback,
    })),
    faqs: card.faqs?.map((f, i) => ({
      ...f,
      question: pick(tr.faqs?.[i]?.question, f.question) ?? f.question,
      answer: pick(tr.faqs?.[i]?.answer, f.answer) ?? f.answer,
    })),
    cta: card.cta
      ? {
          ...card.cta,
          title: pick(tr.cta?.title, card.cta.title) ?? card.cta.title,
          subtitle: pick(tr.cta?.subtitle, card.cta.subtitle),
          buttonLabel:
            pick(tr.cta?.buttonLabel, card.cta.buttonLabel) ??
            card.cta.buttonLabel,
        }
      : card.cta,
    businessHours: card.businessHours?.map((b, i) => ({
      ...b,
      day: pick(tr.businessHours?.[i]?.day, b.day) ?? b.day,
      hours: pick(tr.businessHours?.[i]?.hours, b.hours) ?? b.hours,
    })),
    brochures: card.brochures?.map((b, i) => ({
      ...b,
      title: pick(tr.brochures?.[i]?.title, b.title) ?? b.title,
    })),
    team: card.team?.map((t, i) => ({
      ...t,
      role: pick(tr.team?.[i]?.role, t.role),
    })),
    stats: card.stats?.map((s, i) => ({
      ...s,
      label: pick(tr.stats?.[i]?.label, s.label) ?? s.label,
    })),
    awards: card.awards?.map((a, i) => ({
      ...a,
      title: pick(tr.awards?.[i]?.title, a.title) ?? a.title,
      issuer: pick(tr.awards?.[i]?.issuer, a.issuer),
    })),
    gallery: card.gallery?.map((g, i) => ({
      ...g,
      alt: pick(tr.gallery?.[i]?.alt, g.alt) ?? g.alt,
    })),
    shop: card.shop?.map((c, i) => ({
      ...c,
      name: pick(tr.shop?.[i]?.name, c.name) ?? c.name,
      products: c.products?.map((p, j) => ({
        ...p,
        name: pick(tr.shop?.[i]?.products?.[j]?.name, p.name) ?? p.name,
        ctaLabel: pick(tr.shop?.[i]?.products?.[j]?.ctaLabel, p.ctaLabel),
      })),
    })),
    enquiry: card.enquiry
      ? {
          ...card.enquiry,
          title: pick(tr.enquiry?.title, card.enquiry.title),
          subtitle: pick(tr.enquiry?.subtitle, card.enquiry.subtitle),
          buttonLabel: pick(tr.enquiry?.buttonLabel, card.enquiry.buttonLabel),
        }
      : card.enquiry,
    booking: card.booking
      ? {
          ...card.booking,
          title: pick(tr.booking?.title, card.booking.title),
          subtitle: pick(tr.booking?.subtitle, card.booking.subtitle),
          buttonLabel: pick(tr.booking?.buttonLabel, card.booking.buttonLabel),
          services: card.booking.services?.map(
            (s, i) => pick(tr.booking?.services?.[i], s) ?? s,
          ),
        }
      : card.booking,
  };
}

/** One editable translated field, wired to its base (English) source. */
export interface TransField {
  key: string;
  label: string;
  /** The base English value, shown as a reference/placeholder. */
  base?: string;
  /** The current translated value (may be empty). */
  value?: string;
  /** Longer fields render as a textarea. */
  multiline?: boolean;
  /** Returns the whole translation with this field updated. */
  set: (v: string) => CardTranslation;
}

/** A titled group of translated fields, mirroring a card section. */
export interface TransGroup {
  title: string;
  fields: TransField[];
}

/** Immutably set `patch` on item `idx` of an array (growing it if needed). */
function arrField<T extends object>(
  arr: T[] | undefined,
  idx: number,
  patch: Partial<T>,
): T[] {
  const next = arr ? [...arr] : [];
  while (next.length <= idx) next.push({} as T);
  next[idx] = { ...next[idx], ...patch };
  return next;
}

/**
 * Build the editable structure for one language's translation: every text
 * field the base card actually uses, grouped by section, each carrying its base
 * value (as a reference) and an immutable setter. This powers the manual "edit
 * translation" UI so owners can tweak anything the AI produced.
 */
export function translationFieldGroups(
  card: CardData,
  tr: CardTranslation,
): TransGroup[] {
  const groups: TransGroup[] = [];
  const has = (s?: string) => Boolean(s && s.trim());

  // Profile
  const profile: TransField[] = [];
  if (has(card.title))
    profile.push({
      key: "title",
      label: "Title / role",
      base: card.title,
      value: tr.title,
      set: (v) => ({ ...tr, title: v }),
    });
  if (has(card.tagline))
    profile.push({
      key: "tagline",
      label: "Tagline",
      base: card.tagline,
      value: tr.tagline,
      set: (v) => ({ ...tr, tagline: v }),
    });
  if (has(card.about))
    profile.push({
      key: "about",
      label: "About",
      base: card.about,
      value: tr.about,
      multiline: true,
      set: (v) => ({ ...tr, about: v }),
    });
  if (has(card.businessType))
    profile.push({
      key: "businessType",
      label: "Business type",
      base: card.businessType,
      value: tr.businessType,
      set: (v) => ({ ...tr, businessType: v }),
    });
  if (profile.length) groups.push({ title: "Profile", fields: profile });

  // Services
  const services: TransField[] = [];
  card.services?.forEach((s, i) => {
    if (has(s.title))
      services.push({
        key: `svc-${i}-t`,
        label: `Service ${i + 1} — title`,
        base: s.title,
        value: tr.services?.[i]?.title,
        set: (v) => ({ ...tr, services: arrField(tr.services, i, { title: v }) }),
      });
    if (has(s.description))
      services.push({
        key: `svc-${i}-d`,
        label: `Service ${i + 1} — description`,
        base: s.description,
        value: tr.services?.[i]?.description,
        multiline: true,
        set: (v) => ({
          ...tr,
          services: arrField(tr.services, i, { description: v }),
        }),
      });
  });
  if (services.length) groups.push({ title: "Products & Services", fields: services });

  // Testimonials
  const testimonials: TransField[] = [];
  card.testimonials?.forEach((t, i) => {
    if (has(t.role))
      testimonials.push({
        key: `tst-${i}-r`,
        label: `Testimonial ${i + 1} — role`,
        base: t.role,
        value: tr.testimonials?.[i]?.role,
        set: (v) => ({
          ...tr,
          testimonials: arrField(tr.testimonials, i, { role: v }),
        }),
      });
    if (has(t.feedback))
      testimonials.push({
        key: `tst-${i}-f`,
        label: `Testimonial ${i + 1} — feedback`,
        base: t.feedback,
        value: tr.testimonials?.[i]?.feedback,
        multiline: true,
        set: (v) => ({
          ...tr,
          testimonials: arrField(tr.testimonials, i, { feedback: v }),
        }),
      });
  });
  if (testimonials.length) groups.push({ title: "Testimonials", fields: testimonials });

  // FAQs
  const faqs: TransField[] = [];
  card.faqs?.forEach((f, i) => {
    if (has(f.question))
      faqs.push({
        key: `faq-${i}-q`,
        label: `FAQ ${i + 1} — question`,
        base: f.question,
        value: tr.faqs?.[i]?.question,
        set: (v) => ({ ...tr, faqs: arrField(tr.faqs, i, { question: v }) }),
      });
    if (has(f.answer))
      faqs.push({
        key: `faq-${i}-a`,
        label: `FAQ ${i + 1} — answer`,
        base: f.answer,
        value: tr.faqs?.[i]?.answer,
        multiline: true,
        set: (v) => ({ ...tr, faqs: arrField(tr.faqs, i, { answer: v }) }),
      });
  });
  if (faqs.length) groups.push({ title: "FAQs", fields: faqs });

  // Call to action
  const cta: TransField[] = [];
  if (card.cta) {
    if (has(card.cta.title))
      cta.push({
        key: "cta-t",
        label: "CTA title",
        base: card.cta.title,
        value: tr.cta?.title,
        set: (v) => ({ ...tr, cta: { ...tr.cta, title: v } }),
      });
    if (has(card.cta.subtitle))
      cta.push({
        key: "cta-s",
        label: "CTA subtitle",
        base: card.cta.subtitle,
        value: tr.cta?.subtitle,
        set: (v) => ({ ...tr, cta: { ...tr.cta, subtitle: v } }),
      });
    if (has(card.cta.buttonLabel))
      cta.push({
        key: "cta-b",
        label: "CTA button",
        base: card.cta.buttonLabel,
        value: tr.cta?.buttonLabel,
        set: (v) => ({ ...tr, cta: { ...tr.cta, buttonLabel: v } }),
      });
  }
  if (cta.length) groups.push({ title: "Call to action", fields: cta });

  // Business hours
  const hours: TransField[] = [];
  card.businessHours?.forEach((b, i) => {
    if (has(b.day))
      hours.push({
        key: `bh-${i}-d`,
        label: `Row ${i + 1} — day`,
        base: b.day,
        value: tr.businessHours?.[i]?.day,
        set: (v) => ({
          ...tr,
          businessHours: arrField(tr.businessHours, i, { day: v }),
        }),
      });
    if (has(b.hours))
      hours.push({
        key: `bh-${i}-h`,
        label: `Row ${i + 1} — hours`,
        base: b.hours,
        value: tr.businessHours?.[i]?.hours,
        set: (v) => ({
          ...tr,
          businessHours: arrField(tr.businessHours, i, { hours: v }),
        }),
      });
  });
  if (hours.length) groups.push({ title: "Business hours", fields: hours });

  // Brochures
  const brochures: TransField[] = [];
  card.brochures?.forEach((b, i) => {
    if (has(b.title))
      brochures.push({
        key: `br-${i}`,
        label: `Brochure ${i + 1} — title`,
        base: b.title,
        value: tr.brochures?.[i]?.title,
        set: (v) => ({
          ...tr,
          brochures: arrField(tr.brochures, i, { title: v }),
        }),
      });
  });
  if (brochures.length) groups.push({ title: "Brochures", fields: brochures });

  // Team
  const team: TransField[] = [];
  card.team?.forEach((t, i) => {
    if (has(t.role))
      team.push({
        key: `tm-${i}`,
        label: `${t.name || `Member ${i + 1}`} — role`,
        base: t.role,
        value: tr.team?.[i]?.role,
        set: (v) => ({ ...tr, team: arrField(tr.team, i, { role: v }) }),
      });
  });
  if (team.length) groups.push({ title: "Team", fields: team });

  // Stats
  const stats: TransField[] = [];
  card.stats?.forEach((s, i) => {
    if (has(s.label))
      stats.push({
        key: `st-${i}`,
        label: `Stat ${i + 1} — label`,
        base: s.label,
        value: tr.stats?.[i]?.label,
        set: (v) => ({ ...tr, stats: arrField(tr.stats, i, { label: v }) }),
      });
  });
  if (stats.length) groups.push({ title: "Stats", fields: stats });

  // Awards
  const awards: TransField[] = [];
  card.awards?.forEach((a, i) => {
    if (has(a.title))
      awards.push({
        key: `aw-${i}-t`,
        label: `Award ${i + 1} — title`,
        base: a.title,
        value: tr.awards?.[i]?.title,
        set: (v) => ({ ...tr, awards: arrField(tr.awards, i, { title: v }) }),
      });
    if (has(a.issuer))
      awards.push({
        key: `aw-${i}-i`,
        label: `Award ${i + 1} — issuer`,
        base: a.issuer,
        value: tr.awards?.[i]?.issuer,
        set: (v) => ({ ...tr, awards: arrField(tr.awards, i, { issuer: v }) }),
      });
  });
  if (awards.length) groups.push({ title: "Awards", fields: awards });

  // Gallery
  const gallery: TransField[] = [];
  card.gallery?.forEach((g, i) => {
    if (has(g.alt))
      gallery.push({
        key: `gl-${i}`,
        label: `Image ${i + 1} — caption`,
        base: g.alt,
        value: tr.gallery?.[i]?.alt,
        set: (v) => ({ ...tr, gallery: arrField(tr.gallery, i, { alt: v }) }),
      });
  });
  if (gallery.length) groups.push({ title: "Gallery", fields: gallery });

  // Shop
  const shop: TransField[] = [];
  card.shop?.forEach((cat, i) => {
    if (has(cat.name))
      shop.push({
        key: `sh-${i}-n`,
        label: `Category ${i + 1} — name`,
        base: cat.name,
        value: tr.shop?.[i]?.name,
        set: (v) => ({ ...tr, shop: arrField(tr.shop, i, { name: v }) }),
      });
    cat.products?.forEach((p, j) => {
      if (has(p.name))
        shop.push({
          key: `sh-${i}-${j}-n`,
          label: `Product ${j + 1} — name`,
          base: p.name,
          value: tr.shop?.[i]?.products?.[j]?.name,
          set: (v) => {
            const products = arrField(tr.shop?.[i]?.products, j, { name: v });
            return { ...tr, shop: arrField(tr.shop, i, { products }) };
          },
        });
      if (has(p.ctaLabel))
        shop.push({
          key: `sh-${i}-${j}-c`,
          label: `Product ${j + 1} — button`,
          base: p.ctaLabel,
          value: tr.shop?.[i]?.products?.[j]?.ctaLabel,
          set: (v) => {
            const products = arrField(tr.shop?.[i]?.products, j, { ctaLabel: v });
            return { ...tr, shop: arrField(tr.shop, i, { products }) };
          },
        });
    });
  });
  if (shop.length) groups.push({ title: "Product Showcase", fields: shop });

  // Enquiry
  const enquiry: TransField[] = [];
  if (card.enquiry?.enabled) {
    if (has(card.enquiry.title))
      enquiry.push({
        key: "enq-t",
        label: "Enquiry title",
        base: card.enquiry.title,
        value: tr.enquiry?.title,
        set: (v) => ({ ...tr, enquiry: { ...tr.enquiry, title: v } }),
      });
    if (has(card.enquiry.subtitle))
      enquiry.push({
        key: "enq-s",
        label: "Enquiry subtitle",
        base: card.enquiry.subtitle,
        value: tr.enquiry?.subtitle,
        set: (v) => ({ ...tr, enquiry: { ...tr.enquiry, subtitle: v } }),
      });
    if (has(card.enquiry.buttonLabel))
      enquiry.push({
        key: "enq-b",
        label: "Enquiry button",
        base: card.enquiry.buttonLabel,
        value: tr.enquiry?.buttonLabel,
        set: (v) => ({ ...tr, enquiry: { ...tr.enquiry, buttonLabel: v } }),
      });
  }
  if (enquiry.length) groups.push({ title: "Enquiry form", fields: enquiry });

  // Booking
  const booking: TransField[] = [];
  if (card.booking?.enabled) {
    if (has(card.booking.title))
      booking.push({
        key: "bk-t",
        label: "Booking title",
        base: card.booking.title,
        value: tr.booking?.title,
        set: (v) => ({ ...tr, booking: { ...tr.booking, title: v } }),
      });
    if (has(card.booking.subtitle))
      booking.push({
        key: "bk-s",
        label: "Booking subtitle",
        base: card.booking.subtitle,
        value: tr.booking?.subtitle,
        set: (v) => ({ ...tr, booking: { ...tr.booking, subtitle: v } }),
      });
    if (has(card.booking.buttonLabel))
      booking.push({
        key: "bk-b",
        label: "Booking button",
        base: card.booking.buttonLabel,
        value: tr.booking?.buttonLabel,
        set: (v) => ({ ...tr, booking: { ...tr.booking, buttonLabel: v } }),
      });
    card.booking.services?.forEach((s, i) => {
      if (has(s))
        booking.push({
          key: `bk-svc-${i}`,
          label: `Service option ${i + 1}`,
          base: s,
          value: tr.booking?.services?.[i],
          set: (v) => {
            const services = [...(tr.booking?.services ?? [])];
            while (services.length <= i) services.push("");
            services[i] = v;
            return { ...tr, booking: { ...tr.booking, services } };
          },
        });
    });
  }
  if (booking.length) groups.push({ title: "Booking form", fields: booking });

  return groups;
}

/** The languages actually available to visitors: base English + enabled ones. */
export function availableLanguages(card: CardData): LangCode[] {
  const extras = (card.languages ?? []).filter(
    (l) => l !== "en" && card.translations?.[l],
  );
  return ["en", ...extras];
}
