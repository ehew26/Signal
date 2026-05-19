'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Shield, Mic, MessageCircle, User, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTimeUntilMonday } from '@/lib/utils'

function WaveformBars({ playing = false, small = false }: { playing?: boolean; small?: boolean }) {
  const bars = small ? 16 : 24
  return (
    <div className="flex items-center gap-[2px]" style={{ height: small ? 20 : 28 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={playing ? 'animate-waveform' : ''}
          style={{
            width: small ? 2 : 3,
            backgroundColor: '#2563eb',
            height: playing ? undefined : `${Math.random() * (small ? 16 : 22) + 4}px`,
            minHeight: 4,
            maxHeight: small ? 20 : 28,
            borderRadius: 1,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.7 + Math.random() * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState(getTimeUntilMonday())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilMonday()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {[
        { value: time.days, label: 'days' },
        { value: time.hours, label: 'hrs' },
        { value: time.minutes, label: 'min' },
        { value: time.seconds, label: 'sec' },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="font-fraunces text-2xl text-cream tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-cream-muted text-[10px] tracking-widest uppercase">{label}</div>
        </div>
      ))}
    </div>
  )
}

function MatchCard({ match, onSignal, onPass }: {
  match: any
  onSignal: () => void
  onPass: () => void
}) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [playingPrompt, setPlayingPrompt] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const profile = match.matched_profile
  const photos = match.matched_photos || []
  const interests = match.matched_interests || []
  const prompts = match.matched_voice_prompts || []
  const isPassed = match.status === 'passed'
  const isSignaled = match.status === 'signaled'

  const mainPhoto = photos[photoIndex]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop`

  function playPrompt(promptId: string, audioUrl: string) {
    if (playingPrompt === promptId) {
      audio?.pause()
      setPlayingPrompt(null)
      return
    }
    audio?.pause()
    const newAudio = new Audio(audioUrl)
    newAudio.play()
    newAudio.onended = () => setPlayingPrompt(null)
    setAudio(newAudio)
    setPlayingPrompt(promptId)
  }

  if (isPassed) {
    return (
      <div className="bg-surface border border-border p-8 text-center opacity-60">
        <p className="text-cream-muted font-fraunces italic">Passed</p>
      </div>
    )
  }

  return (
    <div className={`bg-surface border ${isSignaled ? 'border-accent' : 'border-border'} overflow-hidden`}>
      {/* Photo */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={mainPhoto}
          alt={profile?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Photo navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIndex(i => Math.max(0, i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/60 flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <ChevronLeft size={16} className="text-cream" />
            </button>
            <button
              onClick={() => setPhotoIndex(i => Math.min(photos.length - 1, i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/60 flex items-center justify-center hover:bg-background/80 transition-colors"
            >
              <ChevronRight size={16} className="text-cream" />
            </button>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_: any, i: number) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIndex ? 'bg-cream' : 'bg-cream/30'}`} />
              ))}
            </div>
          </>
        )}

        {/* Verified badge */}
        {profile?.verified && (
          <div className="absolute top-4 right-4 bg-accent text-cream text-[10px] tracking-widest uppercase px-3 py-1.5 flex items-center gap-1.5">
            <Shield size={10} />
            Verified
          </div>
        )}

        {/* Signaled badge */}
        {isSignaled && (
          <div className="absolute top-4 left-4 bg-accent text-cream text-[10px] tracking-widest uppercase px-3 py-1.5">
            Signal Sent
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Link href={`/profile/${profile?.id}`}>
              <h3 className="font-fraunces text-2xl text-cream hover:text-accent transition-colors">{profile?.name}, {profile?.age}</h3>
            </Link>
            <div className="flex items-center gap-1.5 text-cream-muted text-sm mt-1">
              <MapPin size={12} />
              <span>{profile?.city}, {profile?.state}</span>
            </div>
          </div>
          <Link href={`/profile/${profile?.id}`} className="text-cream-muted text-xs tracking-widest uppercase border border-border px-3 py-2 hover:border-accent hover:text-accent transition-colors">
            Full profile
          </Link>
        </div>

        {profile?.bio && (
          <p className="text-cream-muted text-sm leading-relaxed mb-4 line-clamp-2">{profile.bio}</p>
        )}

        {/* Interest tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {interests.slice(0, 5).map((int: any) => (
            <span key={int.id} className="text-[10px] tracking-wider uppercase text-cream-muted border border-border px-2.5 py-1">
              {int.tag}
            </span>
          ))}
        </div>

        {/* Voice prompts */}
        {prompts.length > 0 && (
          <div className="border-t border-border pt-4 mb-5 space-y-3">
            <p className="text-[10px] text-cream-muted tracking-widest uppercase flex items-center gap-2">
              <Mic size={10} /> Voice Prompts
            </p>
            {prompts.slice(0, 2).map((prompt: any) => (
              <div key={prompt.id} className="bg-background border border-border p-3">
                <p className="font-fraunces text-sm italic text-cream mb-2">"{prompt.prompt_question}"</p>
                <div className="flex items-center gap-3">
                  <WaveformBars playing={playingPrompt === prompt.id} small />
                  <button
                    onClick={() => prompt.audio_url && playPrompt(prompt.id, prompt.audio_url)}
                    className="w-7 h-7 border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-cream transition-all flex-shrink-0"
                  >
                    {playingPrompt === prompt.id ? <Pause size={10} /> : <Play size={10} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {!isSignaled && (
          <div className="flex gap-3">
            <button onClick={onPass} className="flex-1 pass-btn">Pass</button>
            <button onClick={onSignal} className="flex-1 signal-btn">Send Signal</button>
          </div>
        )}

        {isSignaled && (
          <div className="text-center py-3 border border-accent/50 bg-accent/5 text-accent text-xs tracking-widest uppercase">
            Signal Sent — Waiting for theirs
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomeClient({
  matches,
  profile,
  signalsSent,
  weekDate,
  memberCount = 0,
  launchTarget = 150,
}: {
  matches: any[]
  profile: any
  signalsSent: number
  weekDate: string
  memberCount?: number
  launchTarget?: number
}) {
  const launched = memberCount >= launchTarget
  const progress = Math.min(100, Math.round((memberCount / launchTarget) * 100))
  const [localMatches, setLocalMatches] = useState(matches)

  async function handleSignal(matchId: string, toUserId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Update weekly match status
    await supabase
      .from('weekly_matches')
      .update({ status: 'signaled' })
      .eq('id', matchId)

    // Insert signal
    const { error: signalError } = await supabase
      .from('signals')
      .insert({ from_user_id: user.id, to_user_id: toUserId })

    if (!signalError) {
      // Check if mutual signal exists
      const { data: mutualSignal } = await supabase
        .from('signals')
        .select('*')
        .eq('from_user_id', toUserId)
        .eq('to_user_id', user.id)
        .single()

      if (mutualSignal) {
        // Create match
        const [uid1, uid2] = [user.id, toUserId].sort()
        await supabase.from('matches').insert({ user_id_1: uid1, user_id_2: uid2 })
        // Notify via API
        await fetch('/api/match-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, matchedUserId: toUserId }),
        })
      }
    }

    setLocalMatches(prev =>
      prev.map(m => m.id === matchId ? { ...m, status: 'signaled' } : m)
    )
  }

  async function handlePass(matchId: string) {
    const supabase = createClient()
    await supabase
      .from('weekly_matches')
      .update({ status: 'passed' })
      .eq('id', matchId)

    setLocalMatches(prev =>
      prev.map(m => m.id === matchId ? { ...m, status: 'passed' } : m)
    )
  }

  const activeMatches = localMatches.filter(m => m.status !== 'passed')
  const signalCount = localMatches.filter(m => m.status === 'signaled').length
  const allUsed = localMatches.every(m => m.status === 'signaled' || m.status === 'passed')

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-fraunces text-xl text-cream">
            Signal<span className="text-accent">.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/messages" className="text-cream-muted hover:text-cream transition-colors relative">
              <MessageCircle size={20} />
            </Link>
            <Link href="/profile" className="text-cream-muted hover:text-cream transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Launch progress banner */}
        {!launched && (
          <div className="mb-10 border border-accent/30 bg-accent/5 p-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-accent text-[11px] tracking-[0.3em] uppercase font-medium">Pre-Launch · Sarasota-Manatee</span>
                <span className="text-cream-muted text-xs tabular-nums">{memberCount} / {launchTarget}</span>
              </div>
              <h2 className="font-fraunces text-2xl text-cream mb-2">
                Signal goes live at <span className="text-accent italic">{launchTarget} founding members.</span>
              </h2>
              <p className="text-cream-muted text-sm mb-4">
                Build your profile now — matching switches on the moment we hit the target. You&rsquo;ll be in the first cohort.
              </p>
              <div className="h-1.5 bg-surface-2 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute inset-y-0 bg-accent/40 blur-sm transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-cream-muted tracking-wider uppercase">
                <span>{progress}% to launch</span>
                <span>{Math.max(0, launchTarget - memberCount)} spots left</span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">
              Week of {new Date(weekDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-fraunces text-4xl text-cream">
              Your matches, {profile.name.split(' ')[0]}.
            </h1>
          </div>

          {/* Signal dots + countdown */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-cream-muted text-xs tracking-widest uppercase mr-2">Signals sent</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border transition-colors ${i < signalCount ? 'bg-accent border-accent' : 'border-border'}`}
                />
              ))}
              <span className="text-cream-muted text-xs ml-1">{signalCount}/5</span>
            </div>
            <div>
              <p className="text-cream-muted text-xs tracking-widest uppercase mb-1">Next drop in</p>
              <Countdown />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {localMatches.length === 0 && (
          <div className="text-center py-24 border border-border">
            <div className="font-fraunces text-3xl italic text-cream-muted mb-4">No matches yet</div>
            <p className="text-cream-muted mb-6">Your five matches arrive every Monday at 7am.</p>
            <div className="flex justify-center">
              <div className="border border-border p-6 inline-block">
                <p className="text-cream-muted text-xs tracking-widest uppercase mb-3">Next delivery in</p>
                <Countdown />
              </div>
            </div>
          </div>
        )}

        {/* All used state */}
        {allUsed && localMatches.length > 0 && (
          <div className="text-center py-8 border border-border mb-8 bg-surface">
            <div className="font-fraunces text-2xl italic text-cream mb-2">All done for this week</div>
            <p className="text-cream-muted text-sm mb-4">New matches arrive next Monday at 7am.</p>
            <div className="flex justify-center">
              <Countdown />
            </div>
          </div>
        )}

        {/* Match cards */}
        <div className="space-y-6">
          {localMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onSignal={() => handleSignal(match.id, match.matched_user_id)}
              onPass={() => handlePass(match.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
