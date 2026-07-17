"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { recommend, recommendReason } from "@/lib/recommend";
import ProductCard from "./ProductCard";

/**
 * Personalized "for you" rail. Re-ranks the catalog against the shopper's local
 * signals (views, category/tag affinity). Renders on the client so it reflects
 * this exact person, and only mounts after hydration to avoid SSR mismatch.
 */
export default function Recommendations({
  products,
  exclude = [],
  title,
  limit = 4,
}: {
  products: Product[];
  exclude?: string[];
  title?: string;
  limit?: number;
}) {
  const { signals, lines } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const picks = useMemo(() => {
    const inCart = lines.map((l) => l.slug);
    return recommend(products, signals, {
      exclude: [...exclude, ...inCart],
      limit,
    });
  }, [products, signals, lines, exclude, limit]);

  if (!mounted || picks.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-violet">
            <Sparkles className="h-4 w-4" /> {title ?? recommendReason(signals)}
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold text-mist sm:text-3xl">
            Picked for you
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {picks.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
