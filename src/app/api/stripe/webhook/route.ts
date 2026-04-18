import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  sendOrderConfirmationBuyer,
  sendOrderNotificationSeller,
  sendPayoutReleasedSeller,
} from '@/lib/email'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

// Idempotency — track processed events in-memory (good enough for low-volume; use Redis for scale)
const processedEvents = new Set<string>()

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency check
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }
  processedEvents.add(event.id)
  if (processedEvents.size > 1000) {
    const first = processedEvents.values().next().value
    if (first) processedEvents.delete(first)
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (!orderId) break

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

        if (!order) break

        // Escrow record
        await supabase.from('escrow_transactions').upsert({
          order_id: orderId,
          status: 'held',
          amount: order.total_amount,
        }, { onConflict: 'order_id' })

        // Mark listing sold
        await supabase.from('listings').update({ status: 'sold' }).eq('id', order.listing_id)

        // In-app notifications
        await supabase.from('notifications').insert([
          {
            user_id: order.seller_id,
            type: 'order_update',
            title: 'New sale! Payment received 🎉',
            body: `Payment of AED ${order.total_amount} is held in escrow. Ship within 3 days.`,
            data: { order_id: orderId },
          },
          {
            user_id: order.buyer_id,
            type: 'order_update',
            title: 'Order confirmed ✅',
            body: 'Payment held in escrow. Seller will ship your item soon.',
            data: { order_id: orderId },
          },
        ])

        // Emails
        const [{ data: buyerUser }, { data: sellerUser }, { data: listingData }] = await Promise.all([
          supabase.auth.admin.getUserById(order.buyer_id),
          supabase.auth.admin.getUserById(order.seller_id),
          supabase.from('listings').select('title').eq('id', order.listing_id).single(),
        ])

        await Promise.allSettled([
          buyerUser.user?.email && listingData
            ? sendOrderConfirmationBuyer(buyerUser.user.email, orderId, listingData.title, order.total_amount)
            : Promise.resolve(),
          sellerUser.user?.email && listingData
            ? sendOrderNotificationSeller(sellerUser.user.email, orderId, listingData.title, order.seller_payout)
            : Promise.resolve(),
        ])
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const { data: order } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_payment_intent_id', pi.id)
          .select()
          .single()

        if (order) {
          // Re-activate listing so it can be bought again
          await supabase.from('listings').update({ status: 'active' }).eq('id', order.listing_id)
          await supabase.from('notifications').insert({
            user_id: order.buyer_id,
            type: 'order_update',
            title: 'Payment failed',
            body: 'Your payment could not be processed. Please try again.',
            data: { order_id: order.id },
          })
        }
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        const paymentIntent = dispute.payment_intent as string

        const { data: order } = await supabase
          .from('orders')
          .update({ status: 'disputed', dispute_reason: `Stripe chargeback: ${dispute.reason}` })
          .eq('stripe_payment_intent_id', paymentIntent)
          .select()
          .single()

        if (order) {
          await supabase.from('escrow_transactions')
            .update({ status: 'disputed' })
            .eq('order_id', order.id)

          // Alert admin via notifications to any admin user
          const { data: admins } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'admin')

          if (admins?.length) {
            await supabase.from('notifications').insert(
              admins.map((a: { id: string }) => ({
                user_id: a.id,
                type: 'dispute',
                title: '⚠️ Chargeback dispute received',
                body: `Order ${order.id} — Reason: ${dispute.reason}. Respond within 7 days.`,
                data: { order_id: order.id, dispute_id: dispute.id },
              }))
            )
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          await supabase
            .from('orders')
            .update({ status: 'refunded' })
            .eq('stripe_payment_intent_id', charge.payment_intent as string)
        }
        break
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type)
    }
  } catch (err) {
    console.error('[Webhook] Handler error:', err)
    // Still return 200 so Stripe doesn't retry — log the error for manual review
  }

  return NextResponse.json({ received: true })
}
