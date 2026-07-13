import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-shadow hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
