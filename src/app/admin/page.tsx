'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, DollarSign, AlertTriangle, Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

function StatCard({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`border p-6 ${accent ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}>
      <div className={`mb-3 ${accent ? 'text-accent' : 'text-cream-muted'}`}>{icon}</div>
      <div className="font-fraunces text-3xl text-cream mb-1">{value}</div>
      <div className="text-cream-muted text-xs tracking-widest uppercase">{label}</div>
    </div>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [waitlist, setWaitlist] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, verified: 0, suspended: 0 })
  const [tab, setTab] = useState<'users' | 'waitlist' | 'email'>('users')
  const [loading, setLoading] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [sending, setSending] = useState(false)

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthenticated(true)
      loadData()
    } else {
      alert('Invalid password')
    }
  }

  async function loadData() {
    setLoading(true)
    const supabase = createClient()

    const [usersRes, waitlistRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('waitlist').select('*').order('created_at', { ascending: false }),
    ])

    const usersData = usersRes.data || []
    setUsers(usersData)
    setWaitlist(waitlistRes.data || [])
    setStats({
      total: usersData.length,
      active: usersData.filter((u: any) => u.subscription_status === 'active').length,
      verified: usersData.filter((u: any) => u.verified).length,
      suspended: usersData.filter((u: any) => u.suspended_until && new Date(u.suspended_until) > new Date()).length,
    })
    setLoading(false)
  }

  async function toggleSuspend(userId: string, suspend: boolean) {
    const res = await fetch('/api/admin/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, suspend }),
    })
    if (res.ok) loadData()
  }

  async function approveUser(userId: string) {
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) loadData()
  }

  async function sendBroadcast() {
    setSending(true)
    await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: emailSubject, body: emailBody }),
    })
    setSending(false)
    setEmailSubject('')
    setEmailBody('')
    alert('Broadcast sent!')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="font-fraunces text-2xl text-cream mb-2">Signal<span className="text-accent">.</span></div>
          <p className="text-cream-muted text-xs tracking-widest uppercase mb-8">Admin Access</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
            <button type="submit" className="w-full bg-accent text-cream py-3.5 text-sm tracking-widest uppercase hover:bg-opacity-90 transition-opacity">
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-fraunces text-xl text-cream">Signal<span className="text-accent">.</span> <span className="text-cream-muted text-sm ml-2">Admin</span></div>
          <button onClick={loadData} className="text-cream-muted hover:text-cream transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Users size={20} />} label="Total Members" value={stats.total} />
          <StatCard icon={<DollarSign size={20} />} label="Active Subscribers" value={stats.active} accent />
          <StatCard icon={<CheckCircle size={20} />} label="Verified Users" value={stats.verified} />
          <StatCard icon={<AlertTriangle size={20} />} label="Suspended" value={stats.suspended} />
        </div>

        {/* Revenue estimate */}
        <div className="border border-border bg-surface p-5 mb-10">
          <div className="text-accent text-xs tracking-widest uppercase mb-1">Estimated MRR</div>
          <div className="font-fraunces text-4xl text-cream">${(stats.active * 34.99).toFixed(2)}</div>
          <div className="text-cream-muted text-xs mt-1">Based on {stats.active} active subscribers at $34.99/month</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          {(['users', 'waitlist', 'email'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors capitalize ${
                tab === t ? 'text-cream border-b-2 border-accent -mb-px' : 'text-cream-muted hover:text-cream'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-cream-muted">Loading...</p>
            ) : users.length === 0 ? (
              <p className="text-cream-muted">No users yet.</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="border border-border bg-surface p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-fraunces text-lg text-cream">{user.name || 'Unnamed'}</span>
                      {user.verified && <span className="text-[10px] tracking-widest uppercase text-accent border border-accent px-2 py-0.5">Verified</span>}
                      {user.suspended_until && new Date(user.suspended_until) > new Date() && (
                        <span className="text-[10px] tracking-widest uppercase text-red-400 border border-red-400/30 px-2 py-0.5">Suspended</span>
                      )}
                    </div>
                    <p className="text-cream-muted text-sm">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-xs px-2 py-0.5 ${user.subscription_status === 'active' ? 'text-accent' : 'text-cream-muted'}`}>
                        {user.subscription_status}
                      </span>
                      <span className="text-cream-muted text-xs">{user.city}, {user.state}</span>
                      <span className="text-cream-muted text-xs">Strikes: {user.strikes}/3</span>
                      <span className="text-cream-muted text-xs">Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.verified && (
                      <button
                        onClick={() => approveUser(user.id)}
                        className="text-xs tracking-widest uppercase border border-accent text-accent px-3 py-2 hover:bg-accent hover:text-cream transition-all"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => toggleSuspend(user.id, !user.suspended_until || new Date(user.suspended_until) < new Date())}
                      className="text-xs tracking-widest uppercase border border-border text-cream-muted px-3 py-2 hover:border-cream hover:text-cream transition-all"
                    >
                      {user.suspended_until && new Date(user.suspended_until) > new Date() ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Waitlist tab */}
        {tab === 'waitlist' && (
          <div className="space-y-3">
            <div className="text-cream-muted text-sm mb-4">{waitlist.length} people on the waitlist</div>
            {waitlist.map(entry => (
              <div key={entry.id} className="border border-border bg-surface p-4 flex items-center justify-between">
                <div>
                  <span className="font-fraunces text-cream">{entry.name}</span>
                  <span className="text-cream-muted text-sm mx-3">·</span>
                  <span className="text-cream-muted text-sm">{entry.email}</span>
                  <span className="text-cream-muted text-sm mx-3">·</span>
                  <span className="text-cream-muted text-sm">{entry.city}</span>
                  {entry.seeking && (
                    <span className="text-cream-muted text-xs ml-3">Seeking: {entry.seeking}</span>
                  )}
                </div>
                <span className="text-cream-muted text-xs">{new Date(entry.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Email broadcast tab */}
        {tab === 'email' && (
          <div className="max-w-2xl space-y-5">
            <div>
              <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Message</label>
              <textarea
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
                placeholder="Write your message to all Signal members..."
                rows={8}
                className="w-full bg-transparent border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={sendBroadcast}
                disabled={sending || !emailSubject || !emailBody}
                className="bg-accent text-cream px-6 py-3 text-sm tracking-widest uppercase hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
              >
                <Mail size={14} />
                {sending ? 'Sending...' : `Send to ${stats.total} members`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
