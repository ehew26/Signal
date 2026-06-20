import { NextResponse } from "next/server";
import {
  CHECKOUT_PLANS,
  ensurePrice,
  getStripe,
  siteUrl,
  type CheckoutPlan,
} from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe Checkout Session for a self-serve subscription and returns
 * its hosted URL. The browser then redirects the customer to Stripe.
 *
 * Body: { planId: "starter" | "growth", email?: string }
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    // Stripe not configured yet — tell the client to fall back to contact.
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 }
    );
  }

  let body: { planId?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const planId = body.planId as CheckoutPlan["id"];
  const plan = CHECKOUT_PLANS[planId];
  if (!plan) {
    return NextResponse.json({ ok: false, error: "Unknown plan." }, { status: 422 });
  }

  try {
    const price = await ensurePrice(plan);
    const base = siteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      customer_email: body.email || undefined,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${base}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/#pricing`,
      subscription_data: { metadata: { plan: plan.id } },
      metadata: { plan: plan.id },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[checkout] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
