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
  osc.frequency.setValueAtTime(820, time)
  osc.frequency.exponentialRampToValueAtTime(380, time + 0.018)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045)
  osc.start(time)
  osc.stop(time + 0.05)
}

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    let audioCtx: AudioContext | null = null
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioCtx.currentTime
      const clickInterval = 0.44
      const totalDuration = 6.5
      for (let i = 0; i < Math.floor(totalDuration / clickInterval); i++) {
        playTick(audioCtx, now + i * clickInterval)
      }
    } catch {
      // Audio not supported — silently skip
    }

    const blinkInterval = setInterval(() => setBlink(b => !b), 440)
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

  const signalOpacity = blink ? 1 : 0.1
  const signalFilter = blink ? `drop-shadow(0 0 14px ${BLUE}aa)` : 'none'
  const signalTransition = 'opacity 0.1s ease, filter 0.1s ease'

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
            'linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: '60vmin',
          height: '60vmin',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BLUE}1a 0%, transparent 65%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main layout: [left signals] [wordmark] [right signals] */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(20px, 4vw, 48px)',
          position: 'relative',
        }}
      >
        {/* Left turn signal — arrows pointing left */}
        <div
          style={{
            display: 'flex',
            gap: 5,
            opacity: signalOpacity,
            filter: signalFilter,
            transition: signalTransition,
            flexDirection: 'row',
          }}
        >
          {[2, 1, 0].map(i => (
            <div key={i} style={{
              width: 0, height: 0,
              borderTop: 'clamp(12px, 2.5vw, 20px) solid transparent',
              borderBottom: 'clamp(12px, 2.5vw, 20px) solid transparent',
              borderRight: `clamp(16px, 3.5vw, 28px) solid ${BLUE}`,
              opacity: 1 - i * 0.25,
            }} />
          ))}
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(72px, 14vw, 140px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: DEEP,
            letterSpacing: '-0.02em',
            transform: phase === 'enter' ? 'scale(0.88)' : 'scale(1)',
            opacity: phase === 'enter' ? 0 : 1,
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            lineHeight: 1,
            textShadow: `0 0 80px ${BLUE}22`,
          }}
        >
          Signal<span style={{ color: BLUE }}>.</span>
        </div>

        {/* Right turn signal — arrows pointing right */}
        <div
          style={{
            display: 'flex',
            gap: 5,
            opacity: signalOpacity,
            filter: signalFilter,
            transition: signalTransition,
            flexDirection: 'row',
          }}
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 0, height: 0,
              borderTop: 'clamp(12px, 2.5vw, 20px) solid transparent',
              borderBottom: 'clamp(12px, 2.5vw, 20px) solid transparent',
              borderLeft: `clamp(16px, 3.5vw, 28px) solid ${BLUE}`,
              opacity: 1 - i * 0.25,
            }} />
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          color: '#718096',
          fontSize: 11,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
          marginTop: 28,
          position: 'relative',
        }}
      >
        Find Someone Real
      </p>
    </div>
  )
}
