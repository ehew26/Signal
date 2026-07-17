# Lumé — the road to $10k/month

A realistic operating plan for the store you now have. No hype: the math, the
levers, and the weekly routine that gets you there.

## The math

$10,000/month in profit is the goal. Working backwards with dropshipping-typical
numbers for beauty tools:

| Lever | Assumption |
| --- | --- |
| Average order value (AOV) | **$46** (one hero item + one add-on; the free-shipping meter at $50 nudges this up) |
| Gross margin after product + shipping | **~55%** → ~$25 gross profit/order |
| Ad + tooling cost | ~$8/order (blended) |
| **Net profit / order** | **~$17** |
| Orders needed for $10k net | **~590/month ≈ 20/day** |
| At a 2.2% conversion rate | **~900 visitors/day** |

So the whole game is: **get ~900 qualified visitors a day and keep conversion
above 2%.** That's very achievable in beauty with organic short-form video.

## The three growth engines

### 1. Organic short-form video (primary — this is a beauty store)
Beauty tools are the *most* screenshot-and-share category on TikTok/Reels. The
store is built for this:
- Every product has a **native share button** and a clean OG image, so a link in
  bio or a comment converts.
- Post **1–3 videos/day per product**: the "ice globe face dunk", the "LED mask
  10-min glow", the "heatless curls reveal". Reuse the same 3 hooks.
- Pin your best-selling product's link. Rotate the `viral` flag in the catalog to
  match whatever is trending — the homepage "Trending now" rail follows it.

### 2. Paid acquisition (accelerant, once a product converts organically)
Only scale a product with paid *after* it sells organically. Start $10–20/day on
Meta Advantage+ or TikTok Spark Ads boosting your best organic video. Kill
anything below a 1.8x ROAS in 3 days; pour budget into winners.

### 3. Retention & AOV (cheapest dollars you'll make)
- The **free-shipping meter** ($50) and **"Pairs well with" / "Picked for you"**
  rails are already lifting AOV — feed them by keeping 12–20 products live.
- Capture emails via the footer "glow list" and send a 3-email welcome flow +
  weekly "new drop" email. Repeat buyers cost ~$0 to reacquire.
- Turn `SLACK_ORDERS_WEBHOOK_URL` on so every sale hits your phone — momentum is
  motivating and helps you spot what's selling.

## Merchandising with what's built

- **`featured: true`** → 2×2 hero cell on the home mosaic. Use for your current
  highest-margin push.
- **`viral: true`** → the "Trending now" rail + a boost in recommendations.
- **`compareAtCents`** → the strike-through + "Save X%" badge. Anchor high,
  price at your target.
- Keep **10–20 products live**. Fewer looks empty; more dilutes attention. Cut
  the bottom sellers monthly.

## Weekly routine (about 5 hours)

1. **Add/refresh 1–2 products** (`/admin` or `src/lib/products.ts`). Set the
   `viral`/`featured` flags to match what's trending.
2. **Film + post 7–15 short videos.** Batch it in one sitting.
3. **Check orders + reviews**, restock winners with your supplier, ship within 48h.
4. **Send one email** to the glow list (new drop or restock).
5. **Reallocate ad spend**: scale winners, cut losers.

## Milestones

| Stage | Target | Focus |
| --- | --- | --- |
| 0 → first sale | 1 order | Connect Stripe, post daily, DM engagers |
| $1k/mo | ~60 orders | Find the 1–2 products that convert organically |
| $3k/mo | ~180 orders | Add paid behind winners; launch email flow |
| $10k/mo | ~590 orders | Scale winners, widen catalog to ~20, systematize video |

## Honest disclaimers

- **This is a business, not a switch.** The code removes the technical work; the
  daily content + supplier relationship is the actual job.
- **Vet suppliers** for shipping times and quality — returns and chargebacks kill
  dropshipping margins faster than anything. The 48h dispatch promise on the site
  assumes a supplier that can actually deliver it.
- **Beauty devices have compliance rules** (marketing claims, electrical safety
  in some regions). Keep claims to what the product genuinely does, and check
  requirements for the markets you ship to.
