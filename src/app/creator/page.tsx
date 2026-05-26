'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DollarSign, TrendingUp, ExternalLink, Plus, Trash2,
  RefreshCw, Settings, BarChart2, FileText, Target,
} from 'lucide-react'

type Earning = {
  id: string
  platform: 'onlyfans' | 'chaturbate' | 'other'
  amount: number
  date: string
  notes: string | null
}

type ContentEntry = {
  id: string
  platform: 'onlyfans' | 'chaturbate' | 'other'
  content_type: string
  title: string
  posted_date: string
  views: number
  likes: number
  tips: number
  notes: string | null
}

type CreatorSettings = {
  onlyfans_url?: string
  onlyfans_username?: string
  chaturbate_url?: string
  chaturbate_username?: string
  monthly_goal?: number
  report_email?: string
}

const PLATFORMS = ['onlyfans', 'chaturbate', 'other'] as const
const CONTENT_TYPES = ['photo', 'video', 'livestream', 'message', 'post', 'other'] as const

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function apiHeaders(token: string) {
  return { 'Content-Type': 'application/json', 'x-creator-token': token }
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`border p-5 ${accent ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}>
      <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-2">{label}</div>
      <div className={`font-fraunces text-3xl mb-1 ${accent ? 'text-accent' : 'text-cream'}`}>{value}</div>
      {sub && <div className="text-cream-muted text-xs">{sub}</div>}
    </div>
  )
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    onlyfans: 'text-blue-600 bg-blue-50 border-blue-200',
    chaturbate: 'text-orange-600 bg-orange-50 border-orange-200',
    other: 'text-gray-600 bg-gray-50 border-gray-200',
  }
  return (
    <span className={`text-[10px] tracking-widest uppercase border px-2 py-0.5 ${colors[platform] || colors.other}`}>
      {platform}
    </span>
  )
}

export default function CreatorPage() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<'overview' | 'earnings' | 'content' | 'settings'>('overview')

  const [earnings, setEarnings] = useState<Earning[]>([])
  const [content, setContent] = useState<ContentEntry[]>([])
  const [settings, setSettings] = useState<CreatorSettings>({})
  const [loading, setLoading] = useState(false)

  // Earnings form
  const [ePlatform, setEPlatform] = useState<'onlyfans' | 'chaturbate' | 'other'>('onlyfans')
  const [eAmount, setEAmount] = useState('')
  const [eDate, setEDate] = useState(new Date().toISOString().split('T')[0])
  const [eNotes, setENotes] = useState('')
  const [eSaving, setESaving] = useState(false)

  // Content form
  const [cPlatform, setCPlatform] = useState<'onlyfans' | 'chaturbate' | 'other'>('onlyfans')
  const [cType, setCType] = useState('photo')
  const [cTitle, setCTitle] = useState('')
  const [cDate, setCDate] = useState(new Date().toISOString().split('T')[0])
  const [cViews, setCViews] = useState('')
  const [cLikes, setCLikes] = useState('')
  const [cTips, setCTips] = useState('')
  const [cNotes, setCNotes] = useState('')
  const [cSaving, setCSaving] = useState(false)

  // Settings form
  const [sOFUrl, setSOFUrl] = useState('')
  const [sOFUser, setSOFUser] = useState('')
  const [sCBUrl, setSCBUrl] = useState('')
  const [sCBUser, setSCBUser] = useState('')
  const [sGoal, setSGoal] = useState('1000')
  const [sEmail, setSEmail] = useState('')
  const [sSaving, setSSaving] = useState(false)

  const loadAll = useCallback(async (t: string) => {
    setLoading(true)
    const [eRes, cRes, sRes] = await Promise.all([
      fetch('/api/creator/earnings', { headers: apiHeaders(t) }),
      fetch('/api/creator/content', { headers: apiHeaders(t) }),
      fetch('/api/creator/settings', { headers: apiHeaders(t) }),
    ])
    const [eData, cData, sData] = await Promise.all([eRes.json(), cRes.json(), sRes.json()])
    setEarnings(Array.isArray(eData) ? eData : [])
    setContent(Array.isArray(cData) ? cData : [])
    setSettings(sData || {})
    if (sData) {
      setSOFUrl(sData.onlyfans_url || '')
      setSOFUser(sData.onlyfans_username || '')
      setSCBUrl(sData.chaturbate_url || '')
      setSCBUser(sData.chaturbate_username || '')
      setSGoal(sData.monthly_goal?.toString() || '1000')
      setSEmail(sData.report_email || '')
    }
    setLoading(false)
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/creator/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setToken(password)
      loadAll(password)
    } else {
      setAuthError('Incorrect password')
    }
  }

  async function addEarning(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !eAmount) return
    setESaving(true)
    const res = await fetch('/api/creator/earnings', {
      method: 'POST',
      headers: apiHeaders(token),
      body: JSON.stringify({ platform: ePlatform, amount: parseFloat(eAmount), date: eDate, notes: eNotes }),
    })
    if (res.ok) {
      setEAmount('')
      setENotes('')
      loadAll(token)
    }
    setESaving(false)
  }

  async function deleteEarning(id: string) {
    if (!token) return
    await fetch(`/api/creator/earnings?id=${id}`, { method: 'DELETE', headers: apiHeaders(token) })
    setEarnings(prev => prev.filter(e => e.id !== id))
  }

  async function addContent(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !cTitle) return
    setCSaving(true)
    const res = await fetch('/api/creator/content', {
      method: 'POST',
      headers: apiHeaders(token),
      body: JSON.stringify({
        platform: cPlatform, content_type: cType, title: cTitle, posted_date: cDate,
        views: parseInt(cViews) || 0, likes: parseInt(cLikes) || 0, tips: parseFloat(cTips) || 0, notes: cNotes,
      }),
    })
    if (res.ok) {
      setCTitle('')
      setCViews('')
      setCLikes('')
      setCTips('')
      setCNotes('')
      loadAll(token)
    }
    setCSaving(false)
  }

  async function deleteContent(id: string) {
    if (!token) return
    await fetch(`/api/creator/content?id=${id}`, { method: 'DELETE', headers: apiHeaders(token) })
    setContent(prev => prev.filter(c => c.id !== id))
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setSSaving(true)
    const res = await fetch('/api/creator/settings', {
      method: 'PUT',
      headers: apiHeaders(token),
      body: JSON.stringify({
        onlyfans_url: sOFUrl, onlyfans_username: sOFUser,
        chaturbate_url: sCBUrl, chaturbate_username: sCBUser,
        monthly_goal: parseFloat(sGoal) || 1000, report_email: sEmail,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setSettings(updated)
    }
    setSSaving(false)
  }

  // Derived stats
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthEarnings = earnings.filter(e => e.date.startsWith(thisMonth))
  const monthTotal = monthEarnings.reduce((s, e) => s + Number(e.amount), 0)
  const goal = settings.monthly_goal || 1000
  const goalPct = Math.min(100, (monthTotal / goal) * 100)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekEarnings = earnings.filter(e => new Date(e.date) >= weekStart)
  const weekTotal = weekEarnings.reduce((s, e) => s + Number(e.amount), 0)

  const ofTotal = monthEarnings.filter(e => e.platform === 'onlyfans').reduce((s, e) => s + Number(e.amount), 0)
  const cbTotal = monthEarnings.filter(e => e.platform === 'chaturbate').reduce((s, e) => s + Number(e.amount), 0)

  const topContent = [...content]
    .sort((a, b) => (Number(b.tips) + b.likes * 0.1) - (Number(a.tips) + a.likes * 0.1))
    .slice(0, 5)

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="font-fraunces text-2xl text-cream mb-1">Creator<span className="text-accent">.</span></div>
          <p className="text-cream-muted text-[11px] tracking-widest uppercase mb-8">Private Dashboard</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
                className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-accent text-white py-3.5 text-sm tracking-widest uppercase hover:bg-blue-700 transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-fraunces text-xl text-cream">Creator<span className="text-accent">.</span></span>
            {settings.onlyfans_url && (
              <a href={settings.onlyfans_url} target="_blank" rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase border border-blue-200 text-blue-600 px-2 py-1 hover:bg-blue-50 transition-colors flex items-center gap-1">
                OF <ExternalLink size={10} />
              </a>
            )}
            {settings.chaturbate_url && (
              <a href={settings.chaturbate_url} target="_blank" rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase border border-orange-200 text-orange-600 px-2 py-1 hover:bg-orange-50 transition-colors flex items-center gap-1">
                CB <ExternalLink size={10} />
              </a>
            )}
          </div>
          <button onClick={() => token && loadAll(token)} className="text-cream-muted hover:text-cream transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8 gap-1">
          {([
            { key: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
            { key: 'earnings', label: 'Earnings', icon: <DollarSign size={14} /> },
            { key: 'content', label: 'Content', icon: <FileText size={14} /> },
            { key: 'settings', label: 'Settings', icon: <Settings size={14} /> },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm tracking-wide transition-colors ${
                tab === t.key
                  ? 'text-cream border-b-2 border-accent -mb-px'
                  : 'text-cream-muted hover:text-cream'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-cream-muted text-sm mb-6">Loading…</p>}

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Goal progress */}
            <div className="border border-accent/30 bg-accent/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-accent">
                  <Target size={16} />
                  <span className="text-[10px] tracking-widest uppercase font-semibold">Monthly Goal</span>
                </div>
                <span className="font-fraunces text-cream text-lg">{fmt(monthTotal)} <span className="text-cream-muted text-sm">/ {fmt(goal)}</span></span>
              </div>
              <div className="bg-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-cream-muted text-xs">{goalPct.toFixed(0)}% complete</span>
                <span className="text-cream-muted text-xs">${Math.max(0, goal - monthTotal).toFixed(2)} remaining</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="This Week" value={fmt(weekTotal)} />
              <StatCard label="This Month" value={fmt(monthTotal)} accent />
              <StatCard label="OnlyFans MTD" value={fmt(ofTotal)} sub="this month" />
              <StatCard label="Chaturbate MTD" value={fmt(cbTotal)} sub="this month" />
            </div>

            {/* Platform quick links */}
            {(settings.onlyfans_url || settings.chaturbate_url) && (
              <div>
                <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-3">Your Platforms</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.onlyfans_url && (
                    <a href={settings.onlyfans_url} target="_blank" rel="noopener noreferrer"
                      className="border border-border bg-surface p-5 flex items-center justify-between hover:border-accent transition-colors group">
                      <div>
                        <div className="text-cream font-semibold">OnlyFans</div>
                        {settings.onlyfans_username && (
                          <div className="text-cream-muted text-sm">@{settings.onlyfans_username}</div>
                        )}
                      </div>
                      <ExternalLink size={16} className="text-cream-muted group-hover:text-accent transition-colors" />
                    </a>
                  )}
                  {settings.chaturbate_url && (
                    <a href={settings.chaturbate_url} target="_blank" rel="noopener noreferrer"
                      className="border border-border bg-surface p-5 flex items-center justify-between hover:border-accent transition-colors group">
                      <div>
                        <div className="text-cream font-semibold">Chaturbate</div>
                        {settings.chaturbate_username && (
                          <div className="text-cream-muted text-sm">@{settings.chaturbate_username}</div>
                        )}
                      </div>
                      <ExternalLink size={16} className="text-cream-muted group-hover:text-accent transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Top performing content */}
            <div>
              <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-3 flex items-center gap-2">
                <TrendingUp size={12} /> Top Performing Content
              </div>
              {topContent.length === 0 ? (
                <p className="text-cream-muted text-sm border border-border p-4">No content logged yet. Add content in the Content tab.</p>
              ) : (
                <div className="space-y-2">
                  {topContent.map((c, i) => (
                    <div key={c.id} className="border border-border bg-surface p-4 flex items-center gap-4">
                      <span className="font-fraunces text-2xl text-accent/40 w-8 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-cream font-medium truncate">{c.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <PlatformBadge platform={c.platform} />
                          <span className="text-cream-muted text-xs">{c.content_type} · {c.posted_date}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {Number(c.tips) > 0 && <div className="text-accent font-semibold text-sm">{fmt(Number(c.tips))}</div>}
                        <div className="text-cream-muted text-xs">
                          {c.likes > 0 && `${c.likes} likes`}
                          {c.likes > 0 && c.views > 0 && ' · '}
                          {c.views > 0 && `${c.views} views`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent earnings */}
            <div>
              <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-3">Recent Earnings</div>
              {earnings.slice(0, 5).length === 0 ? (
                <p className="text-cream-muted text-sm border border-border p-4">No earnings logged yet. Add earnings in the Earnings tab.</p>
              ) : (
                <div className="space-y-2">
                  {earnings.slice(0, 5).map(e => (
                    <div key={e.id} className="border border-border bg-surface px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlatformBadge platform={e.platform} />
                        <span className="text-cream-muted text-sm">{e.date}</span>
                        {e.notes && <span className="text-cream-muted text-xs italic truncate max-w-48">{e.notes}</span>}
                      </div>
                      <span className="font-fraunces text-cream text-lg">{fmt(Number(e.amount))}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EARNINGS ── */}
        {tab === 'earnings' && (
          <div className="space-y-8">
            {/* Add earning form */}
            <div className="border border-border bg-surface p-6">
              <div className="text-cream text-sm tracking-wide mb-4 flex items-center gap-2">
                <Plus size={14} /> Log Earnings
              </div>
              <form onSubmit={addEarning} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Platform</label>
                  <select
                    value={ePlatform}
                    onChange={e => setEPlatform(e.target.value as typeof ePlatform)}
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Amount ($)</label>
                  <input
                    type="number" step="0.01" min="0" required
                    value={eAmount}
                    onChange={e => setEAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Date</label>
                  <input
                    type="date" required
                    value={eDate}
                    onChange={e => setEDate(e.target.value)}
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Notes</label>
                  <input
                    type="text"
                    value={eNotes}
                    onChange={e => setENotes(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="col-span-2 md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={eSaving}
                    className="bg-accent text-white px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {eSaving ? 'Saving…' : 'Add Entry'}
                  </button>
                </div>
              </form>
            </div>

            {/* Earnings table */}
            <div>
              <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-3">
                All Entries ({earnings.length})
              </div>
              {earnings.length === 0 ? (
                <p className="text-cream-muted text-sm border border-border p-4">No earnings logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {earnings.map(e => (
                    <div key={e.id} className="border border-border bg-surface px-4 py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <PlatformBadge platform={e.platform} />
                        <span className="text-cream-muted text-sm shrink-0">{e.date}</span>
                        {e.notes && <span className="text-cream-muted text-xs italic truncate">{e.notes}</span>}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-fraunces text-cream text-xl">{fmt(Number(e.amount))}</span>
                        <button
                          onClick={() => deleteEarning(e.id)}
                          className="text-cream-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {tab === 'content' && (
          <div className="space-y-8">
            {/* Add content form */}
            <div className="border border-border bg-surface p-6">
              <div className="text-cream text-sm tracking-wide mb-4 flex items-center gap-2">
                <Plus size={14} /> Log Content
              </div>
              <form onSubmit={addContent} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Platform</label>
                    <select
                      value={cPlatform}
                      onChange={e => setCPlatform(e.target.value as typeof cPlatform)}
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    >
                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Type</label>
                    <select
                      value={cType}
                      onChange={e => setCType(e.target.value)}
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    >
                      {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Date Posted</label>
                    <input
                      type="date" required
                      value={cDate}
                      onChange={e => setCDate(e.target.value)}
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Tips ($)</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={cTips}
                      onChange={e => setCTips(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Title / Description</label>
                    <input
                      type="text" required
                      value={cTitle}
                      onChange={e => setCTitle(e.target.value)}
                      placeholder="e.g. Pool shoot, Friday night stream…"
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Likes</label>
                    <input
                      type="number" min="0"
                      value={cLikes}
                      onChange={e => setCLikes(e.target.value)}
                      placeholder="0"
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Views</label>
                    <input
                      type="number" min="0"
                      value={cViews}
                      onChange={e => setCViews(e.target.value)}
                      placeholder="0"
                      className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Notes</label>
                  <input
                    type="text"
                    value={cNotes}
                    onChange={e => setCNotes(e.target.value)}
                    placeholder="What worked? What didn't?"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={cSaving}
                    className="bg-accent text-white px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-blue-700 transition-colors disabled:opacity-60"
                  >
                    {cSaving ? 'Saving…' : 'Log Content'}
                  </button>
                </div>
              </form>
            </div>

            {/* Content table */}
            <div>
              <div className="text-cream-muted text-[10px] tracking-widest uppercase mb-3">
                All Content ({content.length})
              </div>
              {content.length === 0 ? (
                <p className="text-cream-muted text-sm border border-border p-4">No content logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {content.map(c => (
                    <div key={c.id} className="border border-border bg-surface p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-cream font-medium">{c.title}</span>
                          <PlatformBadge platform={c.platform} />
                          <span className="text-cream-muted text-[10px] tracking-widest uppercase border border-border px-2 py-0.5">{c.content_type}</span>
                        </div>
                        <div className="flex items-center gap-3 text-cream-muted text-xs">
                          <span>{c.posted_date}</span>
                          {c.views > 0 && <span>{c.views} views</span>}
                          {c.likes > 0 && <span>{c.likes} likes</span>}
                          {c.notes && <span className="italic">{c.notes}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {Number(c.tips) > 0 && (
                          <span className="text-accent font-fraunces text-lg">{fmt(Number(c.tips))}</span>
                        )}
                        <button
                          onClick={() => deleteContent(c.id)}
                          className="text-cream-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div className="max-w-lg">
            <form onSubmit={saveSettings} className="space-y-6">
              <div className="border border-border bg-surface p-6 space-y-4">
                <div className="text-cream text-sm tracking-wide mb-2">OnlyFans</div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Profile URL</label>
                  <input
                    type="url"
                    value={sOFUrl}
                    onChange={e => setSOFUrl(e.target.value)}
                    placeholder="https://onlyfans.com/yourname"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Username</label>
                  <input
                    type="text"
                    value={sOFUser}
                    onChange={e => setSOFUser(e.target.value)}
                    placeholder="yourname"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
              </div>

              <div className="border border-border bg-surface p-6 space-y-4">
                <div className="text-cream text-sm tracking-wide mb-2">Chaturbate</div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Profile URL</label>
                  <input
                    type="url"
                    value={sCBUrl}
                    onChange={e => setSCBUrl(e.target.value)}
                    placeholder="https://chaturbate.com/yourname"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Username</label>
                  <input
                    type="text"
                    value={sCBUser}
                    onChange={e => setSCBUser(e.target.value)}
                    placeholder="yourname"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
              </div>

              <div className="border border-border bg-surface p-6 space-y-4">
                <div className="text-cream text-sm tracking-wide mb-2">Goals & Reporting</div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Monthly Goal ($)</label>
                  <input
                    type="number" step="1" min="1"
                    value={sGoal}
                    onChange={e => setSGoal(e.target.value)}
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="text-cream-muted text-[10px] tracking-widest uppercase block mb-1.5">Weekly Report Email</label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={e => setSEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-background border border-border text-cream px-3 py-2.5 focus:outline-none focus:border-accent text-sm"
                  />
                  <p className="text-cream-muted text-xs mt-1.5">Sent every Friday at 9am with earnings, top content, and goal progress.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={sSaving}
                className="w-full bg-accent text-white py-3 text-sm tracking-widest uppercase hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {sSaving ? 'Saving…' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
