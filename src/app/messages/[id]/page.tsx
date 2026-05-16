import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ChatClient from './ChatClient'

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .single()

  if (!match) notFound()

  const otherId = match.user_id_1 === user.id ? match.user_id_2 : match.user_id_1

  const [profileRes, photosRes, messagesRes] = await Promise.all([
    supabase.from('profiles').select('id, name, age, city, verified').eq('id', otherId).single(),
    supabase.from('photos').select('url').eq('user_id', otherId).order('display_order').limit(1),
    supabase.from('messages').select('*').eq('match_id', params.id).order('created_at', { ascending: true }),
  ])

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('match_id', params.id)
    .neq('sender_id', user.id)

  return (
    <ChatClient
      match={match}
      otherProfile={profileRes.data}
      otherPhoto={photosRes.data?.[0]?.url}
      initialMessages={messagesRes.data || []}
      currentUserId={user.id}
    />
  )
}
