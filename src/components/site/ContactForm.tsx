"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { contactReasons, budgetRanges } from "@/lib/content";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-mist placeholder:text-mist-faint outline-none transition-colors focus:border-violet/60 focus:bg-white/[0.04]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl panel px-8 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald/15 text-emerald">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-mist">Message received.</h3>
        <p className="mt-2 max-w-sm text-sm text-mist-dim">
          Thanks for reaching out. We&apos;ll be in touch within one business day —
          usually much sooner.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl panel p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-mist-dim">
            Name
          </label>
          <input id="name" name="name" required placeholder="Jane Doe" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mist-dim">
            Work email
          </label>
          <input id="email" name="email" type="email" required placeholder="jane@company.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-mist-dim">
            Company <span className="text-mist-faint">(optional)</span>
          </label>
          <input id="company" name="company" placeholder="Acme Inc." className={fieldClass} />
        </div>
        <div>
          <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-mist-dim">
            I&apos;m reaching out about
          </label>
          <select id="reason" name="reason" className={cn(fieldClass, "appearance-none")} defaultValue="">
            <option value="" disabled className="bg-ink-2">Select one…</option>
            {contactReasons.map((r) => (
              <option key={r} value={r} className="bg-ink-2">{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-mist-dim">
          Budget <span className="text-mist-faint">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {budgetRanges.map((b, i) => (
            <label key={b} className="cursor-pointer">
              <input type="radio" name="budget" value={b} defaultChecked={i === budgetRanges.length - 1} className="peer sr-only" />
              <span className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-sm text-mist-dim transition-colors peer-checked:border-violet/60 peer-checked:bg-violet/10 peer-checked:text-mist">
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-mist-dim">
          What are you trying to do?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about the problem, your data, and what success looks like…"
          className={cn(fieldClass, "resize-none")}
        />
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-rose">{error}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-mist-faint">
        We typically respond within one business day. No spam, ever.
      </p>
    </form>
  );
}
