import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listing_id = searchParams.get('listing_id')
  let query = supabase
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(id,display_name,full_name,avatar_url,verified_badge)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: true })

  if (listing_id) query = query.eq('listing_id', listing_id)

  const { data } = await query
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listing_id, receiver_id, content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })

  const { data, error } = await supabase
    .from('messages')
    .insert({ listing_id, sender_id: user.id, receiver_id, content: content.trim() })
    .select('*, sender:profiles!messages_sender_id_fkey(id,display_name,full_name,avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Notify receiver
  await supabase.from('notifications').insert({
    user_id: receiver_id,
    type: 'message',
    title: 'New message',
    body: content.slice(0, 100),
    data: { listing_id, sender_id: user.id },
  })

  return NextResponse.json({ data }, { status: 201 })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listing_id, sender_id } = await request.json()
  await supabase.from('messages')
    .update({ read: true })
    .eq('receiver_id', user.id)
    .eq('listing_id', listing_id)
    .eq('sender_id', sender_id)

  return NextResponse.json({ success: true })
}
