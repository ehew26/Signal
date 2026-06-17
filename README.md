# Vertex AI

A jaw-dropping marketing site and dual dashboards for **Vertex AI**, an AI
strategy & implementation consultancy. Built with Next.js 14 (App Router),
TypeScript, and Tailwind CSS. Front-end only — all data is mocked and lives in
`src/lib/data.ts`, shaped to make swapping in a real backend a small lift.

## What's inside

| Route        | Purpose                                                                 |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Marketing site — hero, services, case studies, process, pricing, FAQ.   |
| `/dashboard` | Internal ops dashboard — KPIs, revenue chart, pipeline, projects.       |
| `/portal`    | Client portal — engagement health, milestones, deliverables.            |

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
