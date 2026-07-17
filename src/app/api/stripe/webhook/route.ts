import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
// Stripe signature verification needs the raw, unparsed request body.
export const runtime = "nodejs";

/**
 * Stripe webhook — closes the automated revenue loop for the store.
 *
 * On `checkout.session.completed` (one-time payment) we:
 *   1. Record the order in Supabase (service role) if configured — idempotent.
 *   2. Ping Slack (if SLACK_ORDERS_WEBHOOK_URL is set) so every sale hits your
 *      phone.
 *
 * Configure STRIPE_WEBHOOK_SECRET (from the Stripe dashboard) to enable
 * signature verification. Register this endpoint:
 *   https://<your-domain>/api/stripe/webhook
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  const raw = await request.text();
  if (!sig) {
    return NextResponse.json({ ok: false, error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await onOrderCompleted(stripe, event);
    }
  } catch (err) {
    console.error(`[webhook] handler error for ${event.type}:`, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onOrderCompleted(stripe: Stripe, event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "payment") return;

  const email = session.customer_details?.email || session.customer_email || "";
  const name = session.customer_details?.name || undefined;
  const amount = session.amount_total ?? 0;

  const db = getServiceSupabase();
  if (db) {
    // Idempotency: skip if we've already processed this event.
    const { data: seen } = await db
      .from("orders")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (seen) return;

    let items: unknown = null;
    try {
      const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 });
      items = li.data.map((l) => ({
        name: l.description,
        qty: l.quantity,
        amount: l.amount_total,
      }));
    } catch {
      /* best-effort */
    }

    await db.from("orders").insert({
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      email,
      name,
      amount_total: amount,
      currency: session.currency,
      status: "paid",
      items,
    });
  } else {
    console.warn("[webhook] service-role key unset — order not persisted.");
  }

  await notifySlack(
    `:moneybag: *New order!* ${name || email || "A customer"} just paid ` +
      `$${(amount / 100).toFixed(2)}.`
  );
}

async function notifySlack(text: string) {
  const webhook =
    process.env.SLACK_ORDERS_WEBHOOK_URL || process.env.SLACK_LEADS_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("[webhook] slack notify failed:", err);
  }
}
