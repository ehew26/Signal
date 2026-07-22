import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Settings, Rocket } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Welcome aboard",
  description: "Your Vertex AI subscription is active. Here's what happens next.",
  robots: { index: false },
};

const steps = [
  {
    icon: Mail,
    title: "Check your inbox",
    body: "We just emailed you a welcome note. Reply with your business name, website, and the phone number you'd like your AI assistant to use.",
  },
  {
    icon: Settings,
    title: "We set everything up",
    body: "Our team configures your AI receptionist, lead capture, and follow-up — done for you. We'll send a quick link to confirm the details.",
  },
  {
    icon: Rocket,
    title: "You go live",
    body: "Usually within a couple of business days. From then on, every call, text, and form gets answered and followed up — 24/7.",
  },
];

export default function WelcomePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="You're in"
        title={
          <>
            Welcome to <span className="gradient-text">Vertex AI</span>
          </>
        }
        sub="Your subscription is active and your payment is confirmed. Here's exactly what happens next."
      />

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-10 flex items-center justify-center gap-2 text-cyan">
            <CheckCircle2 className="h-6 w-6" />
            <span className="text-sm font-medium">Payment confirmed — no further action needed to be charged.</span>
          </Reveal>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="flex items-start gap-4 rounded-2xl panel p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-mist">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist-dim">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <p className="text-sm text-mist-dim">
              Need to update payment details or manage your plan?{" "}
              <Link href="/billing" className="text-cyan underline-offset-4 hover:underline">
                Open your billing portal
              </Link>
              .
            </p>
            <Link href="/" className="btn-ghost mt-6 inline-flex">
              Back to home
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
