'use client'

import { useEffect, useState } from 'react'

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(b => !b), 450)
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 2600)
    const t3 = setTimeout(() => onComplete(), 3300)
    return () => {
      clearInterval(blinkInterval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0c0a07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      {/* Left turn signal */}
      <div style={{ display: 'flex', gap: 6, opacity: blink ? 1 : 0.12, transition: 'opacity 0.12s' }}>
        {[2, 1, 0].map(i => (
          <div key={i} style={{
            width: 0, height: 0,
            borderTop: '18px solid transparent',
            borderBottom: '18px solid transparent',
            borderRight: `26px solid #c8542a`,
            opacity: 1 - i * 0.2,
          }} />
        ))}
      </div>

      {/* Wordmark */}
      <div style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 'clamp(80px, 16vw, 150px)',
        fontWeight: 300,
        fontStyle: 'italic',
        color: '#f4ede3',
        letterSpacing: '-0.02em',
        transform: phase === 'enter' ? 'scale(0.9)' : 'scale(1)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        lineHeight: 1,
      }}>
        Signal<span style={{ color: '#c8542a' }}>.</span>
      </div>

      {/* Right turn signal */}
      <div style={{ display: 'flex', gap: 6, opacity: blink ? 1 : 0.12, transition: 'opacity 0.12s' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 0, height: 0,
            borderTop: '18px solid transparent',
            borderBottom: '18px solid transparent',
            borderLeft: `26px solid #c8542a`,
            opacity: 1 - i * 0.2,
          }} />
        ))}
      </div>

      {/* Tagline */}
      <p style={{
        color: '#a89b8c',
        fontSize: 12,
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        opacity: phase === 'hold' ? 1 : 0,
        transition: 'opacity 0.5s ease 0.4s',
        marginTop: 4,
      }}>
        Find Someone Real
      </p>
    </div>
  )
}
