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

    // Try to create the user
    let userId: string
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (createError) {
      // If user already exists (from a previous failed attempt), look them up
      if (createError.message.toLowerCase().includes('already') || createError.message.toLowerCase().includes('duplicate')) {
        const { data: existing } = await admin.auth.admin.listUsers()
        const found = existing?.users?.find(u => u.email === email)
        if (!found) {
          return NextResponse.json({ error: createError.message }, { status: 400 })
        }
        userId = found.id
        // Update their password and confirm their email
        await admin.auth.admin.updateUserById(userId, {
          password,
          email_confirm: true,
        })
      } else {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }
    } else {
      userId = created.user.id
      // Force-confirm email in case email_confirm didn't take effect
      await admin.auth.admin.updateUserById(userId, { email_confirm: true })
    }

    // Upsert profile row
    const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
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

    // Generate a magic-link token so the client can set a session without
    // relying on signInWithPassword (which fails if email isn't confirmed)
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      // Fall back to signInWithPassword — at this point email should be confirmed
      return NextResponse.json({ success: true, method: 'password' })
    }

    return NextResponse.json({
      success: true,
      method: 'otp',
      token_hash: linkData.properties.hashed_token,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}
