import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('orders')
    .select('*, listing:listings(*, specs:listing_specs(*)), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*), escrow:escrow_transactions(*)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Only allow buyer, seller, or admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if ((data as any).buyer_id !== user.id && (data as any).seller_id !== user.id && profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ data })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { action, tracking_number } = body

  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isBuyer = order.buyer_id === user.id
  const isSeller = order.seller_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isBuyer && !isSeller && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let update: Record<string, unknown> = {}

  switch (action) {
    case 'ship':
      if (!isSeller && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      update = { status: 'shipped', tracking_number, shipped_at: new Date().toISOString() }
      // Notify buyer
      await supabase.from('notifications').insert({
        user_id: order.buyer_id,
        type: 'order_update',
        title: 'Your order has been shipped!',
        body: tracking_number ? `Tracking: ${tracking_number}` : 'The seller has shipped your item.',
        data: { order_id: id },
      })
      break

    case 'confirm_receipt':
      if (!isBuyer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      update = { status: 'completed', completed_at: new Date().toISOString(), delivered_at: new Date().toISOString() }
      // Release escrow
      await supabase.from('escrow_transactions')
        .update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'buyer_confirmed' })
        .eq('order_id', id)
      // Update seller stats
      try { await supabase.rpc('increment_seller_sales', { seller_id: order.seller_id }) } catch (_) {}
      // Notify seller
      await supabase.from('notifications').insert({
        user_id: order.seller_id,
        type: 'payment',
        title: 'Payment released!',
        body: `AED ${order.seller_payout} has been released from escrow.`,
        data: { order_id: id },
      })
      break

    case 'dispute':
      update = { status: 'disputed', dispute_reason: body.reason, disputed_at: new Date().toISOString() }
      // Notify admin (via notifications table — admin can check)
      await supabase.from('notifications').insert({
        user_id: order.seller_id,
        type: 'dispute',
        title: 'Dispute opened on your order',
        body: body.reason ?? 'A buyer has opened a dispute.',
        data: { order_id: id },
      })
      break

    case 'resolve':
      if (!isAdmin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
      update = { status: body.refund ? 'refunded' : 'completed', resolution: body.resolution }
      if (body.refund) {
        await supabase.from('escrow_transactions')
          .update({ status: 'refunded', refunded_at: new Date().toISOString() })
          .eq('order_id', id)
      } else {
        await supabase.from('escrow_transactions')
          .update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'admin_override' })
          .eq('order_id', id)
      }
      break

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  const { data: updated, error } = await supabase.from('orders').update(update).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: updated })
}
