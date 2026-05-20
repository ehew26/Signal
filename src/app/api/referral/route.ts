export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// GET /api/referral?ref=CODE — returns basic info about the referrer
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('ref')

  if (!code) {
    return NextResponse.json({ error: 'Missing ref code' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('name, referral_code, referral_count')
    .eq('referral_code', code.toUpperCase())
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  }

  const firstName = (profile.name || '').split(' ')[0] || 'A member'
  return NextResponse.json({
    referrerName: firstName,
    referralCode: profile.referral_code,
    referralCount: profile.referral_count ?? 0,
  })
}

// POST /api/referral — generate or return referral code for the authenticated user
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = getAdminClient()

  // Check if they already have a code
  const { data: existing } = await admin
    .from('profiles')
    .select('referral_code, referral_count, name')
    .eq('id', user.id)
    .single()

  if (existing?.referral_code) {
    return NextResponse.json({
      referralCode: existing.referral_code,
      referralCount: existing.referral_count ?? 0,
    })
  }

  // Generate a code from name + random suffix
  const name = (existing?.name || 'USER').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  const code = `${name}${suffix}`

  const { error } = await admin
    .from('profiles')
    .update({ referral_code: code, referral_count: 0 })
    .eq('id', user.id)

  if (error) {
    console.error('Referral code generation error:', error)
    return NextResponse.json({ error: 'Could not generate referral code' }, { status: 500 })
  }

  return NextResponse.json({ referralCode: code, referralCount: 0 })
}

// PATCH /api/referral — attribute a referral when a new user signs up with a ref code
export async function PATCH(req: NextRequest) {
  try {
    const { refCode } = await req.json()
    if (!refCode) return NextResponse.json({ ok: false })

    const admin = getAdminClient()
    const { data: referrer } = await admin
      .from('profiles')
      .select('id, referral_count')
      .eq('referral_code', refCode.toUpperCase())
      .single()

    if (!referrer) return NextResponse.json({ ok: false })

    await admin
      .from('profiles')
      .update({ referral_count: (referrer.referral_count ?? 0) + 1 })
      .eq('id', referrer.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
