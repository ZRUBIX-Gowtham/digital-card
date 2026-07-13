import { initials } from "@/lib/utils";
import type { CardData, TemplateMeta, TemplateStyle } from "@/types/card";

/** A tiny, layout-accurate preview so each template reads as its own design. */
export function TemplateThumb({
  template,
  demo,
}: {
  template: TemplateMeta;
  demo?: CardData;
}) {
  const { layout, style } = template;
  const accent = style.accent;
  const name = demo?.name ?? "Your Name";
  const title = demo?.title ?? "Your title";

  const round =
    style.avatar === "square"
      ? "rounded-md"
      : style.avatar === "rounded"
        ? "rounded-lg"
        : "rounded-full";

  const headerBg = headerStyle(style);

  const AvatarChip = ({ size = 34, ring = "ring-2 ring-white" }: { size?: number; ring?: string }) =>
    demo?.avatarImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={demo.avatarImage}
        alt=""
        className={`${round} ${ring} object-cover`}
        style={{ width: size, height: size }}
      />
    ) : (
      <span
        className={`flex items-center justify-center ${round} ${ring} text-[10px] font-bold text-white`}
        style={{ width: size, height: size, backgroundColor: accent }}
      >
        {initials(name)}
      </span>
    );

  const bars = (n: number) =>
    Array.from({ length: n }).map((_, i) => (
      <span
        key={i}
        className="block h-1.5 rounded-full bg-surface-2"
        style={{ width: `${88 - i * 16}%` }}
      />
    ));

  const shell = "h-full w-full overflow-hidden bg-surface";

  if (layout === "cover") {
    return (
      <div className={shell}>
        <div className="relative h-12" style={headerBg}>
          {style.header === "image" && demo?.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={demo.coverImage} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="relative z-10 -mt-5 flex flex-col items-center px-3 pb-2.5 h-[calc(100%-48px)] justify-between">
          <AvatarChip size={30} />
          <div className="text-center min-w-0 w-full mt-0.5">
            <p className="text-[9px] font-bold text-foreground truncate">{name}</p>
            <p className="text-[7px] font-medium truncate" style={{ color: accent }}>{title}</p>
          </div>
          
          <div className="grid w-full grid-cols-3 gap-1 mt-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-border py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          <span className="block w-full rounded py-0.5 text-[5px] font-bold text-center text-white truncate" style={{ backgroundColor: accent }}>
            Save Contact
          </span>
        </div>
      </div>
    );
  }

  if (layout === "minimal") {
    return (
      <div className={`${shell} p-2.5 flex flex-col justify-between min-w-0`}>
        <div>
          <span className="block h-1 w-8 rounded-full" style={{ backgroundColor: accent }} />
          <div className="mt-2 flex items-center gap-2">
            <AvatarChip ring="" size={26} />
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-foreground truncate leading-tight">{name}</p>
              <p className="text-[7px] text-muted truncate leading-tight mt-0.5">{title}</p>
            </div>
          </div>
        </div>
        <div className="mt-1 flex flex-col gap-1 w-full">
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          <span className="block w-full rounded py-0.5 text-[5px] font-bold text-center text-white truncate" style={{ backgroundColor: accent }}>
            Save Contact
          </span>
        </div>
      </div>
    );
  }

  if (layout === "corporate") {
    return (
      <div className={shell}>
        <div className="relative h-14" style={headerBg}>
          {style.header === "image" && demo?.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={demo.coverImage} alt="" className="h-full w-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-1 left-2 flex items-center gap-1.5 text-white pr-2 min-w-0 w-[calc(100%-8px)]">
            <AvatarChip size={20} ring="" />
            <span className="text-[9px] font-bold truncate">{demo?.company ?? name}</span>
          </div>
        </div>
        <div className="p-2.5 flex flex-col gap-1 w-full justify-between h-[calc(100%-56px)] min-w-0">
          <div className="rounded border border-border bg-surface-2/50 p-1 flex justify-between items-center">
            <div className="min-w-0">
              <p className="text-[8px] font-bold text-foreground truncate leading-tight">{name}</p>
              <p className="text-[6px] text-muted truncate leading-tight mt-0.5">{title}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Email", "Website"].map((btn) => (
              <span key={btn} className="rounded border border-border py-0.5 text-[5px] text-center font-bold text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "sidebar") {
    return (
      <div className={`${shell} flex`}>
        {/* Left Sidebar */}
        <div className="flex w-[35%] flex-col items-center justify-between p-2 text-white text-center" style={headerBg}>
          <div className="flex flex-col items-center gap-1">
            <AvatarChip size={26} ring="ring-2 ring-white/40" />
            <p className="text-[8px] font-bold leading-tight truncate w-full">{name}</p>
            <p className="text-[6px] text-white/80 leading-tight truncate w-full">{title}</p>
          </div>
          {/* Social Icons row/stack */}
          <div className="flex gap-1 mt-1 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
            ))}
          </div>
        </div>
        {/* Right Content Column */}
        <div className="flex flex-1 flex-col justify-between p-2 min-w-0">
          <div>
            <p className="text-[7px] font-bold uppercase tracking-wider text-muted truncate">
              {demo?.company ?? "Company Name"}
            </p>
            {demo?.tagline && (
              <p className="text-[6px] text-muted truncate leading-tight mt-0.5">
                {demo.tagline}
              </p>
            )}
          </div>
          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-1 my-1">
            {["Call", "WhatsApp", "Email", "Location"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          {/* Save Contact Button */}
          <span className="block w-full rounded py-0.5 text-[5px] font-bold text-center text-white truncate" style={{ backgroundColor: accent }}>
            Save Contact
          </span>
        </div>
      </div>
    );
  }

  if (layout === "spotlight") {
    return (
      <div className={`${shell} bg-slate-900`}>
        <div className="relative p-2.5 h-full flex flex-col justify-between">
          <span className="absolute right-2 top-2 h-10 w-10 rounded-full opacity-50 blur-xl" style={{ backgroundColor: accent }} />
          <div className="relative flex items-center gap-2">
            <AvatarChip size={26} ring="ring-2 ring-white/20" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-white truncate">{name}</p>
              <p className="text-[7px] text-white/60 truncate">{title}</p>
            </div>
          </div>
          {/* Action buttons matching CardActions */}
          <div className="relative z-10 grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-white/15 bg-white/5 py-0.5 text-[4px] font-bold text-center text-white/80 truncate">
                {btn}
              </span>
            ))}
          </div>
          {/* Gallery items */}
          <div className="relative flex gap-1 justify-between">
            {(demo?.gallery ?? []).slice(0, 3).map((g, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={g.src} alt="" className="h-7 w-7 rounded object-cover ring-1 ring-white/15" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "product") {
    return (
      <div className={shell}>
        <div className="relative flex items-center gap-1.5 p-2 text-white" style={headerBg}>
          {style.header === "image" && demo?.coverImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={demo.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25" />
            </>
          )}
          <div className="relative flex items-center gap-1.5 z-10">
            <AvatarChip size={18} ring="" />
            <span className="text-[8px] font-bold truncate">{demo?.company ?? name}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1.5 justify-between h-[calc(100%-36px)]">
          {/* CardActions representation */}
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          {/* Services/Products Row */}
          <div className="grid grid-cols-2 gap-1 flex-1">
            {(demo?.services ?? []).slice(0, 2).map((s, i) => (
              <div key={i} className="overflow-hidden rounded border border-border bg-surface-2/50 flex flex-col justify-between p-0.5">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt="" className="aspect-square w-full rounded object-cover" />
                ) : (
                  <div className="aspect-square w-full rounded" style={{ backgroundColor: `${accent}18` }} />
                )}
                <p className="text-[5px] font-bold text-center truncate mt-0.5" style={{ color: accent }}>
                  {s.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "storefront") {
    const [feat] = demo?.services ?? [];
    return (
      <div className={shell}>
        {/* Banner header */}
        <div className="relative flex flex-col items-center py-2 text-white" style={headerBg}>
          {style.header === "image" && demo?.coverImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={demo.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/35" />
            </>
          )}
          <div className="relative flex flex-col items-center z-10">
            <AvatarChip size={18} ring="ring-1 ring-white/40" />
            <span className="mt-0.5 text-[8px] font-bold truncate max-w-[90px]">{demo?.company ?? name}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1.5 justify-between h-[calc(100%-46px)]">
          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          {/* Featured Product */}
          {feat?.image ? (
            <div className="overflow-hidden rounded border border-border bg-surface-2/50 flex-1 relative min-h-[36px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feat.image} alt="" className="h-full w-full object-cover absolute inset-0" />
              <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5 px-1 flex justify-between items-center text-white">
                <span className="text-[5px] font-bold truncate max-w-[70%]">{feat.title}</span>
                <span className="text-[5px] font-bold">{feat.price}</span>
              </div>
            </div>
          ) : (
            <div className="rounded border border-dashed border-border bg-surface-2 flex-1 min-h-[30px]" />
          )}
        </div>
      </div>
    );
  }

  if (layout === "catalog") {
    return (
      <div className={shell}>
        <div className="flex items-center gap-1.5 p-2 text-white" style={headerBg}>
          <AvatarChip size={18} ring="" />
          <span className="text-[8px] font-bold truncate">{demo?.company ?? name}</span>
        </div>
        <div className="p-2 flex flex-col gap-1.5 justify-between h-[calc(100%-36px)]">
          {/* CardActions representation */}
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          {/* Services/Product rows list */}
          <div className="flex flex-col gap-1 flex-1 justify-center">
            {(demo?.services ?? []).slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded border border-border bg-surface-2/50 p-1">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt="" className="h-5 w-5 rounded object-cover" />
                ) : (
                  <div className="h-5 w-5 rounded" style={{ backgroundColor: `${accent}18` }} />
                )}
                <span className="text-[6px] font-semibold text-muted flex-1 truncate">
                  {s.title}
                </span>
                <span className="text-[6px] font-bold" style={{ color: accent }}>{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "aside") {
    return (
      <div className={`${shell} p-2.5 flex flex-col justify-between`}>
        <div className="overflow-hidden rounded-xl border border-border" style={{ backgroundColor: `${accent}12` }}>
          <span className="block h-1 w-full" style={{ backgroundColor: accent }} />
          <div className="flex items-center gap-2 p-2">
            <AvatarChip ring="ring-1 ring-white" size={28} />
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-foreground truncate leading-tight">{name}</p>
              <p className="text-[7px] font-medium truncate leading-tight mt-0.5" style={{ color: accent }}>{title}</p>
            </div>
          </div>
        </div>
        <div className="mt-1 flex flex-col gap-1 w-full">
          <div className="grid grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
          <span className="block w-full rounded py-0.5 text-[5px] font-bold text-center text-white truncate" style={{ backgroundColor: accent }}>
            Save Contact
          </span>
        </div>
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className={`${shell} p-2.5 flex flex-col items-center justify-between text-center`}>
        <div className="relative flex flex-col items-center pt-0.5">
          <span className="pointer-events-none absolute -top-1 text-[26px] font-black leading-none tracking-tighter select-none" style={{ color: `${accent}14` }}>
            {initials(name)}
          </span>
          <AvatarChip ring="" size={28} />
          <div className="relative z-10 mt-1 flex w-full items-center gap-1">
            <span className="h-px flex-1" style={{ backgroundColor: `${accent}55` }} />
            <p className="text-[9px] font-bold text-foreground truncate max-w-[60%]">{name}</p>
            <span className="h-px flex-1" style={{ backgroundColor: `${accent}55` }} />
          </div>
          <p className="text-[6px] font-semibold uppercase tracking-widest truncate max-w-full" style={{ color: accent }}>{title}</p>
        </div>
        <span className="block w-full rounded py-0.5 text-[5px] font-bold text-center text-white truncate" style={{ backgroundColor: accent }}>
          Save Contact
        </span>
      </div>
    );
  }

  if (layout === "showcase") {
    const accent2 = style.accent2 ?? accent;
    const gallery = demo?.gallery ?? [];
    return (
      <div className={shell}>
        <div className="relative px-2.5 pb-6 pt-2.5 text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
          <p className="text-[5px] font-bold uppercase tracking-widest text-white/70 truncate">{demo?.company ?? title}</p>
          <p className="text-[13px] font-black leading-none tracking-tight truncate mt-0.5">{name}</p>
          <p className="text-[6px] font-semibold text-white/90 truncate mt-0.5">{title}</p>
        </div>
        <div className="relative z-10 -mt-4 px-2.5">
          <div className={`inline-block ${round} bg-white p-0.5 shadow-sm`}>
            <AvatarChip ring="" size={24} />
          </div>
        </div>
        <div className="px-2.5 pb-2 pt-1">
          <div className="grid grid-cols-2 gap-1">
            {gallery[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gallery[0].src} alt="" className="col-span-2 aspect-[16/9] w-full rounded object-cover" />
            )}
            {gallery.slice(1, 3).map((g, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={g.src} alt="" className="aspect-square w-full rounded object-cover" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "aurora") {
    const accent2 = style.accent2 ?? accent;
    return (
      <div className={shell} style={{ backgroundColor: "#020617" }}>
        <div className="relative h-full overflow-hidden px-2.5 py-3 flex flex-col items-center justify-between text-center">
          <span className="pointer-events-none absolute -top-8 left-1/2 h-16 w-[140%] -translate-x-1/2 rounded-[50%] opacity-40 blur-2xl" style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />
          <div className="relative flex flex-col items-center">
            <div className={`${round} p-[2px]`} style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
              <AvatarChip ring="ring-2 ring-slate-950" size={28} />
            </div>
            <p className="mt-1 text-[9px] font-bold text-white truncate max-w-full">{name}</p>
            <p className="text-[6px] font-semibold truncate max-w-full" style={{ color: accent2 }}>{title}</p>
          </div>
          <div className="relative z-10 grid w-full grid-cols-3 gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-white/15 bg-white/5 py-0.5 text-[4px] font-bold text-center text-white/80 truncate">
                {btn}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "bento") {
    const accent2 = style.accent2 ?? accent;
    return (
      <div className={`${shell} p-2 flex flex-col`}>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="col-span-1 flex items-center justify-center rounded-xl p-1.5" style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
            <AvatarChip ring="ring-1 ring-white/40" size={24} />
          </div>
          <div className="col-span-2 flex flex-col justify-center rounded-xl border border-border bg-surface-2/40 p-1.5 min-w-0">
            <p className="text-[9px] font-bold text-foreground truncate leading-tight">{name}</p>
            <p className="text-[6px] font-semibold truncate leading-tight" style={{ color: accent }}>{title}</p>
          </div>
          <div className="col-span-3 rounded-xl px-2 py-1 text-[6px] font-medium truncate" style={{ backgroundColor: `${accent}12`, color: accent }}>
            {demo?.tagline ?? "Your tagline here"}
          </div>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {["Call", "Chat", "Email"].map((btn) => (
            <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
              {btn}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "masthead") {
    return (
      <div className={`${shell} p-2.5 flex flex-col justify-between`}>
        <div>
          <p className="text-[5px] font-bold uppercase tracking-[0.25em] text-slate-400 truncate">{title}</p>
          <p className="text-[15px] font-black uppercase leading-[0.9] tracking-tight text-foreground truncate mt-0.5">{name}</p>
          <span className="mt-1 block h-1 w-full rounded-full" style={{ backgroundColor: accent }} />
          <div className="mt-1.5 flex items-center gap-1.5">
            <AvatarChip ring="" size={18} />
            <p className="text-[6px] font-medium text-slate-500 truncate">{demo?.company ?? name}</p>
          </div>
        </div>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {["Call", "Chat", "Email"].map((btn) => (
            <span key={btn} className="rounded border border-slate-150 py-0.5 text-[4px] font-bold text-center text-muted truncate">
              {btn}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "lookbook") {
    const accent2 = style.accent2 ?? accent;
    const [feat, ...rest] = demo?.services ?? [];
    return (
      <div className={shell} style={{ backgroundColor: "#020617" }}>
        <div className="px-2.5 pb-2 pt-3 text-center text-white">
          <div className="flex justify-center">
            <div className={`${round} p-[2px]`} style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
              <AvatarChip ring="ring-1 ring-slate-950" size={22} />
            </div>
          </div>
          <p className="mt-1 text-[5px] font-bold uppercase tracking-[0.3em] truncate" style={{ color: accent }}>{title}</p>
          <p className="text-[9px] font-bold tracking-wide truncate">{demo?.company ?? name}</p>
        </div>
        <div className="rounded-t-xl bg-slate-900 p-2 space-y-1.5">
          {feat && (
            <div className="overflow-hidden rounded border border-white/10 relative aspect-[16/9]">
              {feat.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={feat.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ backgroundColor: `${accent}22` }} />
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-1">
            {rest.slice(0, 2).map((s, i) => (
              <div key={i} className="overflow-hidden rounded border border-white/10 aspect-square">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full" style={{ backgroundColor: `${accent}22` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "stall") {
    const accent2 = style.accent2 ?? accent;
    const [feat] = demo?.services ?? [];
    return (
      <div className={shell}>
        <div className="flex flex-col items-center py-2 text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
          <AvatarChip ring="ring-1 ring-white/50" size={20} />
          <span className="mt-0.5 text-[8px] font-bold truncate max-w-[90%]">{demo?.company ?? name}</span>
          <span className="mt-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[4px] font-bold">Order on WhatsApp</span>
        </div>
        <div className="p-2 space-y-1">
          {feat?.image ? (
            <div className="overflow-hidden rounded border border-border relative aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feat.image} alt="" className="h-full w-full object-cover" />
              {feat.price && (
                <span className="absolute right-1 top-1 rounded-full px-1 py-0.5 text-[4px] font-bold text-white" style={{ backgroundColor: accent }}>{feat.price}</span>
              )}
            </div>
          ) : (
            <div className="rounded border border-dashed border-border aspect-[16/10]" style={{ backgroundColor: `${accent}12` }} />
          )}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[6px] font-bold text-foreground truncate">{feat?.title ?? "Product"}</span>
            <span className="rounded px-1.5 py-0.5 text-[4px] font-bold text-white" style={{ backgroundColor: accent }}>Order</span>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "halo") {
    const accent2 = style.accent2 ?? accent;
    return (
      <div className={shell} style={{ background: `radial-gradient(120% 60% at 50% 0%, ${accent}22, transparent 60%), #fff` }}>
        <div className="flex flex-col items-center p-2.5 h-full justify-between text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="pointer-events-none absolute inset-0 scale-150 rounded-full opacity-60 blur-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }} />
              <div className={`relative ${round} bg-white p-0.5 shadow-sm`}>
                <AvatarChip ring="" size={34} />
              </div>
            </div>
            <p className="mt-1.5 text-[10px] font-bold text-foreground truncate max-w-full">{name}</p>
            <p className="text-[7px] font-semibold truncate max-w-full" style={{ color: accent }}>{title}</p>
          </div>
          <div className="w-full flex flex-col gap-1">
            {["Call", "Chat", "Email"].map((btn) => (
              <span key={btn} className="rounded border border-slate-150 bg-surface py-0.5 text-[5px] font-bold text-center text-muted truncate">
                {btn}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // linkbio
  const dark = style.surface === "dark";
  return (
    <div className={`${shell} ${dark ? "bg-slate-900" : ""}`} style={dark ? undefined : { background: `linear-gradient(180deg, ${accent}18, #fff 60%)` }}>
      <div className="flex flex-col items-center p-3 h-full justify-between">
        <div className="flex flex-col items-center">
          <AvatarChip size={32} ring={dark ? "ring-2 ring-white/20" : "ring-2 ring-white"} />
          <p className={`mt-1 text-[10px] font-bold truncate max-w-full ${dark ? "text-white" : "text-foreground"}`}>{name}</p>
        </div>
        <div className="mt-1.5 flex w-full flex-col gap-1">
          {["Call me", "WhatsApp", "Email me"].map((btn, i) => (
            <span
              key={i}
              className={`flex items-center justify-between rounded py-0.5 px-2 text-[6px] font-bold ${
                dark 
                  ? "bg-white/10 text-white/80" 
                  : "border border-slate-150 bg-surface text-muted"
              }`}
            >
              <span className="truncate">{btn}</span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `${accent}1f` }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function headerStyle(style: TemplateStyle): React.CSSProperties {
  if (style.header === "dark") return { backgroundColor: "#0f172a" };
  if (style.header === "gradient")
    return { background: `linear-gradient(135deg, ${style.accent}, ${style.accent2 ?? style.accent})` };
  return { backgroundColor: style.accent };
}
