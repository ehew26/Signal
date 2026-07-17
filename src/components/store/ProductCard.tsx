import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { cn, formatPrice, formatNumber } from "@/lib/utils";
import ProductMedia from "./ProductMedia";
import AddToCart from "./AddToCart";

/**
 * The store's core unit. `feature` makes it span wider/taller in the dynamic
 * grid — that's how the layout re-weights itself toward hero products.
 */
export default function ProductCard({
  product,
  feature = false,
}: {
  product: Product;
  feature?: boolean;
}) {
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : 0;

  const topBadge = product.badges[0];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        feature && "sm:col-span-2 sm:row-span-2"
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className={cn("relative block overflow-hidden", feature ? "aspect-[4/3]" : "aspect-square")}
      >
        <ProductMedia
          hue={product.hue}
          emoji={product.emoji}
          accent={product.accent}
          image={product.image}
          name={product.name}
          size={feature ? "lg" : "md"}
          className="transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {topBadge && (
            <span className="w-fit rounded-full bg-mist/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {topBadge}
            </span>
          )}
          {discount > 0 && (
            <span className="w-fit rounded-full bg-rose px-2.5 py-1 text-[11px] font-semibold text-white">
              −{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-[12px] text-mist-faint">
          <Star className="h-3.5 w-3.5 fill-amber text-amber" />
          <span className="font-medium text-mist-dim">{product.rating.toFixed(1)}</span>
          <span>({formatNumber(product.reviews, true)})</span>
        </div>

        <Link href={`/product/${product.slug}`} className="block">
          <h3
            className={cn(
              "font-display font-semibold leading-tight text-mist",
              feature ? "text-xl" : "text-[15px]"
            )}
          >
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-mist-faint">{product.tagline}</p>
        </Link>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-semibold text-mist">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-[13px] text-mist-faint line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>
          <AddToCart
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              emoji: product.emoji,
              accent: product.accent,
              hue: product.hue,
            }}
            variant="icon"
          />
        </div>
      </div>
    </div>
  );
}
