"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product, Category } from "@/lib/products";
import { CATEGORY_META } from "@/lib/products";
import ProductGrid from "./ProductGrid";
import { cn } from "@/lib/utils";

type SortKey = "trending" | "price-asc" | "price-desc" | "rating" | "new";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "rating", label: "Top rated" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "new", label: "Newest" },
];

export default function ShopBrowser({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory?: Category;
}) {
  const [cat, setCat] = useState<Category | "all">(initialCategory ?? "all");
  const [sort, setSort] = useState<SortKey>("trending");

  const cats = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return (Object.keys(CATEGORY_META) as Category[]).filter((c) => present.has(c));
  }, [products]);

  const filtered = useMemo(() => {
    let list = cat === "all" ? products : products.filter((p) => p.category === cat);
    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list.sort((a, b) => Number(b.badges.includes("New")) - Number(a.badges.includes("New")));
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.viral) - Number(a.viral) ||
            Number(b.featured) - Number(a.featured) ||
            b.reviews - a.reviews
        );
    }
    return list;
  }, [products, cat, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            All
          </FilterChip>
          {cats.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </FilterChip>
          ))}
        </div>
        <label className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-[14px] text-mist-dim">
          <SlidersHorizontal className="h-4 w-4" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent pr-1 font-medium text-mist outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-4 text-[13px] text-mist-faint">{filtered.length} products</p>
      <ProductGrid products={filtered} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[14px] font-medium transition",
        active
          ? "border-mist bg-mist text-white"
          : "border-line bg-white text-mist-dim hover:border-line-strong"
      )}
    >
      {children}
    </button>
  );
}
