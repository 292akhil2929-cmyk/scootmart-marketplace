import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payouts – Seller Dashboard' }

export default async function PayoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role === 'buyer') redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, listing:listings(title,images)')
    .eq('seller_id', user.id)
    .in('status', ['completed', 'in_escrow', 'shipped', 'delivered'])
    .order('created_at', { ascending: false })

  const completedOrders = orders?.filter(o => o.status === 'completed') ?? []
  const pendingOrders = orders?.filter(o => o.status !== 'completed') ?? []
  const totalPaid = completedOrders.reduce((s, o) => s + o.seller_payout, 0)
  const totalPending = pendingOrders.reduce((s, o) => s + o.seller_payout, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Payouts</h1>
      <p className="text-muted-foreground mb-8">Your earnings and payment history</p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-green-600">{formatPrice(totalPaid)}</p>
          <p className="text-xs text-muted-foreground mt-1">From {completedOrders.length} completed orders</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Pending (in escrow)</p>
          <p className="text-3xl font-bold text-amber-600">{formatPrice(totalPending)}</p>
          <p className="text-xs text-muted-foreground mt-1">Released after buyer confirms receipt</p>
        </div>
        <div className="rounded-xl border bg-card p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Payout Method</p>
            <p className="font-semibold">Bank Transfer</p>
            <p className="text-xs text-muted-foreground">3–5 business days after release</p>
          </div>
          <Button size="sm" variant="outline" className="mt-3">Update Bank Details</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Transaction History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {['Item', 'Sale Price', 'Commission', 'Your Payout', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? orders.map((o: any) => (
              <tr key={o.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 max-w-40 truncate font-medium">{o.listing?.title}</td>
                <td className="px-4 py-3">{formatPrice(o.total_amount)}</td>
                <td className="px-4 py-3 text-red-500">−{formatPrice(o.commission_amount)}</td>
                <td className="px-4 py-3 font-bold text-green-600">{formatPrice(o.seller_payout)}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.status === 'completed' ? 'success' : 'warning'} className="text-xs capitalize">
                    {o.status === 'completed' ? 'Paid' : 'Pending'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{timeAgo(o.created_at)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl bg-muted/50 border p-4 text-sm text-muted-foreground">
        <strong>How payouts work:</strong> When a buyer confirms receipt of their item, the escrow is released and your payout (sale price minus {orders?.[0]?.commission_percent ?? 10}% commission) is processed within 3–5 business days to your registered bank account. For large amounts, we may request additional verification per UAE banking regulations.
      </div>
    </div>
  )
}
