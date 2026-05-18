'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, MapPin, Shield, Mic, Users } from 'lucide-react'
import IntroSplash from '@/components/IntroSplash'

// Animated waveform bars component
function WaveformBars({ playing = false, color = '#c8542a', bars = 20 }: { playing?: boolean; color?: string; bars?: number }) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height: 32 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={playing ? 'animate-waveform' : ''}
          style={{
            width: 3,
            backgroundColor: color,
            height: playing ? undefined : `${Math.random() * 24 + 8}px`,
            minHeight: 8,
            maxHeight: 32,
            borderRadius: 2,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
            transform: playing ? undefined : 'scaleY(1)',
          }}
        />
      ))}
    </div>
  )
}

// Floating demo profile card
function FloatingProfileCard() {
  return (
    <div className="animate-float relative w-80">
      <div className="bg-surface border border-border overflow-hidden shadow-2xl">
        {/* Photo */}
        <div className="relative h-96 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"
            alt="Demo profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          {/* Verified badge */}
          <div className="absolute top-4 right-4 bg-accent text-cream text-[10px] tracking-widest uppercase px-3 py-1.5 flex items-center gap-1.5">
            <Shield size={10} />
            Verified
          </div>
        </div>

        {/* Profile info */}
        <div className="p-5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h3 className="font-fraunces text-xl text-cream">Sophia, 29</h3>
              <div className="flex items-center gap-1.5 text-cream-muted text-sm mt-1">
                <MapPin size={12} />
                <span>Sarasota, FL · 2 mi</span>
              </div>
            </div>
          </div>

          {/* Interest tags */}
          <div className="flex flex-wrap gap-1.5 mb-4 mt-3">
            {['Fine dining', 'Yoga', 'Travel', 'Wine'].map(tag => (
              <span key={tag} className="text-[10px] tracking-wider uppercase text-cream-muted border border-border px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* Voice prompt preview */}
          <div className="border-t border-border pt-4 mb-5">
            <p className="text-[10px] text-cream-muted tracking-widest uppercase mb-2">Voice Prompt</p>
            <p className="text-cream text-sm mb-3 font-fraunces italic">"The kind of Sunday morning I want more of..."</p>
            <WaveformBars color="#c8542a" bars={24} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="flex-1 border border-border text-cream-muted text-xs tracking-widest uppercase py-3 hover:border-cream transition-colors">
              Pass
            </button>
            <button className="flex-1 bg-accent text-cream text-xs tracking-widest uppercase py-3 hover:bg-opacity-90 transition-colors">
              Send Signal
            </button>
          </div>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-accent opacity-30" />
      <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-accent opacity-30" />
    </div>
  )
}

// Trust pill component
function TrustPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 border border-border px-5 py-3 bg-surface">
      <span className="text-accent">{icon}</span>
      <span className="text-cream text-sm tracking-wide">{text}</span>
    </div>
  )
}

// Scrolling stats ticker
function StatsTicker() {
  const stats = [
    "487 verified members",
    "Sarasota · Bradenton · Venice · Lakewood Ranch",
    "72-hour response Compact",
    "Voice-first profiles",
    "5 matches every Monday",
    "0% pay-to-win",
    "100% identity verified",
    "No swiping. Ever.",
    "Founding member pricing: $6.99/mo",
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

// How it works step
function HowItWorksStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="animate-on-scroll border-l-2 border-border pl-8 py-2 hover:border-accent transition-colors duration-500 group">
      <div className="text-accent text-xs tracking-[0.3em] uppercase mb-3 font-cabinet">{number}</div>
      <h3 className="font-fraunces text-2xl text-cream mb-3 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-cream-muted leading-relaxed">{description}</p>
    </div>
  )
}

// Waitlist form
function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [seeking, setSeeking] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, seeking }),
      })
      if (res.ok) setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-accent text-5xl mb-6 font-fraunces italic">You're in.</div>
        <p className="text-cream-muted text-lg">We'll reach out when your spot opens up.</p>
        <p className="text-cream-muted text-sm mt-2">Sarasota-Manatee members get priority access.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">First Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/40"
          />
        </div>
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/40"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full bg-background border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Select your city</option>
            <option value="sarasota">Sarasota</option>
            <option value="bradenton">Bradenton</option>
            <option value="lakewood-ranch">Lakewood Ranch</option>
            <option value="venice">Venice</option>
            <option value="other">Other nearby</option>
          </select>
        </div>
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">I'm looking for</label>
          <select
            value={seeking}
            onChange={e => setSeeking(e.target.value)}
            className="w-full bg-background border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Prefer not to say</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="everyone">Everyone</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-cream py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
      >
        {loading ? 'Joining...' : 'Request Early Access'}
        {!loading && <ArrowRight size={16} />}
      </button>
      <p className="text-cream-muted text-xs text-center">
        Founding members get 60 days free. Currently accepting Sarasota-Manatee area only.
      </p>
    </form>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

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
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="font-fraunces text-2xl text-cream">
          Signal<span className="text-accent">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-cream-muted text-sm tracking-wider">
          <a href="#how-it-works" className="hover:text-cream transition-colors">How It Works</a>
          <a href="#voice" className="hover:text-cream transition-colors">Voice Profiles</a>
          <a href="#join" className="hover:text-cream transition-colors">Join</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-cream-muted text-sm hover:text-cream transition-colors hidden md:block">
            Sign In
          </Link>
          <Link href="/signup" className="bg-accent text-cream text-xs tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-opacity-90 transition-opacity">
            Get Access
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center" ref={heroRef}>
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1920&h=1080&fit=crop"
            alt="Couple"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: headline */}
            <div>
              <div className="section-label mb-8">Sarasota · Bradenton · Venice</div>
              <h1 className="font-fraunces text-6xl md:text-7xl lg:text-8xl text-cream leading-[0.95] mb-8">
                Five real<br />
                <span className="italic text-accent">matches</span><br />
                every Monday.
              </h1>
              <p className="text-cream-muted text-lg leading-relaxed mb-10 max-w-md">
                Signal is the antidote to app fatigue. No swiping. No algorithms. Just five curated, verified people from your corner of Florida — delivered once a week.
              </p>

              {/* Trust pills */}
              <div className="grid grid-cols-2 gap-3 mb-10 max-w-md">
                <TrustPill icon={<Shield size={14} />} text="100% verified" />
                <TrustPill icon={<Mic size={14} />} text="Voice-first" />
                <TrustPill icon={<Users size={14} />} text="Local only" />
                <TrustPill icon={<CheckCircle size={14} />} text="Meet in 72 hrs" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="bg-accent text-cream px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-3">
                  Join the Waitlist
                  <ArrowRight size={16} />
                </Link>
                <a href="#how-it-works" className="border border-border text-cream-muted px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:border-cream hover:text-cream transition-all text-center">
                  See How It Works
                </a>
              </div>

              <p className="text-cream-muted text-xs mt-6 tracking-wide">
                Founding member pricing · 60 days free · $6.99/mo after
              </p>
            </div>

            {/* Right: floating profile card */}
            <div className="hidden lg:flex justify-end items-center pr-8">
              <FloatingProfileCard />
            </div>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <StatsTicker />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="section-label mb-6 animate-on-scroll">The Process</div>
            <h2 className="font-fraunces text-5xl lg:text-6xl text-cream leading-tight mb-6 animate-on-scroll">
              Dating, the<br /><span className="italic text-accent">way it should</span><br />feel.
            </h2>
            <p className="text-cream-muted leading-relaxed max-w-md animate-on-scroll">
              We built Signal because app culture broke dating. Infinite choices create decision paralysis. Verification removes bad actors. Voice profiles reveal personality. And one weekly drop restores intention.
            </p>
          </div>

          <div className="space-y-10">
            <HowItWorksStep
              number="01"
              title="Get verified"
              description="Every Signal member completes identity verification via biometric selfie. Your verified badge signals you're real — and so is everyone you'll meet."
            />
            <HowItWorksStep
              number="02"
              title="Build your voice profile"
              description="Record three 30-second voice prompts. Let people hear your laugh, your cadence, your personality — before they ever swipe right."
            />
            <HowItWorksStep
              number="03"
              title="Receive your five"
              description="Every Monday at 7am, five curated matches arrive. We've already filtered for location, age, and compatibility. You just decide who feels right."
            />
            <HowItWorksStep
              number="04"
              title="Signal. Match. Meet."
              description="Send a signal to the people you're interested in. When it's mutual, you match. The Compact keeps both people accountable — respond within 72 hours."
            />
          </div>
        </div>
      </section>

      {/* VOICE PROMPTS SECTION */}
      <section id="voice" className="py-32 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="section-label mb-6 animate-on-scroll">Voice-First</div>
            <h2 className="font-fraunces text-5xl lg:text-6xl text-cream animate-on-scroll">
              Hear who they are<br /><span className="italic text-accent">before you meet.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { question: "Two truths and a lie about me...", name: "Marcus, 31" },
              { question: "The kind of Sunday morning I want more of...", name: "Elena, 27" },
              { question: "What my best friend would say about me...", name: "James, 34" },
            ].map((prompt, i) => (
              <div key={i} className="animate-on-scroll border border-border bg-background p-6 hover:border-accent transition-colors duration-500">
                <p className="font-fraunces text-lg italic text-cream mb-2">"{prompt.question}"</p>
                <p className="text-cream-muted text-sm mb-6">{prompt.name}</p>
                <WaveformBars color="#c8542a" bars={28} />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-cream-muted text-xs">0:28</span>
                  <button className="w-9 h-9 border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-cream transition-all">
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                      <path d="M2 1l9 6-9 6V1z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {couplePhotos.map((src, i) => (
            <div
              key={i}
              className={`animate-on-scroll overflow-hidden ${i === 1 || i === 4 ? 'mt-8' : ''} ${i === 2 ? 'mt-0' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img
                src={src}
                alt="Couple"
                className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700 filter grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-16 animate-on-scroll">
          <p className="font-fraunces text-3xl italic text-cream-muted">Real people. Real connection.</p>
          <p className="text-accent text-sm tracking-widest uppercase mt-2">Sarasota-Manatee, Florida</p>
        </div>
      </section>

      {/* LOCAL DATES SECTION */}
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
              <Link href="/signup" className="bg-accent text-cream px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity inline-flex items-center gap-3">
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
                <div key={place} className="border border-border px-4 py-3 text-cream-muted text-sm hover:border-accent hover:text-cream transition-all">
                  <MapPin size={12} className="inline mr-2 text-accent" />
                  {place}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOIN / WAITLIST */}
      <section id="join" className="py-32 max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label mb-6 animate-on-scroll">Join Signal</div>
          <h2 className="font-fraunces text-5xl lg:text-6xl text-cream mb-6 animate-on-scroll">
            Ready to meet<br /><span className="italic text-accent">someone real?</span>
          </h2>
          <p className="text-cream-muted animate-on-scroll">
            Founding members receive 60 days free. Currently accepting applications from the Sarasota-Manatee area only.
          </p>
        </div>
        <div className="animate-on-scroll">
          <WaitlistForm />
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
            <div className="font-fraunces text-7xl text-cream mb-2">$6<span className="text-accent text-4xl">.99</span></div>
            <div className="text-cream-muted mb-8">per month · after 60-day free trial</div>
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
            <Link href="/signup" className="bg-accent text-cream px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity inline-block">
              Start Free Trial
            </Link>
            <p className="text-cream-muted text-xs mt-4">Use code FOUNDING at checkout for 60 days free</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-fraunces text-3xl text-cream mb-2">
              Signal<span className="text-accent">.</span>
            </div>
            <p className="text-cream-muted text-sm">Find Someone Real</p>
            <p className="text-cream-muted text-xs mt-2">Sarasota-Manatee, Florida</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-cream-muted text-sm">
            <a href="#how-it-works" className="hover:text-cream transition-colors">How It Works</a>
            <Link href="/login" className="hover:text-cream transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-cream transition-colors">Join</Link>
            <a href="mailto:hello@signal.dating" className="hover:text-cream transition-colors">Contact</a>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-cream-muted text-xs">© 2024 Signal. All rights reserved.</p>
          <p className="text-cream-muted text-xs">No refunds policy · Cancel anytime · Data preserved on pause</p>
        </div>
      </footer>
    </main>
  )
}
