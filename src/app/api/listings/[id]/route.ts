import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*), inspection:certified_inspections(*)')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { specs, ...listingData } = await request.json()

  // Verify ownership
  const { data: existing } = await supabase.from('listings').select('seller_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!existing || (existing.seller_id !== user.id && profile?.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .update({ ...listingData, status: 'pending_review' })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (specs) {
    await supabase.from('listing_specs').upsert({ ...specs, listing_id: id }, { onConflict: 'listing_id' })
  }

  return NextResponse.json({ data: listing })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing } = await supabase.from('listings').select('seller_id').eq('id', id).single()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!existing || (existing.seller_id !== user.id && profile?.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await supabase.from('listings').update({ status: 'archived' }).eq('id', id)
  return NextResponse.json({ success: true })
}
