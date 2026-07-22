# Vertex AI

A jaw-dropping marketing site and dual dashboards for **Vertex AI**, an AI
strategy & implementation consultancy. Built with Next.js 14 (App Router),
TypeScript, and Tailwind CSS. Front-end only — all data is mocked and lives in
`src/lib/data.ts`, shaped to make swapping in a real backend a small lift.

## What's inside

| Route             | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | Marketing site — hero, services, case studies, process, pricing, FAQ.   |
| `/services`       | Full services overview with outcomes, deliverables, timeframes.         |
| `/about`          | Story, values, and team.                                                |
| `/work/[slug]`    | Case study detail pages (challenge → approach → outcome).               |
| `/insights`       | Blog index + articles (`/insights/[slug]`).                             |
| `/contact`        | Working lead-capture form (`POST /api/contact`).                        |
| `/login`          | Auth for the gated app (demo credentials provided on the page).         |
| `/dashboard`      | Internal ops dashboard — KPIs, revenue chart, pipeline, projects. 🔒    |
| `/portal`         | Client portal — engagement health, milestones, deliverables. 🔒        |
| `/legal/*`        | Privacy policy and terms of service.                                    |

🔒 = protected by middleware; sign in at `/login` (any valid email + password,
or click "Fill demo credentials").

See [`BUSINESS.md`](./BUSINESS.md) for the full business operating doc —
positioning, ICP, pricing, GTM, sales process, financials, and a launch checklist.

## Functional bits

- **Lead capture (live)** — `/contact` posts to `/api/contact`, which writes
  real rows to a **Supabase** `leads` table. Row Level Security allows validated
  anonymous inserts but **no public reads**, so submissions stay private. If the
  DB write ever fails, it falls back to a local file (dev) or a log line.
- **Live dashboard data** — `/dashboard` reads `projects` from Supabase and
  shows a **live lead counter** (a PII-safe `security definer` count function).
  Falls back to mock data in `src/lib/data.ts` if the DB is unreachable.
- **Auth** — lightweight cookie session (`/api/auth/login`, `/api/auth/logout`)
  gating `/dashboard` and `/portal` via `src/middleware.ts`. Swap for Supabase
  Auth when ready — the middleware can stay.
- **SEO** — dynamic `sitemap.xml`, `robots.txt`, and an OG image.

## Backend (Supabase)

The schema lives in [`supabase/schema.sql`](./supabase/schema.sql). The public
Supabase URL and anon key are baked into `src/lib/supabase.ts` as env-overridable
fallbacks (anon keys are public by design — RLS does the protecting), so the
deployment is zero-config. To point at a different project, set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. A
`SUPABASE_SERVICE_ROLE_KEY` (secret, never committed) unlocks privileged server
reads if you add one later.

## Stack

- **Next.js 14** App Router + React 18
- **Tailwind CSS** design system (`tailwind.config.ts`, `src/app/globals.css`)
- **framer-motion** + CSS animations for motion
- **lucide-react** icons
- Pure-SVG charts (no charting dependency)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # lint
```

## Project structure

```
src/
  app/
    page.tsx            # marketing landing
    dashboard/page.tsx  # internal ops dashboard
    portal/page.tsx     # client portal
    layout.tsx          # fonts + metadata
    globals.css         # design system
  components/
    site/               # marketing sections (Hero, Navbar, Footer, Faq)
    dashboard/          # Shell, charts, widgets
    Reveal.tsx          # scroll-reveal wrapper
    Aurora.tsx          # animated background
    Logo.tsx
  lib/
    data.ts             # all mock data
    utils.ts            # helpers (cn, formatting)
```

## Going full-stack later

`src/lib/data.ts` types mirror a realistic schema. To wire up a backend,
replace those exports with data-fetching functions (e.g. Supabase queries) and
the components keep working unchanged.
