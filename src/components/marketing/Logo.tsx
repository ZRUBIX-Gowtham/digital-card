import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <img
        src="/logo.png"
        alt="OnlineCard logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg"
      />
      <span
        className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Online
        <span className="text-brand">Card</span>
      </span>
    </Link>
  );
}
