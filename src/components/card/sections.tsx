import { Fragment } from "react";
import { Briefcase, IndianRupee, Building2, Calendar } from "lucide-react";
import * as Icons from "lucide-react";
import { sectionAnchorId, sectionHasContent } from "@/lib/section-nav";
import type { CardData, Testimonial, TeamMember, BrandLogo, ShopProduct, Service, GalleryItem, StatItem, CallToAction } from "@/types/card";
import { getYouTubeId } from "@/lib/youtube";
import { effectiveSectionStyle, isCarousel } from "@/lib/section-display";
import { effectiveSectionLayout } from "@/lib/section-layouts";
import { socialIcon, socialLabel } from "./social-icons";
import { WhatsappIcon } from "./brand-icons";
import { Carousel } from "./Carousel";
import { VideoCard } from "./VideoCard";
import { PhotoGallery } from "./PhotoGallery";
import { EnquirySection, BookingSection } from "./LeadForms";

export function LucideIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const IconComponent = (Icons as any)[name] || Briefcase;
  return <IconComponent className={className} style={style} />;
}

function AboutMeta({
  card,
  className = "text-slate-500",
}: {
  card: CardData;
  className?: string;
}) {
  if (!card.establishedYear && !card.businessType) return null;
  return (
    <div className={`mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs ${className}`}>
      {card.establishedYear && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Est. {card.establishedYear}
        </span>
      )}
      {card.businessType && (
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" /> {card.businessType}
        </span>
      )}
    </div>
  );
}

