# Turning on the money machine — Stripe activation

The self-serve subscription system is fully built. To start collecting real
money, do these **one-time** steps. Total time: ~15 minutes.

The site works the whole time without these — until Stripe is connected, the
"Start Starter / Growth" buttons gracefully send people to the contact page
instead of crashing.

---

## What's already built (no action needed)

- **Pricing buttons** start a Stripe Checkout session (`/api/checkout`).
- **Products & prices auto-create themselves** in Stripe the first time someone
  checks out — you do *not* need to set anything up in the Stripe dashboard.
- **Webhook** (`/api/stripe/webhook`) records every sale in Supabase, sends the
  customer an automated welcome/onboarding email, and pings your Slack.
- **Billing portal** (`/billing`) lets customers update their card, change plan,
  or cancel — entirely self-serve.
- **Welcome page** (`/welcome`) greets new customers after payment.
- **Dashboard** shows a live count of active paying subscriptions.

---

## Step 1 — Create a Stripe account
Go to https://stripe.com and sign up (free). Add your bank details so you can
receive payouts. You can do everything else in **test mode** first.

## Step 2 — Get your secret key
Stripe Dashboard → **Developers → API keys** → copy the **Secret key**
(`sk_live_...` for real money, `sk_test_...` to test first).

## Step 3 — Add the webhook
Stripe Dashboard → **Developers → Webhooks → Add endpoint**:
- **Endpoint URL:** `https://YOUR-DOMAIN/api/stripe/webhook`
- **Events to send:** `checkout.session.completed`,
  `customer.subscription.updated`, `customer.subscription.deleted`
- After creating it, copy the **Signing secret** (`whsec_...`).

## Step 4 — Add the env vars in Vercel
Vercel → your project → **Settings → Environment Variables**. Add:

| Name | Value |
| ---- | ----- |
| `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `VERTEX_SUPABASE_SERVICE_ROLE_KEY` | from Supabase → Settings → API → service_role (so the webhook can save customers) |
| `NEXT_PUBLIC_SITE_URL` | your real domain, e.g. `https://yourdomain.com` |

Then **redeploy** (Vercel → Deployments → Redeploy) so the vars take effect.

## Step 5 (optional) — Automated welcome emails
To send branded onboarding emails automatically on every sale:
1. Sign up at https://resend.com (free tier is generous).
2. Verify your domain in Resend.
3. Add in Vercel: `RESEND_API_KEY` and `EMAIL_FROM`
   (e.g. `Vertex AI <hello@yourdomain.com>`), then redeploy.

Without this, sales still work and are recorded — the email step is just skipped.

---

## Test it before going live
1. Use your **test** secret key (`sk_test_...`) and a test webhook.
2. Click a pricing button on the site → use Stripe's test card
   `4242 4242 4242 4242`, any future expiry, any CVC.
3. You should land on `/welcome`, get a record in Supabase (`subscriptions`
   table), a Slack ping, and a welcome email (if Resend is set up).
4. When it all works, swap the test keys for **live** keys and redeploy.

---

## Changing prices
Edit `CHECKOUT_PLANS` in `src/lib/stripe.ts` (and the display copy in
`src/lib/data.ts`). To change an *existing* plan's price, either set
`STRIPE_PRICE_STARTER` / `STRIPE_PRICE_GROWTH` to a new Stripe price ID, or
change the `lookup_key` so a fresh price is auto-created.
