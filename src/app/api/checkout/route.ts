import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { getProducts } from "@/lib/catalog";
import { store } from "@/lib/store";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

/**
 * Creates a Stripe Checkout Session (one-time payment) for a cart and returns
 * the hosted URL. Prices are resolved server-side from our own catalog so the
 * client can never tamper with amounts.
 *
 * Body: { items: [{ slug: string, qty: number }] }
 */
export async function POST(request: Request) {
  const rate = await checkRateLimit("checkout", clientIp(request), {
    requests: 20,
    window: "1 h",
  });
  if (!rate.success) return tooManyRequests(rate.retryAfterSeconds);

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: { items?: { slug?: string; qty?: number }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const items = (body.items ?? []).filter((i) => i.slug && (i.qty ?? 0) > 0);
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "Your bag is empty." }, { status: 422 });
  }

  const catalog = await getProducts();
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));

  const line_items: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description?: string };
    };
  }[] = [];

  for (const item of items) {
    const product = bySlug.get(item.slug!);
    if (!product) continue;
    line_items.push({
      quantity: Math.min(item.qty!, 20),
      price_data: {
        currency: "usd",
        unit_amount: product.priceCents,
        product_data: {
          name: product.name,
          description: product.tagline,
        },
      },
    });
  }

  if (line_items.length === 0) {
    return NextResponse.json({ ok: false, error: "No valid items." }, { status: 422 });
  }

  const subtotal = line_items.reduce(
    (sum, l) => sum + l.price_data.unit_amount * l.quantity,
    0
  );
  const freeShip = subtotal >= store.freeShippingThreshold;

  try {
    const base = siteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: freeShip ? "Free shipping" : "Standard shipping",
            fixed_amount: {
              amount: freeShip ? 0 : store.shippingFlat,
              currency: "usd",
            },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      success_url: `${base}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/shop`,
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
