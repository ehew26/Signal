import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) {
    redirect('/signup')
  }

  // During the founding-member period, anyone with a completed profile gets in.
  const allowed = ['active', 'trialing', 'founding'].includes(profile?.subscription_status)
  if (!allowed) {
    redirect('/signup?step=6')
  }

  // Count members for the "going live at 150" progress indicator
  const { count: memberCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('onboarding_complete', true)

  // Get this week's matches
  const weekDate = (() => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    return monday.toISOString().split('T')[0]
  })()

  const { data: weeklyMatches } = await supabase
    .from('weekly_matches')
    .select(`
      *,
      matched_profile:profiles!weekly_matches_matched_user_id_fkey(
        id, name, age, city, state, bio, verified, gender
      )
    `)
    .eq('user_id', user.id)
    .eq('week_date', weekDate)
    .order('created_at', { ascending: true })

  // For each match, get photos, interests, and voice prompts
  const matchesWithDetails = await Promise.all(
    (weeklyMatches || []).map(async (match) => {
      const [photosRes, interestsRes, promptsRes] = await Promise.all([
        supabase.from('photos').select('*').eq('user_id', match.matched_user_id).order('display_order'),
        supabase.from('interests').select('*').eq('user_id', match.matched_user_id),
        supabase.from('voice_prompts').select('*').eq('user_id', match.matched_user_id).order('display_order'),
      ])
      return {
        ...match,
        matched_photos: photosRes.data || [],
        matched_interests: interestsRes.data || [],
        matched_voice_prompts: promptsRes.data || [],
      }
    })
  )

  const signalsSent = matchesWithDetails.filter(m => m.status === 'signaled').length

  return <HomeClient
    matches={matchesWithDetails}
    profile={profile}
    signalsSent={signalsSent}
    weekDate={weekDate}
    memberCount={memberCount ?? 0}
    launchTarget={150}
  />
}
