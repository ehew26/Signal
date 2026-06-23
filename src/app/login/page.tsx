import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";
import Aurora from "@/components/Aurora";
import LoginForm from "@/components/site/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Vertex AI dashboard and client portal.",
};

const perks = [
  "Track every engagement in real time",
  "Live metrics from your AI systems",
  "All deliverables in one place",
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-12 lg:flex">
        <Aurora />
        <Logo />
        <div>
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            AI that <span className="gradient-text">moves revenue</span> — and the
            cockpit to prove it.
          </h2>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-mist-dim">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-violet/15 text-violet">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-mist-faint">© {new Date().getFullYear()} Vertex AI</p>
      </section>

      {/* Form panel */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <Logo />
        </div>
        <Suspense fallback={<div className="text-sm text-mist-faint">Loading…</div>}>
          <LoginForm />
        </Suspense>
        <Link href="/" className="mt-8 text-xs text-mist-faint transition-colors hover:text-mist-dim">
          ← Back to getvertex.ai
        </Link>
      </section>
    </main>
  );
}
