import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageShell from "@/components/site/PageShell";
import Aurora from "@/components/Aurora";
import Reveal from "@/components/Reveal";
import { posts } from "@/lib/content";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const next = posts[(posts.indexOf(post) + 1) % posts.length];

  return (
    <PageShell>
      <article>
        <section className="relative overflow-hidden pt-36 pb-10 sm:pt-44">
          <Aurora />
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal>
              <Link href="/insights" className="inline-flex items-center gap-1.5 text-sm text-mist-dim transition-colors hover:text-mist">
                <ArrowLeft className="h-4 w-4" /> All insights
              </Link>
              <div className="mt-6 flex items-center gap-3 text-xs text-mist-faint">
                <span className="chip">{post.category}</span>
                <span>{post.date}</span>
                <span>· {post.readTime} read</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
              <div className="mt-6 flex items-center gap-2 text-sm text-mist-dim">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </span>
                {post.author}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-5 pb-16 sm:px-8">
          <Reveal className="mx-auto max-w-3xl space-y-5">
            <p className="text-lg font-medium leading-relaxed text-mist">{post.excerpt}</p>
            {post.body.map((para, i) => (
              <p key={i} className="leading-relaxed text-mist-dim">{para}</p>
            ))}
          </Reveal>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <Reveal className="mx-auto max-w-3xl">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl panel p-7 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-mist-faint">Read next</p>
                <p className="mt-1 text-lg font-semibold text-mist">{next.title}</p>
              </div>
              <Link href={`/insights/${next.slug}`} className="btn-ghost shrink-0">
                Continue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </article>
    </PageShell>
  );
}
