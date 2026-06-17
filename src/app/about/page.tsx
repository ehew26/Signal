import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import { companyFacts, values, team, company } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vertex AI is a senior team of AI practitioners who ship production systems, not slideware. Meet the people and the principles behind the work.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title={<>Senior builders who <span className="gradient-text">ship</span></>}
        sub={`Founded in ${company.founded}, Vertex AI is a small, senior team that designs and deploys production-grade AI. We've shipped systems to millions of users — and we bring that bar to every engagement.`}
      />

      {/* Facts */}
      <section className="px-5 sm:px-8">
        <Reveal className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {companyFacts.map((f) => (
            <div key={f.label} className="rounded-2xl panel p-6 text-center">
              <div className="text-3xl font-semibold gradient-text">{f.value}</div>
              <p className="mt-1 text-xs text-mist-faint">{f.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What we <span className="gradient-text">believe</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={((i % 2) + 1) as 1 | 2}>
                <div className="h-full rounded-2xl panel p-7">
                  <div className="mb-4 h-1 w-10 rounded-full bg-brand-gradient" />
                  <h3 className="text-xl font-semibold text-mist">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-dim">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The <span className="gradient-text">team</span>
            </h2>
            <p className="mt-3 max-w-xl text-mist-dim">
              No armies of junior consultants. Every engagement is staffed by senior
              practitioners who write code and own outcomes.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="h-full rounded-2xl panel p-6">
                  <span className={cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-lg font-semibold text-white", m.accent)}>
                    {m.initials}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-mist">{m.name}</h3>
                  <p className="text-xs font-medium text-violet">{m.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-mist-dim">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-28 sm:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-line-strong px-8 py-14 text-center">
            <div className="absolute inset-0 -z-10 bg-brand-radial" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Want this team on your problem?
            </h2>
            <Link href="/contact" className="btn-primary mt-7">
              Book a strategy call <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
