"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Loader2, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lead Leak Audit — an interactive calculator that quantifies the revenue a
 * business loses to missed calls / unanswered leads, then captures the visitor
 * as a lead (via /api/contact) with the computed figures attached.
 *
 * This is the highest-converting top-of-funnel asset in the growth plan: it
 * shows the prospect a dollar number they feel, then offers to recover it.
 */

const fieldClass =
  "w-full rounded-xl border border-line bg-black/[0.02] px-4 py-3 text-sm text-mist placeholder:text-mist-faint outline-none transition-colors focus:border-violet/60 focus:bg-black/[0.04]";

type Status = "idle" | "submitting" | "success" | "error";

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-mist-dim">{label}</label>
        <span className="text-sm font-semibold text-mist">
          {format ? format(value) : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-violet"
      />
    </div>
  );
}

export default function AuditCalculator() {
  const [callsPerMonth, setCalls] = useState(120);
  const [missedPct, setMissed] = useState(30);
  const [avgValue, setAvgValue] = useState(450);
  const [closeRate, setCloseRate] = useState(40);

  const [businessType, setBusinessType] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const { missedPerMonth, lostJobs, lostPerMonth, lostPerYear } = useMemo(() => {
    const missedPerMonth = Math.round((callsPerMonth * missedPct) / 100);
    const lostJobs = missedPerMonth * (closeRate / 100);
    const lostPerMonth = Math.round(lostJobs * avgValue);
    return {
      missedPerMonth,
      lostJobs: Math.round(lostJobs),
      lostPerMonth,
      lostPerYear: lostPerMonth * 12,
    };
  }, [callsPerMonth, missedPct, avgValue, closeRate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();

    const message =
      `Lead Leak Audit request${businessType ? ` — ${businessType}` : ""}.\n` +
      `Calls/month: ${callsPerMonth}, missed: ${missedPct}% (${missedPerMonth}/mo), ` +
      `avg job value: ${usd(avgValue)}, close rate: ${closeRate}%.\n` +
      `Estimated lost revenue: ${usd(lostPerMonth)}/month (${usd(lostPerYear)}/year).`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          reason: "Lead Leak Audit",
          company: businessType,
          message,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Inputs */}
      <div className="rounded-2xl panel p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-mist">Your numbers</h3>
        <p className="mt-1 text-sm text-mist-dim">
          Drag the sliders to match your business. Everything updates instantly.
        </p>
        <div className="mt-6 space-y-6">
          <Slider
            label="Calls & leads per month"
            value={callsPerMonth}
            onChange={setCalls}
            min={10}
            max={1000}
            step={10}
          />
          <Slider
            label="% you miss or don't call back fast enough"
            value={missedPct}
            onChange={setMissed}
            min={5}
            max={80}
            step={5}
            suffix="%"
          />
          <Slider
            label="Average value of a job / customer"
            value={avgValue}
            onChange={setAvgValue}
            min={50}
            max={10000}
            step={50}
            format={usd}
          />
          <Slider
            label="Of the ones you reach, % you close"
            value={closeRate}
            onChange={setCloseRate}
            min={5}
            max={90}
            step={5}
            suffix="%"
          />
        </div>
      </div>

      {/* Result + capture */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border-glow panel shadow-glow p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose/10 px-3 py-1 text-xs font-semibold text-rose">
            <TrendingDown className="h-3.5 w-3.5" /> Revenue walking out the door
          </span>
          <div className="mt-4">
            <span className="block text-5xl font-semibold gradient-text">
              {usd(lostPerMonth)}
            </span>
            <span className="text-sm text-mist-faint">lost every month</span>
          </div>
          <p className="mt-3 text-sm text-mist-dim">
            That&apos;s about <strong className="text-mist">{usd(lostPerYear)}/year</strong> —
            roughly <strong className="text-mist">{missedPerMonth} missed calls</strong> and{" "}
            <strong className="text-mist">{lostJobs} lost jobs</strong> every month.
          </p>
          <p className="mt-3 text-xs text-mist-faint">
            Vertex AI answers and texts back every one of those, automatically —
            usually recovering most of it. One saved job covers the whole plan.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center rounded-2xl panel px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald/15 text-emerald">
              <Check className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-mist">Audit on its way.</h3>
            <p className="mt-2 max-w-xs text-sm text-mist-dim">
              We&apos;ll send your full Lead Leak Audit and a quick plan to recover
              that {usd(lostPerMonth)}/mo — within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl panel p-6 sm:p-8">
            <h3 className="text-base font-semibold text-mist">
              Get your full audit + recovery plan
            </h3>
            <p className="mt-1 text-xs text-mist-dim">
              See exactly how to stop the leak. No cost, no obligation.
            </p>
            <div className="mt-4 space-y-3">
              <input name="name" required placeholder="Your name" className={fieldClass} />
              <input
                name="email"
                type="email"
                required
                placeholder="you@business.com"
                className={fieldClass}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone (for a callback)"
                className={fieldClass}
              />
              <input
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Type of business (e.g. HVAC, dental, roofing)"
                className={fieldClass}
              />
            </div>
            {status === "error" && <p className="mt-3 text-sm text-rose">{error}</p>}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-5 w-full"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send me my audit <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-mist-faint">
              No spam, ever. We respond within one business day.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
