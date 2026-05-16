export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendGhostWarningEmail, sendSuspensionEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()
    const seventyTwoHoursAgo = new Date()
    seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72)

    const { data: matches } = await supabase
      .from('matches')
      .select('id, user_id_1, user_id_2, created_at, last_message_at')
      .lt('created_at', seventyTwoHoursAgo.toISOString())

    if (!matches?.length) return NextResponse.json({ checked: 0 })

    let warningsIssued = 0

    for (const match of matches) {
      // Check if either party hasn't responded
      const { data: messages } = await supabase
        .from('messages')
        .select('sender_id, created_at')
        .eq('match_id', match.id)
        .order('created_at', { ascending: true })

      // Check if user_1 has responded
      const user1Messages = messages?.filter(m => m.sender_id === match.user_id_1) || []
      const user2Messages = messages?.filter(m => m.sender_id === match.user_id_2) || []

      // If user_2 messaged but user_1 hasn't responded in 72hrs
      if (user2Messages.length > 0 && user1Messages.length === 0) {
        await issueGhostWarning(match.user_id_1, match.id)
        warningsIssued++
      }

      // If user_1 messaged but user_2 hasn't responded in 72hrs
      if (user1Messages.length > 0 && user2Messages.length === 0) {
        await issueGhostWarning(match.user_id_2, match.id)
        warningsIssued++
      }

      // If neither has messaged and match is 72+ hours old
      if (messages?.length === 0) {
        await Promise.all([
          issueGhostWarning(match.user_id_1, match.id),
          issueGhostWarning(match.user_id_2, match.id),
        ])
        warningsIssued += 2
      }
    }

    return NextResponse.json({ success: true, warningsIssued })
  } catch (error) {
    console.error('Ghost check error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function issueGhostWarning(userId: string, matchId: string) {
  const supabase = getAdminClient()
  const { data: existingWarning } = await supabase
    .from('ghost_warnings')
    .select('id')
    .eq('user_id', userId)
    .eq('match_id', matchId)
    .eq('resolved', false)
    .single()

  if (existingWarning) return // Already warned

  // Issue new warning
  await supabase.from('ghost_warnings').insert({ user_id: userId, match_id: matchId })

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, strikes')
    .eq('id', userId)
    .single()

  if (!profile) return

  const newStrikes = (profile.strikes || 0) + 1

  await supabase.from('profiles').update({ strikes: newStrikes }).eq('id', userId)

  if (newStrikes >= 3) {
    // Suspend for 7 days
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('suspensions')
      .eq('id', userId)
      .single()

    const newSuspensions = (updatedProfile?.suspensions || 0) + 1
    const permanent = newSuspensions >= 3

    if (permanent) {
      await supabase.from('profiles').update({
        subscription_status: 'cancelled',
        suspended_until: '2099-01-01',
        suspensions: newSuspensions,
        strikes: 0,
      }).eq('id', userId)
    } else {
      const suspendUntil = new Date()
      suspendUntil.setDate(suspendUntil.getDate() + 7)
      await supabase.from('profiles').update({
        suspended_until: suspendUntil.toISOString(),
        suspensions: newSuspensions,
        strikes: 0,
      }).eq('id', userId)
    }

    await sendSuspensionEmail(profile.email, profile.name, newSuspensions >= 3).catch(console.error)
  } else {
    await sendGhostWarningEmail(profile.email, profile.name, newStrikes).catch(console.error)
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
