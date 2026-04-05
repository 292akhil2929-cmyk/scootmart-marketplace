import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Plus, Eye, Edit, TrendingUp, DollarSign, ShoppingBag, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Seller Dashboard' }

export default async function SellerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || (profile.role !== 'seller' && profile.role !== 'admin')) redirect('/')

  const [{ data: listings }, { data: orders }] = await Promise.all([
    supabase.from('listings').select('*, specs:listing_specs(*)').eq('seller_id', user.id).order('created_at', { ascending: false }),
    supabase.from('orders').select('*, listing:listings(title)').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(10),
  ])

  const activeListings = listings?.filter(l => l.status === 'active').length ?? 0
  const totalViews = listings?.reduce((sum, l) => sum + (l.view_count ?? 0), 0) ?? 0
  const completedOrders = orders?.filter(o => o.status === 'completed') ?? []
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.seller_payout, 0)
  const pendingOrders = orders?.filter(o => ['in_escrow', 'shipped', 'delivered'].includes(o.status)) ?? []

  const statusColors: Record<string, string> = {
    active: 'success', pending_review: 'warning', draft: 'secondary',
    sold: 'default', archived: 'secondary', rejected: 'destructive',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile.display_name ?? profile.full_name}</p>
        </div>
        <Link href="/seller/listings/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Listing</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: 'Active Listings', value: activeListings, color: 'text-blue-600' },
          { icon: Eye, label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-purple-600' },
          { icon: DollarSign, label: 'Total Earnings', value: formatPrice(totalEarnings), color: 'text-green-600' },
          { icon: TrendingUp, label: 'Pending Orders', value: pendingOrders.length, color: 'text-orange-600' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <stat.icon className={`h-5 w-5 mb-3 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Verification banner */}
      {!profile.verified_badge && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100">Get Verified Seller Badge</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Upload your Emirates ID or trade license to get a verified badge and build buyer trust.</p>
          </div>
          <Link href="/seller/verify"><Button size="sm" variant="outline">Verify Now</Button></Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Listings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Your Listings</h2>
          </div>
          <div className="space-y-3">
            {listings && listings.length > 0 ? listings.map(listing => (
              <div key={listing.id} className="rounded-xl border bg-card p-4 flex gap-4">
                <div className="h-16 w-20 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                  {listing.images?.[0] && (
                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="font-medium text-sm line-clamp-1 flex-1">{listing.title}</p>
                    <Badge variant={statusColors[listing.status] as any} className="shrink-0 text-xs capitalize">{listing.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="font-bold text-primary mt-0.5">{formatPrice(listing.price)}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.view_count} views</span>
                    <span>{timeAgo(listing.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link href={`/listings/${listing.slug ?? listing.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                  </Link>
                  <Link href={`/seller/listings/${listing.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 border rounded-xl">
                <p className="text-muted-foreground mb-3">No listings yet</p>
                <Link href="/seller/listings/new"><Button size="sm">Create First Listing</Button></Link>
              </div>
            )}
          </div>
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link href="/seller/orders"><Button variant="outline" size="sm">View All</Button></Link>
          </div>
          <div className="space-y-3">
            {orders && orders.length > 0 ? orders.map((order: any) => (
              <div key={order.id} className="rounded-xl border bg-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium line-clamp-1">{order.listing?.title}</p>
                  <Badge variant={order.status === 'completed' ? 'success' : 'secondary'} className="text-xs capitalize shrink-0 ml-1">{order.status.replace('_', ' ')}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatPrice(order.seller_payout)} payout</span>
                  <span>{timeAgo(order.created_at)}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 border rounded-xl">
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
