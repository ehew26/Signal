'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, Send, Shield, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow, format } from 'date-fns'

function CompactBanner() {
  return (
    <div className="bg-surface border-b border-border px-6 py-3 flex items-center gap-3">
      <AlertTriangle size={14} className="text-accent flex-shrink-0" />
      <p className="text-cream-muted text-xs leading-relaxed">
        <span className="text-cream font-medium">The Compact</span> — Please respond within 72 hours.
        Ghosting three times results in account suspension.
      </p>
    </div>
  )
}

export default function ChatClient({
  match,
  otherProfile,
  otherPhoto,
  initialMessages,
  currentUserId,
}: {
  match: any
  otherProfile: any
  otherPhoto: string | undefined
  initialMessages: any[]
  currentUserId: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${match.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${match.id}` },
        (payload) => {
          const newMsg = payload.new as any
          if (newMsg.sender_id !== currentUserId) {
            setMessages(prev => [...prev, newMsg])
            // Mark as read
            supabase.from('messages').update({ read: true }).eq('id', newMsg.id)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [match.id, currentUserId, supabase])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: match.id,
        sender_id: currentUserId,
        content,
      })
      .select()
      .single()

    if (!error && data) {
      setMessages(prev => [...prev, data])
      // Update last_message_at on match
      await supabase
        .from('matches')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', match.id)
    }

    setSending(false)
  }

  function groupMessagesByDate(msgs: any[]) {
    const groups: { date: string; messages: any[] }[] = []
    let currentDate = ''

    msgs.forEach(msg => {
      const msgDate = format(new Date(msg.created_at), 'MMMM d, yyyy')
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ date: msgDate, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    })
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/messages" className="text-cream-muted hover:text-cream transition-colors">
            <ChevronLeft size={22} />
          </Link>
          <Link href={`/profile/${otherProfile?.id}`} className="flex items-center gap-3 flex-1">
            <div className="relative">
              <img
                src={otherPhoto || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face`}
                alt={otherProfile?.name}
                className="w-10 h-10 object-cover border border-border"
              />
              {otherProfile?.verified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent flex items-center justify-center">
                  <Shield size={8} className="text-cream" />
                </div>
              )}
            </div>
            <div>
              <p className="font-fraunces text-cream text-lg leading-none">{otherProfile?.name}, {otherProfile?.age}</p>
              <p className="text-cream-muted text-xs mt-0.5">{otherProfile?.city}</p>
            </div>
          </Link>
        </div>
        <CompactBanner />
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto mb-4">
              <span className="font-fraunces text-2xl italic text-accent">S</span>
            </div>
            <p className="font-fraunces text-xl text-cream mb-2">You matched with {otherProfile?.name}</p>
            <p className="text-cream-muted text-sm">Send a message to get the conversation started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messageGroups.map(group => (
              <div key={group.date}>
                <div className="text-center mb-4">
                  <span className="text-cream-muted text-xs tracking-widest uppercase border border-border px-4 py-1.5">
                    {group.date}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.messages.map(msg => {
                    const isOwn = msg.sender_id === currentUserId
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-4 py-3 text-sm leading-relaxed ${
                            isOwn
                              ? 'bg-accent text-cream'
                              : 'bg-surface border border-border text-cream'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-cream-muted text-[10px] mt-1 px-1">
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-surface border border-border text-cream px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30 text-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="w-12 h-12 bg-accent text-cream flex items-center justify-center hover:bg-opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
