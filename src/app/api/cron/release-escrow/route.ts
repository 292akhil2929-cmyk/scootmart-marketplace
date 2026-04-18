// Called by Vercel Cron: daily at midnight UTC
// Vercel cron config lives in vercel.json
import { createAdminClient } from '@/lib/supabase/server'
import { sendPayoutReleasedSeller } from '@/lib/email'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron (or our own secret)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const holdDays = Number(process.env.ESCROW_HOLD_DAYS ?? 7)
  const cutoff = new Date(Date.now() - holdDays * 24 * 60 * 60 * 1000).toISOString()

  // Find shipped orders older than holdDays with no buyer confirmation
  const { data: overdueOrders } = await supabase
    .from('orders')
    .select('*, listing:listings(title)')
    .eq('status', 'shipped')
    .lt('shipped_at', cutoff)

  if (!overdueOrders?.length) {
    return NextResponse.json({ released: 0 })
  }

  let released = 0
  for (const order of overdueOrders) {
    try {
      await supabase.from('orders')
        .update({ status: 'completed', completed_at: new Date().toISOString(), auto_completed: true })
        .eq('id', order.id)

      await supabase.from('escrow_transactions')
        .update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'auto_timeout' })
        .eq('order_id', order.id)

      // Notify seller
      await supabase.from('notifications').insert({
        user_id: order.seller_id,
        type: 'payment',
        title: 'Payment auto-released 💸',
        body: `AED ${order.seller_payout} released — buyer didn't dispute within ${holdDays} days.`,
        data: { order_id: order.id },
      })

      // Send payout email
      const [{ data: sellerUser }] = await Promise.all([
        supabase.auth.admin.getUserById(order.seller_id),
      ])
      const title = (order.listing as any)?.title ?? 'your listing'
      if (sellerUser.user?.email) {
        sendPayoutReleasedSeller(sellerUser.user.email, title, order.seller_payout).catch(console.error)
      }

      released++
    } catch (err) {
      console.error('[Cron] Failed to release escrow for order', order.id, err)
    }
  }

  console.log(`[Cron] Released escrow for ${released}/${overdueOrders.length} orders`)
  return NextResponse.json({ released, total: overdueOrders.length })
}
