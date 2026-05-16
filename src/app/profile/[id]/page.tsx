import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Shield, ChevronLeft, Flag } from 'lucide-react'
import VoicePromptPlayer from '@/components/VoicePromptPlayer'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!profile) notFound()

  const [{ data: photos }, { data: interests }, { data: prompts }] = await Promise.all([
    supabase.from('photos').select('*').eq('user_id', params.id).order('display_order'),
    supabase.from('interests').select('*').eq('user_id', params.id),
    supabase.from('voice_prompts').select('*').eq('user_id', params.id).order('display_order'),
  ])

  // Check if there's a weekly match
  const { data: weeklyMatch } = await supabase
    .from('weekly_matches')
    .select('*')
    .eq('user_id', user.id)
    .eq('matched_user_id', params.id)
    .single()

  const mainPhoto = photos?.[0]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop`

  return (
    <main className="min-h-screen bg-background">
      {/* Back nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-background to-transparent">
        <Link href="/home" className="flex items-center gap-2 text-cream-muted hover:text-cream transition-colors">
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </Link>
        <button className="text-cream-muted hover:text-cream transition-colors text-xs tracking-widest uppercase flex items-center gap-2">
          <Flag size={14} />
          Report
        </button>
      </nav>

      {/* Hero photo */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={mainPhoto}
          alt={profile.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              {profile.verified && (
                <div className="flex items-center gap-1.5 text-accent text-xs tracking-widest uppercase mb-3">
                  <Shield size={12} />
                  Verified Member
                </div>
              )}
              <h1 className="font-fraunces text-5xl text-cream mb-2">
                {profile.name}, {profile.age}
              </h1>
              <div className="flex items-center gap-2 text-cream-muted">
                <MapPin size={14} />
                <span>{profile.city}, {profile.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More photos strip */}
      {photos && photos.length > 1 && (
        <div className="flex gap-2 px-6 py-4 overflow-x-auto">
          {photos.slice(1).map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt="Photo"
              className="h-24 w-20 object-cover flex-shrink-0 border border-border"
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-12">
        {/* Bio */}
        {profile.bio && (
          <section>
            <div className="text-accent text-xs tracking-[0.3em] uppercase mb-4">About</div>
            <p className="text-cream leading-relaxed text-lg font-fraunces">{profile.bio}</p>
          </section>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <section>
            <div className="text-accent text-xs tracking-[0.3em] uppercase mb-4">Interests</div>
            <div className="flex flex-wrap gap-2">
              {interests.map((int) => (
                <span key={int.id} className="text-xs tracking-wider uppercase text-cream-muted border border-border px-3 py-2">
                  {int.tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Voice prompts */}
        {prompts && prompts.length > 0 && (
          <section>
            <div className="text-accent text-xs tracking-[0.3em] uppercase mb-4">Voice Prompts</div>
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <VoicePromptPlayer key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </section>
        )}

        {/* Action buttons */}
        {weeklyMatch && (
          <div className="sticky bottom-6">
            <div className="flex gap-4 bg-background/90 backdrop-blur-sm py-4">
              {weeklyMatch.status === 'pending' && (
                <>
                  <button className="flex-1 border border-border text-cream-muted text-sm tracking-widest uppercase py-4 hover:border-cream hover:text-cream transition-colors">
                    Pass
                  </button>
                  <button className="flex-1 bg-accent text-cream text-sm tracking-widest uppercase py-4 hover:bg-opacity-90 transition-colors">
                    Send Signal
                  </button>
                </>
              )}
              {weeklyMatch.status === 'signaled' && (
                <div className="flex-1 text-center py-4 border border-accent text-accent text-sm tracking-widest uppercase">
                  Signal Sent
                </div>
              )}
              {weeklyMatch.status === 'passed' && (
                <div className="flex-1 text-center py-4 border border-border text-cream-muted text-sm tracking-widest uppercase">
                  Passed
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
