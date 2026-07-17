import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getByCategory } from "@/lib/catalog";
import { CATEGORY_META, type Category } from "@/lib/products";
import ShopBrowser from "@/components/store/ShopBrowser";
import Recommendations from "@/components/store/Recommendations";

const VALID = Object.keys(CATEGORY_META) as Category[];

export function generateStaticParams() {
  return VALID.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const meta = CATEGORY_META[params.slug as Category];
  if (!meta) return { title: "Collection" };
  return { title: meta.label, description: meta.blurb };
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as Category;
  const meta = CATEGORY_META[slug];
  if (!meta) notFound();

  const [items, all] = await Promise.all([getByCategory(slug), getProducts()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{meta.emoji}</span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
              {meta.label}
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-lg text-[15px] text-mist-dim">{meta.blurb}</p>
        <div className="mt-8">
          <ShopBrowser products={items} initialCategory={slug} />
        </div>
      </section>
      <Recommendations products={all} exclude={items.map((p) => p.slug)} title="From other rituals" />
    </>
  );
}
