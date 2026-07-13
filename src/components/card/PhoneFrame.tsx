import { cn } from "@/lib/utils";

/**
 * A realistic phone device frame used to preview cards (in the editor and
 * anywhere a "how it looks on a phone" mock is helpful).
 */
export function PhoneFrame({
  children,
  className,
  screenClassName,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * Overrides the height behaviour of the scrollable screen. Defaults to a
   * fixed `max-h-[720px]`; pass `min-h-0 flex-1` (with a height-bounded parent)
   * to make the phone fill the available viewport and scroll internally.
   */
  screenClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex max-h-full w-full max-w-[330px] flex-col rounded-[2.6rem] border-2 border-slate-800 bg-slate-900 p-2 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.45)]",
        className,
      )}
    >
      {/* Side buttons */}
      <span className="absolute -left-1 top-24 h-10 w-1 rounded-l bg-slate-700" />
      <span className="absolute -left-1 top-40 h-10 w-1 rounded-l bg-slate-700" />
      <span className="absolute -right-1 top-32 h-14 w-1 rounded-r bg-slate-700" />

      {/* Screen. The explicit translateZ(0) transform establishes a containing
          block so a card's `position: fixed` overlays (e.g. the nav drawer)
          stay inside the phone frame instead of covering the whole page. */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.1rem] bg-surface [transform:translateZ(0)]">
        {/* Status bar (part of the device chrome) with a Dynamic-Island pill */}
        <div className="relative z-20 flex h-7 shrink-0 items-center justify-center bg-slate-900">
          <span className="h-4 w-20 rounded-full bg-black" />
        </div>
        <div
          className={cn(
            "no-scrollbar overflow-y-auto bg-surface",
            screenClassName ?? "max-h-[720px]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
