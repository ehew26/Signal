'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Edit2, LogOut, Settings, Home, MessageCircle, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import VoicePromptPlayer from '@/components/VoicePromptPlayer'

export default function ProfileClient({ profile, photos, interests, prompts }: {
  profile: any
  photos: any[]
  interests: any[]
  prompts: any[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<'profile' | 'settings'>('profile')

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const mainPhoto = photos?.[0]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop`

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-fraunces text-xl text-cream">Signal<span className="text-accent">.</span></div>
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-cream-muted hover:text-cream transition-colors"><Home size={20} /></Link>
            <Link href="/messages" className="text-cream-muted hover:text-cream transition-colors"><MessageCircle size={20} /></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Profile header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="relative">
            <img
              src={mainPhoto}
              alt={profile.name}
              className="w-24 h-24 object-cover border border-border"
            />
            {profile.verified && (
              <div className="absolute -bottom-2 -right-2 bg-accent w-6 h-6 flex items-center justify-center">
                <Shield size={12} className="text-cream" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-fraunces text-3xl text-cream">{profile.name}</h1>
            <p className="text-cream-muted mt-1">{profile.city}, {profile.state}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs tracking-widest uppercase px-3 py-1 border ${
                profile.subscription_status === 'active' ? 'border-accent text-accent' : 'border-border text-cream-muted'
              }`}>
                {profile.subscription_status === 'active' ? 'Active Member' : profile.subscription_status}
              </span>
              {profile.verified && (
                <span className="text-xs tracking-widest uppercase px-3 py-1 border border-accent/40 text-accent/80">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setTab('profile')}
            className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors ${tab === 'profile' ? 'text-cream border-b-2 border-accent -mb-px' : 'text-cream-muted hover:text-cream'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors ${tab === 'settings' ? 'text-cream border-b-2 border-accent -mb-px' : 'text-cream-muted hover:text-cream'}`}
          >
            Settings
          </button>
        </div>

        {tab === 'profile' && (
          <div className="space-y-10">
            {/* Photos */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="text-accent text-xs tracking-[0.3em] uppercase">Photos</div>
                <button className="text-cream-muted text-xs hover:text-cream transition-colors flex items-center gap-1.5">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative aspect-square">
                    <img src={photo.url} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-accent text-cream text-[9px] tracking-widest uppercase px-2 py-0.5">Main</div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="text-accent text-xs tracking-[0.3em] uppercase">About</div>
                <button className="text-cream-muted text-xs hover:text-cream transition-colors flex items-center gap-1.5">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              {profile.bio ? (
                <p className="text-cream leading-relaxed">{profile.bio}</p>
              ) : (
                <button className="border border-dashed border-border text-cream-muted text-sm px-6 py-3 hover:border-accent hover:text-accent transition-colors">
                  + Add a bio
                </button>
              )}
            </section>

            {/* Interests */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="text-accent text-xs tracking-[0.3em] uppercase">Interests</div>
                <button className="text-cream-muted text-xs hover:text-cream transition-colors flex items-center gap-1.5">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((int) => (
                  <span key={int.id} className="text-xs tracking-wider uppercase text-cream-muted border border-border px-3 py-2">
                    {int.tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Voice prompts */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="text-accent text-xs tracking-[0.3em] uppercase">Voice Prompts</div>
                <button className="text-cream-muted text-xs hover:text-cream transition-colors flex items-center gap-1.5">
                  <Edit2 size={12} /> Re-record
                </button>
              </div>
              <div className="space-y-3">
                {prompts.map((prompt) => (
                  <VoicePromptPlayer key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            {/* Match preferences */}
            <section className="border border-border p-6">
              <h3 className="text-cream font-medium mb-5 flex items-center gap-2">
                <Settings size={16} className="text-accent" />
                Match Preferences
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Age Range</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      defaultValue={profile.age_min}
                      min={18}
                      max={80}
                      className="w-24 bg-transparent border border-border text-cream px-3 py-2 focus:outline-none focus:border-accent text-center"
                    />
                    <span className="text-cream-muted">to</span>
                    <input
                      type="number"
                      defaultValue={profile.age_max}
                      min={18}
                      max={80}
                      className="w-24 bg-transparent border border-border text-cream px-3 py-2 focus:outline-none focus:border-accent text-center"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Distance Radius (miles)</label>
                  <input
                    type="number"
                    defaultValue={profile.distance_radius}
                    min={5}
                    max={50}
                    className="w-24 bg-transparent border border-border text-cream px-3 py-2 focus:outline-none focus:border-accent text-center"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Interested In</label>
                  <div className="flex gap-3">
                    {['Men', 'Women', 'Everyone'].map(option => (
                      <button
                        key={option}
                        className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors border ${
                          (profile.seeking || []).includes(option.toLowerCase())
                            ? 'bg-accent border-accent text-cream'
                            : 'border-border text-cream-muted hover:border-cream'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button className="mt-5 bg-accent text-cream px-6 py-3 text-xs tracking-widest uppercase hover:bg-opacity-90 transition-opacity">
                Save Preferences
              </button>
            </section>

            {/* Subscription */}
            <section className="border border-border p-6">
              <h3 className="text-cream font-medium mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-accent" />
                Subscription
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-cream text-sm">Signal Founding Member</p>
                  <p className="text-cream-muted text-xs mt-1">$34.99/month</p>
                </div>
                <span className={`text-xs tracking-widest uppercase px-3 py-1.5 border ${
                  profile.subscription_status === 'active' ? 'border-accent text-accent' : 'border-border text-cream-muted'
                }`}>
                  {profile.subscription_status}
                </span>
              </div>
              <div className="flex gap-3">
                <button className="border border-border text-cream-muted text-xs tracking-widest uppercase px-4 py-2.5 hover:border-cream hover:text-cream transition-colors">
                  Manage Billing
                </button>
                <button className="border border-border text-cream-muted text-xs tracking-widest uppercase px-4 py-2.5 hover:border-cream hover:text-cream transition-colors">
                  Cancel Membership
                </button>
              </div>
            </section>

            {/* Strikes */}
            {profile.strikes > 0 && (
              <section className="border border-accent/30 bg-accent/5 p-6">
                <p className="text-accent text-sm font-medium mb-2">Anti-ghosting warnings: {profile.strikes}/3</p>
                <p className="text-cream-muted text-xs leading-relaxed">
                  Respond to your matches within 72 hours to maintain your standing. 3 warnings results in a 7-day suspension.
                </p>
              </section>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full border border-border text-cream-muted py-3.5 text-sm tracking-widest uppercase hover:border-cream hover:text-cream transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
