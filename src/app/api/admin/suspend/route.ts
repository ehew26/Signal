export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendSuspensionEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { userId, suspend } = await req.json()
    const supabase = getAdminClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email, suspensions')
      .eq('id', userId)
      .single()

    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (suspend) {
      const suspendedUntil = new Date()
      suspendedUntil.setDate(suspendedUntil.getDate() + 7)
      await supabase.from('profiles').update({
        suspended_until: suspendedUntil.toISOString(),
        suspensions: (profile.suspensions || 0) + 1,
      }).eq('id', userId)
      await sendSuspensionEmail(profile.email, profile.name, (profile.suspensions || 0) >= 2).catch(console.error)
    } else {
      await supabase.from('profiles').update({ suspended_until: null }).eq('id', userId)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
