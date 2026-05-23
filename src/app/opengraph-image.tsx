import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Signal — Find Someone Real'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Blue accent bar top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#2563eb', display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Location pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #e2e8f0',
              padding: '8px 20px',
              marginBottom: 40,
              background: '#f8faff',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', display: 'flex' }} />
            <span style={{ color: '#4a5568', fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Sarasota · Bradenton · Venice
            </span>
          </div>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span
              style={{
                fontSize: 120,
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#0d1f4e',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Signal
            </span>
            <span style={{ fontSize: 120, fontWeight: 300, color: '#2563eb', lineHeight: 1 }}>.</span>
          </div>

          {/* Tagline */}
          <p
            style={{
              color: '#4a5568',
              fontSize: 22,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: 24,
              marginBottom: 48,
            }}
          >
            Find Someone Real
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48 }}>
            {[
              { num: '5', label: 'Matches weekly' },
              { num: '100%', label: 'Verified members' },
              { num: '150', label: 'Founding spots' },
            ].map(({ num, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 300, color: '#2563eb', fontStyle: 'italic' }}>{num}</span>
                <span style={{ fontSize: 13, color: '#4a5568', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* URL bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 40,
            fontSize: 14,
            color: '#4a5568',
            letterSpacing: '0.05em',
            display: 'flex',
          }}
        >
          signal-date-app.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
