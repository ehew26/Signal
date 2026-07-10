"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-black/[0.02] px-4 py-3 text-sm text-mist placeholder:text-mist-faint outline-none transition-colors focus:border-violet/60 focus:bg-black/[0.04]";

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
            Your name
          </label>
          <input id="name" name="name" required placeholder="Jane Smith" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-mist-dim">
            Phone <span className="text-mist-faint">(for a callback)</span>
          </label>
          <input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className={fieldClass} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mist-dim">
          Email
        </label>
        <input id="email" name="email" type="email" required placeholder="you@business.com" className={fieldClass} />
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-mist-dim">
          What kind of business do you run, and what&apos;s slipping through the cracks?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="e.g. I run a roofing company and keep missing calls while I'm on a job…"
          className={cn(fieldClass, "resize-none")}
        />
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-mist-dim">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-violet"
        />
        <span>
          I agree to Vertex AI storing and processing my details to respond to
          this enquiry, as described in the{" "}
          <a href="/legal/privacy" className="text-violet hover:underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

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
            Send &amp; get a callback <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-mist-faint">
        We typically respond within one business day. No spam, ever.
      </p>
    </form>
  );
}
