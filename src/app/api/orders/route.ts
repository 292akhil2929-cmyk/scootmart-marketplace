import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listing_id, delivery_option = 'seller_arranged', delivery_address, bundle_id, payment_method = 'stripe' } = await request.json()

  // Fetch listing
  const { data: listing, error: lError } = await supabase
    .from('listings')
    .select('*, seller:profiles(*)')
    .eq('id', listing_id)
    .eq('status', 'active')
    .single()
  if (lError || !listing) return NextResponse.json({ error: 'Listing not found or unavailable' }, { status: 404 })

  // Get commission config
  const { data: config } = await supabase.from('platform_config').select('value').eq('key', 'commission_percent').single()
  const commissionPercent = Number(config?.value ?? 10)

  const deliveryFee = delivery_option === 'white_glove' ? 150 : 0
  const totalAmount = listing.price + deliveryFee
  const commissionAmount = Math.round(totalAmount * commissionPercent) / 100
  const sellerPayout = totalAmount - commissionAmount

  // Create order
  const { data: order, error: oError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      seller_id: listing.seller_id,
      listing_id,
      bundle_id: bundle_id ?? null,
      status: 'pending_payment',
      listing_price: listing.price,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      commission_percent: commissionPercent,
      commission_amount: commissionAmount,
      seller_payout: sellerPayout,
      delivery_option,
      delivery_address: delivery_address ?? null,
      payment_method,
    })
    .select()
    .single()

  if (oError || !order) return NextResponse.json({ error: oError?.message ?? 'Failed to create order' }, { status: 500 })

  // Create Stripe checkout session
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const session = await createCheckoutSession({
    orderId: order.id,
    listingTitle: listing.title,
    amount: totalAmount,
    successUrl: `${baseUrl}/buyer/orders?order=${order.id}&success=1`,
    cancelUrl: `${baseUrl}/listings/${listing.slug ?? listing.id}`,
    customerEmail: user.email,
  })

  return NextResponse.json({ orderId: order.id, checkoutUrl: session.url }, { status: 201 })
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('orders')
    .select('*, listing:listings(title,images,slug), seller:profiles!orders_seller_id_fkey(*), buyer:profiles!orders_buyer_id_fkey(*)')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return NextResponse.json({ data })
}
