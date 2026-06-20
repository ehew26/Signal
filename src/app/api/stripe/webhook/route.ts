import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";
import { sendEmail, welcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
// Stripe signature verification needs the raw, unparsed request body.
export const runtime = "nodejs";

/**
 * Stripe webhook — the heart of the automated revenue loop.
 *
 * On `checkout.session.completed` we:
 *   1. Upsert the customer + subscription into Supabase (service role).
 *   2. Send an automated welcome / onboarding email (Resend, if configured).
 *   3. Notify the team in Slack (if SLACK_LEADS_WEBHOOK_URL is set).
 *
 * On subscription updates / cancellations we keep our records in sync so the
 * dashboard and billing portal always reflect reality.
 *
 * Configure STRIPE_WEBHOOK_SECRET (from the Stripe dashboard) to enable
 * signature verification. The endpoint to register is:
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
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(stripe, event);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await onSubscriptionChanged(event);
        break;
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error(`[webhook] handler error for ${event.type}:`, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onCheckoutCompleted(stripe: Stripe, event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "subscription") return;

  const email =
    session.customer_details?.email || session.customer_email || "";
  const name = session.customer_details?.name || undefined;
  const plan = (session.metadata?.plan as string) || "subscription";
  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const db = getServiceSupabase();
  if (db) {
    // Idempotency: skip if we've already processed this event.
    const { data: seen } = await db
      .from("billing_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (seen) return;

    let customerId: string | undefined;
    if (email) {
      const { data: customer } = await db
        .from("customers")
        .upsert(
          { email, name, stripe_customer_id: stripeCustomerId, status: "active" },
          { onConflict: "email" }
        )
        .select("id")
        .single();
      customerId = customer?.id;
    }

    await db.from("subscriptions").upsert(
      {
        customer_id: customerId,
        email,
        plan,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status: "active",
      },
      { onConflict: "stripe_subscription_id" }
    );

    await db.from("billing_events").insert({
      stripe_event_id: event.id,
      type: event.type,
      email,
      payload: { plan, amount_total: session.amount_total },
    });
  } else {
    console.warn(
      "[webhook] VERTEX_SUPABASE_SERVICE_ROLE_KEY unset — subscription not persisted."
    );
  }

  // Automated onboarding email.
  if (email) {
    const tmpl = welcomeEmail({ name, plan: planLabel(plan) });
    await sendEmail({ to: email, subject: tmpl.subject, html: tmpl.html, text: tmpl.text });
  }

  await notifySlack(
    `:moneybag: *New paying customer!* ${name || email || "Unknown"} subscribed to *${planLabel(
      plan
    )}*` + (session.amount_total ? ` ($${(session.amount_total / 100).toFixed(0)}/mo)` : "")
  );
}

async function onSubscriptionChanged(event: Stripe.Event) {
  const sub = event.data.object as Stripe.Subscription;
  const db = getServiceSupabase();
  if (!db) return;

  const status =
    event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  await db
    .from("subscriptions")
    .update({ status, current_period_end: periodEnd, updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", sub.id);

  if (status === "canceled") {
    await notifySlack(`:wave: A subscription was canceled (${sub.id}).`);
  }
}

function planLabel(plan: string): string {
  if (plan === "starter") return "Starter";
  if (plan === "growth") return "Growth";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

async function notifySlack(text: string) {
  const webhook = process.env.SLACK_LEADS_WEBHOOK_URL;
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
