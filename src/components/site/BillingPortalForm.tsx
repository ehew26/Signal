"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

/**
 * Lets an existing customer open the Stripe Billing Portal by entering the
 * email they subscribed with. Fully self-serve — update card, change plan, or
 * cancel without contacting anyone.
 */
export default function BillingPortalForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        res.status === 503
          ? "Billing isn't available yet. Please email us and we'll help."
          : data.error || "Something went wrong."
      );
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={open} className="rounded-2xl panel p-6 sm:p-8">
      <label htmlFor="billing-email" className="block text-sm font-medium text-mist">
        Email used at checkout
      </label>
      <input
        id="billing-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@business.com"
        className="mt-2 w-full rounded-xl border border-line bg-black/[0.02] px-4 py-3 text-mist outline-none transition-colors placeholder:text-mist-faint focus:border-line-strong"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Opening…
          </>
        ) : (
          <>
            Manage my subscription <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
