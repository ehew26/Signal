export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendCreatorWeeklyReport } from '@/lib/resend'

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  }
}

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { start, end }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getAdminClient()
  const week = getWeekRange()
  const month = getMonthRange()

  const [settingsRes, weekEarningsRes, monthEarningsRes, contentRes] = await Promise.all([
    supabase.from('creator_settings').select('*').eq('id', 1).single(),
    supabase.from('creator_earnings').select('*').gte('date', week.start).lte('date', week.end),
    supabase.from('creator_earnings').select('*').gte('date', month.start).lte('date', month.end),
    supabase.from('creator_content').select('*').order('tips', { ascending: false }).order('likes', { ascending: false }).limit(20),
  ])

  const settings = settingsRes.data
  const reportEmail = settings?.report_email || 'g.lindsey510@gmail.com'
  const monthlyGoal = settings?.monthly_goal || 1000

  type EarningRow = { platform: string; amount: number }
  type ContentRow = { title: string; platform: string; content_type: string; tips: number; likes: number; views: number; posted_date: string }

  const weekEarnings: EarningRow[] = weekEarningsRes.data || []
  const monthEarnings: EarningRow[] = monthEarningsRes.data || []

  const weekTotal = weekEarnings.reduce((sum: number, e: EarningRow) => sum + Number(e.amount), 0)
  const monthTotal = monthEarnings.reduce((sum: number, e: EarningRow) => sum + Number(e.amount), 0)

  const ofWeek = weekEarnings.filter((e: EarningRow) => e.platform === 'onlyfans').reduce((s: number, e: EarningRow) => s + Number(e.amount), 0)
  const cbWeek = weekEarnings.filter((e: EarningRow) => e.platform === 'chaturbate').reduce((s: number, e: EarningRow) => s + Number(e.amount), 0)
  const otherWeek = weekEarnings.filter((e: EarningRow) => e.platform === 'other').reduce((s: number, e: EarningRow) => s + Number(e.amount), 0)

  const allContent: ContentRow[] = contentRes.data || []
  const topContent = allContent
    .sort((a: ContentRow, b: ContentRow) => (Number(b.tips) + b.likes * 0.1) - (Number(a.tips) + a.likes * 0.1))
    .slice(0, 5)

  await sendCreatorWeeklyReport({
    to: reportEmail,
    weekStart: week.start,
    weekEnd: week.end,
    weekTotal,
    monthTotal,
    monthlyGoal,
    ofWeek,
    cbWeek,
    otherWeek,
    topContent,
    onlyfansUrl: settings?.onlyfans_url,
    chaturbateUrl: settings?.chaturbate_url,
  })

  return NextResponse.json({ ok: true, sentTo: reportEmail, weekTotal, monthTotal })
}

export async function GET(req: NextRequest) {
  return POST(req)
}
