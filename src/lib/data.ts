/**
 * Mock data for Vertex AI.
 * Front-end only — these shapes are intentionally close to what a real
 * Supabase schema would return, so swapping in live data later is a small lift.
 */

import {
  Bot,
  Phone,
  Calendar,
  Star,
  Workflow,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Marketing site                                                             */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  points: string[];
};

export const services: Service[] = [
  {
    id: "chatbot",
    title: "AI Receptionist & Chatbot",
    blurb:
      "Answers customer calls, texts, and website chats 24/7 — answers FAQs and books jobs so you never miss business, even after hours.",
    icon: Bot,
    points: ["Replies in seconds, 24/7", "Trained on your business", "Hands off to you when needed"],
  },
  {
    id: "leads",
    title: "Lead Capture & Follow-Up",
    blurb:
      "Instantly captures every lead and follows up by text and email, so hot prospects don't go cold while you're on the job.",
    icon: Phone,
    points: ["Instant lead response", "Automated follow-up", "Nothing slips through"],
  },
  {
    id: "booking",
    title: "Appointment Booking",
    blurb:
      "Lets customers book and reschedule themselves, synced to your calendar — with automatic reminders that cut no-shows.",
    icon: Calendar,
    points: ["Self-serve scheduling", "Calendar sync", "Reminders cut no-shows"],
  },
  {
    id: "reviews",
    title: "Reviews & Reputation",
    blurb:
      "Automatically asks happy customers for reviews at the right moment — and quietly routes unhappy ones to you first.",
    icon: Star,
    points: ["Automated review requests", "More 5-star reviews", "Catch issues privately"],
  },
  {
    id: "automation",
    title: "Workflow Automation",
    blurb:
      "Automates the repetitive admin — quotes, invoices, reminders, data entry — so you spend your time on the work that pays.",
    icon: Workflow,
    points: ["Quotes & invoices", "Reminders & receipts", "No more copy-paste"],
  },
  {
    id: "setup",
    title: "Done-For-You Setup",
    blurb:
      "We set it all up and keep it running. No tech skills required, no new tools to learn — it works with what you already use.",
    icon: Sparkles,
    points: ["Fully managed setup", "Works with your tools", "Ongoing support"],
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Quick call",
    description:
      "A 20-minute chat about your business — where you're losing leads, missing calls, or drowning in admin. No tech jargon.",
  },
  {
    step: "02",
    title: "We build it",
    description:
      "We set everything up for you — chatbot, lead follow-up, booking — trained on your business. You don't lift a finger.",
  },
  {
    step: "03",
    title: "Go live",
    description:
      "Your AI assistant goes live in days, answering customers and capturing leads around the clock. We test it with you first.",
  },
  {
    step: "04",
    title: "We maintain it",
    description:
      "We keep it running and improving, and you get a real person to call. Cancel anytime — no lock-in, no surprises.",
  },
];

export type Metric = { value: string; label: string };

export const heroMetrics: Metric[] = [
  { value: "24/7", label: "Answers customers, day or night" },
  { value: "<1 min", label: "Response to every new lead" },
  { value: "0", label: "Missed calls or leads" },
  { value: "Days", label: "To go live" },
];

export type CaseStudy = {
  id: string;
  client: string;
  industry: string;
  result: string;
  metric: string;
  metricLabel: string;
  summary: string;
  accent: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "northwind",
    client: "Home-services company",
    industry: "Home Services",
    result: "AI receptionist & lead follow-up",
    metric: "+38%",
    metricLabel: "more booked jobs",
    summary:
      "A 24/7 assistant that answers calls and texts, captures every lead, and books jobs — even after hours and on weekends.",
    accent: "from-violet to-cyan",
  },
  {
    id: "meridian",
    client: "Dental practice",
    industry: "Healthcare",
    result: "Missed-call text-back & booking",
    metric: "−71%",
    metricLabel: "missed-call no-shows",
    summary:
      "Every missed call gets an instant text back that answers questions and books the appointment, so new patients don't call the next clinic.",
    accent: "from-cyan to-emerald",
  },
  {
    id: "atlas",
    client: "Salon & spa",
    industry: "Local Services",
    result: "Reviews & rebooking automation",
    metric: "+180",
    metricLabel: "new 5-star reviews",
    summary:
      "Automated review requests and rebooking reminders that lifted their rating and kept the calendar full.",
    accent: "from-amber to-rose",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Vertex shipped a working agent in three weeks that our last vendor quoted six months for. The ROI conversation was over before the first invoice.",
    name: "Dana Whitfield",
    role: "COO",
    company: "Northwind Logistics",
  },
  {
    quote:
      "They were obsessive about evals and safety, which is exactly what you want when AI touches patient data. Genuinely the most credible team we've worked with.",
    name: "Dr. Marcus Lee",
    role: "VP Clinical Ops",
    company: "Meridian Health",
  },
  {
    quote:
      "Most consultants hand you a deck. Vertex handed us production software and trained our team to own it. We've shipped four more features ourselves since.",
    name: "Priya Nair",
    role: "Head of Engineering",
    company: "Atlas Financial",
  },
];

