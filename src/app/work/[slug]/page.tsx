import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import Aurora from "@/components/Aurora";
import Reveal from "@/components/Reveal";
import { caseStudies } from "@/lib/data";
import { caseStudyDetails } from "@/lib/content";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const study = caseStudies.find((c) => c.id === params.slug);
  if (!study) return { title: "Case study" };
  return {
    title: `${study.client} — ${study.result}`,
    description: study.summary,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = caseStudies.find((c) => c.id === params.slug);
  const detail = caseStudyDetails[params.slug];
  if (!study || !detail) notFound();

  return (
    <PageShell>
      <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
        <Aurora />
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal>
            <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-mist-dim transition-colors hover:text-mist">
              <ArrowLeft className="h-4 w-4" /> All work
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="chip">{study.industry}</span>
              <span className="text-xs uppercase tracking-wider text-mist-faint">{study.client}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{study.result}</h1>
            <p className="mt-4 max-w-2xl text-lg text-mist-dim">{study.summary}</p>
            <p className="mt-5 inline-flex rounded-full border border-line bg-black/[0.03] px-3 py-1.5 text-xs text-mist-faint">
              Illustrative example engagement — figures are target outcomes, not results from a named client.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8">
        <Reveal className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {detail.stats.map((s) => (
            <div key={s.label} className="rounded-2xl panel p-5 text-center">
              <div className="text-2xl font-semibold gradient-text sm:text-3xl">{s.value}</div>
              <p className="mt-1 text-xs leading-snug text-mist-faint">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-10">
          <Reveal>
            <h2 className="text-2xl font-semibold text-mist">The challenge</h2>
            <p className="mt-3 leading-relaxed text-mist-dim">{detail.challenge}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold text-mist">Our approach</h2>
            <ol className="mt-4 space-y-3">
              {detail.approach.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet/10 font-mono text-xs font-semibold text-violet">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed text-mist-dim">{step}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-semibold text-mist">The outcome</h2>
            <p className="mt-3 leading-relaxed text-mist-dim">{detail.outcome}</p>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-line bg-black/[0.02] p-7">
              <p className="text-sm leading-relaxed text-mist-dim">
                This is an illustrative engagement that shows how we&apos;d approach
                this problem. Want to be the named client behind a story like this?{" "}
                <Link href="/contact" className="text-violet hover:underline">
                  Let&apos;s talk
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Other work */}
      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-semibold text-mist">More work</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {caseStudies
              .filter((c) => c.id !== study.id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/work/${c.id}`}
                  className="group rounded-2xl panel p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
                >
                  <div className={cn("bg-gradient-to-r bg-clip-text text-3xl font-semibold text-transparent", c.accent)}>
                    {c.metric}
                  </div>
                  <p className="mt-2 text-sm font-medium text-mist">{c.result}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-violet">
                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
