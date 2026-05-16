export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendMatchNotificationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { userId, matchedUserId } = await req.json()
    const supabase = getAdminClient()

    const [{ data: user }, { data: matched }] = await Promise.all([
      supabase.from('profiles').select('name, email').eq('id', userId).single(),
      supabase.from('profiles').select('name, email').eq('id', matchedUserId).single(),
    ])

    if (user && matched) {
      await Promise.all([
        sendMatchNotificationEmail(user.email, user.name, matched.name),
        sendMatchNotificationEmail(matched.email, matched.name, user.name),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Match notification error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
