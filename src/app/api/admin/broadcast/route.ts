export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { subject, body } = await req.json()
    if (!subject || !body) return NextResponse.json({ error: 'Subject and body required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email, name')
      .not('email', 'is', null)

    if (!profiles?.length) return NextResponse.json({ sent: 0 })

    // Send in batches of 50
    const batchSize = 50
    let sent = 0
    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize)
      await Promise.allSettled(
        batch.map(profile =>
          resend.emails.send({
            from: FROM_EMAIL,
            to: profile.email,
            subject,
            html: `
              <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
                <h1 style="color:#c8542a;font-size:28px;margin-bottom:32px;">Signal.</h1>
                <div style="color:#a89b8c;line-height:1.7;white-space:pre-wrap;">${body}</div>
                <p style="color:#2a2520;font-size:11px;margin-top:48px;">Signal · Sarasota-Manatee, Florida</p>
              </div>
            `,
          })
        )
      )
      sent += batch.length
    }

    return NextResponse.json({ sent })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
