import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { TrendingUp, Eye, ShoppingBag, DollarSign, Star, Heart } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Seller Analytics' }

export default async function SellerAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role === 'buyer') redirect('/')

  const [{ data: listings }, { data: orders }, { data: reviews }] = await Promise.all([
    supabase.from('listings').select('*, specs:listing_specs(range_km_uae_heat)').eq('seller_id', user.id),
    supabase.from('orders').select('*').eq('seller_id', user.id),
    supabase.from('reviews').select('*').eq('seller_id', user.id),
  ])

  const totalViews = listings?.reduce((s, l) => s + (l.view_count ?? 0), 0) ?? 0
  const totalWishlists = listings?.reduce((s, l) => s + (l.wishlist_count ?? 0), 0) ?? 0
  const completedOrders = orders?.filter(o => o.status === 'completed') ?? []
  const totalRevenue = completedOrders.reduce((s, o) => s + o.seller_payout, 0)
  const totalCommission = completedOrders.reduce((s, o) => s + o.commission_amount, 0)
  const avgRating = reviews?.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const conversionRate = totalViews > 0 ? ((completedOrders.length / totalViews) * 100).toFixed(2) : '0'

  const topListings = [...(listings ?? [])]
    .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">Seller Analytics</h1>
      <p className="text-muted-foreground mb-8">Your performance overview on ScootMart.ae</p>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {[
          { icon: Eye, label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-blue-600' },
          { icon: Heart, label: 'Wishlisted', value: totalWishlists, color: 'text-red-500' },
          { icon: ShoppingBag, label: 'Orders', value: completedOrders.length, color: 'text-purple-600' },
          { icon: DollarSign, label: 'Revenue', value: formatPrice(totalRevenue), color: 'text-green-600' },
          { icon: TrendingUp, label: 'Conversion', value: `${conversionRate}%`, color: 'text-orange-600' },
          { icon: Star, label: 'Avg Rating', value: avgRating ? avgRating.toFixed(1) : '—', color: 'text-yellow-500' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border bg-card p-4 text-center">
            <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top listings by views */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Top Listings by Views</h2>
          <div className="space-y-3">
            {topListings.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(l.price)} · {l.condition}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{l.view_count ?? 0}</p>
                  <p className="text-xs text-muted-foreground">views</p>
                </div>
              </div>
            ))}
            {topListings.length === 0 && <p className="text-sm text-muted-foreground">No listings yet</p>}
          </div>
        </div>

        {/* Revenue breakdown */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Revenue Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Gross Sales</span>
              <span className="font-medium">{formatPrice(completedOrders.reduce((s, o) => s + o.total_amount, 0))}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Platform Commission</span>
              <span className="font-medium text-red-500">−{formatPrice(totalCommission)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-semibold">Net Payout</span>
              <span className="font-bold text-green-600">{formatPrice(totalRevenue)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Commission rate: {completedOrders[0]?.commission_percent ?? 10}% per successful sale. Paid out within 3–5 business days after buyer confirms receipt.
          </div>
        </div>

        {/* Recent reviews */}
        <div className="rounded-xl border bg-card p-5 md:col-span-2">
          <h2 className="font-semibold mb-4">Recent Reviews ({reviews?.length ?? 0})</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r: any) => (
                <div key={r.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={s <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                    ))}
                  </div>
                  <div>
                    {r.title && <p className="font-medium text-sm">{r.title}</p>}
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet. Complete sales to receive reviews.</p>
          )}
        </div>
      </div>
    </div>
  )
}
