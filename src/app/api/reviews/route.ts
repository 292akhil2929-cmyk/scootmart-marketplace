import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { listing_id, rating, title, comment, uae_tested_tags } = body

  if (!listing_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Check buyer has a completed order for this listing
  const { data: order } = await supabase
    .from('orders')
    .select('id, seller_id')
    .eq('listing_id', listing_id)
    .eq('buyer_id', user.id)
    .eq('status', 'completed')
    .single()

  if (!order) {
    return NextResponse.json({ error: 'You can only review items you have purchased and received' }, { status: 403 })
  }

  // Prevent duplicate reviews
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('listing_id', listing_id)
    .eq('reviewer_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You have already reviewed this listing' }, { status: 409 })
  }

  const { data, error } = await supabase.from('reviews').insert({
    listing_id,
    reviewer_id: user.id,
    seller_id: order.seller_id,
    order_id: order.id,
    rating,
    title: title ?? null,
    comment: comment ?? null,
    uae_tested_tags: uae_tested_tags ?? [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath(`/listings/${listing_id}`)
  return NextResponse.json({ data }, { status: 201 })
}
