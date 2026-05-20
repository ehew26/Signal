'use client'

import { useEffect, useState } from 'react'
import { Copy, Share2, Check, Users, Link as LinkIcon } from 'lucide-react'

const BASE_URL = 'https://signal-date-app.vercel.app'

export default function ShareSignal() {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(!!navigator?.share)

    fetch('/api/referral', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        if (d.referralCode) {
          setReferralCode(d.referralCode)
          setReferralCount(d.referralCount ?? 0)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const shareLink = referralCode ? `${BASE_URL}?ref=${referralCode}` : BASE_URL

  const shareText = `I just joined Signal — a dating app built for Sarasota-Manatee. Five verified matches every Monday. No swiping. Founding spots are filling up — claim yours before they're gone:`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = shareLink
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: 'Signal — Dating for Sarasota-Manatee',
        text: shareText,
        url: shareLink,
      })
    } catch {
      // user cancelled or not supported
    }
  }

  return (
    <div
      className="border border-[#2563eb]/30 p-6 sm:p-8"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#2563eb' }}
        >
          <Users size={18} color="#ffffff" />
        </div>
        <div>
          <h3
            className="font-medium text-base tracking-tight"
            style={{ color: '#0d1f4e' }}
          >
            Help us reach 150 members
          </h3>
          <p className="text-sm mt-0.5" style={{ color: '#4b5563' }}>
            The sooner we hit the target, the sooner matching goes live.
          </p>
        </div>
      </div>

      {/* Referral count badge */}
      {referralCount > 0 && (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs tracking-[0.2em] uppercase font-medium mb-5"
          style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
        >
          <Check size={12} />
          You&apos;ve referred {referralCount} {referralCount === 1 ? 'person' : 'people'}
        </div>
      )}

      {/* Share link box */}
      <div
        className="flex items-center gap-0 mb-4 overflow-hidden"
        style={{ border: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-2 px-3 flex-1 min-w-0 py-3">
          <LinkIcon size={13} color="#9ca3af" className="flex-shrink-0" />
          <span
            className="text-sm truncate font-mono"
            style={{ color: loading ? '#9ca3af' : '#0d1f4e' }}
          >
            {loading ? 'Generating your link…' : shareLink}
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-3 text-xs tracking-widest uppercase font-medium flex-shrink-0 disabled:opacity-50"
          style={{
            backgroundColor: copied ? '#16a34a' : '#2563eb',
            color: '#ffffff',
            transitionProperty: 'background-color',
            transitionDuration: '200ms',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Buttons row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {canShare && (
          <button
            onClick={handleNativeShare}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50"
            style={{
              backgroundColor: '#0d1f4e',
              color: '#ffffff',
            }}
          >
            <Share2 size={13} />
            Share via…
          </button>
        )}

        <a
          href={`sms:?body=${encodeURIComponent(`${shareText} ${shareLink}`)}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.2em] uppercase font-medium"
          style={{
            border: '1px solid #e5e7eb',
            color: '#0d1f4e',
            backgroundColor: '#ffffff',
          }}
        >
          Text a friend
        </a>
      </div>

      {/* Subtext */}
      <p className="text-xs mt-4 text-center" style={{ color: '#6b7280' }}>
        Your unique link tracks who you bring in. Every founding member gets 60 days free.
      </p>
    </div>
  )
}
