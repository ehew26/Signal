'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Mail, Users, Sparkles, ArrowRight } from 'lucide-react'
import ShareSignal from '@/components/ShareSignal'

export default function WelcomeClient({
  name,
  email,
  memberCount,
  launchTarget,
}: {
  name: string
  email: string
  memberCount: number
  launchTarget: number
}) {
  const progress = Math.min(100, Math.round((memberCount / launchTarget) * 100))
  const spotsLeft = Math.max(0, launchTarget - memberCount)
  const firstName = name.split(' ')[0] || 'there'

  const [showConfetti, setShowConfetti] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)',
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vmin] h-[80vmin] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 60%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Confetti dots */}
      {showConfetti && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full"
              style={{
                width: 6,
                height: 6,
                background: i % 3 === 0 ? '#2563eb' : i % 3 === 1 ? '#0d1f4e' : '#93c5fd',
                left: `${(i * 41) % 100}%`,
                top: `${(i * 17) % 100}%`,
                animation: `float ${3 + (i % 4)}s ease-in-out ${i * 0.1}s infinite`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-2xl mx-auto px-6 py-20">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-fraunces text-3xl text-cream inline-block">
            Signal<span className="text-accent">.</span>
          </Link>
        </div>

        {/* Success badge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-accent flex items-center justify-center">
              <Check size={36} className="text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.4em] uppercase mb-4">You&rsquo;re on the list</div>
          <h1 className="font-fraunces text-5xl md:text-6xl text-cream leading-[1.05] mb-6">
            Congrats, {firstName}.<br />
            <span className="italic text-accent">You&rsquo;re in.</span>
          </h1>
          <p className="text-cream-muted text-lg leading-relaxed max-w-md mx-auto">
            Your profile is locked in for the founding cohort of Signal. We&rsquo;ll email you the moment we go live.
          </p>
        </div>

        {/* Status card */}
        <div className="border border-border bg-surface relative overflow-hidden mb-8">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-medium flex items-center gap-2">
                <Sparkles size={12} /> Pre-Launch · Sarasota-Manatee
              </span>
              <span className="text-cream-muted text-xs tabular-nums">{memberCount} / {launchTarget}</span>
            </div>

            <h2 className="font-fraunces text-2xl text-cream mb-2">
              Signal goes live at <span className="text-accent italic">{launchTarget} founding members</span>
            </h2>
            <p className="text-cream-muted text-sm mb-6">
              The moment we hit the target, matching switches on and you&rsquo;ll be in the first batch of weekly matches.
            </p>

            {/* Progress bar */}
            <div className="h-2 bg-surface-2 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000 rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute inset-y-0 bg-accent/40 blur-md transition-all duration-1000 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-cream-muted tracking-wider uppercase">
              <span>{progress}% to launch</span>
              <span>{spotsLeft} spots left</span>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="border border-border bg-background p-8 mb-8">
          <h3 className="font-fraunces text-xl text-cream mb-6">What happens next</h3>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-accent text-accent flex-shrink-0 flex items-center justify-center text-xs">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-cream font-medium text-sm mb-1">We&rsquo;ll email you when we launch</p>
                <p className="text-cream-muted text-sm">A heads-up will be sent to <span className="text-cream">{email}</span> the moment Signal goes live in your area.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-accent text-accent flex-shrink-0 flex items-center justify-center text-xs">
                <Users size={14} />
              </div>
              <div>
                <p className="text-cream font-medium text-sm mb-1">Help us hit 150 members</p>
                <p className="text-cream-muted text-sm">Share Signal with someone real in the Sarasota-Manatee area. The sooner we hit the target, the sooner you meet your matches.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 border border-accent text-accent flex-shrink-0 flex items-center justify-center text-xs">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-cream font-medium text-sm mb-1">60 days free after launch</p>
                <p className="text-cream-muted text-sm">Founding members get the first 60 days on us. After that, it&rsquo;s just $6.99/month. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share prompt */}
        <div className="mb-8">
          <ShareSignal />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile"
            className="flex-1 border border-border text-cream-muted px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:border-cream hover:text-cream transition-colors flex items-center justify-center gap-2"
          >
            View My Profile
          </Link>
          <Link
            href="/home"
            className="flex-1 bg-accent text-white px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Enter Signal
            <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-center text-cream-muted text-xs mt-10">
          Questions? Reach us at <a href="mailto:hello@signal.dating" className="text-accent hover:underline">hello@signal.dating</a>
        </p>
      </div>
    </main>
  )
}
