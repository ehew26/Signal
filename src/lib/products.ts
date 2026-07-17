/**
 * The Lumé catalog — the source of truth for products.
 *
 * Adding a product is deliberately a one-object edit: drop a new entry in the
 * `PRODUCTS` array (or insert a row in the Supabase `products` table, which
 * takes priority at runtime) and the whole store reacts automatically — the
 * grid re-flows, the layout re-weights toward featured/viral items, categories
 * appear, sitemap + recommendations pick it up. No component edits required.
 *
 * We ship no external image assets: each product renders its own on-brand
 * gradient "media" from `hue` + `emoji` + `accent`, so the store is 100%
 * self-contained and looks intentional out of the box. Swap `image` in later
 * (a URL) and ProductMedia will prefer it.
 */

export type Category =
  | "skincare-tools"
  | "led-therapy"
  | "hair-scalp"
  | "body-recovery"
  | "wellness";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Short punchy line under the name. */
  tagline: string;
  description: string;
  category: Category;
  /** Free-form tags — power search, related items, and the recommender. */
  tags: string[];
  /** Price in cents. */
  priceCents: number;
  /** Optional "was" price in cents for the strike-through. */
  compareAtCents?: number;
  rating: number;
  reviews: number;
  /** Marketing badges e.g. "Bestseller", "New", "Viral on TikTok". */
  badges: string[];
  benefits: string[];
  howToUse: string;
  /** Visual identity for the self-contained gradient media. */
  hue: number;
  emoji: string;
  /** Tailwind-ish accent used sparingly in the card. */
  accent: string;
  /** Optional real image URL — takes priority over the generated media. */
  image?: string;
  featured?: boolean;
  /** Drives extra layout weight + the "trending" rail. */
  viral?: boolean;
  inStock?: boolean;
};

export const CATEGORY_META: Record<Category, { label: string; blurb: string; emoji: string }> = {
  "skincare-tools": {
    label: "Skincare Tools",
    blurb: "Sculpt, lift, and de-puff with tools that actually earn their counter space.",
    emoji: "💎",
  },
  "led-therapy": {
    label: "LED & Light Therapy",
    blurb: "Salon-grade light therapy for skin that looks lit from within.",
    emoji: "✨",
  },
  "hair-scalp": {
    label: "Hair & Scalp",
    blurb: "Roots-up rituals for fuller, healthier, shinier hair.",
    emoji: "🌿",
  },
  "body-recovery": {
    label: "Body & Recovery",
    blurb: "Percussion, heat, and cold — recovery that feels like a reset.",
    emoji: "🧊",
  },
  wellness: {
    label: "Wellness",
    blurb: "Small daily rituals that compound into a calmer, brighter you.",
    emoji: "🕯️",
  },
};

