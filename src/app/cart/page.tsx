"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { store } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductMedia from "@/components/store/ProductMedia";

export default function CartPage() {
  const { lines, subtotalCents, remove, setQty, count } = useCart();
  const [loading, setLoading] = useState(false);

  const remaining = Math.max(0, store.freeShippingThreshold - subtotalCents);
  const shipping = subtotalCents >= store.freeShippingThreshold || subtotalCents === 0 ? 0 : store.shippingFlat;

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const data = await res.json();
      if (data.ok && data.url) window.location.href = data.url;
      else if (data.error === "not_configured")
        alert("Checkout isn't connected to Stripe yet. Add STRIPE_SECRET_KEY to go live.");
      else alert("Couldn't start checkout. Please try again.");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
        Your bag
      </h1>

      {lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-line bg-white py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-2 text-2xl">🛍️</div>
          <p className="text-mist-dim">Your bag is empty.</p>
          <Link
            href="/shop"
            className="rounded-full bg-mist px-6 py-3 text-sm font-semibold text-white transition hover:bg-mist/90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Lines */}
          <div className="space-y-3">
            {lines.map((l) => (
              <div key={l.id} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                <Link href={`/product/${l.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <ProductMedia hue={l.hue} emoji={l.emoji} accent={l.accent} name={l.name} size="sm" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/product/${l.slug}`} className="font-semibold text-mist hover:underline">
                      {l.name}
                    </Link>
                    <button
                      onClick={() => remove(l.id)}
                      className="text-mist-faint transition hover:text-rose"
                      aria-label={`Remove ${l.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="mt-1 text-[14px] text-mist-dim">{formatPrice(l.priceCents)} each</span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-full ring-1 ring-line">
                      <button
                        onClick={() => setQty(l.id, l.qty - 1)}
                        className="grid h-9 w-9 place-items-center text-mist-dim hover:text-mist"
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-mist">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.id, l.qty + 1)}
                        className="grid h-9 w-9 place-items-center text-mist-dim hover:text-mist"
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-mist">{formatPrice(l.priceCents * l.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-line lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-mist">Summary</h2>
            {remaining > 0 && (
              <div className="mt-3 rounded-xl bg-ink-2 px-3 py-2 text-[13px] text-mist-dim">
                Add <span className="font-semibold text-mist">{formatPrice(remaining)}</span> for free
                shipping.
              </div>
            )}
            <dl className="mt-4 space-y-2 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-mist-dim">Subtotal ({count})</dt>
                <dd className="font-medium text-mist">{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist-dim">Shipping</dt>
                <dd className="font-medium text-mist">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-3 text-[16px]">
                <dt className="font-semibold text-mist">Total</dt>
                <dd className="font-semibold text-mist">{formatPrice(subtotalCents + shipping)}</dd>
              </div>
            </dl>
            <button
              onClick={checkout}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-mist py-3.5 text-sm font-semibold text-white transition hover:bg-mist/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Starting…
                </>
              ) : (
                <>
                  Checkout <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[12px] text-mist-faint">
              Secure payment · {store.promises[1].label}
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
