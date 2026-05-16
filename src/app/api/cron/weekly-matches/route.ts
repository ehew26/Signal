export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendMatchEmail } from '@/lib/resend'

// Haversine formula for distance calculation
function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8 // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getWeekDate(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  return monday.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()
    const weekDate = getWeekDate()

    const { data: users } = await supabase
      .from('profiles')
      .select('id, name, email, gender, seeking, age, age_min, age_max, distance_radius, latitude, longitude, city')
      .eq('subscription_status', 'active')
      .eq('verified', true)
      .eq('onboarding_complete', true)
      .is('suspended_until', null)

    if (!users?.length) {
      return NextResponse.json({ message: 'No eligible users', matched: 0 })
    }

    let totalMatches = 0

    for (const user of users) {
      // Get users already seen
      const { data: seenMatches } = await supabase
        .from('weekly_matches')
        .select('matched_user_id')
        .eq('user_id', user.id)

      const seenIds = new Set(seenMatches?.map(m => m.matched_user_id) || [])
      seenIds.add(user.id) // Don't match with self

      // Filter potential matches
      const potentialMatches = users.filter(candidate => {
        if (seenIds.has(candidate.id)) return false

        // Gender preference check
        const userSeeks = user.seeking || []
        const candidateSeeks = candidate.seeking || []
        const genderMatch = userSeeks.length === 0 || userSeeks.includes(candidate.gender)
        const reverseGenderMatch = candidateSeeks.length === 0 || candidateSeeks.includes(user.gender)
        if (!genderMatch || !reverseGenderMatch) return false

        // Age range check
        if (user.age_min && candidate.age < user.age_min) return false
        if (user.age_max && candidate.age > user.age_max) return false
        if (candidate.age_min && user.age < candidate.age_min) return false
        if (candidate.age_max && user.age > candidate.age_max) return false

        // Distance check (if coordinates available)
        if (user.latitude && user.longitude && candidate.latitude && candidate.longitude) {
          const distance = getDistanceMiles(user.latitude, user.longitude, candidate.latitude, candidate.longitude)
          const maxDistance = Math.min(user.distance_radius || 25, candidate.distance_radius || 25)
          if (distance > maxDistance) return false
        }

        return true
      })

      if (potentialMatches.length === 0) continue

      // Get user interests for scoring
      const { data: userInterests } = await supabase
        .from('interests')
        .select('tag')
        .eq('user_id', user.id)

      const userTags = new Set(userInterests?.map(i => i.tag) || [])

      // Score and sort potential matches
      const scored = await Promise.all(
        potentialMatches.map(async candidate => {
          const { data: candidateInterests } = await supabase
            .from('interests')
            .select('tag')
            .eq('user_id', candidate.id)

          const candidateTags = candidateInterests?.map(i => i.tag) || []
          const sharedInterests = candidateTags.filter(t => userTags.has(t)).length

          return { candidate, score: sharedInterests }
        })
      )

      // Sort by shared interests, then randomize ties
      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return Math.random() - 0.5
      })

      // Take top 5
      const selectedMatches = scored.slice(0, 5).map(s => s.candidate)

      // Insert weekly matches
      const matchInserts = selectedMatches.map(match => ({
        user_id: user.id,
        matched_user_id: match.id,
        week_date: weekDate,
        status: 'pending',
      }))

      await supabase.from('weekly_matches').insert(matchInserts)
      totalMatches += selectedMatches.length

      // Send match email
      const matchPreviews = await Promise.all(
        selectedMatches.slice(0, 5).map(async match => {
          const { data: photos } = await supabase
            .from('photos')
            .select('url')
            .eq('user_id', match.id)
            .order('display_order')
            .limit(1)

          return {
            name: match.name,
            age: match.age,
            photo: photos?.[0]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`,
          }
        })
      )

      await sendMatchEmail(user.email, user.name, matchPreviews).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      weekDate,
      usersProcessed: users.length,
      totalMatchesCreated: totalMatches,
    })
  } catch (error) {
    console.error('Weekly matches cron error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
