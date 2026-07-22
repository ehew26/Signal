import type { Metadata } from "next";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitBranch,
  LineChart,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Trophy,
  AlertTriangle,
  Rocket,
  StickyNote,
  Inbox,
} from "lucide-react";
import Shell, { type NavItem } from "@/components/dashboard/Shell";
import Sparkline from "@/components/dashboard/Sparkline";
import AreaChart from "@/components/dashboard/AreaChart";
import {
  kpis,
  pipeline,
  activity,
  type ProjectStatus,
  type Activity,
} from "@/lib/data";
import {
  getProjects,
  getNewLeadsCount,
  getActiveSubscriptionsCount,
} from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Internal Dashboard",
  description: "Vertex AI internal operations dashboard.",
};

// Always render fresh so new leads/projects show up immediately.
export const dynamic = "force-dynamic";

const nav: { section: string; items: NavItem[] }[] = [
  {
    section: "Operate",
    items: [
      { label: "Overview", href: "/dashboard", icon: <LayoutDashboard /> },
      { label: "Pipeline", href: "/dashboard", icon: <GitBranch />, badge: "8" },
      { label: "Projects", href: "/dashboard", icon: <Briefcase /> },
      { label: "Clients", href: "/dashboard", icon: <Users /> },
      { label: "Analytics", href: "/dashboard", icon: <LineChart /> },
    ],
  },
  {
    section: "Workspace",
    items: [
      { label: "Client Portal", href: "/portal", icon: <Rocket /> },
      { label: "Settings", href: "/dashboard", icon: <Settings /> },
    ],
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  "On Track": "bg-emerald/10 text-emerald ring-emerald/20",
  "At Risk": "bg-amber/10 text-amber ring-amber/20",
  Completed: "bg-violet/10 text-violet ring-violet/20",
  Discovery: "bg-cyan/10 text-cyan ring-cyan/20",
};

const activityIcon: Record<Activity["kind"], { icon: typeof Trophy; color: string }> = {
  win: { icon: Trophy, color: "text-emerald" },
  alert: { icon: AlertTriangle, color: "text-amber" },
  ship: { icon: Rocket, color: "text-violet" },
  note: { icon: StickyNote, color: "text-cyan" },
};

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl panel p-5 sm:p-6", className)}>{children}</div>;
}

export default async function DashboardPage() {
  const [projects, newLeads, activeSubs] = await Promise.all([
    getProjects(),
    getNewLeadsCount(),
    getActiveSubscriptionsCount(),
  ]);

  return (
    <Shell
      nav={nav}
      title="Overview"
      subtitle="Good morning, Ada — here's how the business is tracking."
      user={{ name: "Ada Reyes", role: "Founder & Principal", initials: "AR" }}
    >
      {newLeads !== null && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-violet/30 bg-violet/[0.06] px-5 py-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet/15 text-violet">
            <Inbox className="h-4 w-4" />
          </span>
          <p className="text-sm text-mist">
            <span className="font-semibold">{newLeads}</span>{" "}
            {newLeads === 1 ? "new lead" : "new leads"} captured in the last 30 days
          </p>
          {activeSubs !== null && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-2.5 py-1 text-xs font-medium text-emerald">
              💳 {activeSubs} active {activeSubs === 1 ? "subscription" : "subscriptions"}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" /> Live from Supabase
          </span>
        </div>
      )}
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const up = k.delta >= 0;
          return (
            <Panel key={k.id} className="!p-5">
              <p className="text-sm text-mist-dim">{k.label}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <span className="text-2xl font-semibold text-mist">{k.value}</span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                    up ? "bg-emerald/10 text-emerald" : "bg-rose/10 text-rose"
                  )}
                >
                  {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(k.delta)}%
                </span>
              </div>
              <Sparkline data={k.spark} positive={up} className="mt-3 h-9 w-full" />
            </Panel>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* Revenue chart */}
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-mist">Revenue & Pipeline</h2>
              <p className="text-xs text-mist-faint">Last 7 months · $ thousands</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-mist-dim">
                <span className="h-2 w-2 rounded-full bg-violet" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-mist-dim">
                <span className="h-2 w-2 rounded-full bg-cyan" /> Pipeline
              </span>
            </div>
          </div>
          <div className="mt-4 h-[240px]">
            <AreaChart />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald">
            <TrendingUp className="h-4 w-4" />
            Revenue up 91% since December — strongest two-quarter run to date.
          </div>
        </Panel>

        {/* Activity feed */}
        <Panel>
          <h2 className="font-semibold text-mist">Recent activity</h2>
          <ul className="mt-4 space-y-1">
            {activity.map((a) => {
              const { icon: Icon, color } = activityIcon[a.kind];
              return (
                <li key={a.id} className="flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-black/[0.03]">
                  <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-black/[0.04]", color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-mist">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-mist-dim">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-xs text-mist-faint">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Pipeline board */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-mist">Sales pipeline</h2>
          <span className="text-xs text-mist-faint">$512k across 8 open deals</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="rounded-2xl panel p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-mist">{stage.stage}</span>
                <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-xs text-mist-dim">{stage.count}</span>
              </div>
              <p className="mt-1 text-xs text-mist-faint">{stage.value}</p>
              <div className="mt-3 space-y-2">
                {stage.deals.map((d) => (
                  <div
                    key={d.client}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-black/[0.02] px-3 py-2.5 transition-colors hover:border-line-strong"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-mist">{d.client}</p>
                      <p className="text-xs text-mist-faint">{d.value}</p>
                    </div>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white">
                      {d.owner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects table */}
      <div className="mt-4">
        <Panel className="!p-0">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-mist">Active engagements</h2>
            <button className="text-xs font-medium text-violet hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wider text-mist-faint">
                  <th scope="col" className="px-5 py-3 font-medium sm:px-6">Client</th>
                  <th scope="col" className="px-5 py-3 font-medium">Engagement</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Progress</th>
                  <th scope="col" className="px-5 py-3 font-medium">Value</th>
                  <th scope="col" className="px-5 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-black/[0.02]">
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-[11px] font-semibold text-white">
                          {p.owner}
                        </span>
                        <span className="font-medium text-mist">{p.client}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-mist-dim">{p.engagement}</td>
                    <td className="px-5 py-4">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium ring-1", statusStyles[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/[0.05]">
                          <div
                            className="h-full rounded-full bg-brand-gradient"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-mist-faint">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-mist">{p.value}</td>
                    <td className="px-5 py-4 text-mist-dim">{p.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}
