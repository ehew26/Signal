export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: { supabase_user_id: user.id },
      return_url: `${appUrl}/signup?step=6&verified=true`,
    })

    await supabase
      .from('profiles')
      .update({ verification_session_id: verificationSession.id })
      .eq('id', user.id)

    return NextResponse.json({ url: verificationSession.url })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
