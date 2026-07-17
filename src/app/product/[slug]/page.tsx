import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Check, Truck, RotateCcw, Leaf } from "lucide-react";
import { getProducts, getProduct, getRelated } from "@/lib/catalog";
import { CATEGORY_META } from "@/lib/products";
import { store } from "@/lib/store";
import { formatPrice, formatNumber } from "@/lib/utils";
import ProductMedia from "@/components/store/ProductMedia";
import ProductGrid from "@/components/store/ProductGrid";
import BuyBox from "@/components/store/BuyBox";
import ShareButton from "@/components/store/ShareButton";
import Recommendations from "@/components/store/Recommendations";
import ViewTracker from "@/components/store/ViewTracker";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`.slice(0, 155),
    openGraph: {
      title: `${product.name} · ${store.name}`,
      description: product.tagline,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const [related, all] = await Promise.all([getRelated(product.slug), getProducts()]);
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : 0;
  const cat = CATEGORY_META[product.category];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: store.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <ViewTracker slug={product.slug} category={product.category} tags={product.tags} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav className="text-[13px] text-mist-faint">
          <Link href="/shop" className="hover:text-mist">
            Shop
          </Link>
          <span className="mx-1.5">/</span>
          <Link href={`/collections/${product.category}`} className="hover:text-mist">
            {cat.label}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-mist-dim">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-8 sm:px-6 md:grid-cols-2">
        {/* Media */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-float ring-1 ring-line">
            <ProductMedia
              hue={product.hue}
              emoji={product.emoji}
              accent={product.accent}
              image={product.image}
              name={product.name}
              size="lg"
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-rose px-3 py-1.5 text-[13px] font-semibold text-white">
                Save {discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span
                key={b}
                className="rounded-full bg-ink-2 px-3 py-1 text-[12px] font-semibold text-violet"
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-[17px] text-mist-dim">{product.tagline}</p>

          <div className="mt-3 flex items-center gap-2 text-[14px]">
            <span className="inline-flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(product.rating)
                      ? "h-4 w-4 fill-amber text-amber"
                      : "h-4 w-4 text-mist-faint/40"
                  }
                />
              ))}
            </span>
            <span className="font-medium text-mist">{product.rating.toFixed(1)}</span>
            <span className="text-mist-faint">· {formatNumber(product.reviews)} reviews</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-mist">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-lg text-mist-faint line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-mist-dim">{product.description}</p>

          {/* Benefits */}
          <ul className="mt-6 space-y-2.5">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[15px] text-mist">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald/15 text-emerald">
                  <Check className="h-3 w-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          {/* Buy */}
          <div className="mt-7">
            <BuyBox
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                emoji: product.emoji,
                accent: product.accent,
                hue: product.hue,
              }}
            />
            <div className="mt-3">
              <ShareButton
                url={`/product/${product.slug}`}
                title={`${product.name} — ${store.name}`}
                text={product.tagline}
                label="Share this find"
                className="w-full"
              />
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
            <TrustItem icon={<Truck className="h-4 w-4" />} label="Free over $50" />
            <TrustItem icon={<RotateCcw className="h-4 w-4" />} label="30-day returns" />
            <TrustItem icon={<Leaf className="h-4 w-4" />} label="Cruelty-free" />
          </div>

          {/* How to use */}
          <div className="mt-6 rounded-2xl bg-ink-2 p-5">
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-mist-faint">
              How to use
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-mist-dim">{product.howToUse}</p>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-semibold text-mist sm:text-3xl">
            Pairs well with
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Personalized */}
      <Recommendations products={all} exclude={[product.slug]} title="Based on what you're viewing" />
    </>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-[12px] text-mist-dim">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-violet ring-1 ring-line">
        {icon}
      </span>
      {label}
    </div>
  );
}
