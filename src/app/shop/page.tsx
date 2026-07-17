import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import ShopBrowser from "@/components/store/ShopBrowser";
import Recommendations from "@/components/store/Recommendations";

export const metadata: Metadata = {
  title: "Shop all",
  description: "The full Lumé edit — beauty & wellness tools, ranked by what's working.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
          Shop all
        </h1>
        <p className="mt-2 max-w-lg text-[15px] text-mist-dim">
          Every tool in the collection. Filter by ritual, sort by what&rsquo;s trending.
        </p>
        <div className="mt-8">
          <ShopBrowser products={products} />
        </div>
      </section>
      <Recommendations products={products} title="You might also love" />
    </>
  );
}
