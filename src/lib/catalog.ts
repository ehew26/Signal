/**
 * Catalog access layer.
 *
 * Runtime priority:
 *   1. Supabase `products` table (if reachable + non-empty) — lets you add a
 *      product live, no redeploy, and the site updates on next request.
 *   2. The `PRODUCTS` seed in products.ts — always present, zero-config.
 *
 * Everything else in the app reads products through here, so the two sources
 * are interchangeable and the storefront never breaks.
 */
import { getSupabase } from "@/lib/supabase";
import {
  PRODUCTS,
  CATEGORY_META,
  type Product,
  type Category,
} from "@/lib/products";

/** Shape a raw Supabase row into a Product, tolerating snake_case columns. */
function rowToProduct(r: Record<string, any>): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    category: (r.category ?? "wellness") as Category,
    tags: r.tags ?? [],
    priceCents: r.price_cents ?? r.priceCents ?? 0,
    compareAtCents: r.compare_at_cents ?? r.compareAtCents ?? undefined,
    rating: r.rating ?? 4.6,
    reviews: r.reviews ?? 0,
    badges: r.badges ?? [],
    benefits: r.benefits ?? [],
    howToUse: r.how_to_use ?? r.howToUse ?? "",
    hue: r.hue ?? 260,
    emoji: r.emoji ?? "✨",
    accent: r.accent ?? "#a78bfa",
    image: r.image ?? undefined,
    featured: r.featured ?? false,
    viral: r.viral ?? false,
    inStock: r.in_stock ?? r.inStock ?? true,
  };
}

// Cache within a single server render pass to avoid duplicate round-trips.
let _memo: { at: number; data: Product[] } | null = null;
const TTL_MS = 30_000;

export async function getProducts(): Promise<Product[]> {
  if (_memo && Date.now() - _memo.at < TTL_MS) return _memo.data;
  let data = PRODUCTS;
  const supabase = getSupabase();
  if (supabase) {
    try {
      const res = await supabase
        .from("products")
        .select("*")
        .order("featured", { ascending: false });
      if (!res.error && res.data && res.data.length > 0) {
        data = res.data.map(rowToProduct);
      }
    } catch {
      // fall through to seed
    }
  }
  _memo = { at: Date.now(), data };
  return data;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function getFeatured(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length ? featured : all.slice(0, 3);
}

export async function getViral(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.viral);
}

export async function getBestsellers(): Promise<Product[]> {
  const all = await getProducts();
  return [...all].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
}

/** Categories that actually have products, in a stable order. */
export async function getActiveCategories(): Promise<
  { key: Category; label: string; blurb: string; emoji: string; count: number }[]
> {
  const all = await getProducts();
  const order: Category[] = [
    "skincare-tools",
    "led-therapy",
    "hair-scalp",
    "body-recovery",
    "wellness",
  ];
  return order
    .map((key) => {
      const count = all.filter((p) => p.category === key).length;
      return { key, ...CATEGORY_META[key], count };
    })
    .filter((c) => c.count > 0);
}

export async function getByCategory(category: Category): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.category === category);
}

/**
 * Content-based "you may also like": score other products by shared category
 * and overlapping tags. Deterministic, no user state required.
 */
export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const anchor = all.find((p) => p.slug === slug);
  if (!anchor) return all.slice(0, limit);
  const tagset = new Set(anchor.tags);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === anchor.category) score += 3;
      score += p.tags.filter((t) => tagset.has(t)).length;
      if (p.viral) score += 0.5;
      score += p.rating / 10;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export { CATEGORY_META };
export type { Product, Category };
