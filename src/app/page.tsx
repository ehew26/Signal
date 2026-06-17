import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Quote,
  Star,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import Faq from "@/components/site/Faq";
import Aurora from "@/components/Aurora";
import Reveal from "@/components/Reveal";
import {
  services,
  caseStudies,
  processSteps,
  testimonials,
  plans,
  clientLogos,
} from "@/lib/data";
import { cn } from "@/lib/utils";

function SectionHeading({
  eyebrow,
  title,
  sub,
  center = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <span className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-violet" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-mist-dim sm:text-lg">{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Aurora />

      <main>
        <Hero />

        {/* ---------- Logo marquee ---------- */}
        <section className="py-10">
          <p className="mb-8 text-center text-xs uppercase tracking-[0.22em] text-mist-faint">
            Trusted by teams shipping AI to production
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-14">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <span
                  key={i}
                  className="text-2xl font-semibold tracking-tight text-mist-faint/70 font-display"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title={<>End-to-end AI, <span className="gradient-text">built to last</span></>}
                sub="From the first strategy session to a hardened production system your team owns. Six ways we create leverage."
              />
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <article className="group relative h-full overflow-hidden rounded-2xl panel p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/3 translate-x-1/3 rounded-full bg-violet/10 blur-2xl transition-opacity duration-300 group-hover:bg-violet/20" />
                    <div className="relative">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient/10 ring-1 ring-line-strong">
                        <s.icon className="h-6 w-6 text-violet" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold text-mist">{s.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-mist-dim">{s.blurb}</p>
                      <ul className="mt-5 space-y-2">
                        {s.points.map((p) => (
                          <li key={p} className="flex items-center gap-2 text-sm text-mist-dim">
                            <Check className="h-4 w-4 shrink-0 text-cyan" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Work / case studies ---------- */}
        <section id="work" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
                <SectionHeading
                  center={false}
                  eyebrow="Selected work"
                  title={<>Outcomes, not <span className="gradient-text">output</span></>}
                  sub="A few engagements where AI moved a number that matters."
                />
                <Link href="/#contact" className="btn-ghost shrink-0">
                  Start your project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {caseStudies.map((c, i) => (
                <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl panel p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="chip">{c.industry}</span>
                        <ArrowUpRight className="h-5 w-5 text-mist-faint transition-colors group-hover:text-violet" />
                      </div>
                      <div className={cn("mt-8 bg-gradient-to-r bg-clip-text text-5xl font-semibold text-transparent", c.accent)}>
                        {c.metric}
                      </div>
                      <p className="mt-1 text-sm text-mist-faint">{c.metricLabel}</p>
                    </div>
                    <div className="mt-8 border-t border-line pt-5">
                      <h3 className="text-lg font-semibold text-mist">{c.result}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist-dim">{c.summary}</p>
                      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-mist-faint">
                        {c.client}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Process ---------- */}
        <section id="process" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="How it works"
                title={<>A path from <span className="gradient-text">idea to impact</span></>}
                sub="A proven four-phase method that de-risks AI and ships working software fast."
              />
            </Reveal>

            <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="absolute left-0 top-7 hidden h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent lg:block" />
              {processSteps.map((p, i) => (
                <Reveal key={p.step} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="relative">
                    <div className="relative z-10 mb-6 grid h-14 w-14 place-items-center rounded-2xl panel font-mono text-lg font-semibold text-violet">
                      {p.step}
                      <span className="absolute inset-0 -z-10 rounded-2xl bg-violet/10 blur-md" />
                    </div>
                    <h3 className="text-xl font-semibold text-mist">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist-dim">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="What clients say"
                title={<>Teams that bet on us, <span className="gradient-text">won</span></>}
              />
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <figure className="flex h-full flex-col rounded-2xl panel p-7">
                    <Quote className="h-8 w-8 text-violet/40" />
                    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-mist">
                      “{t.quote}”
                    </blockquote>
                    <div className="mt-6 flex items-center gap-1 text-amber">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <figcaption className="mt-4 border-t border-line pt-4">
                      <div className="text-sm font-semibold text-mist">{t.name}</div>
                      <div className="text-xs text-mist-faint">
                        {t.role} · {t.company}
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Pricing ---------- */}
        <section id="pricing" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Engagements"
                title={<>Pricing that scales <span className="gradient-text">with ambition</span></>}
                sub="Transparent, outcome-focused engagements. Start small, scale when it works."
              />
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <Reveal key={plan.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-2xl p-7",
                      plan.highlighted ? "border-glow panel shadow-glow" : "panel"
                    )}
                  >
                    {plan.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
                        Most popular
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-mist">{plan.name}</h3>
                    <p className="mt-1 text-sm text-mist-dim">{plan.tagline}</p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold gradient-text">{plan.price}</span>
                      <span className="text-sm text-mist-faint">{plan.cadence}</span>
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-mist-dim">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/#contact"
                      className={cn("mt-8 w-full", plan.highlighted ? "btn-primary" : "btn-ghost")}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow="FAQ" title="Questions, answered" />
            </Reveal>
            <Reveal className="mt-12">
              <Faq />
            </Reveal>
          </div>
        </section>

        {/* ---------- CTA / contact ---------- */}
        <section id="contact" className="relative scroll-mt-24 px-5 pb-28 sm:px-8">
          <Reveal>
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-line-strong px-8 py-16 text-center sm:py-20">
              <div className="absolute inset-0 -z-10 bg-brand-radial" />
              <div className="absolute inset-0 -z-10 bg-grid opacity-40 mask-fade-b" />
              <span className="eyebrow justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Let&apos;s build
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Ready to put AI to <span className="gradient-text-flow">work?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-mist-dim">
                Book a 30-minute strategy call. We&apos;ll pressure-test your idea and
                leave you with a clear, honest plan — whether or not you hire us.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="mailto:hello@vertex-ai.com" className="btn-primary">
                  Book a strategy call <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard" className="btn-ghost">
                  Explore the dashboard
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-mist-faint">hello@vertex-ai.com</p>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
