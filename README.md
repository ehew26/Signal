# Lumé — automated beauty & wellness store

A sleek, modern, **fully self-contained** dropshipping storefront built for
virality and hands-off operation. Next.js 14 (App Router), TypeScript, Tailwind.
It runs with **zero configuration** — real products, a dynamic layout, a
personalized recommendation engine, cart, and a Stripe-ready checkout all work
out of the box. Add keys when you're ready to take money.

> **Glow, engineered.**

## Why it's low-maintenance

- **Add a product, the site updates itself.** The catalog is the single source
  of truth. Drop an entry in `src/lib/products.ts` (or a Supabase row) and the
  homepage mosaic, category pages, search/sort, recommendations, sitemap, and
  per-product pages all regenerate automatically.
- **The layout adapts.** The product grid re-weights itself around `featured`
  and `viral` items — hero cells, trending rails, and category counts are
  derived, never hand-placed.
- **No image assets to manage.** Every product renders its own on-brand gradient
  visual from a hue + emoji + accent. Looks designed on day one; swap in real
  photos (`image:` URL) anytime.

## Feature map

| Area | What's built |
| --- | --- |
| Storefront | Home, `/shop` (filter + sort), `/collections/[slug]`, `/product/[slug]` |
| Cart | Slide-out drawer + `/cart`, localStorage-persisted, free-shipping meter |
| Checkout | Stripe Checkout (one-time), server-priced, shipping + promo codes |
| Recommendations | On-device personalization from browsing signals — no accounts |
| Viral loops | Native share sheet on every product, per-page OG + SEO, shareable links |
| Automation | `/admin` add-product form → live via Supabase, or paste-ready snippet |
| Orders | Stripe webhook records orders + pings Slack on every sale |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

That's it — the full store runs on the seed catalog with no env vars.

## Going live (in order of impact)

1. **Take payments.** Set `STRIPE_SECRET_KEY`. Checkout goes live immediately —
   prices are built from your catalog, so there's nothing to configure in
   Stripe. Add `STRIPE_WEBHOOK_SECRET` (endpoint `/api/stripe/webhook`) to
   record orders and get a Slack ping on every sale.
2. **Set your domain.** `NEXT_PUBLIC_SITE_URL`.
3. **(Optional) Live catalog.** Run [`supabase/schema.sql`](./supabase/schema.sql),
   set the `NEXT_PUBLIC_SUPABASE_*` + `SUPABASE_SERVICE_ROLE_KEY` vars, and the
   `/admin` page will publish products live with no redeploy. Protect it with
   `ADMIN_TOKEN`.

See [`.env.example`](./.env.example) for every switch.

## Adding products

**Zero-config:** append to the `PRODUCTS` array in `src/lib/products.ts` and
commit. **Live (with Supabase):** open `/admin`, fill the form, hit publish —
it inserts a row and revalidates the storefront. Without a DB, `/admin` hands
you a ready-to-paste catalog entry.

## Stack

- **Next.js 14** App Router + React 18 (SSG product/category pages)
- **Tailwind CSS** design system (`tailwind.config.ts`, `src/app/globals.css`)
- **Stripe** Checkout for payments
- **Supabase** (optional) for a live catalog + order history
- **lucide-react** icons · no charting or image dependencies

## Project structure

```
src/
  app/
    page.tsx                 # home — hero, trending, dynamic mosaic
    shop/                    # all products (client filter + sort)
    collections/[slug]/      # category pages
    product/[slug]/          # product detail + buy + share + recs
    cart/                    # full cart page
    admin/                   # add-product dashboard
    order/success/           # post-checkout confirmation
    api/checkout/            # Stripe Checkout session (cart -> hosted URL)
    api/products/            # add product (live or snippet)
    api/stripe/webhook/      # records orders, Slack alert
  components/store/          # ProductCard, Grid, CartDrawer, BuyBox, ...
  lib/
    products.ts              # the catalog — source of truth
    catalog.ts               # Supabase-first accessor w/ seed fallback
    cart.tsx                 # cart + behavioral signals (context)
    recommend.ts             # on-device recommendation engine
    store.ts                 # brand + store config
    stripe.ts                # Stripe helpers
```

See [`GROWTH.md`](./GROWTH.md) for the path to $10k/month.
