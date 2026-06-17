import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Target, Package } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import { services } from "@/lib/data";
import { serviceDetails } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "From AI strategy to custom agents, automation, RAG systems, governance, and team enablement — end-to-end AI consulting built to last.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Services"
        title={<>End-to-end AI, <span className="gradient-text">built to last</span></>}
        sub="Six ways we create leverage — from the first strategy session to a hardened production system your team owns."
      />

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-5">
          {services.map((s, i) => {
            const detail = serviceDetails[s.id];
            return (
              <Reveal key={s.id} delay={((i % 2) + 1) as 1 | 2}>
                <article className="group grid gap-6 rounded-2xl panel p-7 transition-all duration-300 hover:border-line-strong sm:grid-cols-[auto_1fr] sm:p-8">
                  <span className="grid h-14 w-14 place-items-center self-start rounded-2xl bg-violet/10 ring-1 ring-line-strong">
                    <s.icon className="h-7 w-7 text-violet" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-2xl font-semibold text-mist">{s.title}</h2>
                      {detail && (
                        <span className="chip">
                          <Clock className="h-3.5 w-3.5" /> {detail.timeframe}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist-dim">{s.blurb}</p>

                    {detail && (
                      <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist-faint">
                            <Target className="h-3.5 w-3.5 text-cyan" /> The outcome
                          </p>
                          <p className="mt-2 text-sm text-mist">{detail.outcome}</p>
                          <p className="mt-3 text-xs text-mist-faint">
                            <span className="text-mist-dim">Ideal for:</span> {detail.idealFor}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist-faint">
                            <Package className="h-3.5 w-3.5 text-cyan" /> What you get
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {detail.deliverables.map((d) => (
                              <li key={d} className="flex items-center gap-2 text-sm text-mist-dim">
                                <Check className="h-4 w-4 shrink-0 text-cyan" /> {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-12 max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-line-strong px-8 py-14 text-center">
            <div className="absolute inset-0 -z-10 bg-brand-radial" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-mist-dim">
              That&apos;s the most common starting point. A 2-week Sprint finds your
              highest-ROI bet — and tells you honestly which ideas to skip.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Book a strategy call <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/#pricing" className="btn-ghost">See pricing</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
