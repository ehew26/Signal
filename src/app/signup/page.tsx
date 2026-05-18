'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ArrowLeft, Upload, Mic, Square, Play, Pause, X, Check } from 'lucide-react'
import { VOICE_PROMPT_QUESTIONS, INTEREST_TAGS } from '@/types'
import Link from 'next/link'

// Progress bar
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-3">
        <span className="text-cream-muted text-xs tracking-widest uppercase">Step {step} of {total}</span>
        <span className="text-cream-muted text-xs">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-px bg-border w-full relative">
        <div
          className="absolute top-0 left-0 h-px bg-accent transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i < step ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>
    </div>
  )
}

// Step 1: Basic info
function Step1({ onNext, data, setData }: {
  onNext: () => void
  data: any
  setData: (d: any) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!data.name || !data.email || !data.password || !data.dateOfBirth) {
      setError('All fields are required.')
      setLoading(false)
      return
    }

    const age = Math.floor((Date.now() - new Date(data.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age < 18) {
      setError('You must be 18 or older to join Signal.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Update profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: data.name,
        email: data.email,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        city: data.city,
        onboarding_step: 2,
      })
    }

    setLoading(false)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData({ ...data, name: e.target.value })}
            required
            placeholder="Your name"
            className="w-full bg-transparent border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30"
          />
        </div>
        <div className="col-span-2">
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData({ ...data, email: e.target.value })}
            required
            placeholder="you@example.com"
            className="w-full bg-transparent border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30"
          />
        </div>
        <div className="col-span-2">
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full bg-transparent border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30"
          />
        </div>
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Date of Birth</label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={e => setData({ ...data, dateOfBirth: e.target.value })}
            required
            className="w-full bg-background border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">I identify as</label>
          <select
            value={data.gender}
            onChange={e => setData({ ...data, gender: e.target.value })}
            required
            className="w-full bg-background border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Select</option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">City</label>
          <select
            value={data.city}
            onChange={e => setData({ ...data, city: e.target.value })}
            required
            className="w-full bg-background border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">Select your city</option>
            <option value="Sarasota">Sarasota</option>
            <option value="Bradenton">Bradenton</option>
            <option value="Lakewood Ranch">Lakewood Ranch</option>
            <option value="Venice">Venice</option>
            <option value="Other">Other nearby</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-cream py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
      >
        {loading ? 'Creating account...' : 'Continue'}
        {!loading && <ArrowRight size={16} />}
      </button>
    </form>
  )
}

