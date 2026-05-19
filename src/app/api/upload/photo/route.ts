import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabase } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Verify the user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const displayOrder = parseInt(formData.get('displayOrder') as string ?? '0', 10)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    // Use admin client — bypasses all storage RLS policies
    const admin = createSupabase(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Create bucket if it doesn't exist yet
    await admin.storage.createBucket('photos', { public: true, fileSizeLimit: 10485760 })

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const bytes = await file.arrayBuffer()
    const { error: uploadError } = await admin.storage
      .from('photos')
      .upload(path, bytes, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from('photos').getPublicUrl(path)

    // Insert into photos table using admin to bypass RLS
    const { error: dbError } = await admin.from('photos').insert({
      user_id: user.id,
      url: publicUrl,
      storage_path: path,
      display_order: displayOrder,
    })

    if (dbError) {
      // Non-fatal: the file uploaded fine, just log the DB error
      console.error('photos table insert error:', dbError.message)
    }

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500 })
  }
}
