import Stripe from "stripe";
import { store } from "@/lib/store";

/**
 * Stripe integration for the Lumé storefront.
 *
 * Design goals:
 * - Zero dashboard setup. We build Checkout Sessions with inline `price_data`
 *   from our own catalog, so there are no Stripe Products/Prices to pre-create
 *   or copy-paste. Add a product to the catalog and it's instantly buyable.
 * - Graceful degradation. With no key configured, getStripe() returns null and
 *   the UI falls back to "saved to your bag", so the site never hard-breaks.
 */

let _stripe: Stripe | null | undefined;

/** Returns a configured Stripe client, or null when no secret key is set. */
export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  _stripe = key ? new Stripe(key) : null;
  return _stripe;
}

/** Absolute site URL for building Stripe redirect targets. */
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || store.url;
}
