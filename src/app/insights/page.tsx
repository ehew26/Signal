import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on shipping production AI — evals, build-vs-buy, agent safety, and the lessons behind the work.",
};

export default function InsightsPage() {
  const [featured, ...rest] = posts;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights"
        title={<>Notes from the <span className="gradient-text">field</span></>}
        sub="What we've learned shipping AI to production — the patterns, the trade-offs, and the mistakes worth avoiding."
      />

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Featured */}
          <Reveal>
            <Link
              href={`/insights/${featured.slug}`}
              className="group block overflow-hidden rounded-2xl panel p-8 transition-all duration-300 hover:border-line-strong sm:p-10"
            >
              <div className="flex items-center gap-3 text-xs text-mist-faint">
                <span className="chip">{featured.category}</span>
                <span>{featured.date}</span>
                <span>· {featured.readTime} read</span>
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-mist-dim">{featured.excerpt}</p>
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </Reveal>

          {/* Rest */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={((i % 2) + 1) as 1 | 2}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl panel p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong"
                >
                  <div className="flex items-center gap-3 text-xs text-mist-faint">
                    <span className="chip">{p.category}</span>
                    <span>{p.readTime} read</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-mist">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-dim">{p.excerpt}</p>
                  <p className="mt-5 text-xs text-mist-faint">{p.author} · {p.date}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
