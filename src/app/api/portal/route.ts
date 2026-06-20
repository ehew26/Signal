import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe Billing Portal session so a customer can update payment
 * details, change plan, or cancel — entirely self-serve, no human needed.
 *
 * Body: { email: string }
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 422 });
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "No subscription found for that email." },
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${siteUrl()}/billing`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[portal] failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not open billing portal." },
      { status: 500 }
    );
  }
}
