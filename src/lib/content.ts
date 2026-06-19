/**
 * Long-form marketing & company content for Vertex AI.
 * Kept separate from data.ts (dashboard/app data) for clarity.
 */

export const company = {
  name: "Vertex AI",
  legalName: "Vertex AI, LLC",
  tagline: "Production-grade AI for ambitious companies.",
  email: "hello@vertex-ai.com",
  salesEmail: "newbusiness@vertex-ai.com",
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
  agents: {
    slug: "agents",
    outcome: "Autonomous agents that take real work off your team's plate.",
    deliverables: ["Agent architecture & tool design", "Production deployment", "Eval suite & guardrails", "Monitoring dashboard"],
    idealFor: "Teams drowning in repetitive, judgment-heavy tasks.",
    timeframe: "4–8 weeks to v1",
  },
  automation: {
    slug: "automation",
    outcome: "Zero-touch pipelines that run your busywork while you sleep.",
    deliverables: ["Process audit & mapping", "Automated pipelines", "Error handling & alerts", "Runbook & handoff"],
    idealFor: "Ops teams with high-volume manual workflows.",
    timeframe: "3–6 weeks",
  },
  strategy: {
    slug: "strategy",
    outcome: "A board-ready AI roadmap tied to dollars and timelines.",
    deliverables: ["Opportunity assessment", "Build-vs-buy analysis", "Cost & ROI model", "90-day execution plan"],
    idealFor: "Leadership teams deciding where to place AI bets.",
    timeframe: "2–3 weeks",
  },
  rag: {
    slug: "rag",
    outcome: "A trustworthy knowledge engine that cites its sources.",
    deliverables: ["Hybrid retrieval system", "Source-grounded answers", "Hallucination evals", "Admin & feedback tools"],
    idealFor: "Companies sitting on knowledge their teams can't find.",
    timeframe: "4–7 weeks",
  },
  governance: {
    slug: "governance",
    outcome: "Ship AI fast without shipping risk.",
    deliverables: ["Eval harness", "PII & access controls", "Audit logging", "Policy framework"],
    idealFor: "Regulated industries and risk-conscious leadership.",
    timeframe: "3–5 weeks",
  },
  enablement: {
    slug: "enablement",
    outcome: "Your team ships AI confidently, long after we leave.",
    deliverables: ["Hands-on workshops", "Prompt & eval libraries", "Internal playbooks", "Ongoing advisory"],
    idealFor: "Teams that want to build the muscle in-house.",
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
      "A fast-growing B2B SaaS company's support team was drowning in repetitive tickets — password resets, how-tos, billing questions. First-response times kept climbing and senior agents burned out on work far below their level.",
    approach: [
      "Analyzed 6 months of tickets to find the highest-volume, automatable intents.",
      "Built a support agent grounded in their help center, API docs, and product data.",
      "Added strict guardrails: cite sources, never guess, escalate anything uncertain to a human with full context.",
      "Ran an eval suite against real historical tickets before launch, then rolled out intent by intent.",
    ],
    outcome:
      "The agent resolves the bulk of repetitive tickets end-to-end, drafts replies for the rest, and routes complex issues to the right human — so the team spends its time on the conversations that actually need them.",
    stats: [
      { value: "−52%", label: "Tickets handled by humans" },
      { value: "<2 min", label: "Median first response" },
      { value: "100%", label: "Answers cited & grounded" },
      { value: "4.6/5", label: "CSAT on automated replies" },
    ],
    quote: {
      text: "Illustrative engagement — your story could go here.",
      author: "Vertex AI",
    },
  },
  meridian: {
    slug: "meridian",
    challenge:
      "Clinicians at Meridian wasted hours hunting through 2M+ documents for guidance — with zero tolerance for a wrong or unsourced answer.",
    approach: [
      "Built a hybrid retrieval system over the full clinical corpus.",
      "Grounded every answer in citations with confidence scoring.",
      "Designed a hallucination eval harness reviewed by clinical staff.",
      "Added PII controls and full audit logging for compliance.",
    ],
    outcome:
      "A clinical assistant that clinicians actually trust — answers are fast, cited, and safe, with a human always able to verify the source.",
    stats: [
      { value: "4.1 hrs", label: "Saved / clinician / week" },
      { value: "2M+", label: "Documents indexed" },
      { value: "0", label: "Unsourced answers shipped" },
      { value: "96%", label: "Clinician satisfaction" },
    ],
    quote: {
      text: "They were obsessive about evals and safety, which is exactly what you want when AI touches patient data.",
      author: "Dr. Marcus Lee, VP Clinical Ops",
    },
  },
  atlas: {
    slug: "atlas",
    challenge:
      "Atlas's underwriters spent days drafting memos and manually flagging risk, creating a bottleneck on every loan decision.",
    approach: [
      "Built an underwriting copilot that drafts memos from application data.",
      "Layered in risk-flagging with explainable rationale.",
      "Kept a human firmly in the loop for every final decision.",
      "Integrated directly into the existing underwriting workflow.",
    ],
    outcome:
      "Underwriters move 9× faster on routine decisions and spend their time on the judgment calls that actually need a human.",
    stats: [
      { value: "9×", label: "Faster decisions" },
      { value: "−61%", label: "Memo drafting time" },
      { value: "100%", label: "Human-reviewed" },
      { value: "$2.4M", label: "Annual capacity unlocked" },
    ],
    quote: {
      text: "Vertex handed us production software and trained our team to own it. We've shipped four more features ourselves since.",
      author: "Priya Nair, Head of Engineering",
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