export const PRODUCTS: Product[] = [
  {
    id: "p-glacier-globes",
    slug: "glacier-ice-globes",
    name: "Glacier Ice Globes",
    tagline: "Cold-therapy facial in 5 minutes.",
    description:
      "A pair of chilled borosilicate globes that de-puff, tighten pores, and calm redness. Keep them in the freezer, roll them over cleansed skin, and watch your morning face wake up. The ritual that broke the internet — now with a satin-finish handle that doesn't slip.",
    category: "skincare-tools",
    tags: ["cooling", "de-puff", "morning", "sensitive-skin", "viral", "gift"],
    priceCents: 3800,
    compareAtCents: 5200,
    rating: 4.8,
    reviews: 2143,
    badges: ["Viral on TikTok", "Bestseller"],
    benefits: ["Instantly de-puffs & tightens", "Calms redness and irritation", "Boosts serum absorption"],
    howToUse: "Chill for 30+ min. Glide over cleansed skin for 3–5 min, moving outward and up.",
    hue: 190,
    emoji: "🧊",
    accent: "#38bdf8",
    featured: true,
    viral: true,
  },
  {
    id: "p-aurora-mask",
    slug: "aurora-led-face-mask",
    name: "Aurora LED Face Mask",
    tagline: "7 clinical light modes. Zero appointments.",
    description:
      "Salon-grade red, blue, and near-infrared light in a feather-light silicone mask. Red smooths fine lines, blue clears breakouts, near-infrared calms. Ten minutes a day is all it takes to make 'what are you doing differently?' your most-asked question.",
    category: "led-therapy",
    tags: ["anti-aging", "acne", "red-light", "evening", "premium", "viral", "gift"],
    priceCents: 14900,
    compareAtCents: 21900,
    rating: 4.9,
    reviews: 1687,
    badges: ["Editor's Pick", "Viral on TikTok"],
    benefits: ["Red light smooths fine lines", "Blue light clears breakouts", "Cordless, 10-min sessions"],
    howToUse: "On clean, dry skin, wear for 10 min daily. Choose a mode; relax; glow.",
    hue: 330,
    emoji: "✨",
    accent: "#f472b6",
    featured: true,
    viral: true,
  },
  {
    id: "p-obsidian-gua-sha",
    slug: "obsidian-gua-sha",
    name: "Obsidian Gua Sha",
    tagline: "The lymphatic reset, sculpted from stone.",
    description:
      "Hand-finished black obsidian, weighted just right to drain, sculpt, and define. The cool stone glides tension out of your jaw and cheekbones while the ritual glides stress out of your day.",
    category: "skincare-tools",
    tags: ["sculpting", "lymphatic", "evening", "sensitive-skin", "gift", "affordable"],
    priceCents: 2400,
    compareAtCents: 3400,
    rating: 4.7,
    reviews: 3320,
    badges: ["Bestseller"],
    benefits: ["Defines jawline & cheekbones", "Drains lymphatic puffiness", "Melts jaw tension"],
    howToUse: "Apply facial oil. Glide flat-side up and out, 5–8 strokes per zone.",
    hue: 260,
    emoji: "💎",
    accent: "#a78bfa",
    featured: true,
    viral: false,
  },
  {
    id: "p-microcurrent-wand",
    slug: "lift-microcurrent-wand",
    name: "Lift Microcurrent Wand",
    tagline: "The 5-minute facelift, in your hand.",
    description:
      "Gentle microcurrent tones the muscles under your skin the way a workout tones the rest of you. Used daily, it lifts, firms, and gives you that 'just left the facialist' contour — no needles, no downtime.",
    category: "skincare-tools",
    tags: ["anti-aging", "sculpting", "lifting", "premium", "morning", "viral"],
    priceCents: 11900,
    compareAtCents: 16900,
    rating: 4.6,
    reviews: 934,
    badges: ["New", "Viral on TikTok"],
    benefits: ["Tones & lifts facial muscles", "Firms over 4–6 weeks", "Painless microcurrent"],
    howToUse: "Apply conductive gel. Glide upward along contours for 5 min, 5x/week.",
    hue: 210,
    emoji: "⚡",
    accent: "#60a5fa",
    featured: false,
    viral: true,
  },
  {
    id: "p-halo-ring-light",
    slug: "halo-red-light-collar",
    name: "Halo Red-Light Neck Collar",
    tagline: "Because your neck ages first.",
    description:
      "A flexible collar of medical-grade red and infrared LEDs that wraps the neck and décolletage — the spot every other routine forgets. Firms crepey skin and softens 'tech neck' lines while you scroll.",
    category: "led-therapy",
    tags: ["anti-aging", "red-light", "neck", "premium", "evening"],
    priceCents: 9900,
    compareAtCents: 13900,
    rating: 4.7,
    reviews: 512,
    badges: ["New"],
    benefits: ["Firms neck & décolletage", "Softens tech-neck lines", "Hands-free 10-min sessions"],
    howToUse: "Wrap on clean skin, wear 10 min daily. Follow with moisturizer.",
    hue: 350,
    emoji: "🌅",
    accent: "#fb7185",
    featured: false,
    viral: false,
  },
  {
    id: "p-scalp-massager",
    slug: "root-scalp-massager",
    name: "Root Scalp Massager",
    tagline: "Fuller hair starts at the root.",
    description:
      "A silicone scalp brush that boosts circulation, lifts buildup, and turns your shower into a five-star scalp facial. Softer, stronger hair — and honestly the best 90 seconds of your day.",
    category: "hair-scalp",
    tags: ["hair-growth", "scalp", "shower", "affordable", "gift", "viral"],
    priceCents: 1800,
    compareAtCents: 2600,
    rating: 4.8,
    reviews: 5210,
    badges: ["Bestseller", "Viral on TikTok"],
    benefits: ["Boosts scalp circulation", "Lifts product buildup", "Soothing & exfoliating"],
    howToUse: "Massage in circular motions on wet or dry scalp for 60–90 sec.",
    hue: 150,
    emoji: "🌿",
    accent: "#34d399",
    featured: false,
    viral: true,
  },
  {
    id: "p-derma-roller",
    slug: "renew-derma-roller",
    name: "Renew Derma Roller",
    tagline: "Micro-channels for max serum payoff.",
    description:
      "0.25mm titanium micro-needles create thousands of invisible channels so your serums sink in instead of sitting on top. The multiplier that makes everything else in your routine work harder.",
    category: "skincare-tools",
    tags: ["anti-aging", "serum-boost", "evening", "affordable"],
    priceCents: 2900,
    rating: 4.5,
    reviews: 1188,
    badges: [],
    benefits: ["Boosts serum absorption", "Smooths texture over time", "Titanium, sanitizable"],
    howToUse: "On clean skin, roll each zone 4–6x vertically/horizontally. Apply serum. 2x/week.",
    hue: 280,
    emoji: "🪄",
    accent: "#c084fc",
    featured: false,
    viral: false,
  },
  {
    id: "p-percussion-mini",
    slug: "pulse-mini-massage-gun",
    name: "Pulse Mini Massage Gun",
    tagline: "Deep-tissue recovery, pocket-sized.",
    description:
      "Palm-sized percussion that hits like a device three times its size. Four speeds melt knots in your neck, back, and legs. Quiet enough for the office, powerful enough for post-leg-day.",
    category: "body-recovery",
    tags: ["recovery", "muscle", "travel", "gift", "viral", "premium"],
    priceCents: 6900,
    compareAtCents: 9900,
    rating: 4.7,
    reviews: 2760,
    badges: ["Bestseller", "Viral on TikTok"],
    benefits: ["Melts muscle knots fast", "4 speeds, 4 heads", "6-hour battery, ultra-quiet"],
    howToUse: "Glide over sore muscles 1–2 min per area. Avoid bones and joints.",
    hue: 20,
    emoji: "💥",
    accent: "#fb923c",
    featured: true,
    viral: true,
  },
  {
    id: "p-cryo-roller",
    slug: "frost-cryo-roller",
    name: "Frost Cryo Roller",
    tagline: "Ice-roll away puff and tension.",
    description:
      "A gel-core roller that stays cold for an hour. Roll it over your face to shrink puffiness or over tight shoulders to chase tension — the do-everything cold tool that lives in your freezer door.",
    category: "body-recovery",
    tags: ["cooling", "de-puff", "recovery", "affordable", "morning"],
    priceCents: 2200,
    compareAtCents: 3200,
    rating: 4.6,
    reviews: 1440,
    badges: [],
    benefits: ["Stays cold ~60 min", "De-puffs face & eyes", "Eases neck & shoulder tension"],
    howToUse: "Freeze 2+ hrs. Roll over face or body for 2–4 min.",
    hue: 200,
    emoji: "❄️",
    accent: "#38bdf8",
    featured: false,
    viral: false,
  },
  {
    id: "p-silk-eye-mask",
    slug: "lull-weighted-silk-eye-mask",
    name: "Lull Weighted Silk Eye Mask",
    tagline: "Blackout sleep, spa-grade calm.",
    description:
      "Mulberry silk on your skin, a gentle weight over your eyes. Blocks 100% of light and applies the same calming pressure as an eye pillow, so you fall asleep faster and wake up smoother.",
    category: "wellness",
    tags: ["sleep", "calm", "silk", "gift", "evening", "affordable"],
    priceCents: 3200,
    compareAtCents: 4200,
    rating: 4.9,
    reviews: 1980,
    badges: ["Editor's Pick"],
    benefits: ["100% blackout", "Gentle calming weight", "Mulberry silk, crease-free"],
    howToUse: "Wear over eyes for sleep or a 20-min reset. Hand-wash cold.",
    hue: 250,
    emoji: "🌙",
    accent: "#818cf8",
    featured: false,
    viral: false,
  },
  {
    id: "p-jade-roller",
    slug: "jade-facial-roller",
    name: "Jade Facial Roller",
    tagline: "The classic, done properly.",
    description:
      "Real, ethically-sourced jade — not dyed resin — on a squeak-free axle. Cool to the touch, weighted to depuff, and calming enough to become the last thing you do every night.",
    category: "skincare-tools",
    tags: ["cooling", "de-puff", "evening", "affordable", "gift"],
    priceCents: 1900,
    compareAtCents: 2800,
    rating: 4.4,
    reviews: 2610,
    badges: [],
    benefits: ["Naturally cooling", "De-puffs & soothes", "Squeak-free real jade"],
    howToUse: "Apply oil. Roll outward and up, larger roller on cheeks, small under eyes.",
    hue: 140,
    emoji: "🟢",
    accent: "#4ade80",
    featured: false,
    viral: false,
  },
  {
    id: "p-blue-spot-wand",
    slug: "clarity-blue-light-spot-wand",
    name: "Clarity Blue-Light Spot Wand",
    tagline: "Zap a breakout before it peaks.",
    description:
      "Targeted blue + red light plus gentle warmth that shortens the life of a breakout when you catch it early. Pocket-sized SOS for the spot that always shows up on the wrong day.",
    category: "led-therapy",
    tags: ["acne", "blue-light", "spot-treatment", "travel", "affordable", "viral"],
    priceCents: 4200,
    compareAtCents: 5900,
    rating: 4.5,
    reviews: 870,
    badges: ["New", "Viral on TikTok"],
    benefits: ["Targets blemishes fast", "Blue + red + warmth", "Rechargeable, travel-ready"],
    howToUse: "Hold on cleansed blemish for 2–3 min, 2–3x/day at first sign.",
    hue: 220,
    emoji: "🔵",
    accent: "#3b82f6",
    featured: false,
    viral: true,
  },
  {
    id: "p-heatless-curl-set",
    slug: "cloud-heatless-curl-set",
    name: "Cloud Heatless Curl Set",
    tagline: "Wake up with the waves.",
    description:
      "A satin curl rod and clips that turn overnight sleep into a soft, bouncy blowout — zero heat, zero damage. The set that made 'I woke up like this' technically true.",
    category: "hair-scalp",
    tags: ["hair-styling", "heatless", "overnight", "affordable", "gift", "viral"],
    priceCents: 2100,
    compareAtCents: 3200,
    rating: 4.6,
    reviews: 4020,
    badges: ["Bestseller", "Viral on TikTok"],
    benefits: ["Heat-free, damage-free waves", "Satin = less frizz & breakage", "Works on most lengths"],
    howToUse: "On damp hair, wrap around the rod, secure, sleep. Unwrap in the morning.",
    hue: 40,
    emoji: "☁️",
    accent: "#fbbf24",
    featured: false,
    viral: true,
  },
  {
    id: "p-aroma-diffuser",
    slug: "mist-aroma-diffuser",
    name: "Mist Aroma Diffuser",
    tagline: "Turn any room into a reset.",
    description:
      "A whisper-quiet ultrasonic diffuser with an ambient glow that turns essential oils into a fine, hydrating mist. Ten hours of calm on a single fill — the centerpiece of every wind-down routine.",
    category: "wellness",
    tags: ["calm", "home", "sleep", "gift", "evening"],
    priceCents: 3600,
    compareAtCents: 4900,
    rating: 4.7,
    reviews: 1320,
    badges: [],
    benefits: ["10-hr whisper-quiet mist", "Soft ambient light", "Auto-off safety"],
    howToUse: "Fill to line, add 5–8 drops of oil, choose mist + light. Enjoy.",
    hue: 300,
    emoji: "🕯️",
    accent: "#e879f9",
    featured: false,
    viral: false,
  },
  {
    id: "p-cold-plunge-facial-tub",
    slug: "nordic-face-ice-bath",
    name: "Nordic Face Ice Bath",
    tagline: "The viral cold-plunge, for your face.",
    description:
      "A cushioned basin built for the 'face dunk' ritual influencers swear by. Fill with ice water, submerge for a few seconds, and get tight, bright, wide-awake skin — the most-shared 15 seconds of anyone's morning.",
    category: "body-recovery",
    tags: ["cooling", "de-puff", "morning", "viral", "gift"],
    priceCents: 2800,
    rating: 4.3,
    reviews: 640,
    badges: ["New", "Viral on TikTok"],
    benefits: ["Instant tight, bright skin", "Cushioned, splash-smart rim", "Doubles as a soak bowl"],
    howToUse: "Fill with cold water + ice. Submerge face for 10–15 sec, repeat 3x.",
    hue: 195,
    emoji: "🫧",
    accent: "#22d3ee",
    featured: false,
    viral: true,
  },
];
