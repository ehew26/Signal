import Stripe from "stripe";

/**
 * Stripe integration for Vertex AI's self-serve subscriptions.
 *
 * Design goals:
 * - Zero dashboard setup. The moment STRIPE_SECRET_KEY is present, the app
 *   auto-creates the Products + Prices in Stripe (idempotently, keyed by
 *   `lookup_key`) the first time someone checks out. No copy-pasting price IDs.
 * - Graceful degradation. With no key configured, getStripe() returns null and
 *   callers fall back to the "Talk to us" contact flow, so the site never breaks.
 *
 * You can still override the auto-created prices by setting STRIPE_PRICE_<PLAN>
 * to an existing Stripe price ID.
 */

/** A self-serve, subscribable plan. Mirrors the marketing copy in data.ts. */
export type CheckoutPlan = {
  /** Stable id used in the API + as the Stripe lookup_key. */
  id: "starter" | "growth";
  name: string;
  /** Amount in cents, billed monthly. */
  amount: number;
  /** Marketing description shown on the Stripe Checkout page. */
  description: string;
};

export const CHECKOUT_PLANS: Record<CheckoutPlan["id"], CheckoutPlan> = {
  starter: {
    id: "starter",
    name: "Vertex AI — Starter",
    amount: 29900,
    description:
      "AI chatbot, instant lead capture + text-back, lead alerts. Setup done for you.",
  },
  growth: {
    id: "growth",
    name: "Vertex AI — Growth",
    amount: 59900,
    description:
      "Everything in Starter plus booking + reminders, automated follow-up, and review automation.",
  },
};

let _stripe: Stripe | null | undefined;

/** Returns a configured Stripe client, or null when no secret key is set. */
export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  _stripe = key ? new Stripe(key) : null;
  return _stripe;
}

const _priceCache = new Map<string, string>();

/**
 * Resolves the Stripe Price ID for a plan, creating the Product + Price on
 * first use. Idempotent: a `lookup_key` ensures we never create duplicates,
 * even across cold starts / multiple instances.
 */
export async function ensurePrice(plan: CheckoutPlan): Promise<string> {
  const cached = _priceCache.get(plan.id);
  if (cached) return cached;

  // Explicit override wins.
  const override = process.env[`STRIPE_PRICE_${plan.id.toUpperCase()}`];
  if (override) {
    _priceCache.set(plan.id, override);
    return override;
  }

  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");

  const lookupKey = `vertex_${plan.id}_monthly`;

  const existing = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  if (existing.data[0]) {
    _priceCache.set(plan.id, existing.data[0].id);
    return existing.data[0].id;
  }

  const product = await stripe.products.create({
    name: plan.name,
    description: plan.description,
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.amount,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: lookupKey,
  });
  _priceCache.set(plan.id, price.id);
  return price.id;
}

/** Absolute site URL for building Stripe redirect targets. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://getvertex.vercel.app"
  );
}
