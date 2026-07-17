/**
 * Central brand + store configuration for Lumé.
 *
 * Single source of truth for everything that isn't a product: brand name,
 * voice, contact, social, shipping promises, and the money target that drives
 * the growth math. Change it here and it flows through the whole site.
 */

export const store = {
  name: "Lumé",
  legalName: "Lumé Beauty Co.",
  tagline: "Glow, engineered.",
  /** One-liner used in hero + meta. */
  promise: "Clinically-minded beauty & wellness tools, curated for people who actually use them.",
  email: "hello@lume.store",
  supportEmail: "care@lume.store",
  /** Public site URL — override in prod with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://lume-store.vercel.app",
  currency: "USD",
  founded: 2026,
  social: {
    instagram: "https://instagram.com/lume.store",
    tiktok: "https://tiktok.com/@lume.store",
    pinterest: "https://pinterest.com/lume_store",
  },
  /** Shown as trust badges across the store. */
  promises: [
    { label: "Free shipping", detail: "On orders over $50" },
    { label: "30-day glow guarantee", detail: "Love it or your money back" },
    { label: "Cruelty-free", detail: "Never tested on animals" },
    { label: "Fast dispatch", detail: "Ships within 48 hours" },
  ],
  /** Free-shipping threshold in cents. Powers the cart progress bar. */
  freeShippingThreshold: 5000,
  /** Flat shipping in cents when under threshold. */
  shippingFlat: 495,
} as const;

export type Store = typeof store;
