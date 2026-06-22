/**
 * Long-form marketing & company content for Vertex AI.
 * Kept separate from data.ts (dashboard/app data) for clarity.
 */

export const company = {
  name: "Vertex AI",
  legalName: "Vertex AI, LLC",
  tagline: "Production-grade AI for ambitious companies.",
  email: "ed@getvertex.ai",
  salesEmail: "ed@getvertex.ai",
  phone: "+1 (415) 555-0142",
  location: "San Francisco, CA · Remote-first",
  founded: 2023,
  social: {
    x: "https://x.com/vertexai",
    linkedin: "https://linkedin.com/company/vertexai",
  },
};

export const companyFacts = [
  { value: "Founder-led", label: "Senior practitioners only" },
  { value: "Production", label: "Evals gate every release" },
  { value: "Your stack", label: "No lock-in — you own the code" },
  { value: "2-week", label: "First working prototype" },
];

export type Value = { title: string; description: string };

export const values: Value[] = [
  {
    title: "Outcomes over output",
    description:
      "We measure ourselves by the number we moved for you — revenue, cost, or risk — not by decks delivered or hours billed.",
  },
  {
    title: "Evals or it didn't happen",
    description:
      "Every system ships with a test suite. If we can't measure quality, we don't put it in front of your customers.",
  },
  {
    title: "Your stack, your ownership",
    description:
      "We build on your cloud, document everything, and train your team. No lock-in, no black boxes, no rent-seeking.",
  },
  {
    title: "Honest about AI",
    description:
      "Sometimes the right answer is 'don't use AI for that yet.' We'll tell you when an idea isn't worth the spend.",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  bio: string;
  accent: string;
};

export const team: TeamMember[] = [
  {
    name: "Ada Reyes",
    role: "Founder & Principal",
    initials: "AR",
    bio: "Former ML lead at two unicorns. Has shipped agents to millions of users and lived to tell the eval war stories.",
    accent: "from-violet to-cyan",
  },
  {
    name: "Jamie Lin",
    role: "Head of Engineering",
    initials: "JL",
    bio: "Distributed-systems veteran who makes LLM systems boringly reliable. Believes monitoring is a love language.",
    accent: "from-cyan to-emerald",
  },
  {
    name: "Marc Pereira",
    role: "AI Strategy Lead",
    initials: "MP",
    bio: "Ex-management consultant turned builder. Translates between the boardroom and the codebase fluently.",
    accent: "from-amber to-rose",
  },
  {
    name: "Sofia Almeida",
    role: "Head of Applied Research",
    initials: "SA",
    bio: "Keeps us honest on evals, safety, and what the frontier can actually do today versus next quarter.",
    accent: "from-rose to-violet",
  },
];

export type ServiceDetail = {
  slug: string;
  outcome: string;
  deliverables: string[];
  idealFor: string;
  timeframe: string;
};

export const serviceDetails: Record<string, ServiceDetail> = {
  chatbot: {
    slug: "chatbot",
    outcome: "A 24/7 assistant that answers customers and books jobs while you work.",
    deliverables: ["Website chat widget", "Call & text auto-answer", "Trained on your FAQs & services", "Smart handoff to you"],
    idealFor: "Any business losing customers to missed calls or slow replies.",
    timeframe: "Live in days",
  },
  leads: {
    slug: "leads",
    outcome: "Every lead captured and followed up — automatically, instantly.",
    deliverables: ["Instant text-back on new leads", "Follow-up sequences", "Lead alerts to your phone", "Simple lead inbox"],
    idealFor: "Businesses that get leads by phone, form, or DM and can't always respond fast.",
    timeframe: "Live in days",
  },
  booking: {
    slug: "booking",
    outcome: "Customers book themselves, your calendar fills, no-shows drop.",
    deliverables: ["Self-serve booking page", "Calendar sync", "Automatic reminders", "Reschedule handling"],
    idealFor: "Appointment-based businesses — home services, clinics, salons, trades.",
    timeframe: "Live in days",
  },
  reviews: {
    slug: "reviews",
    outcome: "More 5-star reviews, and unhappy customers caught before they post.",
    deliverables: ["Automated review requests", "Smart timing", "Private feedback routing", "Google/Facebook links"],
    idealFor: "Local businesses that live and die by their online rating.",
    timeframe: "Live in days",
  },
  automation: {
    slug: "automation",
    outcome: "The repetitive admin runs itself, so you get your evenings back.",
    deliverables: ["Quote & invoice automation", "Reminders & receipts", "Data entry automation", "Tool integrations"],
    idealFor: "Owners buried in paperwork and repetitive back-office tasks.",
    timeframe: "1–2 weeks",
  },
  setup: {
    slug: "setup",
    outcome: "Everything set up and maintained for you — zero tech headaches.",
    deliverables: ["Done-for-you setup", "Works with your existing tools", "Ongoing maintenance", "A real person to call"],
    idealFor: "Owners who want results without becoming an AI expert.",
    timeframe: "Ongoing",
  },
};

export type CaseStudyDetail = {
  slug: string;
  challenge: string;
  approach: string[];
  outcome: string;
  stats: { value: string; label: string }[];
  quote: { text: string; author: string };
};

export const caseStudyDetails: Record<string, CaseStudyDetail> = {
  northwind: {
    slug: "northwind",
    challenge:
      "A busy home-services company was losing jobs every week to missed calls — owners on a roof can't answer the phone, and callers who hit voicemail just dial the next company on Google.",
    approach: [
      "Set up an AI assistant to answer every call, text, and website chat instantly.",
      "Trained it on their services, service area, pricing ranges, and FAQs.",
      "Connected it to their calendar so it books and reschedules jobs automatically.",
      "Routed anything unusual straight to the owner with a text summary.",
    ],
    outcome:
      "Now no call goes unanswered — day, night, or weekend. The assistant captures the lead, answers common questions, and books the job, while the crew stays focused on the work.",
    stats: [
      { value: "+38%", label: "More booked jobs" },
      { value: "0", label: "Missed calls" },
      { value: "24/7", label: "Always answering" },
      { value: "Days", label: "To go live" },
    ],
    quote: {
      text: "Illustrative engagement — your story could go here.",
      author: "Vertex AI",
    },
  },
  meridian: {
    slug: "meridian",
    challenge:
      "A dental practice was missing dozens of calls a week during appointments. Each missed call from a prospective patient often meant a booking lost to a competing clinic.",
    approach: [
      "Set up instant text-back on every missed call.",
      "The assistant answers common questions (hours, insurance, pricing) by text.",
      "It offers open appointment slots and books the patient on the spot.",
      "Front-desk staff get a clean summary instead of a voicemail backlog.",
    ],
    outcome:
      "Missed calls turn into booked appointments instead of lost patients, and the front desk stops playing phone tag — all without adding headcount.",
    stats: [
      { value: "−71%", label: "Missed-call no-shows" },
      { value: "+25%", label: "New patient bookings" },
      { value: "<1 min", label: "Text-back time" },
      { value: "Days", label: "To go live" },
    ],
    quote: {
      text: "Illustrative engagement — your story could go here.",
      author: "Vertex AI",
    },
  },
  atlas: {
    slug: "atlas",
    challenge:
      "A salon and spa had great service but a thin online presence — too few recent reviews, and a calendar with gaps from clients who never rebooked.",
    approach: [
      "Automated review requests by text right after each appointment.",
      "Sent unhappy feedback privately to the owner before it went public.",
      "Added rebooking reminders to bring clients back on schedule.",
      "Kept the messages on-brand and easy to turn off anytime.",
    ],
    outcome:
      "A steady stream of fresh 5-star reviews lifted their ranking and visibility, while automated rebooking kept the calendar full.",
    stats: [
      { value: "+180", label: "New 5-star reviews" },
      { value: "4.9★", label: "Average rating" },
      { value: "+22%", label: "Repeat bookings" },
      { value: "Days", label: "To go live" },
    ],
    quote: {
      text: "Illustrative engagement — your story could go here.",
      author: "Vertex AI",
    },
  },
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "evals-are-the-product",
    title: "Evals are the product",
    excerpt:
      "The teams winning with AI aren't the ones with the cleverest prompts — they're the ones who can measure quality. Here's how we build eval suites that gate every release.",
    category: "Engineering",
    date: "Jun 4, 2026",
    readTime: "6 min",
    author: "Jamie Lin",
    body: [
      "Most AI projects fail in the same place: nobody can say whether the system is actually good. Demos dazzle, then production quietly disappoints, and the team has no way to tell whether a change made things better or worse.",
      "We treat evals as the first deliverable, not the last. Before we write the agent, we write the test suite — drawn from your real data and graded against the decisions your best people already make.",
      "This flips the dynamic entirely. Every prompt change, model swap, or new tool runs through the suite. Regressions get caught before your customers see them, and 'is this better?' becomes a number instead of an argument.",
      "If you take one thing from working with us: an AI system you can't measure is an AI system you can't trust. Build the ruler first.",
    ],
  },
  {
    slug: "build-vs-buy-ai",
    title: "Build vs. buy: a decision framework for AI",
    excerpt:
      "Should you build that AI feature, buy a vendor, or wait? A simple framework we use with every client to avoid the two most expensive mistakes.",
    category: "Strategy",
    date: "May 21, 2026",
    readTime: "8 min",
    author: "Marc Pereira",
    body: [
      "Two expensive mistakes dominate AI strategy: building commodity capabilities you should have bought, and buying core differentiation you should have built.",
      "Our rule of thumb: buy the plumbing, build the moat. If a capability is undifferentiated infrastructure — transcription, OCR, generic chat — buy it and move on. If it encodes your unique data, judgment, or workflow, that's where building pays off.",
      "The third option, 'wait,' is underrated. For fast-moving capabilities, six months of patience can turn a six-figure build into a config change. We help you spot which bets are worth making now and which to revisit next quarter.",
    ],
  },
  {
    slug: "agents-that-dont-go-rogue",
    title: "Agents that don't go rogue",
    excerpt:
      "Autonomous agents are powerful and terrifying. The guardrail patterns we use to ship agents that are aggressive about work and conservative about risk.",
    category: "Safety",
    date: "May 7, 2026",
    readTime: "5 min",
    author: "Sofia Almeida",
    body: [
      "An agent with tools is an agent that can do damage. The goal isn't to make agents timid — it's to make them aggressive within a fence you trust.",
      "We lean on three patterns: hard constraints the model literally cannot violate, human-in-the-loop gates on high-stakes actions, and a kill switch that an operator can hit in one click.",
      "Pair that with thorough logging and you get the best of both worlds: an agent that takes real work off your plate, and a paper trail that lets you sleep at night.",
    ],
  },
];

export const contactReasons = [
  "New project",
  "Strategy / roadmap",
  "Partnership",
  "Careers",
  "Something else",
];

export const budgetRanges = ["< $25k", "$25k – $75k", "$75k – $150k", "$150k+", "Not sure yet"];
