import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceSupabase } from "@/lib/supabase";
import { getProducts } from "@/lib/catalog";
import type { Category } from "@/lib/products";

export const dynamic = "force-dynamic";

/** GET — list current products (used by the admin dashboard). */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ ok: true, count: products.length, products });
}

/**
 * POST — add a product.
 *
 * If a Supabase service-role key is configured, we insert a row into the
 * `products` table and revalidate the storefront so the new product is live on
 * the next request — no redeploy. If it isn't configured, we return a ready-to-
 * paste catalog entry so you can drop it into src/lib/products.ts and commit.
 *
 * Protected by an ADMIN_TOKEN when set (sent as `x-admin-token`).
 */
export async function POST(request: Request) {
  const requiredToken = process.env.ADMIN_TOKEN;
  if (requiredToken) {
    const got = request.headers.get("x-admin-token");
    if (got !== requiredToken) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const errors: string[] = [];
  if (!body.name) errors.push("name is required");
  if (!body.priceCents || body.priceCents <= 0) errors.push("priceCents must be > 0");
  if (errors.length) {
    return NextResponse.json({ ok: false, error: errors.join(", ") }, { status: 422 });
  }

  const slug =
    body.slug ||
    String(body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const product = {
    id: body.id || `p-${slug}`,
    slug,
    name: body.name,
    tagline: body.tagline || "",
    description: body.description || "",
    category: (body.category || "wellness") as Category,
    tags: Array.isArray(body.tags)
      ? body.tags
      : String(body.tags || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
    priceCents: Number(body.priceCents),
    compareAtCents: body.compareAtCents ? Number(body.compareAtCents) : undefined,
    rating: body.rating ? Number(body.rating) : 4.7,
    reviews: body.reviews ? Number(body.reviews) : 0,
    badges: Array.isArray(body.badges)
      ? body.badges
      : String(body.badges || "")
          .split(",")
          .map((b: string) => b.trim())
          .filter(Boolean),
    benefits: Array.isArray(body.benefits)
      ? body.benefits
      : String(body.benefits || "")
          .split("\n")
          .map((b: string) => b.trim())
          .filter(Boolean),
    howToUse: body.howToUse || "",
    hue: body.hue != null ? Number(body.hue) : Math.floor(Math.random() * 360),
    emoji: body.emoji || "✨",
    accent: body.accent || "#a78bfa",
    image: body.image || undefined,
    featured: Boolean(body.featured),
    viral: Boolean(body.viral),
    inStock: body.inStock === false ? false : true,
  };

  const db = getServiceSupabase();
  if (db) {
    const { error } = await db.from("products").insert({
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      category: product.category,
      tags: product.tags,
      price_cents: product.priceCents,
      compare_at_cents: product.compareAtCents ?? null,
      rating: product.rating,
      reviews: product.reviews,
      badges: product.badges,
      benefits: product.benefits,
      how_to_use: product.howToUse,
      hue: product.hue,
      emoji: product.emoji,
      accent: product.accent,
      image: product.image ?? null,
      featured: product.featured,
      viral: product.viral,
      in_stock: product.inStock,
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, hint: "Ensure the `products` table exists (see supabase/schema.sql)." },
        { status: 500 }
      );
    }
    // Push the change live everywhere the catalog is read.
    for (const path of ["/", "/shop", `/product/${product.slug}`, `/collections/${product.category}`]) {
      try {
        revalidatePath(path);
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json({
      ok: true,
      mode: "live",
      product,
      message: "Product added and storefront revalidated — it's live now.",
    });
  }

  // No DB configured — return a paste-ready seed entry.
  return NextResponse.json({
    ok: true,
    mode: "snippet",
    product,
    message:
      "No Supabase service key configured. Paste this entry into the PRODUCTS array in src/lib/products.ts and commit to publish.",
    snippet: seedSnippet(product),
  });
}

function seedSnippet(p: Record<string, any>): string {
  const j = (v: unknown) => JSON.stringify(v);
  return `  {
    id: ${j(p.id)},
    slug: ${j(p.slug)},
    name: ${j(p.name)},
    tagline: ${j(p.tagline)},
    description: ${j(p.description)},
    category: ${j(p.category)},
    tags: ${j(p.tags)},
    priceCents: ${p.priceCents},${p.compareAtCents ? `\n    compareAtCents: ${p.compareAtCents},` : ""}
    rating: ${p.rating},
    reviews: ${p.reviews},
    badges: ${j(p.badges)},
    benefits: ${j(p.benefits)},
    howToUse: ${j(p.howToUse)},
    hue: ${p.hue},
    emoji: ${j(p.emoji)},
    accent: ${j(p.accent)},
    featured: ${p.featured},
    viral: ${p.viral},
  },`;
}
