import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

/**
 * Avatar for card templates. Renders the profile image when `image` is set,
 * otherwise falls back to initials on a coloured tile.
 */
export function Avatar({
  name,
  logoText,
  image,
  accent,
  size = 88,
  className,
  ring = true,
  rounded = "rounded-2xl",
}: {
  name: string;
  logoText?: string;
  image?: string;
  accent: string;
  size?: number;
  className?: string;
  ring?: boolean;
  rounded?: string;
}) {
  const shared = cn(
    "flex items-center justify-center overflow-hidden",
    rounded,
    ring && "ring-4 ring-white",
    className,
  );

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        width={size}
        height={size}
        className={cn(shared, "object-cover")}
        style={{
          width: size,
          height: size,
          aspectRatio: "1 / 1",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    );
  }

  return (
    <div
      className={cn(shared, "font-bold text-white")}
      style={{
        width: size,
        height: size,
        backgroundColor: accent,
        fontSize: size * 0.34,
      }}
    >
      {logoText ?? initials(name)}
    </div>
  );
}
