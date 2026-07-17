"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { store } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductMedia from "./ProductMedia";

export default function CartDrawer() {
  const { lines, open, setOpen, subtotalCents, count, remove, setQty } = useCart();
  const [loading, setLoading] = useState(false);

  const remaining = Math.max(0, store.freeShippingThreshold - subtotalCents);
  const pct = Math.min(100, (subtotalCents / store.freeShippingThreshold) * 100);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else if (data.error === "not_configured") {
        alert(
          "Checkout isn't wired to Stripe yet. Add STRIPE_SECRET_KEY to go live — your bag is saved."
        );
      } else {
        alert("Something went wrong starting checkout. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-mist/25 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-ink shadow-float transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping bag"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-mist">
            <ShoppingBag className="h-5 w-5" /> Your bag {count > 0 && `(${count})`}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-full text-mist-dim hover:bg-ink-2"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-2 text-2xl">🛍️</div>
            <p className="text-mist-dim">Your bag is empty.</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-mist px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="px-5 pt-4">
              <p className="text-[13px] text-mist-dim">
                {remaining > 0 ? (
                  <>
                    You&rsquo;re <span className="font-semibold text-mist">{formatPrice(remaining)}</span>{" "}
                    away from free shipping
                  </>
                ) : (
                  <span className="font-semibold text-emerald">You&rsquo;ve unlocked free shipping ✨</span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-2">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
                  <Link
                    href={`/product/${l.slug}`}
                    onClick={() => setOpen(false)}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                  >
                    <ProductMedia hue={l.hue} emoji={l.emoji} accent={l.accent} name={l.name} size="sm" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${l.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-semibold leading-tight text-mist hover:underline"
                      >
                        {l.name}
                      </Link>
                      <button
                        onClick={() => remove(l.id)}
                        className="text-mist-faint hover:text-rose"
                        aria-label={`Remove ${l.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="mt-0.5 text-[13px] text-mist-dim">{formatPrice(l.priceCents)}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full ring-1 ring-line">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="grid h-8 w-8 place-items-center text-mist-dim hover:text-mist"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-mist">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="grid h-8 w-8 place-items-center text-mist-dim hover:text-mist"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-mist">
                        {formatPrice(l.priceCents * l.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-mist-dim">Subtotal</span>
                <span className="text-lg font-semibold text-mist">{formatPrice(subtotalCents)}</span>
              </div>
              <button
                onClick={checkout}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-mist py-3.5 text-sm font-semibold text-white transition hover:bg-mist/90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Starting checkout…
                  </>
                ) : (
                  <>Checkout · {formatPrice(subtotalCents)}</>
                )}
              </button>
              <p className="mt-2 text-center text-[12px] text-mist-faint">
                Secure checkout · {store.promises[1].label}
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
