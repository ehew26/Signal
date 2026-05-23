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
              <div style="background:#ffffff;font-family:system-ui,-apple-system,sans-serif;padding:48px 24px;max-width:600px;margin:0 auto;">
                <div style="border:1px solid #e2e8f0;padding:40px;border-radius:8px;">
                  <h1 style="font-family:Georgia,serif;color:#0d1f4e;font-size:28px;margin:0 0 32px 0;">Signal</h1>
                  <div style="color:#4a5568;line-height:1.7;white-space:pre-wrap;">${body}</div>
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0 24px;" />
                  <p style="color:#4a5568;font-size:11px;margin:0;">Signal · Sarasota-Manatee, Florida</p>
                </div>
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