/** Renders the About content in the chosen design variant (no section heading). */
export function AboutBody({
  card,
  accent,
  variant,
}: {
  card: CardData;
  accent: string;
  variant: string;
}) {
  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <p className="text-sm leading-relaxed text-slate-600">{card.about}</p>
        <AboutMeta card={card} />
      </div>
    );
  }
  if (variant === "highlight") {
    return (
      <div
        className="rounded-2xl border border-border p-4"
        style={{ backgroundColor: `${accent}0d`, borderLeft: `3px solid ${accent}` }}
      >
        <p className="text-sm leading-relaxed text-slate-700">{card.about}</p>
        <AboutMeta card={card} className="text-slate-500" />
      </div>
    );
  }
  if (variant === "banner") {
    return (
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}c8)` }}
      >
        <p className="text-sm font-medium leading-relaxed">{card.about}</p>
        <AboutMeta card={card} className="text-white/80" />
      </div>
    );
  }
  return (
    <>
      <p className="text-sm leading-relaxed text-slate-600">{card.about}</p>
      <AboutMeta card={card} />
    </>
  );
}

export function AboutSection({ card, accent = "#4f46e5" }: { card: CardData; accent?: string }) {
  if (!card.about) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "about");
  return (
    <div>
      <SectionLabel>About</SectionLabel>
      <AboutBody card={card} accent={accent} variant={variant} />
    </div>
  );
}

function ServiceRow({ s, accent }: { s: Service; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <LucideIcon name={s.icon || "Briefcase"} className="h-4 w-4" />
        </span>
        <p className="min-w-0 flex-1 text-sm font-semibold text-foreground">
          {s.title}
        </p>
      </div>
      {s.price && (
        <span
          className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {s.price}
        </span>
      )}
      {s.description && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{s.description}</p>
      )}
    </div>
  );
}

function ServiceCompactCard({ s, accent }: { s: Service; accent: string }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-white p-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        <LucideIcon name={s.icon || "Briefcase"} className="h-4 w-4" />
      </span>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">
        {s.title}
      </p>
      {s.price && (
        <span className="mt-1.5 text-[11px] font-bold" style={{ color: accent }}>
          {s.price}
        </span>
      )}
    </div>
  );
}

function ServiceTile({ s, accent }: { s: Service; accent: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-3.5 text-center">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        <LucideIcon name={s.icon || "Briefcase"} className="h-5 w-5" />
      </span>
      <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">
        {s.title}
      </p>
      {s.price && (
        <span
          className="mt-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {s.price}
        </span>
      )}
    </div>
  );
}

/** Renders services in the chosen design variant (no section heading). */
export function ServicesBody({
  services,
  accent,
  variant,
}: {
  services: Service[];
  accent: string;
  variant: string;
}) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((s, i) => (
          <ServiceCompactCard key={i} s={s} accent={accent} />
        ))}
      </div>
    );
  }
  if (variant === "tiles") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((s, i) => (
          <ServiceTile key={i} s={s} accent={accent} />
        ))}
      </div>
    );
  }
  if (variant === "numbered") {
    return (
      <div className="space-y-2.5">
        {services.map((s, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white p-3.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                {s.price && (
                  <span className="shrink-0 text-[11px] font-bold" style={{ color: accent }}>
                    {s.price}
                  </span>
                )}
              </div>
              {s.description && (
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "priced") {
    return (
      <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-border bg-white">
        {services.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              {s.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{s.description}</p>
              )}
            </div>
            {s.price && (
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                {s.price}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {services.map((s, i) => (
        <ServiceRow key={i} s={s} accent={accent} />
      ))}
    </div>
  );
}

export function ServicesSection({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  if (!card.services.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "services");
  return (
    <div>
      <SectionLabel>Products &amp; Services</SectionLabel>
      <ServicesBody services={card.services} accent={accent} variant={variant} />
    </div>
  );
}

export function GallerySection({
  card,
  accent = "#4f46e5",
  columns = 3,
}: {
  card: CardData;
  accent?: string;
  columns?: 2 | 3;
}) {
  if (!card.gallery.length) return null;
  const style = effectiveSectionStyle(card.sectionStyles, "gallery");
  const variant = effectiveSectionLayout(card.sectionLayouts, "gallery");
  return (
    <div>
      <SectionLabel>Gallery</SectionLabel>
      {isCarousel(style) && variant === "grid" ? (
        <Carousel
          slides={card.gallery.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={g.src + i}
              src={g.src}
              alt={g.alt}
              className="aspect-square w-full rounded-xl border border-border object-cover"
              loading="lazy"
            />
          ))}
          accent={accent}
          autoplay={style === "carousel-auto"}
          basis="basis-full"
        />
      ) : (
        <PhotoGallery images={card.gallery} columns={columns} variant={variant} />
      )}
    </div>
  );
}

/** Renders the gallery in the chosen design variant (no section heading). */
export function GalleryBody({
  images,
  columns = 3,
  variant,
}: {
  images: GalleryItem[];
  columns?: 2 | 3;
  variant: string;
}) {
  return <PhotoGallery images={images} columns={columns} variant={variant} />;
}

export function PaymentSection({ card }: { card: CardData }) {
  const p = card.payment;
  if (!p || (!p.upiId && !p.accountNumber)) return null;
  return (
    <div>
      <SectionLabel>Payment Details</SectionLabel>
      <div className="space-y-2 rounded-xl border border-border bg-surface p-4 text-sm">
        {p.upiId && <Row label="UPI ID" value={p.upiId} />}
        {p.bankName && <Row label="Bank" value={p.bankName} />}
        {p.accountName && <Row label="Account Name" value={p.accountName} />}
        {p.accountNumber && <Row label="A/C No." value={p.accountNumber} />}
        {p.ifsc && <Row label="IFSC" value={p.ifsc} />}
      </div>
    </div>
  );
}

/** Renders business hours in the chosen design variant (no section heading). */
export function BusinessHoursBody({
  hours,
  accent,
  variant,
}: {
  hours: { day: string; hours: string }[];
  accent: string;
  variant: string;
}) {
  const closed = (h: string) => /closed/i.test(h);
  if (variant === "striped") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-white text-xs">
        {hours.map((bh, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3.5 py-2 ${i % 2 === 1 ? "bg-surface-2" : ""}`}
          >
            <span className="font-semibold text-slate-700">{bh.day}</span>
            <span className={`font-medium ${closed(bh.hours) ? "text-rose-500" : "text-slate-500"}`}>
              {bh.hours}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "cards") {
    return (
      <div className="space-y-2">
        {hours.map((bh, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-white px-3.5 py-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: closed(bh.hours) ? "#f43f5e" : accent }} />
              {bh.day}
            </span>
            <span className={`text-xs font-medium ${closed(bh.hours) ? "text-rose-500" : "text-slate-500"}`}>
              {bh.hours}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {hours.map((bh, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-2.5 text-center">
            <p className="text-[11px] font-bold text-slate-700">{bh.day}</p>
            <p className={`mt-0.5 text-[10px] font-medium ${closed(bh.hours) ? "text-rose-500" : "text-slate-500"}`}>
              {bh.hours}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-white p-3.5 space-y-1.5 text-xs text-slate-600">
      {hours.map((bh, i) => (
        <div key={i} className="flex justify-between items-center py-0.5 border-b border-slate-50 last:border-0">
          <span className="font-semibold text-slate-700">{bh.day}</span>
          <span className="font-medium text-slate-500">{bh.hours}</span>
        </div>
      ))}
    </div>
  );
}

export function BusinessHoursSection({ card, accent = "#4f46e5" }: { card: CardData; accent?: string }) {
  if (!card.businessHours || !card.businessHours.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "businessHours");
  return (
    <div>
      <SectionLabel>Business Hours</SectionLabel>
      <BusinessHoursBody hours={card.businessHours} accent={accent} variant={variant} />
    </div>
  );
}

export function MapSection({ card, accent }: { card: CardData; accent: string }) {
  const { address, mapUrl } = card.contact;
  // Need at least an address (to embed) or a map link (to open) to show anything.
  if (!address && !mapUrl) return null;

  // Embed a keyless Google Maps iframe from the address (most reliable source).
  // Share/short links (mapUrl) are frequently blocked in iframes, so we only
  // embed when we have an address to query.
  const embedSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : null;

  // "Get directions" opens the native maps app / Google Maps. Prefer the
  // explicit map link, else search for the address.
  const directionsUrl =
    mapUrl ||
    (address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null);

  return (
    <div>
      <SectionLabel>Location</SectionLabel>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {embedSrc && (
          <iframe
            title="Location map"
            src={embedSrc}
            width="100%"
            height="200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0"
          />
        )}
        <div className="flex items-start gap-3 p-3.5">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <Icons.MapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            {address && (
              <p className="text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                {address}
              </p>
            )}
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: accent }}
              >
                <Icons.Navigation className="h-3.5 w-3.5" /> Get directions
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Row of five stars, filled up to `rating`. */
function StarRating({
  rating,
  className = "h-3.5 w-3.5",
  emptyClass = "text-slate-200",
}: {
  rating: number;
  className?: string;
  emptyClass?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, idx) => (
        <Icons.Star
          key={idx}
          className={`${className} ${idx < rating ? "fill-amber-400 text-amber-400" : emptyClass}`}
        />
      ))}
    </div>
  );
}

/** "Classic" — bordered card with quote mark, stars, and an author chip. */
function TestimonialClassic({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-4 pt-5 shadow-sm"
      style={{ borderTopColor: accent, borderTopWidth: 3 }}
    >
      <Icons.Quote
        className="absolute right-3 top-3 h-8 w-8 opacity-10"
        style={{ color: accent }}
        fill="currentColor"
      />
      <div className="mb-2">
        <StarRating rating={t.rating} />
      </div>
      <p className="min-h-[3.5rem] text-xs italic leading-relaxed text-slate-600">
        &ldquo;{t.feedback}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-slate-700">{t.name}</p>
          {t.role && <p className="truncate text-[10px] text-slate-400">{t.role}</p>}
        </div>
      </div>
    </div>
  );
}

/** "Minimal" — clean, borderless quote with the author on one line below. */
function TestimonialMinimal({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-white p-4">
      <div className="mb-2.5">
        <StarRating rating={t.rating} />
      </div>
      <p className="text-[13px] leading-relaxed text-slate-700">
        &ldquo;{t.feedback}&rdquo;
      </p>
      <p className="mt-3 text-[11px] font-bold" style={{ color: accent }}>
        {t.name}
        {t.role && (
          <span className="font-medium text-slate-400"> · {t.role}</span>
        )}
      </p>
    </div>
  );
}

/** "Speech bubble" — chat-style bubble with the reviewer sitting underneath. */
function TestimonialBubble({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div className="h-full">
      <div className="rounded-2xl rounded-bl-md border border-border bg-surface p-3.5">
        <p className="text-xs italic leading-relaxed text-slate-600">
          &ldquo;{t.feedback}&rdquo;
        </p>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5 pl-1.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-slate-700">{t.name}</p>
          <StarRating rating={t.rating} className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

/** "Spotlight" — bold accent-filled card that puts the review front and centre. */
function TestimonialSpotlight({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl p-5 text-white shadow-sm"
      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}c8)` }}
    >
      <Icons.Quote
        className="absolute right-3 top-3 h-10 w-10 opacity-20"
        fill="currentColor"
      />
      <div className="mb-2.5">
        <StarRating rating={t.rating} className="h-3.5 w-3.5" emptyClass="text-white/30" />
      </div>
      <p className="text-[13px] font-medium leading-relaxed">
        &ldquo;{t.feedback}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2.5 border-t border-white/20 pt-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold"
          style={{ color: accent }}
        >
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold">{t.name}</p>
          {t.role && <p className="truncate text-[10px] text-white/70">{t.role}</p>}
        </div>
      </div>
    </div>
  );
}

/** "Quote" — centred design led by a large quotation mark, author underneath. */
function TestimonialQuote({ t, accent }: { t: Testimonial; accent: string }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-white p-5 text-center">
      <Icons.Quote
        className="mx-auto h-7 w-7"
        style={{ color: accent }}
        fill="currentColor"
      />
      <p className="mt-2.5 text-[13px] leading-relaxed text-slate-700">
        &ldquo;{t.feedback}&rdquo;
      </p>
      <div className="mt-3 flex justify-center">
        <StarRating rating={t.rating} />
      </div>
      <p className="mt-2.5 text-[11px] font-bold text-slate-700">{t.name}</p>
      {t.role && <p className="text-[10px] text-slate-400">{t.role}</p>}
    </div>
  );
}

/** Render a single testimonial in the chosen design variant. */
export function TestimonialVariantCard({
  variant,
  t,
  accent,
}: {
  variant: string;
  t: Testimonial;
  accent: string;
}) {
  switch (variant) {
    case "minimal":
      return <TestimonialMinimal t={t} accent={accent} />;
    case "bubble":
      return <TestimonialBubble t={t} accent={accent} />;
    case "spotlight":
      return <TestimonialSpotlight t={t} accent={accent} />;
    case "quote":
      return <TestimonialQuote t={t} accent={accent} />;
    case "classic":
    default:
      return <TestimonialClassic t={t} accent={accent} />;
  }
}

export function TestimonialsSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.testimonials || !card.testimonials.length) return null;
  const style = effectiveSectionStyle(card.sectionStyles, "testimonials");
  const variant = effectiveSectionLayout(card.sectionLayouts, "testimonials");
  const slides = card.testimonials.map((t, i) => (
    <TestimonialVariantCard key={i} variant={variant} t={t} accent={accent} />
  ));
  return (
    <div>
      <SectionLabel>Testimonials</SectionLabel>
      {isCarousel(style) ? (
        <Carousel
          slides={slides}
          accent={accent}
          autoplay={style === "carousel-auto"}
          basis="basis-full"
        />
      ) : (
        <div className="space-y-3">{slides}</div>
      )}
    </div>
  );
}

/** Renders FAQs in the chosen design variant (no section heading). */
export function FaqBody({
  faqs,
  accent,
  variant,
}: {
  faqs: { question: string; answer: string }[];
  accent: string;
  variant: string;
}) {
  if (variant === "cards") {
    return (
      <div className="space-y-2.5">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-3.5">
            <p className="flex items-start gap-2 text-xs font-bold text-slate-800">
              <Icons.HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
              {faq.question}
            </p>
            <p className="mt-1.5 pl-6 text-xs leading-relaxed text-slate-500">{faq.answer}</p>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "bordered") {
    return (
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-white p-3 [&_summary::-webkit-details-marker]:hidden"
            style={{ borderLeft: `3px solid ${accent}` }}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-xs font-semibold text-slate-800 outline-none">
              <span>{faq.question}</span>
              <Icons.Plus className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="mt-2 border-t border-slate-50 pt-2 text-xs leading-relaxed text-slate-500">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    );
  }
  if (variant === "numbered") {
    return (
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl border border-border bg-white p-3 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-800 outline-none">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                {i + 1}
              </span>
              <span className="flex-1">{faq.question}</span>
              <Icons.ChevronDown className="h-3 w-3 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="mt-2 pl-8 text-xs leading-relaxed text-slate-500">{faq.answer}</p>
          </details>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <details key={i} className="group rounded-xl border border-border bg-white p-3 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-xs font-semibold text-slate-800 outline-none">
            <span>{faq.question}</span>
            <span className="shrink-0 rounded-full bg-slate-50 p-1 text-slate-400 group-open:rotate-180 transition-transform duration-200">
              <Icons.ChevronDown className="h-3 w-3" />
            </span>
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 border-t border-slate-50 pt-2">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({ card, accent = "#4f46e5" }: { card: CardData; accent?: string }) {
  if (!card.faqs || !card.faqs.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "faqs");
  return (
    <div>
      <SectionLabel>Frequently Asked Questions</SectionLabel>
      <FaqBody faqs={card.faqs} accent={accent} variant={variant} />
    </div>
  );
}

/** Resolve where a CTA button should point, falling back to card contact info. */
function ctaHref(cta: CallToAction, card: CardData): string | undefined {
  const action = cta.action ?? "whatsapp";
  const v = cta.value?.trim();
  if (action === "link") return v || undefined;
  if (action === "email") {
    const email = v || card.contact.email;
    return email ? `mailto:${email}` : undefined;
  }
  if (action === "phone") {
    const phone = (v || card.contact.phone || "").replace(/\s+/g, "");
    return phone ? `tel:${phone}` : undefined;
  }
  // whatsapp
  const digits = (v || card.contact.whatsapp || "").replace(/\D/g, "");
  if (!digits) return undefined;
  const msg = `Hi! ${cta.title || "I'd like to get in touch."}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

function CtaButton({
  cta,
  href,
  className,
  style,
}: {
  cta: CallToAction;
  href?: string;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href || "#"}
      target={cta.action === "link" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {cta.icon && <LucideIcon name={cta.icon} className="h-4 w-4" />}
      {cta.buttonLabel || "Get in touch"}
    </a>
  );
}

/** Renders the CTA block in the chosen design variant (no section heading). */
export function CtaBody({
  cta,
  card,
  accent,
  variant,
}: {
  cta: CallToAction;
  card: CardData;
  accent: string;
  variant: string;
}) {
  const href = ctaHref(cta, card);

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h4 className="text-base font-bold text-slate-800">{cta.title}</h4>
        {cta.subtitle && <p className="mt-1 text-sm text-slate-500">{cta.subtitle}</p>}
        <CtaButton
          cta={cta}
          href={href}
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: accent }}
        />
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800">{cta.title}</h4>
          {cta.subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{cta.subtitle}</p>}
        </div>
        <CtaButton
          cta={cta}
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: accent }}
        />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="py-2 text-center">
        <h4 className="text-base font-bold text-slate-800">{cta.title}</h4>
        {cta.subtitle && <p className="mt-1 text-sm text-slate-500">{cta.subtitle}</p>}
        <CtaButton
          cta={cta}
          href={href}
          className="mt-3 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition hover:bg-slate-50"
          style={{ borderColor: accent, color: accent }}
        />
      </div>
    );
  }

  if (variant === "boxed") {
    return (
      <div
        className="rounded-2xl border border-border p-5 text-center"
        style={{ backgroundColor: `${accent}0d` }}
      >
        <span
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accent }}
        >
          <LucideIcon name={cta.icon || "Sparkles"} className="h-6 w-6" />
        </span>
        <h4 className="text-base font-bold text-slate-800">{cta.title}</h4>
        {cta.subtitle && <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">{cta.subtitle}</p>}
        <CtaButton
          cta={cta}
          href={href}
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: accent }}
        />
      </div>
    );
  }

  // banner (default)
  return (
    <div
      className="overflow-hidden rounded-2xl p-6 text-center text-white shadow-sm"
      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}c8)` }}
    >
      <h4 className="text-lg font-extrabold leading-tight">{cta.title}</h4>
      {cta.subtitle && <p className="mx-auto mt-1.5 max-w-sm text-sm text-white/85">{cta.subtitle}</p>}
      <CtaButton
        cta={cta}
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold transition hover:opacity-90"
        style={{ color: accent }}
      />
    </div>
  );
}

export function CtaSection({ card, accent }: { card: CardData; accent: string }) {
  const cta = card.cta;
  if (!cta || (!cta.title && !cta.buttonLabel)) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "cta");
  return (
    <div>
      <CtaBody cta={cta} card={card} accent={accent} variant={variant} />
    </div>
  );
}

export function YouTubeVideosSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.youtubeVideos || !card.youtubeVideos.length) return null;
  const validIds = card.youtubeVideos
    .map(getYouTubeId)
    .filter((id): id is string => Boolean(id));
  if (!validIds.length) return null;

  const style = effectiveSectionStyle(card.sectionStyles, "youtubeVideos");
  const frames = validIds.map((id, i) => <VideoCard key={i} id={id} />);

  return (
    <div>
      <SectionLabel>Videos</SectionLabel>
      {isCarousel(style) ? (
        <Carousel
          slides={frames}
          accent={accent}
          autoplay={style === "carousel-auto"}
          basis="basis-full"
        />
      ) : (
        <div className="space-y-3">{frames}</div>
      )}
    </div>
  );
}

function TeamCard({ m, accent }: { m: TeamMember; accent: string }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-3 text-center">
      {m.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={m.image}
          alt={m.name}
          className="h-14 w-14 rounded-full border border-border object-cover"
          loading="lazy"
        />
      ) : (
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {initials(m.name)}
        </span>
      )}
      <p className="mt-2 text-xs font-bold text-slate-700">{m.name}</p>
      {m.role && <p className="text-[10px] text-slate-400">{m.role}</p>}
    </div>
  );
}

function TeamAvatar({
  m,
  accent,
  size,
}: {
  m: TeamMember;
  accent: string;
  size: string;
}) {
  return m.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={m.image}
      alt={m.name}
      className={`${size} shrink-0 rounded-full border border-border object-cover`}
      loading="lazy"
    />
  ) : (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full font-bold text-white`}
      style={{ backgroundColor: accent }}
    >
      {initials(m.name)}
    </span>
  );
}

