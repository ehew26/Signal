import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroMetrics } from "@/lib/data";
import PhoneDemo from "@/components/site/PhoneDemo";
import Magnetic from "@/components/site/Magnetic";

export default function Hero() {
  return (
    <section className="relative px-5 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <span className="chip animate-fade-in">AI automation for small businesses</span>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]">
            Capture every lead.
            <br />
            <span className="text-violet">Automate the busywork.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-dim sm:text-xl lg:mx-0">
            A friendly AI assistant that answers your customers, captures every
            lead, and books appointments — 24/7. Set up for you, live in days.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <Magnetic href="/contact" className="btn-primary">
              Book a free call
            </Magnetic>
            <Link
              href="/#work"
              className="inline-flex items-center gap-1 text-base font-medium text-violet hover:underline"
            >
              See how it works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <PhoneDemo />
        </div>
      </div>

      <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 sm:mt-24 sm:grid-cols-4">
        {heroMetrics.map((m) => (
          <div key={m.label} className="text-center">
            <dt className="text-3xl font-semibold tracking-tight text-mist sm:text-4xl">{m.value}</dt>
            <dd className="mx-auto mt-2 max-w-[12ch] text-sm leading-snug text-mist-faint">{m.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
