"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { PhoneCall, Wand2, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";

type Step = { title: string; description: string; icon: LucideIcon };

const STEPS: Step[] = [
  { title: "A customer reaches out", description: "A call, text, or website chat comes in — even at 9pm on a Sunday.", icon: PhoneCall },
  { title: "Your assistant answers instantly", description: "It greets them by name, answers their questions, and captures the lead.", icon: Wand2 },
  { title: "The job gets booked", description: "It offers open slots, books the appointment, and sends a confirmation.", icon: Rocket },
  { title: "You stay in control", description: "You get a tidy summary on your phone — and it keeps improving over time.", icon: ShieldCheck },
];

export default function HowItWorksScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setActive(idx < 0 ? 0 : idx);
  });

  const Active = STEPS[active].icon;

  return (
    <section ref={ref} className="relative" style={{ height: `${STEPS.length * 90}vh` }}>
      <div className="sticky top-0 flex min-h-screen items-center px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Steps list */}
          <div>
            <span className="eyebrow">How it works</span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              From hello to booked — <span className="text-violet">on autopilot.</span>
            </h2>
            <ol className="mt-10 space-y-6">
              {STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.title} className="flex gap-4">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold transition-all duration-300 ${
                        on ? "bg-violet text-white" : "bg-black/[0.05] text-mist-faint"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-45"}`}>
                      <h3 className="text-lg font-semibold text-mist">{s.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-mist-dim">{s.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[2rem] panel">
              <div className="absolute inset-0 -z-10 bg-brand-radial" />
              <div className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center">
                <motion.div
                  key={active}
                  initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="grid h-24 w-24 place-items-center rounded-3xl bg-violet text-white shadow-glow"
                >
                  <Active className="h-11 w-11" />
                </motion.div>
                <motion.p
                  key={`t-${active}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 }}
                  className="text-xl font-semibold text-mist"
                >
                  {STEPS[active].title}
                </motion.p>
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? "w-6 bg-violet" : "w-1.5 bg-black/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
