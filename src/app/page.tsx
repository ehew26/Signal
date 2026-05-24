'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Shield, Mic, Users, Star } from 'lucide-react'
import IntroSplash from '@/components/IntroSplash'
import { ScrollProgress, MouseSpotlight, LiveJoinToasts, TiltCard, AnimatedCounter } from '@/components/WowEffects'

const WAVEFORM_HEIGHTS = [14, 22, 8, 28, 18, 32, 10, 26, 16, 30, 12, 24, 20, 8, 28, 14, 22, 16, 30, 10, 26, 18, 24, 12]

function WaveformBars({ playing = false, color = '#2563eb', bars = 20 }: { playing?: boolean; color?: string; bars?: number }) {
  const heights = WAVEFORM_HEIGHTS.slice(0, bars)
  return (
    <div className="flex items-center gap-[3px]" style={{ height: 32 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={playing ? 'animate-waveform' : ''}
          style={{
            width: 3,
            backgroundColor: color,
            height: playing ? undefined : `${h}px`,
            minHeight: 8,
            maxHeight: 32,
            borderRadius: 2,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.8 + (i % 3) * 0.3}s`,
          }}
        />
      ))}
    </div>
  )
}

function FloatingProfileCard() {
  return (
    <div className="animate-float relative w-80">
      <div className="bg-surface border border-border overflow-hidden shadow-2xl">
        <div className="relative h-96 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"
            alt="Demo profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f4e]/80 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 bg-accent text-white text-[10px] tracking-widest uppercase px-3 py-1.5 flex items-center gap-1.5">
            <Shield size={10} />
            Verified
          </div>
          <div className="absolute bottom-4 left-5 right-5">
            <h3 className="font-fraunces text-2xl text-white">Sophia, 29</h3>
            <div className="flex items-center gap-1.5 text-white/70 text-sm mt-1">
              <MapPin size={12} />
              <span>Sarasota · 2 mi</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['Fine dining', 'Yoga', 'Travel', 'Wine'].map(tag => (
              <span key={tag} className="text-[10px] tracking-wider uppercase text-cream-muted border border-border px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-border pt-4 mb-5">
            <p className="text-[10px] text-cream-muted tracking-widest uppercase mb-2">Voice Prompt</p>
            <p className="text-cream text-sm mb-3 font-fraunces italic">"The kind of Sunday morning I want more of..."</p>
            <WaveformBars color="#2563eb" bars={20} />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 pass-btn">Pass</button>
            <button className="flex-1 signal-btn">Send Signal</button>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-accent opacity-40" />
      <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-accent opacity-40" />

      <div className="absolute -bottom-6 right-3 flex items-center gap-2">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 bg-accent rounded-full animate-signal-ping" />
          <div className="w-2 h-2 bg-accent rounded-full" />
        </div>
        <span className="text-[10px] text-accent tracking-widest uppercase">Live matching</span>
      </div>
    </div>
  )
}

function StatsTicker() {
  const stats = [
    "Sarasota · Bradenton · Venice · Lakewood Ranch",
    "5 matches delivered every Monday at 7am",
    "Identity verified members only",
    "72-hour response compact",
    "Voice-first profiles",
    "0% pay-to-win. Ever.",
    "Founding member pricing: $6.99/mo",
    "No swiping. No algorithms. No ghosting.",
    "Siesta Key to Anna Maria Island",
  ]
  const doubled = [...stats, ...stats]

  return (
    <div className="border-y border-border py-4 overflow-hidden bg-surface">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((stat, i) => (
          <span key={i} className="text-xs tracking-[0.25em] uppercase text-cream-muted mx-10">
            {stat}
            <span className="text-accent mx-10">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ProblemCard({ label, items, accent }: { label: string; items: string[]; accent?: boolean }) {
  return (
    <div className={`p-8 border ${accent ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}>
      <div className={`text-xs tracking-[0.3em] uppercase font-medium mb-6 ${accent ? 'text-accent' : 'text-cream-muted'}`}>{label}</div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            {accent
              ? <CheckCircle size={15} className="text-accent flex-shrink-0 mt-0.5" />
              : <span className="text-cream-muted/40 text-lg leading-none mt-0.5 flex-shrink-0">×</span>
            }
            <span className={`text-sm leading-relaxed ${accent ? 'text-cream' : 'text-cream-muted'}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Testimonial({ quote, name, detail }: { quote: string; name: string; detail: string }) {
  return (
    <div
      className="animate-on-scroll border border-border p-8 bg-surface group hover:border-accent hover:-translate-y-1"
      style={{ transitionProperty: 'border-color, transform, box-shadow', transitionDuration: '300ms' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}
    >
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className="text-accent fill-accent" />
        ))}
      </div>
      <p className="font-fraunces text-lg italic text-cream leading-relaxed mb-6">"{quote}"</p>
      <div>
        <div className="text-cream text-sm font-medium">{name}</div>
        <div className="text-cream-muted text-xs mt-1 tracking-wide">{detail}</div>
      </div>
    </div>
  )
}

function HowItWorksStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="animate-on-scroll border-l-2 border-border pl-8 py-2 group" style={{ transitionProperty: 'border-color', transitionDuration: '300ms' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#2563eb')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
    >
      <div className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-cabinet">{number}</div>
      <h3 className="font-fraunces text-2xl text-cream mb-3 group-hover:text-accent" style={{ transitionProperty: 'color', transitionDuration: '200ms' }}>{title}</h3>
      <p className="text-cream-muted leading-relaxed">{description}</p>
    </div>
  )
}

function VoicePromptCards() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [progress, setProgress] = useState<Record<number, number>>({})
  const timers = useRef<Record<number, ReturnType<typeof setInterval>>>({})

  const prompts = [
    { question: "Two truths and a lie about me...", name: "Marcus, 31", city: "Sarasota", duration: 28 },
    { question: "The kind of Sunday morning I want more of...", name: "Elena, 27", city: "Bradenton", duration: 22 },
    { question: "What my best friend would say about me...", name: "James, 34", city: "Lakewood Ranch", duration: 31 },
  ]

  const togglePlay = (i: number) => {
    if (playing === i) {
      clearInterval(timers.current[i])
      setPlaying(null)
      return
    }
    if (playing !== null) clearInterval(timers.current[playing])
    setPlaying(i)
    setProgress(p => ({ ...p, [i]: 0 }))
    const total = prompts[i].duration * 1000
    const start = Date.now()
    timers.current[i] = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / total) * 100)
      setProgress(p => ({ ...p, [i]: pct }))
      if (pct >= 100) {
        clearInterval(timers.current[i])
        setPlaying(null)
      }
    }, 80)
  }

  useEffect(() => () => Object.values(timers.current).forEach(clearInterval), [])

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {prompts.map((prompt, i) => {
        const isPlaying = playing === i
        const pct = progress[i] ?? 0
        const elapsed = Math.round((pct / 100) * prompt.duration)
        const fmt = (s: number) => `0:${String(s).padStart(2, '0')}`
        return (
          <div
            key={i}
            className="animate-on-scroll border bg-surface p-6 group cursor-pointer"
            style={{
              borderColor: isPlaying ? '#2563eb' : undefined,
              transitionProperty: 'border-color, box-shadow',
              transitionDuration: '300ms',
              transitionDelay: `${i * 100}ms`,
              boxShadow: isPlaying ? '0 0 24px rgba(37,99,235,0.15)' : undefined,
            }}
            onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.borderColor = '#2563eb' }}
            onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.borderColor = '' }}
            onClick={() => togglePlay(i)}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={10} className="text-accent" />
              <span className="text-[10px] tracking-widest uppercase text-accent">Verified</span>
              <span className="text-cream-muted text-[10px] ml-auto">{prompt.city}</span>
            </div>
            <p className="font-fraunces text-lg italic text-cream mb-2">"{prompt.question}"</p>
            <p className="text-cream-muted text-sm mb-6">{prompt.name}</p>
            <WaveformBars playing={isPlaying} color="#2563eb" bars={20} />

            {/* Progress bar */}
            <div className="h-[2px] bg-border mt-4 mb-3 overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: `${pct}%`, transition: pct === 0 ? 'none' : 'width 0.08s linear' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-cream-muted text-xs tabular-nums">
                {isPlaying ? fmt(elapsed) : '0:00'} / {fmt(prompt.duration)}
              </span>
              <button
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  backgroundColor: isPlaying ? '#2563eb' : 'transparent',
                  border: '1px solid #2563eb',
                  color: isPlaying ? '#fff' : '#2563eb',
                  transitionProperty: 'background-color, color',
                  transitionDuration: '150ms',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={e => { e.stopPropagation(); togglePlay(i) }}
              >
                {isPlaying
                  ? <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3" height="12"/><rect x="7" y="0" width="3" height="12"/></svg>
                  : <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><path d="M2 1l9 6-9 6V1z"/></svg>
                }
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScarcityBar() {
  const [count, setCount] = useState(0)
  const target = 150
  const progress = Math.min(100, Math.round((count / target) * 100))
  const remaining = Math.max(0, target - count)

  useEffect(() => {
    fetch('/api/waitlist/count').then(r => r.json()).then(d => {
      if (d.count != null) setCount(d.count)
    }).catch(() => {})
  }, [])

  return (
    <div className="border border-accent/30 bg-accent/5 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1">
          <div className="h-1 bg-border relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress}%`, transitionProperty: 'width', transitionDuration: '1000ms' }} />
            <div className="absolute inset-y-0 bg-accent/30 blur-sm" style={{ width: `${progress}%`, transitionProperty: 'width', transitionDuration: '1000ms' }} />
          </div>
        </div>
        <span className="text-accent text-xs tracking-widest uppercase font-medium tabular-nums whitespace-nowrap">{remaining} spots left</span>
      </div>
      <Link href="/signup" className="text-xs tracking-widest uppercase text-white bg-accent px-5 py-2.5 whitespace-nowrap" style={{ transitionProperty: 'background-color, transform', transitionDuration: '150ms' }}>
        Claim Yours →
      </Link>
    </div>
  )
}

function LiveAnnouncementBar() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/waitlist/count').then(r => r.json()).then(d => {
      if (d.count != null) setRemaining(Math.max(0, 150 - d.count))
    }).catch(() => {})
  }, [])

  const urgent = remaining != null && remaining <= 40

  return (
    <div className={`text-white text-xs tracking-[0.2em] uppercase text-center py-2.5 px-4 font-medium ${urgent ? 'bg-red-600' : 'bg-accent'}`}>
      {urgent && remaining != null
        ? <><span className="inline-block animate-pulse mr-2">⚡</span>Only {remaining} founding spots left — 60 days free after launch</>
        : 'Founding member spots are limited — 60 days free after launch'
      }
    </div>
  )
}

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true)
  const [referrerName, setReferrerName] = useState<string | null>(null)
  const searchParams = useSearchParams()

  // Capture referral code from URL and persist to sessionStorage
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      sessionStorage.setItem('signal_ref', ref)
      // Fetch referrer info to show a personalised banner
      fetch(`/api/referral?ref=${encodeURIComponent(ref)}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.referrerName) setReferrerName(d.referrerName) })
        .catch(() => {})
    } else {
      // Check if we already have a stored ref
      const stored = sessionStorage.getItem('signal_ref')
      if (stored) {
        fetch(`/api/referral?ref=${encodeURIComponent(stored)}`)
          .then(r => r.ok ? r.json() : null)
          .then(d => { if (d?.referrerName) setReferrerName(d.referrerName) })
          .catch(() => {})
      }
    }
  }, [searchParams])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [showIntro])

  const couplePhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=550&fit=crop',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=500&fit=crop',
  ]

  return (
    <main className="bg-background min-h-screen">
      <ScrollProgress />
      <MouseSpotlight />
      <LiveJoinToasts />
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      {/* Scarcity top bar */}
      <LiveAnnouncementBar />

      {/* Referral banner — shown when arriving via a share link */}
      {referrerName && (
        <div
          className="text-center py-3 px-4 text-sm flex items-center justify-center gap-2"
          style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderBottom: '1px solid #bfdbfe' }}
        >
          <span style={{ fontSize: 16 }}>👋</span>
          <span>
            <strong>{referrerName}</strong> invited you to Signal — claim a founding spot below.
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="font-fraunces text-2xl text-cream">Signal<span className="text-accent">.</span></div>
        <div className="hidden md:flex items-center gap-8 text-cream-muted text-sm tracking-wider">
          <a href="#how-it-works" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>How It Works</a>
          <a href="#voice" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Voice Profiles</a>
          <a href="#join" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Join</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-cream-muted text-sm hover:text-cream hidden md:block" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Sign In</Link>
          <Link href="/signup" className="bg-accent text-white text-xs tracking-[0.2em] uppercase px-5 py-2.5" style={{ transitionProperty: 'background-color, transform', transitionDuration: '150ms' }}>Get Access</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920&h=1080&fit=crop"
            alt="Couple"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 mb-8 animate-entrance">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-cream-muted text-xs tracking-[0.25em] uppercase">Sarasota · Bradenton · Venice</span>
              </div>

              <h1 className="font-fraunces text-6xl md:text-7xl lg:text-8xl text-cream leading-[0.92] mb-8 animate-entrance" style={{ animationDelay: '0.1s' }}>
                Five real<br />
                <span className="italic text-shimmer">matches</span><br />
                every Monday.
              </h1>
              <p className="text-cream-muted text-lg leading-relaxed mb-10 max-w-md animate-entrance" style={{ animationDelay: '0.2s' }}>
                Signal is the antidote to app fatigue. No swiping. No algorithms. Just five curated, verified people from your corner of Florida — delivered once a week.
              </p>

              {/* Animated stats */}
              <div className="grid grid-cols-3 gap-4 mb-10 max-w-md animate-entrance" style={{ animationDelay: '0.3s' }}>
                {[
                  { num: 5, suffix: '', label: 'Matches weekly' },
                  { num: 100, suffix: '%', label: 'Verified' },
                  { num: 150, suffix: '', label: 'Founding spots' },
                ].map(({ num, suffix, label }) => (
                  <div key={label} className="border border-border px-4 py-4 bg-surface text-center group hover:border-accent" style={{ transitionProperty: 'border-color', transitionDuration: '200ms' }}>
                    <div className="font-fraunces text-3xl italic text-accent tabular-nums">
                      <AnimatedCounter to={num} suffix={suffix} />
                    </div>
                    <div className="text-cream-muted text-[10px] tracking-widest uppercase mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-entrance" style={{ animationDelay: '0.4s' }}>
                <Link href="/signup" className="btn-primary animate-glow-pulse relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-3">
                    Claim a Founding Spot
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  See How It Works
                </a>
              </div>

              <p className="text-cream-muted text-xs mt-6 tracking-wide animate-entrance" style={{ animationDelay: '0.5s' }}>
                Free now · 60 days free after launch · $6.99/mo after that · No credit card
              </p>
            </div>

            <div className="hidden lg:flex justify-end items-center pr-8">
              <TiltCard>
                <FloatingProfileCard />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <StatsTicker />

      {/* LIVE STATS BANNER */}
      <section className="py-20 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: 25, suffix: ' mi', label: 'Max match radius' },
              { num: 5, suffix: '', label: 'Matches per week' },
              { num: 72, suffix: 'h', label: 'Response compact' },
              { num: 150, suffix: '', label: 'Founding spots total' },
            ].map(({ num, suffix, label }) => (
              <div key={label}>
                <div className="font-fraunces text-5xl md:text-6xl italic text-white tabular-nums">
                  <AnimatedCounter to={num} suffix={suffix} />
                </div>
                <div className="text-white/70 text-xs tracking-widest uppercase mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label mb-6 animate-on-scroll">The Problem</div>
          <h2 className="font-fraunces text-5xl lg:text-6xl text-cream mb-6 animate-on-scroll">
            You're not bad at dating.<br />
            <span className="italic text-accent">The apps are broken.</span>
          </h2>
          <p className="text-cream-muted max-w-2xl mx-auto animate-on-scroll">
            The apps profit from your loneliness. More swipes means more engagement. More engagement means more ad revenue. They have no incentive for you to actually meet anyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="animate-on-scroll">
            <ProblemCard
              label="Dating Apps Today"
              items={[
                "500+ options create decision paralysis — you choose no one",
                "Pay $29 to see who already liked you",
                "Matched at 9pm, ghosted by 9:01",
                "Faces optimized for the feed, not a first date",
                "Engineered for engagement — not relationships",
              ]}
            />
          </div>
          <div className="animate-on-scroll stagger-2">
            <ProblemCard
              label="Signal"
              accent
              items={[
                "Five curated, verified people — no paralysis, just intention",
                "Founding members pay $6.99 total. No tricks, no boosts",
                "72-hour response compact — everyone stays accountable",
                "Voice profiles let you hear who they are before you meet",
                "We make money when you stay — so we earn your relationship",
              ]}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="section-label mb-6 animate-on-scroll">The Process</div>
              <h2 className="font-fraunces text-5xl lg:text-6xl text-cream leading-tight mb-6 animate-on-scroll">
                Dating, the<br /><span className="italic text-accent">way it should</span><br />feel.
              </h2>
              <p className="text-cream-muted leading-relaxed max-w-md animate-on-scroll">
                We built Signal because app culture broke dating. Infinite choices create decision paralysis. Verification removes bad actors. Voice profiles reveal personality. And one weekly drop restores intention.
              </p>
              <div className="mt-10 animate-on-scroll">
                <ScarcityBar />
              </div>
            </div>

            <div className="space-y-10">
              <HowItWorksStep number="01" title="Get verified" description="Every Signal member completes identity verification. Your verified badge signals you're real — and so is everyone you'll meet." />
              <HowItWorksStep number="02" title="Build your voice profile" description="Record three 30-second voice prompts. Let people hear your laugh, your cadence, your personality — before they ever swipe right." />
              <HowItWorksStep number="03" title="Receive your five" description="Every Monday at 7am, five curated matches arrive. We've already filtered for location, age, and compatibility. You just decide who feels right." />
              <HowItWorksStep number="04" title="Signal. Match. Meet." description="Send a signal to the people you're interested in. When it's mutual, you match. The Compact keeps both people accountable — respond within 72 hours." />
            </div>
          </div>
        </div>
      </section>

      {/* VOICE PROMPTS */}
      <section id="voice" className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="section-label mb-6 animate-on-scroll">Voice-First</div>
          <h2 className="font-fraunces text-5xl lg:text-6xl text-cream animate-on-scroll">
            Hear who they are<br /><span className="italic text-accent">before you meet.</span>
          </h2>
          <p className="text-cream-muted mt-6 max-w-xl mx-auto animate-on-scroll">
            A voice reveals what a photo never can. Nervousness. Humor. Warmth. The way someone laughs at their own joke. Signal profiles start with sound.
          </p>
        </div>

        <VoicePromptCards />
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label mb-6 animate-on-scroll">Member Stories</div>
            <h2 className="font-fraunces text-5xl text-cream animate-on-scroll">
              Real people.<br /><span className="italic text-accent">Real connections.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="I went on four dates in my first month. Four. I'd been on Hinge for two years and barely managed one that wasn't miserable."
              name="Sarah M."
              detail="Member · Sarasota"
            />
            <Testimonial
              quote="The voice prompts changed everything. I knew I liked her laugh before we ever met. First date felt like a third date."
              name="Daniel R."
              detail="Member · Lakewood Ranch"
            />
            <Testimonial
              quote="I'm 42 and I thought dating apps weren't for me. Signal proved me wrong. Five real people, once a week. I can handle that."
              name="Christine L."
              detail="Member · Bradenton"
            />
          </div>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {couplePhotos.map((src, i) => (
            <div key={i} className={`animate-on-scroll overflow-hidden ${i === 1 || i === 4 ? 'mt-8' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <img
                src={src}
                alt="Couple"
                className="w-full h-64 md:h-80 object-cover filter grayscale hover:grayscale-0"
                style={{ transitionProperty: 'filter, transform', transitionDuration: '700ms' }}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-16 animate-on-scroll">
          <p className="font-fraunces text-3xl italic text-cream-muted">The connections you're looking for</p>
          <p className="text-accent text-sm tracking-widest uppercase mt-2">Sarasota-Manatee, Florida</p>
        </div>
      </section>

      {/* LOCAL DATES */}
      <section className="py-32 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="section-label mb-6 animate-on-scroll">Local First</div>
              <h2 className="font-fraunces text-5xl text-cream leading-tight mb-6 animate-on-scroll">
                Built for<br /><span className="italic text-accent">this corner</span><br />of Florida.
              </h2>
              <p className="text-cream-muted leading-relaxed mb-8 animate-on-scroll">
                Signal launched in the Sarasota-Manatee area because the best connections happen close to home. Every match is within 25 miles. Every meet-up is at a place you already love.
              </p>
              <Link href="/signup" className="btn-primary animate-on-scroll">
                Claim Your Spot
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 animate-on-scroll">
              {[
                "Siesta Key Beach",
                "Selby Botanical Gardens",
                "The Francis",
                "Indigenous Restaurant",
                "Sarasota Farmers Market",
                "Mote Marine Aquarium",
                "Ringling Museum",
                "Anna Maria Island",
                "Bradenton Riverwalk",
                "Mattison's City Grille",
              ].map(place => (
                <div key={place} className="border border-border px-4 py-3 text-cream-muted text-sm" style={{ transitionProperty: 'border-color, color', transitionDuration: '200ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#0d1f4e' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }}
                >
                  <MapPin size={12} className="inline mr-2 text-accent" />
                  {place}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="py-32 max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label mb-6 animate-on-scroll">Join Signal</div>
          <h2 className="font-fraunces text-5xl lg:text-6xl text-cream mb-6 animate-on-scroll">
            Ready to meet<br /><span className="italic text-accent">someone real?</span>
          </h2>
          <p className="text-cream-muted animate-on-scroll max-w-lg mx-auto">
            Founding members receive 60 days free. We're currently accepting applications from the Sarasota-Manatee area only — and spots are limited.
          </p>
        </div>
        <div className="animate-on-scroll text-center">
          <Link href="/signup" className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 text-sm tracking-[0.2em] uppercase font-medium animate-glow-pulse" style={{ transitionProperty: 'background-color, transform', transitionDuration: '150ms' }}>
            Claim a Founding Spot
            <ArrowRight size={16} />
          </Link>
          <p className="text-cream-muted text-xs mt-5 tracking-wide">Free now · 60 days free after launch · $6.99/mo after that</p>
          <p className="text-cream-muted text-xs mt-2">No credit card required · Sarasota-Manatee area only</p>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-surface border-y border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="section-label mb-6 animate-on-scroll">Pricing</div>
          <h2 className="font-fraunces text-4xl text-cream mb-4 animate-on-scroll">Simple. Flat. No tricks.</h2>
          <p className="text-cream-muted mb-12 animate-on-scroll">One price. No boosts. No super likes. No algorithmic advantages for paying more.</p>

          <div className="border border-border p-10 animate-on-scroll">
            <div className="text-cream-muted text-xs tracking-widest uppercase mb-4">Founding Member</div>
            <div className="font-fraunces text-7xl text-cream mb-2 tabular-nums">$6<span className="text-accent text-4xl">.99</span></div>
            <div className="text-cream-muted mb-8">per month · 60 days free after sign-up</div>
            <ul className="text-left space-y-3 mb-10 max-w-xs mx-auto">
              {[
                "5 verified matches every Monday",
                "Voice profile with 3 prompts",
                "Unlimited messaging with matches",
                "Identity-verified badge",
                "No pay-to-win features ever",
                "Pause anytime · cancel anytime",
              ].map(feature => (
                <li key={feature} className="flex items-center gap-3 text-cream-muted text-sm">
                  <CheckCircle size={14} className="text-accent flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-primary animate-glow-pulse">
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <p className="text-cream-muted text-xs mt-4">No credit card required during our founding-member period</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-fraunces text-3xl text-cream mb-2">Signal<span className="text-accent">.</span></div>
            <p className="text-cream-muted text-sm">Find Someone Real</p>
            <p className="text-cream-muted text-xs mt-2">Sarasota-Manatee, Florida</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-cream-muted text-sm">
              <a href="#how-it-works" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>How It Works</a>
              <Link href="/login" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Sign In</Link>
              <Link href="/signup" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Join</Link>
              <a href="mailto:hello@signal.dating" className="hover:text-cream" style={{ transitionProperty: 'color', transitionDuration: '150ms' }}>Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-cream-muted text-xs tracking-widest uppercase">Follow us</span>
              <a
                href="https://www.tiktok.com/@signaldating"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-muted hover:text-accent"
                style={{ transitionProperty: 'color', transitionDuration: '150ms' }}
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/signaldating"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-muted hover:text-accent"
                style={{ transitionProperty: 'color', transitionDuration: '150ms' }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-cream-muted text-xs">© 2025 Signal. All rights reserved.</p>
          <p className="text-cream-muted text-xs">Cancel anytime · Data preserved on pause</p>
        </div>
      </footer>
    </main>
  )
}
