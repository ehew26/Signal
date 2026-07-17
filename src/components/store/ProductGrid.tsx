import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

/**
 * Dynamic, self-arranging grid.
 *
 * The layout isn't hand-authored — it derives from the products themselves.
 * Featured items (and, when few products exist, the first item) claim a 2×2
 * hero cell; everything else flows around them. Add a product and mark it
 * featured/viral and the mosaic re-weights on its own.
 */
export default function ProductGrid({
  products,
  featureFirst = false,
}: {
  products: Product[];
  featureFirst?: boolean;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line-strong bg-white/60 p-12 text-center text-mist-faint">
        Nothing here yet — new drops land weekly. Check back soon.
      </div>
    );
  }

  // Decide which cards get hero treatment. Cap it so the mosaic stays balanced.
  const maxFeatures = products.length >= 6 ? 2 : products.length >= 3 ? 1 : 0;
  let used = 0;
  const isFeature = (p: Product, i: number) => {
    if (used >= maxFeatures) return false;
    const promote = p.featured || (featureFirst && i === 0);
    if (promote) {
      used += 1;
      return true;
    }
    return false;
  };

  return (
    <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} feature={isFeature(p, i)} />
      ))}
    </div>
  );
}
