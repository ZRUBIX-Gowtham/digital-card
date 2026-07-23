import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-8 min-w-0 max-w-full overflow-x-hidden", className)}>
      {children}
    </div>
  );
}
