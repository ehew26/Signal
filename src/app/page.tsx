import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import Faq from "@/components/site/Faq";
import Aurora from "@/components/Aurora";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/site/Tilt";
import Parallax from "@/components/site/Parallax";
import Magnetic from "@/components/site/Magnetic";
import StickyCTA from "@/components/site/StickyCTA";
import BookingScene from "@/components/site/BookingScene";
import HowItWorksScroll from "@/components/site/HowItWorksScroll";
import { services, caseStudies, plans, clientLogos } from "@/lib/data";
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

        {/* ---------- Trust row ---------- */}
        <section className="px-5 pt-10 sm:px-8">
          <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-mist-dim">
            {["Live in days", "Setup included", "No long contracts", "Cancel anytime", "You own it"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-violet" /> {t}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Logo marquee ---------- */}
        <section className="py-10">
          <p className="mb-8 text-center text-xs uppercase tracking-[0.22em] text-mist-faint">
            Built on the tools you already use
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

        {/* ---------- Feature: built for your business ---------- */}
        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="eyebrow">Made for real businesses</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Built for the way you actually work.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
                Roofers, plumbers, dentists, salons, cleaners — if you lose
                business to a missed call or a slow reply, this is for you. Your
                assistant answers, books, and follows up while you do the work.
              </p>
              <Link href="/services" className="mt-7 inline-flex items-center gap-1 text-base font-medium text-violet hover:underline">
                See what it does <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={1}>
              <Parallax amount={28}>
                <div className="overflow-hidden rounded-[1.5rem] shadow-lift ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80"
                    alt="A local service professional at work"
                    className="aspect-[4/3] h-full w-full scale-110 object-cover"
                    loading="lazy"
                  />
                </div>
              </Parallax>
            </Reveal>
          </div>
        </section>

        {/* ---------- Feature: results ---------- */}
        <section className="bg-ink-2 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <Parallax amount={28}>
                <div className="overflow-hidden rounded-[1.5rem] shadow-lift ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80"
                    alt="Two small-business owners celebrating a win"
                    className="aspect-[4/3] h-full w-full scale-110 object-cover"
                    loading="lazy"
                  />
                </div>
              </Parallax>
            </Reveal>
            <Reveal delay={1} className="order-1 lg:order-2">
              <span className="eyebrow">Why it matters</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                More booked jobs. Happier customers.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
                Every missed call is money walking to a competitor. With instant
                answers, automatic follow-up, and easy booking, more of your leads
                turn into paying customers — without you lifting a finger.
              </p>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-1 text-base font-medium text-violet hover:underline">
                Book a free call <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="What we do"
                title={<>Everything your business needs, <span className="gradient-text">automated</span></>}
                sub="Six ways we help you win more customers and spend less time on the busywork — all set up and managed for you."
              />
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <Tilt className="h-full">
                  <article className="group relative h-full overflow-hidden rounded-2xl panel p-7 transition-shadow duration-300 hover:shadow-glow">
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
                  </Tilt>
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
                  eyebrow="Example engagements"
                  title={<>The kind of work <span className="gradient-text">we build</span></>}
                  sub="Illustrative scenarios that show how we approach high-value AI problems. We're onboarding our first named clients now."
                />
                <Link href="/contact" className="btn-ghost shrink-0">
                  Start your project <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {caseStudies.map((c, i) => (
                <Reveal key={c.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <Tilt className="h-full">
                  <Link
                    href={`/work/${c.id}`}
                    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl panel p-7 transition-shadow duration-300 hover:shadow-card"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="chip">{c.industry}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-mist-faint">Illustrative</span>
                      </div>
                      <div className={cn("mt-8 bg-gradient-to-r bg-clip-text text-5xl font-semibold text-transparent", c.accent)}>
                        {c.metric}
                      </div>
                      <p className="mt-1 text-sm text-mist-faint">target {c.metricLabel}</p>
                    </div>
                    <div className="mt-8 border-t border-line pt-5">
                      <h3 className="text-lg font-semibold text-mist">{c.result}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist-dim">{c.summary}</p>
                      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-mist-faint">
                        {c.client}
                      </p>
                    </div>
                  </Link>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Booking scene ---------- */}
        <section className="bg-ink-2 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="eyebrow">The outcome</span>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Watch your calendar fill itself.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-mist-dim">
                While you&apos;re on the job, your assistant is answering customers,
                capturing leads, and booking appointments — turning missed calls
                into paying work, automatically.
              </p>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-1 text-base font-medium text-violet hover:underline">
                Put it to work for me <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={1}>
              <BookingScene />
            </Reveal>
          </div>
        </section>

        {/* ---------- How it works (scroll-scrubbed) ---------- */}
        <HowItWorksScroll />

        {/* ---------- Founding clients ---------- */}
        <section className="relative py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-line-strong p-8 sm:p-12">
                <div className="absolute inset-0 -z-10 bg-brand-radial opacity-60" />
                <span className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  Founding clients
                </span>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  We&apos;re taking on a small number of{" "}
                  <span className="gradient-text">founding clients</span>
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-mist-dim">
                  As a new practice, we&apos;re partnering with a few teams at a
                  discounted, hands-on rate — in exchange for candid feedback and,
                  if it goes well, a named case study. You get senior AI talent at
                  a founder-friendly price; we earn proof. Honest trade.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    "Discounted founding-client pricing",
                    "Direct access to the people building it",
                    "Production-grade work, fully documented",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-mist-dim">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {p}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn-primary mt-8">
                  Become a founding client <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Pricing ---------- */}
        <section id="pricing" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Engagements"
                title={<>Simple, <span className="gradient-text">honest pricing</span></>}
                sub="Setup included, no long contracts, cancel anytime. Most owners earn it back from a single extra booked job."
              />
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <Reveal key={plan.name} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <Tilt className="h-full" max={5}>
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
                      href="/contact"
                      className={cn("mt-8 w-full", plan.highlighted ? "btn-primary" : "btn-ghost")}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>

            <Reveal className="mx-auto mt-8 max-w-3xl">
              <p className="text-center text-sm text-mist-dim">
                <span className="font-medium text-mist">Risk-free to try.</span>{" "}
                No setup fees, no long contracts — cancel anytime. Most owners earn
                it back from a single extra booked job.
              </p>
            </Reveal>
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
                Ready to stop missing <span className="gradient-text-flow">customers?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-mist-dim">
                Book a free 20-minute call. We&apos;ll show you exactly where
                you&apos;re losing leads and how AI can fix it — no pressure, no jargon.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Magnetic href="/contact" className="btn-primary">
                  Book a free call <ArrowRight className="h-4 w-4" />
                </Magnetic>
                <Link href="/#pricing" className="btn-ghost">
                  See plans &amp; pricing
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-mist-faint">hello@vertex-ai.com</p>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <StickyCTA />
    </>
  );
}
