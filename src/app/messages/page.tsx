import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, User, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function MessagesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  const matchesWithDetails = await Promise.all(
    (matches || []).map(async (match) => {
      const otherId = match.user_id_1 === user.id ? match.user_id_2 : match.user_id_1

      const [profileRes, photosRes, lastMsgRes, unreadRes] = await Promise.all([
        supabase.from('profiles').select('id, name, age, city, verified').eq('id', otherId).single(),
        supabase.from('photos').select('url').eq('user_id', otherId).order('display_order').limit(1),
        supabase.from('messages').select('*').eq('match_id', match.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('messages').select('id', { count: 'exact' }).eq('match_id', match.id).eq('read', false).neq('sender_id', user.id),
      ])

      return {
        ...match,
        other_profile: profileRes.data,
        other_photo: photosRes.data?.[0]?.url,
        last_message: lastMsgRes.data?.[0],
        unread_count: unreadRes.count || 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-fraunces text-xl text-cream">Signal<span className="text-accent">.</span></div>
          <div className="flex items-center gap-6">
            <Link href="/home" className="text-cream-muted hover:text-cream transition-colors"><Home size={20} /></Link>
            <Link href="/profile" className="text-cream-muted hover:text-cream transition-colors"><User size={20} /></Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">Inbox</div>
          <h1 className="font-fraunces text-4xl text-cream">Messages</h1>
        </div>

        {matchesWithDetails.length === 0 ? (
          <div className="text-center py-24 border border-border">
            <MessageCircle size={32} className="text-cream-muted mx-auto mb-4" />
            <p className="font-fraunces text-2xl italic text-cream-muted mb-3">No conversations yet</p>
            <p className="text-cream-muted text-sm mb-6">When you and someone both send signals, you'll match and can message here.</p>
            <Link href="/home" className="bg-accent text-cream px-6 py-3 text-xs tracking-widest uppercase hover:bg-opacity-90 transition-opacity inline-block">
              View This Week's Matches
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {matchesWithDetails.map(match => (
              <Link
                key={match.id}
                href={`/messages/${match.id}`}
                className="flex items-center gap-4 py-5 hover:bg-surface/50 transition-colors -mx-4 px-4"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={match.other_photo || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face`}
                    alt={match.other_profile?.name}
                    className="w-14 h-14 object-cover border border-border"
                  />
                  {match.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-cream text-[10px] flex items-center justify-center rounded-full">
                      {match.unread_count}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-fraunces text-lg text-cream">
                      {match.other_profile?.name}, {match.other_profile?.age}
                    </span>
                    {match.last_message && (
                      <span className="text-cream-muted text-xs">
                        {formatDistanceToNow(new Date(match.last_message.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${match.unread_count > 0 ? 'text-cream' : 'text-cream-muted'}`}>
                    {match.last_message?.content || 'No messages yet — say hello'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
