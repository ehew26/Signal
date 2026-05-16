export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, city, seeking } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('waitlist').insert({ name, email, city, seeking })

    if (error && error.code === '23505') {
      return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
    }
    if (error) throw error

    // Send confirmation email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're on the Signal waitlist",
      html: `
        <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
          <h1 style="color:#c8542a;font-size:28px;margin-bottom:8px;">Signal.</h1>
          <p style="color:#a89b8c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:32px;">Find Someone Real</p>
          <h2 style="font-size:22px;margin-bottom:12px;">You're in, ${name}.</h2>
          <p style="color:#a89b8c;line-height:1.7;margin-bottom:20px;">
            We'll reach out as soon as your spot opens up. Founding members in the Sarasota-Manatee area get priority.
          </p>
          <p style="color:#a89b8c;line-height:1.7;">
            In the meantime — Signal launches with five curated, verified matches delivered every Monday at 7am. No swiping. No pay-to-win. Just real people, close to home.
          </p>
          <p style="color:#2a2520;font-size:11px;margin-top:48px;">Signal · Sarasota-Manatee, Florida</p>
        </div>
      `,
    }).catch(() => {}) // Don't fail if email fails

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