function TeamRow({ m, accent }: { m: TeamMember; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <TeamAvatar m={m} accent={accent} size="h-11 w-11 text-sm" />
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-700">{m.name}</p>
        {m.role && <p className="truncate text-[10px] text-slate-400">{m.role}</p>}
      </div>
    </div>
  );
}

function TeamCircle({ m, accent }: { m: TeamMember; accent: string }) {
  return (
    <div className="flex flex-col items-center px-1 text-center">
      <TeamAvatar m={m} accent={accent} size="h-16 w-16 text-base" />
      <p className="mt-2 text-xs font-bold text-slate-700">{m.name}</p>
      {m.role && <p className="text-[10px] text-slate-400">{m.role}</p>}
    </div>
  );
}

/** Renders the team in the chosen design variant (no section heading). */
export function TeamBody({
  team,
  accent,
  variant,
}: {
  team: TeamMember[];
  accent: string;
  variant: string;
}) {
  if (variant === "rows") {
    return (
      <div className="space-y-2">
        {team.map((m, i) => (
          <TeamRow key={i} m={m} accent={accent} />
        ))}
      </div>
    );
  }
  if (variant === "circles") {
    return (
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {team.map((m, i) => (
          <TeamCircle key={i} m={m} accent={accent} />
        ))}
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        {team.map((m, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <TeamAvatar m={m} accent={accent} size="h-12 w-12 text-xs" />
            <p className="mt-1.5 line-clamp-1 text-[11px] font-bold text-slate-700">{m.name}</p>
            {m.role && <p className="line-clamp-1 text-[9px] text-slate-400">{m.role}</p>}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "minimal") {
    return (
      <div className="space-y-1">
        {team.map((m, i) => (
          <div key={i} className="flex items-center gap-2.5 py-1.5">
            <TeamAvatar m={m} accent={accent} size="h-9 w-9 text-[11px]" />
            <p className="text-xs font-semibold text-slate-700">
              {m.name}
              {m.role && <span className="font-normal text-slate-400"> · {m.role}</span>}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {team.map((m, i) => (
        <TeamCard key={i} m={m} accent={accent} />
      ))}
    </div>
  );
}

export function TeamSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.team || !card.team.length) return null;
  const style = effectiveSectionStyle(card.sectionStyles, "team");
  const variant = effectiveSectionLayout(card.sectionLayouts, "team");
  return (
    <div>
      <SectionLabel>Our Team</SectionLabel>
      {isCarousel(style) && variant === "cards" ? (
        <Carousel
          slides={card.team.map((m, i) => (
            <TeamCard key={i} m={m} accent={accent} />
          ))}
          accent={accent}
          autoplay={style === "carousel-auto"}
          basis="basis-1/2"
        />
      ) : (
        <TeamBody team={card.team} accent={accent} variant={variant} />
      )}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function StatCard({ s, accent }: { s: StatItem; accent: string }) {
  return (
    <div
      className="rounded-xl border border-border p-3.5 text-center"
      style={{ backgroundColor: `${accent}0d` }}
    >
      {s.icon && (
        <LucideIcon
          name={s.icon}
          className="mx-auto mb-1 h-4 w-4"
          style={{ color: accent }}
        />
      )}
      <p className="text-xl font-extrabold leading-tight" style={{ color: accent }}>
        {s.value}
      </p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {s.label}
      </p>
    </div>
  );
}

/** Renders the stats in the chosen design variant (no section heading). */
export function StatsBody({
  stats,
  accent,
  variant,
}: {
  stats: StatItem[];
  accent: string;
  variant: string;
}) {
  if (variant === "row") {
    return (
      <div className="flex flex-wrap items-stretch justify-around gap-y-3 rounded-xl border border-border bg-white p-3.5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-1 basis-1/3 flex-col items-center px-2 text-center [&:not(:last-child)]:border-r [&:not(:last-child)]:border-slate-100"
          >
            <p className="text-lg font-extrabold leading-tight" style={{ color: accent }}>
              {s.value}
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "bold") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="py-2 text-center">
            <p className="text-3xl font-black leading-none tracking-tight" style={{ color: accent }}>
              {s.value}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3.5"
            style={{ backgroundColor: `${accent}12` }}
          >
            <span className="text-sm font-extrabold" style={{ color: accent }}>
              {s.value}
            </span>
            <span className="text-[11px] font-medium text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "iconrows") {
    return (
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              <LucideIcon name={s.icon || "TrendingUp"} className="h-4 w-4" />
            </span>
            <p className="text-lg font-extrabold leading-none" style={{ color: accent }}>
              {s.value}
            </p>
            <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {stats.map((s, i) => (
        <StatCard key={i} s={s} accent={accent} />
      ))}
    </div>
  );
}

export function StatsSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.stats || !card.stats.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "stats");
  return (
    <div>
      <SectionLabel>Achievements</SectionLabel>
      <StatsBody stats={card.stats} accent={accent} variant={variant} />
    </div>
  );
}

type AwardItem = { title: string; issuer?: string; year?: string; icon?: string };

/** Renders awards in the chosen design variant (no section heading). */
export function AwardsBody({
  awards,
  accent,
  variant,
}: {
  awards: AwardItem[];
  accent: string;
  variant: string;
}) {
  const meta = (a: AwardItem) => [a.issuer, a.year].filter(Boolean).join(" · ");
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {awards.map((a, i) => (
          <div key={i} className="flex h-full flex-col items-center rounded-xl border border-border bg-white p-3.5 text-center">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              <LucideIcon name={a.icon || "Award"} className="h-5 w-5" />
            </span>
            <p className="mt-2 text-xs font-bold text-slate-700">{a.title}</p>
            {meta(a) && <p className="mt-0.5 text-[10px] text-slate-400">{meta(a)}</p>}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "timeline") {
    return (
      <div className="relative space-y-3 pl-5">
        <span className="absolute left-1.5 top-1 bottom-1 w-px" style={{ backgroundColor: `${accent}40` }} />
        {awards.map((a, i) => (
          <div key={i} className="relative">
            <span
              className="absolute -left-[15px] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: accent }}
            />
            {a.year && (
              <p className="text-[10px] font-bold" style={{ color: accent }}>{a.year}</p>
            )}
            <p className="text-xs font-bold text-slate-700">{a.title}</p>
            {a.issuer && <p className="text-[10px] text-slate-400">{a.issuer}</p>}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "badges") {
    return (
      <div className="flex flex-wrap gap-2">
        {awards.map((a, i) => (
          <div key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              <LucideIcon name={a.icon || "Award"} className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold text-slate-700">{a.title}</span>
            {a.year && <span className="text-[10px] text-slate-400">{a.year}</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {awards.map((a, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <LucideIcon name={a.icon || "Award"} className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-700">{a.title}</p>
            {meta(a) && <p className="text-[10px] text-slate-400">{meta(a)}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AwardsSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.awards || !card.awards.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "awards");
  return (
    <div>
      <SectionLabel>Awards &amp; Certifications</SectionLabel>
      <AwardsBody awards={card.awards} accent={accent} variant={variant} />
    </div>
  );
}

function BrandCard({ b }: { b: BrandLogo }) {
  return (
    <div
      className="flex h-14 items-center justify-center rounded-xl border border-border bg-white p-2"
      title={b.name}
    >
      {b.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={b.logo}
          alt={b.name}
          className="max-h-9 max-w-full object-contain grayscale transition hover:grayscale-0"
          loading="lazy"
        />
      ) : (
        <span className="text-center text-[11px] font-bold leading-tight text-slate-500">
          {b.name}
        </span>
      )}
    </div>
  );
}

/** Renders brand logos in the chosen design variant (no section heading). */
export function BrandsBody({
  brands,
  accent,
  variant,
}: {
  brands: BrandLogo[];
  accent: string;
  variant: string;
}) {
  if (variant === "bordered") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {brands.map((b, i) => (
          <div key={i} className="flex h-16 items-center justify-center rounded-xl border border-border bg-white p-3" title={b.name}>
            {b.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo} alt={b.name} className="max-h-10 max-w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-center text-xs font-bold text-slate-600">{b.name}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {brands.map((b, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600"
          >
            {b.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo} alt={b.name} className="h-4 max-w-[60px] object-contain" loading="lazy" />
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                {b.name}
              </>
            )}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "mono") {
    return (
      <div className="grid grid-cols-3 gap-2.5">
        {brands.map((b, i) => (
          <div key={i} className="flex h-14 items-center justify-center rounded-xl bg-surface-2 p-2" title={b.name}>
            {b.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo} alt={b.name} className="max-h-8 max-w-full object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
            ) : (
              <span className="text-center text-[11px] font-bold text-slate-400">{b.name}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {brands.map((b, i) => (
        <BrandCard key={i} b={b} />
      ))}
    </div>
  );
}

export function BrandsSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.brands || !card.brands.length) return null;
  const style = effectiveSectionStyle(card.sectionStyles, "brands");
  const variant = effectiveSectionLayout(card.sectionLayouts, "brands");
  return (
    <div>
      <SectionLabel>Trusted By</SectionLabel>
      {isCarousel(style) && variant === "cards" ? (
        <Carousel
          slides={card.brands.map((b, i) => <BrandCard key={i} b={b} />)}
          accent={accent}
          autoplay={style === "carousel-auto"}
          basis="basis-1/3"
        />
      ) : (
        <BrandsBody brands={card.brands} accent={accent} variant={variant} />
      )}
    </div>
  );
}

function shopWhatsAppLink(whatsapp: string | undefined, productName: string): string | null {
  const digits = (whatsapp ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const msg = `Hi, I'm interested in "${productName}". Is it available?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

function discountPct(price?: string, mrp?: string): number | null {
  const p = parseFloat((price ?? "").replace(/[^\d.]/g, ""));
  const m = parseFloat((mrp ?? "").replace(/[^\d.]/g, ""));
  if (!p || !m || m <= p) return null;
  return Math.round((1 - p / m) * 100);
}

function ShopProductCard({
  p,
  accent,
  whatsapp,
  isCompact,
}: {
  p: ShopProduct;
  accent: string;
  whatsapp?: string;
  isCompact?: boolean;
}) {
  const pct = discountPct(p.price, p.mrp);
  const cta = p.cta ?? "whatsapp";
  const wa = cta === "whatsapp" ? shopWhatsAppLink(p.whatsapp || whatsapp, p.name) : null;
  const link = cta === "link" ? p.url : undefined;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white flex flex-col">
      <div className="relative aspect-square bg-surface shrink-0">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Icons.Image className={isCompact ? "h-6 w-6" : "h-8 w-8"} />
          </div>
        )}
        {pct !== null && (
          <span
            className={`absolute left-1.5 top-1.5 rounded-md text-white font-bold ${isCompact ? "px-1.5 py-0.5 text-[9px]" : "px-1.5 py-0.5 text-[10px]"}`}
            style={{ backgroundColor: accent }}
          >
            -{pct}%
          </span>
        )}
      </div>
      <div className={`flex flex-col flex-1 ${isCompact ? "p-2" : "p-2.5"}`}>
        <p className={`truncate font-semibold text-slate-700 ${isCompact ? "text-[11px]" : "text-xs"}`} title={p.name}>{p.name}</p>
        {(p.price || p.mrp) && (
          <div className={`mt-0.5 flex flex-wrap items-baseline ${isCompact ? "gap-1" : "gap-1.5 mt-1"}`}>
            {p.price && <span className={`font-bold text-slate-900 ${isCompact ? "text-[12px]" : "text-sm"}`}>{p.price}</span>}
            {p.mrp && <span className={`text-slate-400 line-through ${isCompact ? "text-[9px]" : "text-[11px]"}`}>{p.mrp}</span>}
          </div>
        )}
        {(link || wa) && (
          <div className="mt-auto pt-2">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-1.5 rounded-lg font-semibold text-white transition-colors ${isCompact ? "py-1.5 text-[10px]" : "px-2 py-1.5 text-[11px]"}`}
                style={{ backgroundColor: accent }}
              >
                <LucideIcon name={p.ctaIcon || "ShoppingBag"} className={isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                <span className="truncate">{p.ctaLabel || (isCompact ? "Buy" : "Buy now")}</span>
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 ${isCompact ? "py-1.5 text-[10px]" : "px-2 py-1.5 text-[11px]"}`}
              >
                <WhatsappIcon className={isCompact ? "h-3 w-3 shrink-0" : "h-3.5 w-3.5 shrink-0"} /> 
                <span className="truncate">{p.ctaLabel || (isCompact ? "Order" : "Order on WhatsApp")}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ShopListRow({ p, accent, whatsapp }: { p: ShopProduct; accent: string; whatsapp?: string }) {
  const pct = discountPct(p.price, p.mrp);
  const cta = p.cta ?? "whatsapp";
  const wa = cta === "whatsapp" ? shopWhatsAppLink(p.whatsapp || whatsapp, p.name) : null;
  const link = cta === "link" ? p.url : undefined;
  const href = link || wa || undefined;
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-white p-2.5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Icons.Image className="h-6 w-6" />
          </div>
        )}
        {pct !== null && (
          <span className="absolute left-1 top-1 rounded px-1 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: accent }}>
            -{pct}%
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs font-semibold text-slate-700">{p.name}</p>
        {(p.price || p.mrp) && (
          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
            {p.price && <span className="text-sm font-bold text-slate-900">{p.price}</span>}
            {p.mrp && <span className="text-[11px] text-slate-400 line-through">{p.mrp}</span>}
          </div>
        )}
        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white"
            style={{ backgroundColor: accent }}>
            <LucideIcon name={link ? p.ctaIcon || "ShoppingBag" : "MessageCircle"} className="h-3 w-3 shrink-0" />
            <span className="truncate">{p.ctaLabel || (link ? "Buy now" : "Order")}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function ShopMinimalCard({ p }: { p: ShopProduct }) {
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Icons.Image className="h-8 w-8" />
          </div>
        )}
      </div>
      <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">{p.name}</p>
      {p.price && <p className="text-sm font-bold text-slate-900">{p.price}</p>}
    </div>
  );
}

function ShopCoverCard({ p, accent, whatsapp }: { p: ShopProduct; accent: string; whatsapp?: string }) {
  const pct = discountPct(p.price, p.mrp);
  const cta = p.cta ?? "whatsapp";
  const wa = cta === "whatsapp" ? shopWhatsAppLink(p.whatsapp || whatsapp, p.name) : null;
  const link = cta === "link" ? p.url : undefined;
  const href = link || wa || undefined;
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-surface shadow-sm border border-border">
      {p.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-2 text-slate-300">
          <Icons.Image className="h-8 w-8" />
        </div>
      )}
      
      {/* Gradient Overlay for Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Discount Badge */}
      {pct !== null && (
        <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-md" style={{ backgroundColor: accent }}>
          -{pct}%
        </span>
      )}

      {/* CTA Button overlay */}
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
        >
          <LucideIcon name={link ? p.ctaIcon || "ShoppingBag" : "MessageCircle"} className="h-3.5 w-3.5" />
        </a>
      )}

      {/* Text Content */}
      <div className="absolute inset-x-0 bottom-0 p-2.5">
        <p className="truncate text-[11px] font-bold text-white drop-shadow-md" title={p.name}>{p.name}</p>
        {(p.price || p.mrp) && (
          <div className="mt-0.5 flex items-baseline gap-1.5 drop-shadow-md">
            {p.price && <span className="text-xs font-extrabold text-white">{p.price}</span>}
            {p.mrp && <span className="text-[9px] text-white/70 line-through">{p.mrp}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders a list of shop products in the chosen design variant. */
export function ShopProductsBody({
  products,
  accent,
  whatsapp,
  variant,
}: {
  products: ShopProduct[];
  accent: string;
  whatsapp?: string;
  variant: string;
}) {
  if (variant === "list") {
    return (
      <div className="space-y-2.5">
        {products.map((p, pi) => (
          <ShopListRow key={pi} p={p} accent={accent} whatsapp={whatsapp} />
        ))}
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {products.map((p, pi) => (
          <ShopCoverCard key={pi} p={p} accent={accent} whatsapp={whatsapp} />
        ))}
      </div>
    );
  }
  if (variant === "minimal") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {products.map((p, pi) => (
          <ShopMinimalCard key={pi} p={p} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {products.map((p, pi) => (
        <ShopProductCard key={pi} p={p} accent={accent} whatsapp={whatsapp} />
      ))}
    </div>
  );
}

export function ShopSection({ card, accent }: { card: CardData; accent: string }) {
  const categories = (card.shop ?? []).filter((c) => c.products && c.products.length);
  if (!categories.length) return null;
  const whatsapp = card.contact.whatsapp;
  const variant = effectiveSectionLayout(card.sectionLayouts, "shop");
  return (
    <div>
      <SectionLabel>Shop</SectionLabel>
      <div className="space-y-5">
        {categories.map((cat, ci) => (
          <div key={ci}>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full" style={{ backgroundColor: accent }} />
              <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
              <span className="text-[10px] text-slate-400">{cat.products.length} items</span>
            </div>
            <ShopProductsBody products={cat.products} accent={accent} whatsapp={whatsapp} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}

type BrochureItem = { title: string; url: string };

/** Renders brochures/documents in the chosen design variant (no section heading). */
export function BrochureBody({
  brochures,
  accent,
  variant,
}: {
  brochures: BrochureItem[];
  accent: string;
  variant: string;
}) {
  const anchor = "flex items-center transition-colors group";
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {brochures.map((b, i) => (
          <a key={i} href={b.url} download target="_blank" rel="noopener noreferrer"
            className={`${anchor} h-full flex-col items-start gap-2 rounded-xl border border-border bg-white p-3.5 hover:bg-slate-50`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Icons.FileText className="h-4.5 w-4.5" />
            </span>
            <span className="line-clamp-2 text-xs font-semibold text-slate-800">{b.title}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: accent }}>
              <Icons.Download className="h-3 w-3" /> Download
            </span>
          </a>
        ))}
      </div>
    );
  }
  if (variant === "tiles") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {brochures.map((b, i) => (
          <a key={i} href={b.url} download target="_blank" rel="noopener noreferrer"
            className={`${anchor} flex-col justify-center gap-2 rounded-xl border border-border bg-white p-4 text-center hover:bg-slate-50`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Icons.FileText className="h-6 w-6" />
            </span>
            <span className="line-clamp-2 text-xs font-semibold text-slate-800">{b.title}</span>
          </a>
        ))}
      </div>
    );
  }
  if (variant === "compact") {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-white divide-y divide-slate-100">
        {brochures.map((b, i) => (
          <a key={i} href={b.url} download target="_blank" rel="noopener noreferrer"
            className={`${anchor} justify-between gap-3 px-3.5 py-2.5 hover:bg-slate-50`}>
            <span className="inline-flex min-w-0 items-center gap-2">
              <Icons.FileText className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span className="truncate text-xs font-medium text-slate-700">{b.title}</span>
            </span>
            <Icons.Download className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </a>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {brochures.map((b, i) => (
        <a key={i} href={b.url} download target="_blank" rel="noopener noreferrer"
          className={`${anchor} justify-between rounded-xl border border-border bg-white p-3 hover:bg-slate-50`}>
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Icons.FileText className="h-4 w-4" />
            </span>
            <span className="truncate text-xs font-semibold text-slate-800">{b.title}</span>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-slate-400 transition-colors group-hover:bg-brand group-hover:text-white group-hover:border-brand">
            <Icons.Download className="h-3.5 w-3.5" />
          </span>
        </a>
      ))}
    </div>
  );
}

export function BrochureSection({ card, accent }: { card: CardData; accent: string }) {
  if (!card.brochures || !card.brochures.length) return null;
  const variant = effectiveSectionLayout(card.sectionLayouts, "brochures");
  return (
    <div>
      <SectionLabel>Brochures &amp; Documents</SectionLabel>
      <BrochureBody brochures={card.brochures} accent={accent} variant={variant} />
    </div>
  );
}

export function SocialsRow({
  card,
  accent,
}: {
  card: CardData;
  accent: string;
}) {
  if (!card.socials.length) return null;
  return (
    <div className="flex flex-wrap gap-2.5">
      {card.socials.map((s) => {
        const Icon = socialIcon[s.platform];
        return (
          <a
            key={s.platform + s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={socialLabel[s.platform]}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-surface"
          >
            <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
          </a>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
      {children}
    </h3>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="font-medium text-foreground [overflow-wrap:anywhere]">
        {value}
      </span>
    </div>
  );
}

export function OrderedSections({
  card,
  accent,
  galleryColumns = 3,
  exclude = [],
}: {
  card: CardData;
  accent: string;
  galleryColumns?: 2 | 3;
  exclude?: string[];
}) {
  const order = card.sectionsOrder !== undefined && card.sectionsOrder !== null
    ? card.sectionsOrder
    : [
        "about",
        "services",
        "shop",
        "stats",
        "gallery",
        "team",
        "payment",
        "businessHours",
        "youtubeVideos",
        "brochures",
        "awards",
        "brands",
        "testimonials",
        "faqs",
        "booking",
        "enquiry",
        "cta",
        "map",
      ];

  const renderBody = (sectionKey: string): React.ReactNode => {
    switch (sectionKey) {
      case "about":
        return <AboutSection card={card} accent={accent} />;
      case "services":
        return <ServicesSection card={card} accent={accent} />;
      case "gallery":
        return <GallerySection card={card} accent={accent} columns={galleryColumns} />;
      case "payment":
        return <PaymentSection card={card} />;
      case "businessHours":
        return <BusinessHoursSection card={card} accent={accent} />;
      case "youtubeVideos":
        return <YouTubeVideosSection card={card} accent={accent} />;
      case "brochures":
        return <BrochureSection card={card} accent={accent} />;
      case "team":
        return <TeamSection card={card} accent={accent} />;
      case "stats":
        return <StatsSection card={card} accent={accent} />;
      case "awards":
        return <AwardsSection card={card} accent={accent} />;
      case "brands":
        return <BrandsSection card={card} accent={accent} />;
      case "shop":
        return <ShopSection card={card} accent={accent} />;
      case "testimonials":
        return <TestimonialsSection card={card} accent={accent} />;
      case "faqs":
        return <FaqSection card={card} accent={accent} />;
      case "booking":
        return <BookingSection card={card} accent={accent} />;
      case "enquiry":
        return <EnquirySection card={card} accent={accent} />;
      case "cta":
        return <CtaSection card={card} accent={accent} />;
      case "map":
        return <MapSection card={card} accent={accent} />;
      default:
        return null;
    }
  };

  return (
    <>
      {order
        .filter((key) => !exclude.includes(key))
        .map((sectionKey) => {
          const node = renderBody(sectionKey);
          if (!node) return null;
          // Only real, non-empty sections become jump-link anchor targets; empty
          // ones stay unwrapped so they don't create stray spacing.
          if (!sectionHasContent(card, sectionKey)) {
            return <Fragment key={sectionKey}>{node}</Fragment>;
          }
          return (
            <div key={sectionKey} id={sectionAnchorId(sectionKey)} className="scroll-mt-4">
              {node}
            </div>
          );
        })}
    </>
  );
}

export { IndianRupee };
