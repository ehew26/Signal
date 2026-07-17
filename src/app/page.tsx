import Link from "next/link";
import { ArrowRight, Flame, Star, Truck, ShieldCheck, Sparkles, Leaf } from "lucide-react";
import {
  getProducts,
  getFeatured,
  getViral,
  getActiveCategories,
} from "@/lib/catalog";
import { store } from "@/lib/store";
import { formatNumber } from "@/lib/utils";
import ProductGrid from "@/components/store/ProductGrid";
import ProductMedia from "@/components/store/ProductMedia";
import Recommendations from "@/components/store/Recommendations";
import Reveal from "@/components/Reveal";

export default async function HomePage() {
  const [products, featured, viral, categories] = await Promise.all([
    getProducts(),
    getFeatured(),
    getViral(),
    getActiveCategories(),
  ]);

  const hero = featured[0] ?? products[0];
  const totalReviews = products.reduce((n, p) => n + p.reviews, 0);
  const promiseIcons = [Truck, ShieldCheck, Leaf, Sparkles];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1.5 text-[13px] font-medium text-mist-dim backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" />
              Loved by {formatNumber(totalReviews, true)}+ glow-getters
            </div>
            <h1 className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.03] tracking-tight text-mist sm:text-6xl">
              Glow,
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">engineered.</span>
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mist-dim">
              {store.promise}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-mist px-7 py-4 text-sm font-semibold text-white shadow-lift transition hover:bg-mist/90"
              >
                Shop the edit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/collections/led-therapy"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-7 py-4 text-sm font-semibold text-mist transition hover:border-line-strong"
              >
                Explore LED therapy
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-mist-faint">
              {store.promises.map((p) => (
                <span key={p.label} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Hero product visual */}
          {hero && (
            <Reveal className="relative">
              <Link href={`/product/${hero.slug}`} className="group relative block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-float ring-1 ring-line">
                  <ProductMedia
                    hue={hero.hue}
                    emoji={hero.emoji}
                    accent={hero.accent}
                    image={hero.image}
                    name={hero.name}
                    size="lg"
                    className="transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/80 p-4 backdrop-blur-md ring-1 ring-white/60">
                  <div>
                    <div className="text-[12px] font-medium uppercase tracking-wide text-violet">
                      {hero.badges[0] ?? "Featured"}
                    </div>
                    <div className="font-display text-lg font-semibold text-mist">{hero.name}</div>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-mist text-white transition group-hover:scale-105">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------- CATEGORY RAIL ---------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/collections/${c.key}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-5 text-center transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="text-3xl transition group-hover:scale-110">{c.emoji}</span>
              <span className="text-[13px] font-semibold text-mist">{c.label}</span>
              <span className="text-[12px] text-mist-faint">{c.count} products</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- TRENDING / VIRAL ---------- */}
      {viral.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-rose">
                <Flame className="h-4 w-4" /> Trending now
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold text-mist sm:text-3xl">
                Going viral this week
              </h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-mist-dim hover:text-mist sm:inline-flex">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={viral.slice(0, 8)} />
        </section>
      )}

      {/* ---------- FEATURED MOSAIC ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[13px] font-medium text-violet">
            <Sparkles className="h-4 w-4" /> The edit
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold text-mist sm:text-3xl">
            Handpicked, dynamically arranged
          </h2>
          <p className="mt-1 max-w-lg text-[15px] text-mist-dim">
            The grid re-weights itself around whatever we&rsquo;re hyping — add a product and the
            layout adapts on its own.
          </p>
        </div>
        <ProductGrid products={products.slice(0, 10)} featureFirst />
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-7 py-4 text-sm font-semibold text-mist transition hover:border-line-strong"
          >
            Shop all {products.length} products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---------- PERSONALIZED ---------- */}
      <Recommendations products={products} title="This week's most-loved" />

      {/* ---------- PROMISE STRIP ---------- */}
      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
          {store.promises.map((p, i) => {
            const Icon = promiseIcons[i % promiseIcons.length];
            return (
              <div key={p.label} className="flex flex-col items-center gap-2 text-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-violet ring-1 ring-line">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[14px] font-semibold text-mist">{p.label}</span>
                <span className="text-[13px] text-mist-faint">{p.detail}</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
