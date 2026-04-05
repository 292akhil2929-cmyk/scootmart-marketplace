import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendOrderConfirmationBuyer, sendOrderNotificationSeller } from '@/lib/email'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId
    if (!orderId) return NextResponse.json({ received: true })

    // Mark order as paid, create escrow record
    const { data: order } = await supabase
      .from('orders')
      .update({
        status: 'in_escrow',
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (order) {
      await supabase.from('escrow_transactions').insert({
        order_id: orderId,
        status: 'held',
        amount: order.total_amount,
      })

      // Update listing status to sold
      await supabase.from('listings').update({ status: 'sold' }).eq('id', order.listing_id)

      // Notify seller
      await supabase.from('notifications').insert({
        user_id: order.seller_id,
        type: 'order_update',
        title: 'New sale! Payment received',
        body: `Your listing has been sold. Payment of AED ${order.total_amount} is held in escrow.`,
        data: { order_id: orderId },
      })

      // Notify buyer
      await supabase.from('notifications').insert({
        user_id: order.buyer_id,
        type: 'order_update',
        title: 'Order confirmed',
        body: 'Payment received and held in escrow. Seller will ship your item soon.',
        data: { order_id: orderId },
      })

      // Send emails
      const { data: buyerUser } = await supabase.auth.admin.getUserById(order.buyer_id)
      const { data: sellerUser } = await supabase.auth.admin.getUserById(order.seller_id)
      const { data: listingData } = await supabase.from('listings').select('title').eq('id', order.listing_id).single()

      if (buyerUser.user?.email && listingData) {
        await sendOrderConfirmationBuyer(buyerUser.user.email, orderId, listingData.title, order.total_amount)
      }
      if (sellerUser.user?.email && listingData) {
        await sendOrderNotificationSeller(sellerUser.user.email, orderId, listingData.title, order.seller_payout)
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    await supabase.from('orders').update({ status: 'cancelled' })
      .eq('stripe_payment_intent_id', pi.id)
  }

  return NextResponse.json({ received: true })
}
