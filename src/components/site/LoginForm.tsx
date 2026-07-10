"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock } from "lucide-react";

const DEMO = { email: "demo@getvertex.ai", password: "vertex-demo" };
const fieldClass =
  "w-full rounded-xl border border-line bg-black/[0.02] px-4 py-3 text-sm text-mist placeholder:text-mist-faint outline-none transition-colors focus:border-violet/60 focus:bg-black/[0.04]";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-black/[0.03] px-3 py-1 text-xs text-mist-dim">
        <Lock className="h-3.5 w-3.5 text-violet" /> Secure sign in
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-mist-dim">Sign in to your dashboard and client portal.</p>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mist-dim">Email</label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com" className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-mist-dim">Password</label>
          <input
            id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" className={fieldClass}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-rose">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>

      <button
        type="button"
        onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); }}
        className="mt-3 w-full rounded-full border border-dashed border-line px-4 py-2.5 text-xs text-mist-dim transition-colors hover:border-line-strong hover:text-mist"
      >
        Fill demo credentials — {DEMO.email} / {DEMO.password}
      </button>
    </form>
  );
}
