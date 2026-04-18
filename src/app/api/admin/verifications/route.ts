import { createAdminClient } from '@/lib/supabase/server'
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
    .from('seller_verifications')
    .select('*, seller:profiles(full_name,email,location_emirate,total_sales)')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })

  return NextResponse.json({ data })
}

export async function PATCH(request: Request) {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await assertAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { verification_id, action, notes } = await request.json()
  if (!verification_id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'verification_id and action (approve|reject) required' }, { status: 400 })
  }

  const newStatus = action === 'approve' ? 'verified' : 'rejected'

  const { data: verification, error } = await supabase
    .from('seller_verifications')
    .update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewer_notes: notes ?? null })
    .eq('id', verification_id)
    .select()
    .single()

  if (error || !verification) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'approve') {
    // Grant verified badge
    await supabase.from('profiles')
      .update({ verified_badge: true })
      .eq('id', (verification as any).seller_id)
  }

  // Notify seller
  await supabase.from('notifications').insert({
    user_id: (verification as any).seller_id,
    type: 'seller_update',
    title: action === 'approve' ? 'Seller account verified! ✅' : 'Verification requires more info',
    body: action === 'approve'
      ? 'Your identity has been verified. Your listings now show the Verified badge.'
      : notes ?? 'Please resubmit with clearer documents.',
    data: { verification_id },
  })

  return NextResponse.json({ success: true, status: newStatus })
}