// Step 2: Photos
function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Session expired. Please refresh and try again.')
        return
      }

      for (const file of Array.from(files)) {
        if (photos.length >= 6) break
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 10MB.`)
          continue
        }
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('photos').upload(path, file)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)
          await supabase.from('photos').insert({
            user_id: user.id,
            url: publicUrl,
            storage_path: path,
            display_order: photos.length,
          })
          setPhotos(prev => [...prev, publicUrl])
        } else {
          alert(`Failed to upload ${file.name}. Please try again.`)
        }
      }
    } finally {
      setUploading(false)
    }
  }

  async function handleNext() {
    if (photos.length === 0) {
      alert('Please add at least one photo.')
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ onboarding_step: 3 }).eq('id', user.id)
    onNext()
  }

  function removePhoto(url: string) {
    setPhotos(prev => prev.filter(p => p !== url))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-fraunces text-lg text-cream mb-2">Add your photos</h3>
        <p className="text-cream-muted text-sm">Add up to 6 photos. First photo is your main photo. Real, recent photos only.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <div className="absolute top-2 left-2 bg-accent text-cream text-[9px] tracking-widest uppercase px-2 py-1">Main</div>
            )}
            <button
              onClick={() => removePhoto(url)}
              className="absolute top-2 right-2 bg-background/80 text-cream w-6 h-6 flex items-center justify-center hover:bg-background transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {photos.length < 6 && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-border flex flex-col items-center justify-center text-cream-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
          >
            <Upload size={20} className="mb-2" />
            <span className="text-xs">{uploading ? 'Uploading...' : 'Add photo'}</span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-4">
        <button onClick={onBack} className="border border-border text-cream-muted px-6 py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={photos.length === 0}
          className="flex-1 bg-accent text-cream py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

// Step 3: Voice prompts
function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [recordings, setRecordings] = useState<{ [q: string]: Blob }>({})
  const [recording, setRecording] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [timers, setTimers] = useState<{ [q: string]: number }>({})
  const timerRef = useRef<{ [q: string]: NodeJS.Timeout }>({})

  function toggleQuestion(q: string) {
    if (selectedQuestions.includes(q)) {
      setSelectedQuestions(prev => prev.filter(x => x !== q))
    } else if (selectedQuestions.length < 3) {
      setSelectedQuestions(prev => [...prev, q])
    }
  }

  async function startRecording(question: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordings(prev => ({ ...prev, [question]: blob }))
        stream.getTracks().forEach(t => t.stop())
        clearInterval(timerRef.current[question])
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(question)
      setTimers(prev => ({ ...prev, [question]: 0 }))
      timerRef.current[question] = setInterval(() => {
        setTimers(prev => {
          const newTime = (prev[question] || 0) + 1
          if (newTime >= 30) stopRecording()
          return { ...prev, [question]: newTime }
        })
      }, 1000)
    } catch (e) {
      alert('Microphone access required. Please allow microphone access and try again.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setRecording(null)
  }

  function playRecording(question: string) {
    const blob = recordings[question]
    if (!blob) return
    if (playing === question) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    const url = URL.createObjectURL(blob)
    audioRef.current = new Audio(url)
    audioRef.current.play()
    audioRef.current.onended = () => setPlaying(null)
    setPlaying(question)
  }

  async function handleNext() {
    if (selectedQuestions.length < 3 || Object.keys(recordings).length < 3) {
      alert('Please record all 3 voice prompts.')
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i]
      const blob = recordings[q]
      if (blob) {
        const path = `${user.id}/prompt_${i}_${Date.now()}.webm`
        const { error } = await supabase.storage.from('voice-prompts').upload(path, blob)
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('voice-prompts').getPublicUrl(path)
          await supabase.from('voice_prompts').insert({
            user_id: user.id,
            prompt_question: q,
            audio_url: publicUrl,
            storage_path: path,
            duration_seconds: timers[q] || 0,
            display_order: i,
          })
        }
      }
    }

    await supabase.from('profiles').update({ onboarding_step: 4 }).eq('id', user.id)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-fraunces text-lg text-cream mb-2">Record 3 voice prompts</h3>
        <p className="text-cream-muted text-sm">Select 3 questions and record up to 30 seconds each. Let people hear who you are.</p>
      </div>

      <div className="space-y-3">
        {VOICE_PROMPT_QUESTIONS.map(q => {
          const isSelected = selectedQuestions.includes(q)
          const hasRecording = !!recordings[q]
          const isRecording = recording === q
          const isPlaying = playing === q

          return (
            <div
              key={q}
              className={`border p-4 transition-colors ${isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-cream/30'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleQuestion(q)}
                  className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${isSelected ? 'bg-accent border-accent' : 'border-border'}`}
                >
                  {isSelected && <Check size={12} className="text-cream" />}
                </button>
                <p className="font-fraunces italic text-cream flex-1 text-sm">"{q}"</p>
              </div>

              {isSelected && (
                <div className="mt-4 pl-8 flex items-center gap-3">
                  {!hasRecording && !isRecording && (
                    <button
                      onClick={() => startRecording(q)}
                      className="flex items-center gap-2 text-accent border border-accent px-4 py-2 text-xs tracking-widest uppercase hover:bg-accent hover:text-cream transition-all"
                    >
                      <Mic size={14} /> Record
                    </button>
                  )}
                  {isRecording && (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 text-cream bg-accent px-4 py-2 text-xs tracking-widest uppercase animate-pulse"
                    >
                      <Square size={14} /> Stop ({30 - (timers[q] || 0)}s)
                    </button>
                  )}
                  {hasRecording && !isRecording && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => playRecording(q)}
                        className="flex items-center gap-2 text-cream-muted border border-border px-4 py-2 text-xs tracking-widest uppercase hover:border-cream hover:text-cream transition-all"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button
                        onClick={() => startRecording(q)}
                        className="text-cream-muted text-xs hover:text-cream transition-colors"
                      >
                        Re-record
                      </button>
                      <span className="text-accent text-xs flex items-center gap-1">
                        <Check size={12} /> Recorded
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="border border-border text-cream-muted px-6 py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedQuestions.length < 3 || Object.keys(recordings).filter(k => selectedQuestions.includes(k)).length < 3}
          className="flex-1 bg-accent text-cream py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

// Step 4: Interests
function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  function toggleTag(tag: string) {
    if (selected.includes(tag)) {
      setSelected(prev => prev.filter(t => t !== tag))
    } else if (selected.length < 10) {
      setSelected(prev => [...prev, tag])
    }
  }

  async function handleNext() {
    if (selected.length < 3) {
      alert('Please select at least 3 interests.')
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const inserts = selected.map(tag => ({ user_id: user.id, tag }))
    await supabase.from('interests').insert(inserts)
    await supabase.from('profiles').update({ onboarding_step: 5 }).eq('id', user.id)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-fraunces text-lg text-cream mb-2">Select your interests</h3>
        <p className="text-cream-muted text-sm">Pick 3–10 things that reflect who you are. These help us match you better.</p>
        <p className="text-accent text-xs mt-1">{selected.length}/10 selected</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INTEREST_TAGS.map(tag => {
          const isSelected = selected.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                isSelected
                  ? 'bg-accent text-cream border border-accent'
                  : 'border border-border text-cream-muted hover:border-cream hover:text-cream'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="border border-border text-cream-muted px-6 py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={selected.length < 3}
          className="flex-1 bg-accent text-cream py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

// Step 5: Verification
function Step5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [loading, setLoading] = useState(false)

  async function handleVerification() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/verification', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-fraunces text-lg text-cream mb-2">Identity verification</h3>
        <p className="text-cream-muted text-sm leading-relaxed">
          Every Signal member verifies their identity. This keeps the community safe and authentic. You'll take a quick selfie — no ID required.
        </p>
      </div>

      <div className="border border-border p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 border border-accent text-accent text-xs flex items-center justify-center flex-shrink-0">01</div>
          <div>
            <p className="text-cream text-sm font-medium mb-1">Quick selfie</p>
            <p className="text-cream-muted text-xs">Take a selfie using your device camera. Takes about 30 seconds.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 border border-accent text-accent text-xs flex items-center justify-center flex-shrink-0">02</div>
          <div>
            <p className="text-cream text-sm font-medium mb-1">Biometric check</p>
            <p className="text-cream-muted text-xs">Stripe Identity confirms you're a real person. Data is encrypted and secure.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 border border-accent text-accent text-xs flex items-center justify-center flex-shrink-0">03</div>
          <div>
            <p className="text-cream text-sm font-medium mb-1">Get your badge</p>
            <p className="text-cream-muted text-xs">Your verified badge appears on your profile. Other members trust you're real.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="border border-border text-cream-muted px-6 py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handleVerification}
          disabled={loading}
          className="flex-1 bg-accent text-cream py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
        >
          {loading ? 'Redirecting...' : 'Start Verification'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>

      <button onClick={onNext} className="w-full text-cream-muted text-xs hover:text-cream transition-colors text-center">
        Skip for now (verification required before seeing matches)
      </button>
    </div>
  )
}

// Step 6: Payment
function Step6({ onBack }: { onBack: () => void }) {
  const [coupon, setCoupon] = useState('FOUNDING')
  const [loading, setLoading] = useState(false)

  async function handlePayment() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-fraunces text-lg text-cream mb-2">Start your membership</h3>
        <p className="text-cream-muted text-sm">Founding members get 60 days free. $6.99/month after your trial ends.</p>
      </div>

      <div className="border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-cream font-medium">Signal Founding Member</p>
            <p className="text-cream-muted text-xs mt-1">5 matches weekly · Verified community · Cancel anytime</p>
          </div>
          <div className="text-right">
            <p className="font-fraunces text-3xl text-cream">$6<span className="text-accent text-xl">.99</span></p>
            <p className="text-cream-muted text-xs">/month after trial</p>
          </div>
        </div>

        <div>
          <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Promo Code</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={coupon}
              onChange={e => setCoupon(e.target.value.toUpperCase())}
              placeholder="FOUNDING"
              className="flex-1 bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30 text-sm"
            />
          </div>
          {coupon === 'FOUNDING' && (
            <p className="text-accent text-xs mt-2 flex items-center gap-1.5">
              <Check size={12} /> 60 days free applied
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 text-cream-muted text-xs">
        <div className="flex items-center gap-2"><Check size={12} className="text-accent" /> No charge today with code FOUNDING</div>
        <div className="flex items-center gap-2"><Check size={12} className="text-accent" /> Cancel anytime — no cancellation fees</div>
        <div className="flex items-center gap-2"><Check size={12} className="text-accent" /> Data preserved if you pause or cancel</div>
        <div className="flex items-center gap-2"><Check size={12} className="text-accent" /> No pay-to-win features, ever</div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="border border-border text-cream-muted px-6 py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center gap-2">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-accent text-cream py-3.5 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
        >
          {loading ? 'Redirecting to Stripe...' : 'Start Free Trial'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>

      <p className="text-cream-muted text-xs text-center">
        No refunds policy · Secure payment via Stripe
      </p>
    </div>
  )
}

const STEPS = [
  { title: 'Create account', subtitle: 'Let\'s get started' },
  { title: 'Add photos', subtitle: 'Show who you are' },
  { title: 'Voice prompts', subtitle: 'Let them hear you' },
  { title: 'Your interests', subtitle: 'What drives you' },
  { title: 'Get verified', subtitle: 'Real people only' },
  { title: 'Start your membership', subtitle: 'Almost there' },
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    city: '',
  })

  const currentStep = STEPS[step - 1]

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-16">
        <Link href="/" className="font-fraunces text-2xl text-cream mb-16 block">
          Signal<span className="text-accent">.</span>
        </Link>

        <ProgressBar step={step} total={6} />

        <div className="mb-8">
          <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">{currentStep.subtitle}</div>
          <h1 className="font-fraunces text-3xl text-cream">{currentStep.title}</h1>
        </div>

        {step === 1 && (
          <Step1
            onNext={() => setStep(2)}
            data={formData}
            setData={setFormData}
          />
        )}
        {step === 2 && (
          <Step2
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <Step5
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        )}
        {step === 6 && (
          <Step6
            onBack={() => setStep(5)}
          />
        )}

        <p className="text-cream-muted text-sm text-center mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
