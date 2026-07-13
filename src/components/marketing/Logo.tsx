import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Digital Site logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg"
      />
      <span
        className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Digital
        <span className="text-brand"> Site</span>
      </span>
    </Link>
  );
}
