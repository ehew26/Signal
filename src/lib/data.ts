/**
 * Mock data for Vertex AI.
 * Front-end only — these shapes are intentionally close to what a real
 * Supabase schema would return, so swapping in live data later is a small lift.
 */

import {
  Bot,
  Workflow,
  LineChart,
  Database,
  ShieldCheck,
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
    id: "agents",
    title: "Custom AI Agents",
    blurb:
      "Autonomous, tool-using agents wired into your stack — handling support, research, and ops with human-grade judgment.",
    icon: Bot,
    points: ["Multi-step tool use", "Human-in-the-loop guardrails", "Sub-second routing"],
  },
  {
    id: "automation",
    title: "Workflow Automation",
    blurb:
      "Kill the busywork. We map your highest-leverage processes and automate them end-to-end with reliable, observable pipelines.",
    icon: Workflow,
    points: ["Process discovery", "Zero-touch pipelines", "Full audit trails"],
  },
  {
    id: "strategy",
    title: "AI Strategy & Roadmaps",
    blurb:
      "A board-ready plan that ties AI initiatives to revenue, risk, and timeline — so you invest in what actually compounds.",
    icon: LineChart,
    points: ["Opportunity sizing", "Build-vs-buy analysis", "90-day execution plan"],
  },
  {
    id: "rag",
    title: "Knowledge & RAG Systems",
    blurb:
      "Turn scattered docs into a trustworthy, cited knowledge engine your team and customers can actually rely on.",
    icon: Database,
    points: ["Hybrid retrieval", "Source-grounded answers", "Evals & hallucination control"],
  },
  {
    id: "governance",
    title: "AI Governance & Safety",
    blurb:
      "Ship fast without shipping risk. Policy, evaluation, and monitoring frameworks built for regulated environments.",
    icon: ShieldCheck,
    points: ["Eval harnesses", "PII & access controls", "Compliance-ready logging"],
  },
  {
    id: "enablement",
    title: "Team Enablement",
    blurb:
      "We don't just build and leave. Your team ships confidently with hands-on training and reusable internal playbooks.",
    icon: Sparkles,
    points: ["Workshops & playbooks", "Prompt & eval libraries", "Ongoing advisory"],
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
    title: "Discover",
    description:
      "We audit your workflows, data, and goals to find the AI bets with the highest, fastest ROI — and the ones to avoid.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "A concrete architecture and success metrics. You get a build plan, cost model, and risk map before a line of code ships.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Rapid, evaluated iterations. We ship working software in weeks, not quarters, with evals gating every release.",
  },
  {
    step: "04",
    title: "Scale",
    description:
      "Production hardening, monitoring, and team enablement so the system keeps compounding long after we're gone.",
  },
];

export type Metric = { value: string; label: string };

export const heroMetrics: Metric[] = [
  { value: "$42M+", label: "Client value created" },
  { value: "120+", label: "AI systems shipped" },
  { value: "6.2×", label: "Avg. ROI in year one" },
  { value: "98%", label: "Client retention" },
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
    client: "Northwind Logistics",
    industry: "Supply Chain",
    result: "Autonomous dispatch agent",
    metric: "−38%",
    metricLabel: "operating cost",
    summary:
      "Replaced a 12-person manual routing desk with an agent that books, reroutes, and escalates in real time.",
    accent: "from-violet to-cyan",
  },
  {
    id: "meridian",
    client: "Meridian Health",
    industry: "Healthcare",
    result: "Clinical knowledge assistant",
    metric: "4.1 hrs",
    metricLabel: "saved per clinician / week",
    summary:
      "A source-grounded RAG assistant over 2M clinical documents — with zero tolerance for hallucination.",
    accent: "from-cyan to-emerald",
  },
  {
    id: "atlas",
    client: "Atlas Financial",
    industry: "Fintech",
    result: "Underwriting copilot",
    metric: "9×",
    metricLabel: "faster decisions",
    summary:
      "An underwriting copilot that drafts memos and flags risk, keeping a human firmly in the loop.",
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
    name: "Sprint",
    price: "$12k",
    cadence: "/ 2-week sprint",
    tagline: "Validate one high-value AI use case, fast.",
    features: [
      "Discovery & opportunity sizing",
      "One working prototype",
      "Eval baseline & cost model",
      "Executive readout",
    ],
    cta: "Start a sprint",
  },
  {
    name: "Build",
    price: "$28k",
    cadence: "/ month",
    tagline: "Ship a production system with a dedicated pod.",
    features: [
      "Dedicated senior pod",
      "Production-grade build & evals",
      "Monitoring & observability",
      "Weekly demos & async access",
      "Team enablement included",
    ],
    highlighted: true,
    cta: "Book a strategy call",
  },
  {
    name: "Partner",
    price: "Custom",
    cadence: "/ engagement",
    tagline: "Embedded AI leadership across your org.",
    features: [
      "Fractional Head of AI",
      "Multi-team roadmap & governance",
      "Vendor & build-vs-buy strategy",
      "Quarterly board reporting",
      "Priority SLAs",
    ],
    cta: "Talk to a partner",
  },
];

export const clientLogos = [
  "Northwind",
  "Meridian",
  "Atlas",
  "Lumen",
  "Cascade",
  "Orbital",
  "Vanta",
  "Polaris",
];

export const faqs = [
  {
    q: "How fast can you actually ship something?",
    a: "Our 2-week Sprint produces a working prototype against your real data. Most production builds reach a usable v1 within 4–6 weeks.",
  },
  {
    q: "We're worried about hallucinations and data security. How do you handle that?",
    a: "Every engagement ships with an eval harness, source-grounding, and access controls. For regulated clients we add PII redaction, audit logging, and human-in-the-loop gating.",
  },
  {
    q: "Do you lock us into proprietary tools?",
    a: "Never. We build on your cloud and your stack, document everything, and train your team to own it. No black boxes.",
  },
  {
    q: "What if we don't know where to start?",
    a: "That's the most common starting point. Our Discovery phase finds the highest-ROI bets and tells you honestly which AI ideas aren't worth it yet.",
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
