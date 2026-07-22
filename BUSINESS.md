# Vertex AI — Business Operating Doc

Everything needed to actually *run* Vertex AI as a consulting business. The
website and dashboards in this repo are the product surface; this is the
playbook behind them.

---

## 1. Positioning

**One-liner:** Production-grade AI for ambitious companies — strategy to
deployment, in weeks.

**Category:** Boutique AI implementation consultancy (not a body shop, not an
agency reselling a single SaaS).

**Wedge:** Most companies are stuck between (a) big consultancies that deliver
slideware and (b) freelancers who can't ship production-safe systems. We are
senior practitioners who ship working software *and* leave the client's team
able to own it.

**Proof points to lead with:** $42M+ client value created, 120+ systems
shipped, 6.2× average year-one ROI, 98% retention.

---

## 2. Ideal Customer Profile (ICP)

| Attribute        | Sweet spot                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Company size     | 50–2,000 employees ($10M–$500M revenue)                           |
| Buyer            | VP/Director of Eng, COO, Head of Ops, or a technical founder      |
| Trigger          | "We have an AI mandate and no idea how to ship it safely"         |
| Verticals        | Logistics, healthcare, fintech, B2B SaaS, professional services   |
| Disqualifiers    | Pre-revenue startups, pure research, "build me an app for $2k"    |

**Where they hang out:** LinkedIn, industry Slacks, operator communities,
conference hallways. Not Twitter threads about prompt hacks.

---

## 3. Offers & Pricing

| Offer       | Price            | Outcome                                       | Goal                |
| ----------- | ---------------- | --------------------------------------------- | ------------------- |
| **Sprint**  | $12k / 2 weeks   | Validate one use case + working prototype     | Low-risk entry point|
| **Build**   | $28k / month     | Ship a production system with a dedicated pod | Core revenue        |
| **Partner** | Custom retainer  | Embedded fractional AI leadership             | High LTV, sticky    |

**Pricing logic:** Sprint is priced to be an easy "yes" and to disqualify
tire-kickers. ~70% of Sprints should convert to Build. Partner is reserved for
clients with multi-team, multi-quarter ambition.

**Margin target:** 55–65% gross on Build/Partner. Sprint is roughly break-even —
it's a sales tool, not a profit center.

---

## 4. Go-to-Market

**Primary channels (in priority order):**
1. **Referrals & word of mouth** — our 98% retention is the flywheel. Ask every
   happy client for one intro at the close of an engagement.
2. **Content / Insights** — the `/insights` blog. One sharp, opinionated piece
   per week on evals, build-vs-buy, agent safety. Repurpose to LinkedIn.
3. **Case studies** — every engagement ends with a published, metric-driven
   case study (see `/work/[slug]`). These are the highest-converting asset.
4. **Founder-led outbound** — targeted, researched, ≤5 prospects/week. Quality
   over volume.
5. **Partnerships** — cloud providers, vertical SaaS, fractional-CTO networks.

**Funnel:**
`Visit → /contact form → Strategy call → Sprint proposal → Build → Partner`

The `/api/contact` endpoint captures leads; in production, route them to a CRM
and notify the team in Slack.

---

## 5. Sales Process

1. **Inbound lead** (contact form or referral) → respond within 1 business day.
2. **30-min strategy call** — diagnose the problem, qualify against ICP, be
   honest if AI isn't the answer.
3. **Sprint proposal** — scoped, fixed-price, sent within 48h of the call.
4. **Sprint delivery** — working prototype + eval baseline + ROI model.
5. **Build conversion** — present the path to production; land the monthly pod.
6. **Expansion** — additional use cases, then Partner retainer.

**KPIs to watch** (mirrored in `/dashboard`): MRR, pipeline value, qualified
leads, win rate, Sprint→Build conversion, utilization, retention.

---

## 6. Delivery Method (the "Vertex Method")

`Discover → Design → Build → Scale` (see the Process section on the homepage).

Non-negotiables on every engagement:
- **Evals first.** Write the test suite before the system.
- **Source-grounding & guardrails** on anything customer-facing.
- **Build on the client's stack**, document everything, no lock-in.
- **Team enablement** so the client owns it after we leave.

