import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)', { count: 'exact' })
    .eq('status', 'active')

  const q = searchParams.get('q')
  if (q) query = query.ilike('title', `%${q}%`)

  const type = searchParams.get('type')
  if (type) query = query.eq('type', type)

  const condition = searchParams.get('condition')
  if (condition) query = query.eq('condition', condition)

  const brand = searchParams.get('brand')
  if (brand) query = query.eq('brand', brand)

  const emirate = searchParams.get('emirate')
  if (emirate) query = query.eq('location_emirate', emirate)

  const min_price = searchParams.get('min_price')
  if (min_price) query = query.gte('price', min_price)

  const max_price = searchParams.get('max_price')
  if (max_price) query = query.lte('price', max_price)

  if (searchParams.get('certified_used') === 'true') query = query.eq('certified_used', true)
  if (searchParams.get('rta_compliant') === 'true') query = query.eq('rta_compliant', true)
  if (searchParams.get('uae_tested') === 'true') query = query.eq('uae_tested', true)
  if (searchParams.get('featured') === 'true') query = query.eq('featured', true)

  const sort = searchParams.get('sort') ?? 'newest'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'popular') query = query.order('view_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 24)
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, count, page, limit })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { specs, ...listingData } = body

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({ ...listingData, seller_id: user.id, status: 'pending_review' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (specs && listing) {
    await supabase.from('listing_specs').insert({ ...specs, listing_id: listing.id })
  }

  return NextResponse.json({ data: listing }, { status: 201 })
}
