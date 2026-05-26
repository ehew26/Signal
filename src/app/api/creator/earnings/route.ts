import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

function isAuthed(req: NextRequest) {
  return req.headers.get('x-creator-token') === process.env.CREATOR_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getAdminClient()
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') // YYYY-MM
  let query = supabase.from('creator_earnings').select('*').order('date', { ascending: false })
  if (month) {
    query = query.gte('date', `${month}-01`).lte('date', `${month}-31`)
  }
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('creator_earnings')
    .insert({ platform: body.platform, amount: body.amount, date: body.date, notes: body.notes || null })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const supabase = getAdminClient()
  const { error } = await supabase.from('creator_earnings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
