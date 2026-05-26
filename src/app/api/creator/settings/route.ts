import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-creator-token') === process.env.CREATOR_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getAdminClient()
  const { data, error } = await supabase.from('creator_settings').select('*').eq('id', 1).single()
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || {})
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('creator_settings')
    .upsert({
      id: 1,
      onlyfans_url: body.onlyfans_url || null,
      onlyfans_username: body.onlyfans_username || null,
      chaturbate_url: body.chaturbate_url || null,
      chaturbate_username: body.chaturbate_username || null,
      monthly_goal: body.monthly_goal || 1000,
      report_email: body.report_email || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
