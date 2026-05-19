'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    // Blink the turn signal
    const blinkInterval = setInterval(() => {
      setBlink(b => !b)
    }, 500)

    // Phase timeline
    const holdTimer = setTimeout(() => setPhase('hold'), 800)
    const exitTimer = setTimeout(() => setPhase('exit'), 2800)
    const redirectTimer = setTimeout(() => router.push('/'), 3600)

    return () => {
      clearInterval(blinkInterval)
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0c0a07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        transition: 'opacity 0.8s ease',
        opacity: phase === 'exit' ? 0 : 1,
      }}
    >
      {/* Turn signal left */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: blink ? 1 : 0.15,
          transition: 'opacity 0.1s ease',
        }}
      >
        {/* Left arrow segments */}
        {[2, 1, 0].map(i => (
          <div
            key={i}
            style={{
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderRight: `24px solid #2563eb`,
              opacity: blink ? (1 - i * 0.25) : 0.1,
              transition: `opacity ${0.1 + i * 0.05}s ease`,
            }}
          />
        ))}
      </div>

      {/* Signal wordmark */}
      <div
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(72px, 15vw, 140px)',
          fontWeight: 300,
          color: '#f4ede3',
          letterSpacing: '-0.02em',
          fontStyle: 'italic',
          transform: phase === 'enter' ? 'scale(0.92)' : 'scale(1)',
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
        }}
      >
        Signal
        <span style={{ color: '#2563eb' }}>.</span>
      </div>

      {/* Turn signal right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: blink ? 1 : 0.15,
          transition: 'opacity 0.1s ease',
        }}
      >
        {/* Right arrow segments */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderLeft: `24px solid #2563eb`,
              opacity: blink ? (1 - i * 0.25) : 0.1,
              transition: `opacity ${0.1 + i * 0.05}s ease`,
            }}
          />
        ))}
      </div>

      {/* Tagline */}
      <p
        style={{
          color: '#a89b8c',
          fontSize: 13,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginTop: 8,
          opacity: phase === 'hold' ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
        }}
      >
        Find Someone Real
      </p>
    </div>
  )
}