---

## 7. Financial Model (illustrative targets, Year 1→2)

| Metric              | Target                                            |
| ------------------- | ------------------------------------------------- |
| Active clients      | 12–18 concurrent                                  |
| MRR                 | $180k → $300k                                      |
| Avg. engagement     | $28k/mo × 4–6 months                              |
| Gross margin        | 55–65%                                            |
| Pipeline coverage   | 3× of quarterly target                            |
| CAC payback         | < 1 engagement                                    |

Bench/utilization is the main lever — keep senior practitioners 70–80% billable
without burning them out.

---

## 8. Team & Hiring

Start lean and senior (see `/about`): Founder/Principal, Head of Engineering,
Strategy Lead, Head of Applied Research. Hire only senior practitioners who can
both build and talk to a boardroom. Avoid the junior-army model — it kills the
positioning.

**First hires as you scale:** delivery lead (to protect founder time), a
second senior engineer per ~3 concurrent Builds.

---

## 9. Tooling Stack (suggested)

| Function      | Tool                                                |
| ------------- | --------------------------------------------------- |
| Site/app      | This repo (Next.js on Vercel)                       |
| CRM           | HubSpot / Attio                                     |
| Leads → ops   | `/api/contact` → CRM + Slack webhook                |
| Auth/DB       | Supabase (wire into dashboard/portal — see README)  |
| Comms         | Slack (internal), shared client channels            |
| Docs/contract | Notion + DocuSign                                   |
| Billing       | Stripe (invoicing + subscriptions for retainers)    |

---

## 10. 90-Day Launch Checklist

- [ ] Point a domain at the Vercel deployment.
- [ ] Wire `/api/contact` to a CRM + Slack notification.
- [ ] Replace mock dashboard/portal data with Supabase (see README).
- [ ] Publish the 3 seed case studies and 3 blog posts (already drafted).
- [x] Self-serve Stripe subscriptions are **built** (Starter $299 / Growth $599,
      auto-onboarding email, self-serve billing portal). Activate by adding your
      Stripe keys — see `STRIPE_SETUP.md`.
- [ ] Book 5 strategy calls from the founder's existing network.
- [ ] Ship one Insights post per week.
- [ ] Close the first 2 Sprints; convert at least 1 to Build.

---

*This doc is a living playbook — revise it as the business learns.*

---

## 11. Launch Playbook (do these in order)

### A. Warm outbound — your first 3 clients
Your fastest clients come from people who already trust you, not cold ads.

1. List **30–50 people** who know your work (ex-colleagues, ex-managers, founders, peers).
2. Send each a short, personal note — no pitch deck. Template:

   > Subject: what I'm building now
   >
   > Hey {name} — quick update: I've started an AI consulting practice
   > (Vertex AI) helping {their world}-type teams ship production AI —
   > agents, automation, and RAG that actually move a number.
   >
   > Not asking you to buy anything. If anyone in your network is
   > wrestling with an AI project and could use a senior set of hands,
   > I'd love an intro. Site's here if useful: https://getvertex.vercel.app
   >
   > Either way, good to be back in touch — how are you?

3. Goal: **5 conversations → 1–2 paid pilots** in the first 30 days.

### B. Proof engine — turn pilots into logos
- Offer **1–2 founding-client pilots** at a discounted or fixed price, explicitly
  in exchange for a named case study + testimonial (see the "Founding clients"
  section on the homepage).
- The moment a pilot delivers, replace one illustrative `/work` example with the
  **real, named** case study. Real logos unlock everything else.

### C. Content engine — compounding inbound
- Publish **one technical post every 1–2 weeks** to `/insights` (we ship with 3
  seed posts). Each should show how you solved a real, specific problem.
- Cross-post to LinkedIn the same day; link back to the post.
- After ~3 months this becomes your most reliable inbound channel.

### D. Sharpen the niche
"AI that moves revenue" is everyone's pitch. Pick **one** vertical/use-case you
can win (e.g. "support automation for B2B SaaS", "RAG for legal teams"), then
rewrite the homepage headline + one example engagement around it. Specificity is
what generates inbound. *(Tell Claude the niche and it'll rewrite the copy.)*

