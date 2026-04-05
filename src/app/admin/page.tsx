import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Panel – ScootMart.ae' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [
    { count: totalListings },
    { count: pendingListings },
    { count: totalOrders },
    { count: totalSellers },
    { count: disputedOrders },
    { data: pendingReview },
    { data: recentOrders },
    { data: pendingVerifications },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'disputed'),
    supabase.from('listings').select('*, seller:profiles(display_name,full_name,verified_badge)').eq('status', 'pending_review').order('created_at', { ascending: false }).limit(10),
    supabase.from('orders').select('*, listing:listings(title), buyer:profiles!orders_buyer_id_fkey(display_name,full_name)').order('created_at', { ascending: false }).limit(10),
    supabase.from('seller_verifications').select('*, seller:profiles(display_name,full_name)').eq('status', 'pending').limit(10),
  ])

  const approveListing = async (id: string) => {
    'use server'
    const supabase = await createClient()
    await supabase.from('listings').update({ status: 'active' }).eq('id', id)
    revalidatePath('/admin')
  }

  const rejectListing = async (id: string) => {
    'use server'
    const supabase = await createClient()
    await supabase.from('listings').update({ status: 'rejected' }).eq('id', id)
    revalidatePath('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">ScootMart.ae Operations Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/analytics"><Button variant="outline" size="sm">Analytics & Revenue</Button></Link>
          <Link href="/admin/disputes"><Button variant="outline" size="sm">Disputes</Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: totalListings ?? 0 },
          { label: 'Pending Review', value: pendingListings ?? 0, alert: (pendingListings ?? 0) > 0 },
          { label: 'Total Orders', value: totalOrders ?? 0 },
          { label: 'Total Sellers', value: totalSellers ?? 0 },
          { label: 'Open Disputes', value: disputedOrders ?? 0, alert: (disputedOrders ?? 0) > 0, href: '/admin/disputes' },
        ].map(stat => (
          <Link key={stat.label} href={(stat as any).href ?? '#'} className={`rounded-xl border p-5 block ${stat.alert ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' : 'bg-card'} ${(stat as any).href ? 'hover:bg-accent cursor-pointer transition-colors' : 'cursor-default'}`}>
            <div className={`text-3xl font-bold ${stat.alert ? 'text-amber-700 dark:text-amber-300' : ''}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending listings */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Pending Review ({pendingListings ?? 0})</h2>
          <div className="space-y-3">
            {pendingReview && pendingReview.length > 0 ? pendingReview.map((listing: any) => (
              <div key={listing.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {listing.seller?.display_name ?? listing.seller?.full_name} · {formatPrice(listing.price)} · {timeAgo(listing.created_at)}
                    </p>
                  </div>
                  <Badge variant="warning" className="text-xs">Pending</Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/listings/${listing.slug ?? listing.id}`} target="_blank">
                    <Button variant="outline" size="sm">Preview</Button>
                  </Link>
                  <form action={approveListing.bind(null, listing.id)}>
                    <Button size="sm" type="submit">Approve</Button>
                  </form>
                  <form action={rejectListing.bind(null, listing.id)}>
                    <Button size="sm" variant="destructive" type="submit">Reject</Button>
                  </form>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground text-sm">No pending listings</div>
            )}
          </div>
        </div>

        {/* Pending seller verifications */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Seller Verifications ({pendingVerifications?.length ?? 0})</h2>
          <div className="space-y-3">
            {pendingVerifications && pendingVerifications.length > 0 ? pendingVerifications.map((v: any) => (
              <div key={v.id} className="rounded-xl border bg-card p-4">
                <p className="font-medium text-sm">{v.seller?.display_name ?? v.seller?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize mb-2">{v.type} · {v.business_name ?? 'Individual'} · {timeAgo(v.submitted_at)}</p>
                <div className="flex gap-2">
                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    await supabase.from('seller_verifications').update({ status: 'verified' }).eq('id', v.id)
                    await supabase.from('profiles').update({ verified_badge: true }).eq('id', v.seller_id)
                  }}>
                    <Button size="sm" type="submit">Verify</Button>
                  </form>
                  <form action={async () => {
                    'use server'
                    const supabase = await createClient()
                    await supabase.from('seller_verifications').update({ status: 'rejected' }).eq('id', v.id)
                  }}>
                    <Button size="sm" variant="destructive" type="submit">Reject</Button>
                  </form>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground text-sm">No pending verifications</div>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Order ID', 'Listing', 'Buyer', 'Amount', 'Commission', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order: any) => (
                  <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 max-w-40 truncate">{order.listing?.title}</td>
                    <td className="px-4 py-3">{order.buyer?.display_name ?? order.buyer?.full_name}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3 text-green-600">{formatPrice(order.commission_amount)}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-xs capitalize">{order.status.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{timeAgo(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