export type Plan = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    price: "$299",
    cadence: "/ month",
    tagline: "Answer customers and capture every lead, 24/7.",
    features: [
      "AI chatbot on your website",
      "Instant lead capture + text-back",
      "Email & text lead alerts",
      "Setup done for you",
    ],
    cta: "Get started",
  },
  {
    name: "Growth",
    price: "$599",
    cadence: "/ month",
    tagline: "Automate booking, follow-up, and reviews.",
    features: [
      "Everything in Starter",
      "Appointment booking + reminders",
      "Automated follow-up sequences",
      "Automated review requests",
      "Priority support",
    ],
    highlighted: true,
    cta: "Book a call",
  },
  {
    name: "Done-For-You",
    price: "Custom",
    cadence: "/ project",
    tagline: "Full automation, fully managed for you.",
    features: [
      "Custom workflows for your business",
      "Integrations with your tools",
      "Dedicated setup & management",
      "Ongoing optimization",
      "A real person to call",
    ],
    cta: "Talk to us",
  },
];

// The tools we build on — true, not fabricated client logos.
export const clientLogos = [
  "OpenAI",
  "Anthropic",
  "AWS",
  "Google Cloud",
  "Azure",
  "Supabase",
  "Postgres",
  "Vercel",
];

export const faqs = [
  {
    q: "Do I need to be technical to use this?",
    a: "Not at all. We set everything up for you and keep it running. There's nothing to install and no new software to learn — it works with the phone number, website, and tools you already have.",
  },
  {
    q: "How fast can it go live?",
    a: "Most small businesses are up and running within a few days. We build it, test it with you, and flip it on once you're happy.",
  },
  {
    q: "Will customers know they're talking to AI? Will it sound robotic?",
    a: "It's trained on your business so it sounds like you, and it hands off to a real person whenever something needs a human. The goal is happier customers, not a frustrating phone tree.",
  },
  {
    q: "What does it cost, and am I locked in?",
    a: "Plans start at $299/month with setup included, and you can cancel anytime — no long contracts, no lock-in. Most clients make it back from a single extra booked job.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Internal Ops Dashboard                                                     */
/* -------------------------------------------------------------------------- */

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: number; // percentage change
  spark: number[];
};

export const kpis: Kpi[] = [
  { id: "mrr", label: "Monthly Recurring Revenue", value: "$184,200", delta: 12.4, spark: [120, 132, 128, 145, 150, 168, 184] },
  { id: "pipeline", label: "Pipeline Value", value: "$512,000", delta: 8.1, spark: [380, 410, 405, 455, 470, 498, 512] },
  { id: "leads", label: "Qualified Leads", value: "42", delta: 23.0, spark: [22, 28, 25, 31, 34, 38, 42] },
  { id: "clients", label: "Active Clients", value: "18", delta: 5.9, spark: [12, 13, 14, 15, 16, 17, 18] },
];

export type MonthlyPoint = { month: string; revenue: number; pipeline: number };

export const revenueSeries: MonthlyPoint[] = [
  { month: "Dec", revenue: 96, pipeline: 280 },
  { month: "Jan", revenue: 112, pipeline: 320 },
  { month: "Feb", revenue: 124, pipeline: 360 },
  { month: "Mar", revenue: 138, pipeline: 410 },
  { month: "Apr", revenue: 151, pipeline: 448 },
  { month: "May", revenue: 168, pipeline: 486 },
  { month: "Jun", revenue: 184, pipeline: 512 },
];

export type PipelineStage = {
  stage: string;
  count: number;
  value: string;
  deals: { client: string; value: string; owner: string }[];
};

export const pipeline: PipelineStage[] = [
  {
    stage: "Discovery",
    count: 3,
    value: "$96k",
    deals: [
      { client: "Helix Bio", value: "$28k", owner: "AR" },
      { client: "Verge Retail", value: "$40k", owner: "JL" },
      { client: "Cobalt Energy", value: "$28k", owner: "AR" },
    ],
  },
  {
    stage: "Proposal",
    count: 2,
    value: "$140k",
    deals: [
      { client: "Stride Logistics", value: "$84k", owner: "MP" },
      { client: "Aperture Labs", value: "$56k", owner: "JL" },
    ],
  },
  {
    stage: "Negotiation",
    count: 2,
    value: "$176k",
    deals: [
      { client: "Quanta Finance", value: "$120k", owner: "AR" },
      { client: "Birch & Co", value: "$56k", owner: "MP" },
    ],
  },
  {
    stage: "Closing",
    count: 1,
    value: "$100k",
    deals: [{ client: "Meridian Health", value: "$100k", owner: "JL" }],
  },
];

export type ProjectStatus = "On Track" | "At Risk" | "Completed" | "Discovery";

export type Project = {
  id: string;
  client: string;
  engagement: string;
  status: ProjectStatus;
  progress: number;
  owner: string;
  value: string;
  due: string;
};

export const projects: Project[] = [
  { id: "p1", client: "Northwind Logistics", engagement: "Dispatch Agent", status: "On Track", progress: 72, owner: "AR", value: "$84k", due: "Jul 18" },
  { id: "p2", client: "Meridian Health", engagement: "Clinical RAG Assistant", status: "At Risk", progress: 48, owner: "JL", value: "$100k", due: "Aug 02" },
  { id: "p3", client: "Atlas Financial", engagement: "Underwriting Copilot", status: "On Track", progress: 64, owner: "MP", value: "$76k", due: "Jul 29" },
  { id: "p4", client: "Cascade Media", engagement: "Content Automation", status: "Completed", progress: 100, owner: "AR", value: "$32k", due: "Jun 09" },
  { id: "p5", client: "Orbital Telecom", engagement: "Support Agent v2", status: "Discovery", progress: 15, owner: "JL", value: "$58k", due: "Aug 21" },
];

export type Activity = {
  id: string;
  who: string;
  action: string;
  target: string;
  time: string;
  kind: "win" | "note" | "alert" | "ship";
};

export const activity: Activity[] = [
  { id: "a1", who: "Ada R.", action: "closed", target: "Meridian Health — $100k", time: "12m ago", kind: "win" },
  { id: "a2", who: "System", action: "flagged at-risk", target: "Clinical RAG Assistant", time: "1h ago", kind: "alert" },
  { id: "a3", who: "Jamie L.", action: "shipped", target: "Dispatch Agent v1.4", time: "3h ago", kind: "ship" },
  { id: "a4", who: "Marc P.", action: "logged a call with", target: "Quanta Finance", time: "5h ago", kind: "note" },
  { id: "a5", who: "Ada R.", action: "moved to Negotiation", target: "Birch & Co", time: "Yesterday", kind: "note" },
];

/* -------------------------------------------------------------------------- */
/*  Client Portal                                                              */
/* -------------------------------------------------------------------------- */

export const portalClient = {
  name: "Northwind Logistics",
  engagement: "Autonomous Dispatch Agent",
  manager: "Ada Reyes",
  managerRole: "Engagement Lead",
  health: "On Track",
  progress: 72,
  startedOn: "May 5, 2026",
  nextMilestone: "Production rollout · Jul 18",
};

export type Milestone = {
  title: string;
  status: "done" | "active" | "upcoming";
  date: string;
  detail: string;
};

export const milestones: Milestone[] = [
  { title: "Discovery & data audit", status: "done", date: "May 12", detail: "Mapped 9 workflows; identified routing as top ROI." },
  { title: "Architecture & eval baseline", status: "done", date: "May 26", detail: "Agent design approved; eval suite at 94% accuracy." },
  { title: "Prototype on live data", status: "done", date: "Jun 09", detail: "Booking & reroute flows working end-to-end." },
  { title: "Hardening & monitoring", status: "active", date: "Jul 03", detail: "Adding observability, fallbacks, and human escalation." },
  { title: "Production rollout", status: "upcoming", date: "Jul 18", detail: "Phased rollout to the full dispatch team." },
];

export type Deliverable = {
  name: string;
  type: string;
  date: string;
  size: string;
};

export const deliverables: Deliverable[] = [
  { name: "AI Opportunity Audit", type: "PDF", date: "May 12", size: "2.4 MB" },
  { name: "Agent Architecture Spec", type: "PDF", date: "May 26", size: "1.1 MB" },
  { name: "Eval Report — v1 Prototype", type: "PDF", date: "Jun 09", size: "860 KB" },
  { name: "Cost & ROI Model", type: "XLSX", date: "Jun 09", size: "320 KB" },
];

export const portalMetrics: Metric[] = [
  { value: "−38%", label: "Routing cost vs. baseline" },
  { value: "94%", label: "Eval accuracy" },
  { value: "2.1s", label: "Avg. decision latency" },
  { value: "1,240", label: "Dispatches automated" },
];
