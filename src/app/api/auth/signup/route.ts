import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, dateOfBirth, gender, city } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Try to create the user with email pre-confirmed
    let userId: string
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (createError) {
      // User may already exist from a previous attempt — look them up and update
      const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
      const existing = list?.users?.find(u => u.email === email)
      if (!existing) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }
      userId = existing.id
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true })
    } else {
      userId = created.user.id
    }

    // Upsert profile
    const age = Math.floor(
      (Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )
    await admin.from('profiles').upsert({
      id: userId,
      name,
      email,
      date_of_birth: dateOfBirth,
      gender: gender || null,
      city: city || null,
      age,
      onboarding_step: 2,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}
