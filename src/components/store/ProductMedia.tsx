import { cn } from "@/lib/utils";

/**
 * Self-contained product visual. If a real `image` URL exists we use it;
 * otherwise we render an on-brand gradient "hero" derived from the product's
 * hue + emoji, so every card looks intentional with zero image assets.
 */
export default function ProductMedia({
  hue,
  emoji,
  accent,
  image,
  name,
  className,
  size = "md",
}: {
  hue: number;
  emoji: string;
  accent: string;
  image?: string;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const emojiSize = size === "lg" ? "text-[5.5rem]" : size === "sm" ? "text-4xl" : "text-6xl";

  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt={name}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, hsl(${hue} 90% 96%), hsl(${
          (hue + 30) % 360
        } 80% 90%) 55%, hsl(${(hue + 60) % 360} 70% 86%))`,
      }}
      aria-hidden="true"
    >
      {/* soft blooms */}
      <div
        className="absolute -left-10 -top-10 h-40 w-40 rounded-full blur-2xl opacity-60"
        style={{ background: accent }}
      />
      <div
        className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full blur-3xl opacity-40"
        style={{ background: `hsl(${(hue + 40) % 360} 90% 75%)` }}
      />
      {/* glass disc holding the icon */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid aspect-square w-[46%] place-items-center rounded-full bg-white/45 backdrop-blur-md ring-1 ring-white/60 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)]">
          <span className={cn("drop-shadow-sm", emojiSize)}>{emoji}</span>
        </div>
      </div>
    </div>
  );
}
