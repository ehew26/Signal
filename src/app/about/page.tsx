import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import { companyFacts, values, company } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vertex AI is a founder-led, senior practice that ships production-grade AI, not slideware. The principles and the people behind the work.",
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

      {/* Who you work with */}
      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Who you <span className="gradient-text">work with</span>
            </h2>
            <p className="mt-4 leading-relaxed text-mist-dim">
              No armies of junior consultants. Every engagement is led by the
              founder and staffed by senior practitioners who write the code and
              own the outcome — the same people in the sales call are the ones
              shipping your system.
            </p>
            <p className="mt-4 leading-relaxed text-mist-dim">
              We&apos;re a new, deliberately small practice. That means you get
              senior attention and a direct line — not a handoff to an offshore
              team after the contract is signed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-28 sm:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-line-strong px-8 py-14 text-center">
            <div className="absolute inset-0 -z-10 bg-brand-radial" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Want senior AI talent on your problem?
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
