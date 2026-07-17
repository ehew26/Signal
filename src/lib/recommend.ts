/**
 * On-device personalized recommendation engine.
 *
 * Pure function, no server, no accounts. Given the full catalog and the
 * shopper's local behavioral signals (views + category/tag affinity from
 * cart.tsx), it ranks products the shopper is most likely to want next.
 *
 * Scoring blends:
 *   - category affinity (what you keep looking at)
 *   - tag affinity (cooling? anti-aging? gifts?)
 *   - social proof (rating × log(reviews)) so cold-start users still see hits
 *   - a viral nudge (these convert + get shared)
 *   - a novelty penalty for items already viewed a lot (keep it fresh)
 */
import type { Product } from "@/lib/products";
import type { Signals } from "@/lib/cart";

export function recommend(
  products: Product[],
  signals: Signals,
  opts: { exclude?: string[]; limit?: number } = {}
): Product[] {
  const { exclude = [], limit = 6 } = opts;
  const excludeSet = new Set(exclude);

  const catTotal = Object.values(signals.categories).reduce((a, b) => a + b, 0) || 1;
  const tagTotal = Object.values(signals.tags).reduce((a, b) => a + b, 0) || 1;
  const hasHistory = catTotal > 1 || tagTotal > 1;

  const scored = products
    .filter((p) => !excludeSet.has(p.slug))
    .map((p) => {
      const catAffinity = (signals.categories[p.category] ?? 0) / catTotal;
      const tagAffinity =
        p.tags.reduce((sum, t) => sum + (signals.tags[t] ?? 0), 0) / tagTotal;

      const socialProof = (p.rating / 5) * Math.log10(10 + p.reviews);
      const viralNudge = p.viral ? 0.6 : 0;
      const viewed = signals.views[p.slug] ?? 0;
      const noveltyPenalty = Math.min(viewed * 0.25, 1.2);

      // Weight personalization heavily once we know the shopper, else lean on
      // social proof so first-time visitors still see the best sellers.
      const personalized = hasHistory
        ? catAffinity * 3.2 + tagAffinity * 4.0
        : 0;

      const score = personalized + socialProof + viralNudge - noveltyPenalty;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.p);
}

/** A short, human explanation of why we're showing recs — nice UX touch. */
export function recommendReason(signals: Signals): string {
  const topCat = Object.entries(signals.categories).sort((a, b) => b[1] - a[1])[0];
  if (topCat && topCat[1] > 1) {
    const label = topCat[0]
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
    return `Because you've been eyeing ${label}`;
  }
  return "This week's most-loved";
}
