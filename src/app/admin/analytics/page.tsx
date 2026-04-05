import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Analytics – ScootMart.ae' }

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const [
    { data: revenueData },
    { data: ordersByStatus },
    { data: topListings },
    { data: topSellers },
    { data: recentCompleted },
  ] = await Promise.all([
    // Aggregate GMV and commission from orders
    supabase.from('orders').select('total_amount, commission_amount, seller_payout, status, created_at'),
    // Orders grouped by status
    supabase.from('orders').select('status'),
    // Top listings by orders
    supabase.from('orders').select('listing_id, listing:listings(title, price), total_amount').eq('status', 'completed').limit(20),
    // Top sellers by revenue
    supabase.from('orders').select('seller_id, seller:profiles!orders_seller_id_fkey(display_name, full_name), seller_payout').eq('status', 'completed').limit(50),
    // Recent completed orders for payout tracking
    supabase.from('orders')
      .select('*, listing:listings(title), seller:profiles!orders_seller_id_fkey(display_name,full_name), buyer:profiles!orders_buyer_id_fkey(display_name,full_name)')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(15),
  ])

  // Calculate totals
  const allOrders = revenueData ?? []
  const gmv = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
  const totalCommission = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.commission_amount ?? 0), 0)
  const totalPayout = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.seller_payout ?? 0), 0)
  const inEscrow = allOrders.filter(o => ['in_escrow', 'shipped', 'delivered'].includes(o.status)).reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
  const pendingPayouts = allOrders.filter(o => ['in_escrow', 'shipped', 'delivered'].includes(o.status)).reduce((sum, o) => sum + (o.seller_payout ?? 0), 0)

  const statusCounts = (ordersByStatus ?? []).reduce((acc: Record<string, number>, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  // Aggregate top listings
  const listingMap = new Map<string, { title: string; count: number; revenue: number }>()
  for (const o of (topListings ?? []) as any[]) {
    const id = o.listing_id
    const existing = listingMap.get(id) ?? { title: o.listing?.title ?? id, count: 0, revenue: 0 }
    listingMap.set(id, { ...existing, count: existing.count + 1, revenue: existing.revenue + (o.total_amount ?? 0) })
  }
  const topListingsSorted = Array.from(listingMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // Aggregate top sellers
  const sellerMap = new Map<string, { name: string; payout: number; count: number }>()
  for (const o of (topSellers ?? []) as any[]) {
    const id = o.seller_id
    const existing = sellerMap.get(id) ?? { name: o.seller?.display_name ?? o.seller?.full_name ?? id, payout: 0, count: 0 }
    sellerMap.set(id, { ...existing, payout: existing.payout + (o.seller_payout ?? 0), count: existing.count + 1 })
  }
  const topSellersSorted = Array.from(sellerMap.values()).sort((a, b) => b.payout - a.payout).slice(0, 5)

  const STATUS_LABELS: Record<string, string> = {
    pending_payment: 'Pending Payment',
    in_escrow: 'In Escrow',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    disputed: 'Disputed',
    refunded: 'Refunded',
    cancelled: 'Cancelled',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground">Revenue, GMV, and escrow overview</p>
        </div>
        <a href="/admin" className="ml-auto text-sm text-muted-foreground hover:text-foreground">← Back to Admin</a>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total GMV', value: formatPrice(gmv), sub: 'Completed orders', color: 'text-foreground' },
          { label: 'Platform Revenue', value: formatPrice(totalCommission), sub: '8–12% commission', color: 'text-green-600 dark:text-green-400' },
          { label: 'Seller Payouts', value: formatPrice(totalPayout), sub: 'Released to sellers', color: 'text-blue-600 dark:text-blue-400' },
          { label: 'In Escrow', value: formatPrice(inEscrow), sub: 'Held right now', color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Pending Payouts', value: formatPrice(pendingPayouts), sub: 'To sellers on delivery', color: 'text-purple-600 dark:text-purple-400' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4">
            <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-sm font-medium mt-1">{kpi.label}</div>
            <div className="text-xs text-muted-foreground">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Order status breakdown */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-2">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = statusCounts[key] ?? 0
              const total = Object.values(statusCounts).reduce((a, b) => a + b, 0)
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{label}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top listings */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Top Listings by Revenue</h2>
          {topListingsSorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed sales yet</p>
          ) : (
            <div className="space-y-3">
              {topListingsSorted.map((l, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-medium w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.count} {l.count === 1 ? 'sale' : 'sales'}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{formatPrice(l.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top sellers */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Top Sellers by Payout</h2>
          {topSellersSorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payouts yet</p>
          ) : (
            <div className="space-y-3">
              {topSellersSorted.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm font-medium w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.count} {s.count === 1 ? 'sale' : 'sales'}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(s.payout)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent completed orders */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Recent Completed Orders</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Order', 'Item', 'Buyer', 'Seller', 'GMV', 'Commission', 'Payout', 'Completed'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentCompleted ?? []).map((order: any) => (
                <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 max-w-36 truncate text-xs">{order.listing?.title}</td>
                  <td className="px-4 py-3 text-xs">{order.buyer?.display_name ?? order.buyer?.full_name}</td>
                  <td className="px-4 py-3 text-xs">{order.seller?.display_name ?? order.seller?.full_name}</td>
                  <td className="px-4 py-3 font-medium text-xs">{formatPrice(order.total_amount)}</td>
                  <td className="px-4 py-3 text-green-600 font-medium text-xs">{formatPrice(order.commission_amount)}</td>
                  <td className="px-4 py-3 text-xs">{formatPrice(order.seller_payout)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{order.completed_at ? new Date(order.completed_at).toLocaleDateString('en-AE') : '—'}</td>
                </tr>
              ))}
              {(recentCompleted ?? []).length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No completed orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
