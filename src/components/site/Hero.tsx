import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroMetrics } from "@/lib/data";

const HERO_IMG =
  "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=2200&q=80";

export default function Hero() {
  return (
    <section className="relative px-5 pt-36 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-4xl text-center">
        <span className="chip animate-fade-in">AI automation for small businesses</span>

        <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Capture every lead.
          <br />
          <span className="text-violet">Automate the busywork.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-dim sm:text-xl">
          A friendly AI assistant that answers your customers, captures every
          lead, and books appointments — 24/7. Set up for you, live in days.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link href="/contact" className="btn-primary">
            Book a free call
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-1 text-base font-medium text-violet hover:underline"
          >
            See how it works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Hero photograph */}
      <div className="mx-auto mt-16 max-w-6xl">
        <div className="overflow-hidden rounded-[1.75rem] shadow-float ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMG}
            alt="A customer paying at a small local business"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {heroMetrics.map((m) => (
            <div key={m.label} className="text-center">
              <dt className="text-3xl font-semibold tracking-tight text-mist sm:text-4xl">{m.value}</dt>
              <dd className="mx-auto mt-2 max-w-[12ch] text-sm leading-snug text-mist-faint">{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
