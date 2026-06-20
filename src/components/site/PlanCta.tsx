"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pricing CTA. For self-serve plans (planId set) it starts a Stripe Checkout
 * session and redirects to Stripe's hosted page. If Stripe isn't configured
 * yet (503), it gracefully falls back to the contact page so the button always
 * does something useful. Non-self-serve plans link straight to /contact.
 */
export default function PlanCta({
  planId,
  label,
  highlighted,
}: {
  planId?: "starter" | "growth";
  label: string;
  highlighted?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const className = cn(
    "mt-8 inline-flex w-full items-center justify-center gap-2",
    highlighted ? "btn-primary" : "btn-ghost"
  );

  if (!planId) {
    return (
      <Link href="/contact" className={className}>
        {label}
      </Link>
    );
  }

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (res.status === 503) {
        // Stripe not wired up yet — let the visitor reach us instead.
        window.location.href = "/contact";
        return;
      }
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={cn(className, "mt-0 disabled:opacity-70")}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Starting…
          </>
        ) : (
          label
        )}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
