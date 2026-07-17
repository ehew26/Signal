import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { CATEGORY_META, type Category } from "@/lib/products";
import { store } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const BASE = store.url;

  const staticRoutes = ["", "/shop", "/cart", "/legal/privacy", "/legal/terms"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const categoryRoutes = (Object.keys(CATEGORY_META) as Category[]).map((c) => ({
    url: `${BASE}/collections/${c}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
