'use client'
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { timeAgo, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  listing_id: string
  created_at: string
  read: boolean
  sender?: { id: string; display_name: string | null; full_name: string | null; avatar_url: string | null }
}

interface Conversation {
  listing_id: string
  other_user_id: string
  other_user_name: string
  other_user_avatar: string | null
  last_message: string
  last_at: string
  unread: number
}

export function MessagesClient() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing')
  const sellerId = searchParams.get('seller')

  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<{ listing_id: string; other_id: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        loadConversations(data.user.id)
      }
    })
  }, [])

  useEffect(() => {
    if (listingId && sellerId && userId) {
      setActiveConv({ listing_id: listingId, other_id: sellerId })
    }
  }, [listingId, sellerId, userId])

  useEffect(() => {
    if (!activeConv) return
    loadMessages(activeConv.listing_id, activeConv.other_id)

    // Real-time subscription
    const channel = supabase
      .channel(`messages:${activeConv.listing_id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${activeConv.listing_id}` },
        payload => setMessages(prev => [...prev, payload.new as Message])
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeConv])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadConversations(uid: string) {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!messages_sender_id_fkey(id,display_name,full_name,avatar_url), receiver:profiles!messages_receiver_id_fkey(id,display_name,full_name,avatar_url)')
      .or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
      .order('created_at', { ascending: false })

    if (!data) return

    // Group by listing_id + other user
    const map = new Map<string, Conversation>()
    data.forEach((m: any) => {
      const otherId = m.sender_id === uid ? m.receiver_id : m.sender_id
      const other = m.sender_id === uid ? m.receiver : m.sender
      const key = `${m.listing_id}:${otherId}`
      if (!map.has(key)) {
        map.set(key, {
          listing_id: m.listing_id,
          other_user_id: otherId,
          other_user_name: other?.display_name ?? other?.full_name ?? 'Unknown',
          other_user_avatar: other?.avatar_url ?? null,
          last_message: m.content,
          last_at: m.created_at,
          unread: m.receiver_id === uid && !m.read ? 1 : 0,
        })
      } else {
        const existing = map.get(key)!
        if (m.receiver_id === uid && !m.read) existing.unread++
      }
    })
    setConversations(Array.from(map.values()))
  }

  async function loadMessages(listing_id: string, other_id: string) {
    const res = await fetch(`/api/messages?listing_id=${listing_id}`)
    const { data } = await res.json()
    if (data) {
      const filtered = data.filter((m: Message) =>
        (m.sender_id === userId && m.receiver_id === other_id) ||
        (m.sender_id === other_id && m.receiver_id === userId)
      )
      setMessages(filtered)
      // Mark as read
      fetch('/api/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing_id, sender_id: other_id }) })
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !activeConv || !userId) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: activeConv.listing_id, receiver_id: activeConv.other_id, content: input }),
    })
    setInput('')
    setSending(false)
  }

  if (!userId) return <div className="container py-20 text-center text-muted-foreground">Please <a href="/login" className="text-primary underline">sign in</a> to view messages.</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="border rounded-2xl overflow-hidden flex" style={{ height: '70vh' }}>
        {/* Sidebar */}
        <div className="w-72 border-r flex flex-col shrink-0">
          <div className="p-3 border-b">
            <p className="text-sm font-semibold text-muted-foreground">Conversations</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground mt-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No messages yet
              </div>
            ) : conversations.map(conv => (
              <button key={`${conv.listing_id}:${conv.other_user_id}`}
                onClick={() => setActiveConv({ listing_id: conv.listing_id, other_id: conv.other_user_id })}
                className={cn('w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left',
                  activeConv?.listing_id === conv.listing_id && activeConv?.other_id === conv.other_user_id ? 'bg-muted' : ''
                )}>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={conv.other_user_avatar ?? undefined} />
                  <AvatarFallback>{getInitials(conv.other_user_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{conv.other_user_name}</p>
                    {conv.unread > 0 && <span className="bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shrink-0">{conv.unread}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={cn('flex gap-2', msg.sender_id === userId ? 'justify-end' : 'justify-start')}>
                  {msg.sender_id !== userId && (
                    <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                      <AvatarImage src={msg.sender?.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs">{getInitials(msg.sender?.display_name ?? msg.sender?.full_name ?? '?')}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('max-w-[70%] rounded-2xl px-3 py-2 text-sm',
                    msg.sender_id === userId ? 'bg-primary text-white rounded-br-sm' : 'bg-muted rounded-bl-sm'
                  )}>
                    <p>{msg.content}</p>
                    <p className={cn('text-xs mt-0.5', msg.sender_id === userId ? 'text-white/70' : 'text-muted-foreground')}>{timeAgo(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex gap-2 p-4 border-t">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" className="flex-1" disabled={sending} />
              <Button type="submit" size="icon" disabled={sending || !input.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-3">
            <MessageSquare className="h-12 w-12 opacity-20" />
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
