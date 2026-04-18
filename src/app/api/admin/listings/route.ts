import { createAdminClient } from '@/lib/supabase/server'
import { sendListingApprovedEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

async function assertAdmin(supabase: Awaited<ReturnType<typeof createAdminClient>>, userId: string) {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role === 'admin'
}

export async function GET() {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await assertAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(full_name,email,verified_badge)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true })

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await assertAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { listing_id, action, rejection_reason } = await request.json()
  if (!listing_id || !action) return NextResponse.json({ error: 'listing_id and action required' }, { status: 400 })

  if (action === 'approve') {
    const { data: listing, error } = await supabase
      .from('listings')
      .update({ status: 'active' })
      .eq('id', listing_id)
      .select('*, seller:profiles!listings_seller_id_fkey(id)')
      .single()

    if (error || !listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Notify seller
    await supabase.from('notifications').insert({
      user_id: (listing as any).seller_id,
      type: 'listing_update',
      title: 'Your listing is live! ✅',
      body: `"${listing.title}" has been approved and is now visible to buyers.`,
      data: { listing_id },
    })

    // Send approval email
    const { data: sellerUser } = await supabase.auth.admin.getUserById((listing as any).seller_id)
    if (sellerUser.user?.email) {
      sendListingApprovedEmail(sellerUser.user.email, listing.title, listing.slug ?? listing.id).catch(console.error)
    }

    return NextResponse.json({ success: true, status: 'active' })
  }

  if (action === 'reject') {
    const { data: listing, error } = await supabase
      .from('listings')
      .update({ status: 'rejected' })
      .eq('id', listing_id)
      .select()
      .single()

    if (error || !listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await supabase.from('notifications').insert({
      user_id: (listing as any).seller_id,
      type: 'listing_update',
      title: 'Listing requires changes',
      body: rejection_reason ?? 'Your listing was not approved. Please review and resubmit.',
      data: { listing_id },
    })

    return NextResponse.json({ success: true, status: 'rejected' })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
