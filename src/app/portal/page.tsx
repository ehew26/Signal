import type { Metadata } from "next";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  MessagesSquare,
  CreditCard,
  LifeBuoy,
  Download,
  Check,
  Circle,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import Shell, { type NavItem } from "@/components/dashboard/Shell";
import {
  portalClient,
  milestones,
  deliverables,
  portalMetrics,
  type Milestone,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Track your Vertex AI engagement — progress, deliverables, and reports.",
};

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Your engagement",
    items: [
      { label: "Overview", href: "/portal", icon: <LayoutDashboard /> },
      { label: "Milestones", href: "/portal", icon: <ListChecks /> },
      { label: "Deliverables", href: "/portal", icon: <FileText />, badge: "4" },
      { label: "Messages", href: "/portal", icon: <MessagesSquare /> },
      { label: "Billing", href: "/portal", icon: <CreditCard /> },
    ],
  },
  {
    section: "Help",
    items: [{ label: "Support", href: "/portal", icon: <LifeBuoy /> }],
  },
];

function ProgressRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a9a5b" />
          <stop offset="100%" stopColor="#96823c" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="url(#ring)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

const dotStyles: Record<Milestone["status"], string> = {
  done: "bg-emerald text-ink",
  active: "bg-violet text-white ring-4 ring-violet/20",
  upcoming: "bg-black/[0.05] text-mist-faint",
};

export default function PortalPage() {
  return (
    <Shell
      nav={nav}
      title={portalClient.engagement}
      subtitle={`${portalClient.name} · started ${portalClient.startedOn}`}
      user={{ name: "Dana Whitfield", role: portalClient.name, initials: "DW" }}
    >
      {/* Hero status */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl panel p-6 sm:p-8">
          <div className="absolute inset-0 -z-10 bg-brand-radial opacity-60" />
          <span className="chip">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
            {portalClient.health}
          </span>
          <h2 className="mt-4 max-w-md text-2xl font-semibold text-mist sm:text-3xl">
            Your AI agent is{" "}
            <span className="gradient-text">{portalClient.progress}% to production.</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-dim">
            On schedule and tracking well. Next up:{" "}
            <span className="text-mist">{portalClient.nextMilestone}</span>.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="btn-primary !px-5 !py-2.5">
              Message {portalClient.manager.split(" ")[0]} <ArrowUpRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-sm text-mist-dim">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                AR
              </span>
              <div>
                <p className="text-mist">{portalClient.manager}</p>
                <p className="text-xs text-mist-faint">{portalClient.managerRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl panel p-6">
          <div className="relative grid place-items-center">
            <ProgressRing value={portalClient.progress} />
            <div className="absolute text-center">
              <div className="text-3xl font-semibold gradient-text">{portalClient.progress}%</div>
              <div className="text-xs text-mist-faint">complete</div>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-mist-dim">
            <CalendarClock className="h-4 w-4 text-violet" />
            {portalClient.nextMilestone}
          </p>
        </div>
      </div>

      {/* Live metrics */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {portalMetrics.map((m) => (
          <div key={m.label} className="rounded-2xl panel p-5">
            <div className="text-2xl font-semibold gradient-text">{m.value}</div>
            <p className="mt-1 text-xs leading-snug text-mist-faint">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {/* Milestones timeline */}
        <div className="rounded-2xl panel p-6">
          <h2 className="font-semibold text-mist">Project timeline</h2>
          <ol className="mt-5 space-y-1">
            {milestones.map((m, i) => (
              <li key={m.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < milestones.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-full w-px bg-line" />
                )}
                <span
                  className={cn(
                    "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    dotStyles[m.status]
                  )}
                >
                  {m.status === "done" ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn("text-sm font-medium", m.status === "upcoming" ? "text-mist-dim" : "text-mist")}>
                      {m.title}
                    </h3>
                    <span className="shrink-0 text-xs text-mist-faint">{m.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-mist-faint">{m.detail}</p>
                  {m.status === "active" && (
                    <span className="mt-2 inline-flex rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-semibold text-violet">
                      In progress
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Deliverables */}
        <div className="rounded-2xl panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-mist">Deliverables</h2>
            <span className="text-xs text-mist-faint">{deliverables.length} files</span>
          </div>
          <ul className="mt-4 space-y-2">
            {deliverables.map((d) => (
              <li
                key={d.name}
                className="group flex items-center gap-3 rounded-xl border border-line bg-black/[0.02] px-3 py-3 transition-colors hover:border-line-strong"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet/10 text-violet">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-mist">{d.name}</p>
                  <p className="text-xs text-mist-faint">
                    {d.type} · {d.size} · {d.date}
                  </p>
                </div>
                <button
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-mist-faint transition-colors hover:bg-black/[0.04] hover:text-mist"
                  aria-label={`Download ${d.name}`}
                >
                  <Download className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
