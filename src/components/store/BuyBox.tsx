"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

type P = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  emoji: string;
  accent: string;
  hue: number;
};

export default function BuyBox({ product }: { product: P }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const line = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.priceCents,
    emoji: product.emoji,
    accent: product.accent,
    hue: product.hue,
  };

  function addToBag() {
    add(line, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function buyNow() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ slug: product.slug, qty }] }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else if (data.error === "not_configured") {
        add(line, qty);
        alert("Checkout isn't connected to Stripe yet — I added it to your bag instead.");
      } else {
        alert("Couldn't start checkout. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-line bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-11 w-11 place-items-center text-mist-dim hover:text-mist"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-semibold text-mist">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="grid h-11 w-11 place-items-center text-mist-dim hover:text-mist"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={addToBag}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-mist bg-white px-6 py-3.5 text-sm font-semibold text-mist transition hover:bg-ink-2"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </>
          )}
        </button>
      </div>
      <button
        onClick={buyNow}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-mist px-6 py-4 text-sm font-semibold text-white shadow-lift transition hover:bg-mist/90 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Starting checkout…
          </>
        ) : (
          <>Buy now · {formatPrice(product.priceCents * qty)}</>
        )}
      </button>
    </div>
  );
}
