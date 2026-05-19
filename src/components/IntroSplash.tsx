'use client'

import { useEffect, useState } from 'react'

const BLUE = '#2563eb'
const DEEP = '#0d1f4e'

function playTick(audioCtx: AudioContext, time: number) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.type = 'square'
  osc.frequency.setValueAtTime(800, time)
  osc.frequency.exponentialRampToValueAtTime(400, time + 0.015)
  gain.gain.setValueAtTime(0.35, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04)
  osc.start(time)
  osc.stop(time + 0.04)
}

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    let audioCtx: AudioContext | null = null
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioCtx.currentTime
      const clickInterval = 0.45
      const totalDuration = 6.5
      for (let i = 0; i < totalDuration / clickInterval; i++) {
        playTick(audioCtx, now + i * clickInterval)
      }
    } catch {
      // Audio not supported — silently skip
    }

    const blinkInterval = setInterval(() => setBlink(b => !b), 450)
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 6600)
    const t3 = setTimeout(() => {
      onComplete()
      audioCtx?.close()
    }, 7300)

    return () => {
      clearInterval(blinkInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      audioCtx?.close()
    }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.7s ease',
        overflow: 'hidden',
      }}
    >
      {/* Futuristic background grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: '70vmin',
          height: '70vmin',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}22 0%, transparent 60%)`,
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left turn signal */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          opacity: blink ? 1 : 0.12,
          transition: 'opacity 0.12s',
          filter: blink ? `drop-shadow(0 0 12px ${BLUE}88)` : 'none',
          position: 'relative',
        }}
      >
        {[2, 1, 0].map(i => (
          <div key={i} style={{
            width: 0, height: 0,
            borderTop: '18px solid transparent',
            borderBottom: '18px solid transparent',
            borderRight: `26px solid ${BLUE}`,
            opacity: 1 - i * 0.2,
          }} />
        ))}
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(80px, 16vw, 150px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: DEEP,
          letterSpacing: '-0.02em',
          transform: phase === 'enter' ? 'scale(0.9)' : 'scale(1)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          lineHeight: 1,
          position: 'relative',
          textShadow: `0 0 60px ${BLUE}33`,
        }}
      >
        Signal<span style={{ color: BLUE }}>.</span>
      </div>

      {/* Right turn signal */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          opacity: blink ? 1 : 0.12,
          transition: 'opacity 0.12s',
          filter: blink ? `drop-shadow(0 0 12px ${BLUE}88)` : 'none',
          position: 'relative',
        }}
      >
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 0, height: 0,
            borderTop: '18px solid transparent',
            borderBottom: '18px solid transparent',
            borderLeft: `26px solid ${BLUE}`,
            opacity: 1 - i * 0.2,
          }} />
        ))}
      </div>

      {/* Tagline */}
      <p
        style={{
          color: '#4a5568',
          fontSize: 12,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 0.5s ease 0.4s',
          marginTop: 4,
          position: 'relative',
        }}
      >
        Find Someone Real
      </p>
    </div>
  )
}
