'use client'

import { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-center gap-[3px] flex-1" style={{ height: 32 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          className={playing ? 'animate-waveform' : ''}
          style={{
            width: 3,
            backgroundColor: '#2563eb',
            height: playing ? undefined : `${Math.random() * 24 + 6}px`,
            minHeight: 4,
            maxHeight: 30,
            borderRadius: 1,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.8 + Math.random() * 0.7}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function VoicePromptPlayer({ prompt }: { prompt: any }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function togglePlay() {
    if (!prompt.audio_url) return

    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(prompt.audio_url)
        audioRef.current.onended = () => setPlaying(false)
      }
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="border border-border bg-surface p-5 hover:border-accent/50 transition-colors">
      <p className="font-fraunces italic text-cream text-base mb-4">"{prompt.prompt_question}"</p>
      <div className="flex items-center gap-4">
        <WaveformBars playing={playing} />
        <div className="flex items-center gap-3 flex-shrink-0">
          {prompt.duration_seconds && (
            <span className="text-cream-muted text-xs">
              0:{String(prompt.duration_seconds).padStart(2, '0')}
            </span>
          )}
          <button
            onClick={togglePlay}
            className="w-10 h-10 border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-cream transition-all"
            disabled={!prompt.audio_url}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
