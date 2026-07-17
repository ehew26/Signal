"use client";

import { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    emoji: string;
    accent: string;
    hue: number;
  };
  variant?: "full" | "icon";
  qty?: number;
  className?: string;
};

export default function AddToCart({ product, variant = "full", qty = 1, className }: Props) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  function handleAdd() {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        emoji: product.emoji,
        accent: product.accent,
        hue: product.hue,
      },
      qty
    );
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${product.name} to bag`}
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full bg-mist text-white shadow-lift transition active:scale-90 hover:scale-105",
          className
        )}
      >
        {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-mist px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition active:scale-[0.98] hover:bg-mist/90",
        className
      )}
    >
      {done ? (
        <>
          <Check className="h-4 w-4" /> Added to bag
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Add to bag
        </>
      )}
    </button>
  );
}
