"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { heroMetrics } from "@/lib/data";

const TERMINAL_LINES = [
  { p: "$", t: "vertex deploy support-agent --env prod", c: "text-cyan" },
  { p: ">", t: "Running eval suite … 142/142 passed ✓", c: "text-emerald" },
  { p: ">", t: "Routing model warm · p95 latency 840ms", c: "text-mist-dim" },
  { p: ">", t: "Agent live. Handling 1,240 conversations/day.", c: "text-mist" },
];

function Terminal() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= TERMINAL_LINES.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), count === 0 ? 600 : 900);
    return () => clearTimeout(id);
  }, [count]);

  return (
    <div className="border-glow rounded-2xl">
      <div className="panel overflow-hidden rounded-2xl shadow-float">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose/80" />
          <span className="h-3 w-3 rounded-full bg-amber/80" />
          <span className="h-3 w-3 rounded-full bg-emerald/80" />
          <span className="ml-2 font-mono text-xs text-mist-faint">vertex — agent deploy</span>
        </div>
        <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed min-h-[148px]">
          {TERMINAL_LINES.slice(0, count).map((line, i) => (
            <div key={i} className="flex gap-2 animate-fade-in">
              <span className="text-violet">{line.p}</span>
              <span className={line.c}>{line.t}</span>
            </div>
          ))}
          {count < TERMINAL_LINES.length && (
            <span className="inline-block h-4 w-2 animate-blink bg-violet align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
      {/* mouse spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,30%), rgba(124,92,255,0.12), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="chip animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            AI strategy → production, in weeks
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">Ship AI that</span>
            <br />
            <span className="gradient-text-flow">moves revenue.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-dim">
            Vertex AI partners with ambitious teams to design, build, and deploy
            production-grade AI — custom agents, automation, and LLM systems that
            pay for themselves. No slideware. No black boxes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/#contact" className="btn-primary">
              Book a strategy call <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#work" className="btn-ghost">
              <Play className="h-4 w-4" /> See the work
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {heroMetrics.map((m) => (
              <div key={m.label}>
                <dt className="text-2xl font-semibold gradient-text">{m.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-mist-faint">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative animate-float-slow">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-radial blur-2xl" />
          <Terminal />
        </div>
      </div>
    </section>
  );
}
