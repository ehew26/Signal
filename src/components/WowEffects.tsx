'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Scroll Progress Bar ───────────────────────────────────────────────────
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setProgress((scrollTop / (scrollHeight - clientHeight)) * 100)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
          boxShadow: '0 0 8px rgba(37,99,235,0.7)',
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  )
}

// ─── Mouse Spotlight ───────────────────────────────────────────────────────
export function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(37,99,235,0.07), transparent 50%)`
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      aria-hidden
    />
  )
}

// ─── Animated Counter ─────────────────────────────────────────────────────
export function AnimatedCounter({ to, suffix = '', duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - p, 4)
            setCount(Math.round(ease * to))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Live Join Toast ───────────────────────────────────────────────────────
const NAMES = [
  'Sarah', 'Jake', 'Madison', 'Tyler', 'Olivia', 'Connor', 'Emma',
  'Liam', 'Ava', 'Noah', 'Sophia', 'Mason', 'Isabella', 'Ethan',
  'Mia', 'Logan', 'Charlotte', 'Lucas', 'Amelia', 'James',
]
const AREAS = [
  'Sarasota', 'Bradenton', 'Lakewood Ranch', 'Venice',
  'Siesta Key', 'Downtown Sarasota', 'Palmer Ranch', 'Anna Maria',
]

interface Toast { id: number; name: string; area: string }

export function LiveJoinToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  useEffect(() => {
    // First toast after 8 seconds, then random 18-40s
    const schedule = () => {
      const delay = 18000 + Math.random() * 22000
      return setTimeout(() => {
        const id = ++counter.current
        const name = NAMES[Math.floor(Math.random() * NAMES.length)]
        const area = AREAS[Math.floor(Math.random() * AREAS.length)]
        setToasts(prev => [...prev.slice(-2), { id, name, area }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
        schedule()
      }, delay)
    }

    const first = setTimeout(() => {
      const id = ++counter.current
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const area = AREAS[Math.floor(Math.random() * AREAS.length)]
      setToasts([{ id, name, area }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
      schedule()
    }, 8000)

    return () => clearTimeout(first)
  }, [])

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t, i) => (
        <div
          key={t.id}
          style={{
            animation: 'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
            opacity: i < toasts.length - 1 ? 0.6 : 1,
          }}
          className="flex items-center gap-3 bg-white border border-border shadow-lg px-4 py-3 max-w-[240px]"
        >
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60" />
          </div>
          <div>
            <p className="text-cream text-xs font-medium">{t.name} just joined</p>
            <p className="text-cream-muted text-[10px] tracking-wide">{t.area}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── 3D Tilt Card Wrapper ─────────────────────────────────────────────────
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.15s ease-out', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

// ─── Magnetic Button ──────────────────────────────────────────────────────
export function MagneticButton({ children, className = '', href, onClick }: {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * 0.25
    const y = (e.clientY - top - height / 2) * 0.25
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0,0)'
  }

  const style = { transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }

  if (href) {
    return (
      <a ref={ref as any} href={href} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={style}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref as any} className={className} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} style={style}>
      {children}
    </button>
  )
}
