import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice, timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Sales – ScootMart.ae' }

const STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
  pending_payment: { label: 'Awaiting Payment', variant: 'warning' },
  in_escrow: { label: 'Ready to Ship', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  disputed: { label: 'Disputed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
}

async function markShipped(orderId: string, tracking: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('orders').update({
    status: 'shipped',
    tracking_number: tracking || null,
    shipped_at: new Date().toISOString(),
  }).eq('id', orderId)
  // Notify buyer
  const { data: order } = await supabase.from('orders').select('buyer_id, listing_id').eq('id', orderId).single()
  if (order) {
    await supabase.from('notifications').insert({
      user_id: order.buyer_id,
      type: 'order_update',
      title: 'Your order has been shipped!',
      body: tracking ? `Tracking number: ${tracking}` : 'The seller has shipped your item.',
      data: { order_id: orderId },
    })
  }
  revalidatePath('/seller/orders')
}

export default async function SellerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'seller' && profile?.role !== 'admin') redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      listing:listings(title, images, slug),
      buyer:profiles!orders_buyer_id_fkey(display_name, full_name, avatar_url)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const active = (orders ?? []).filter((o: any) => !['completed', 'cancelled', 'refunded'].includes(o.status))
  const past = (orders ?? []).filter((o: any) => ['completed', 'cancelled', 'refunded'].includes(o.status))

  const totalRevenue = (orders ?? []).filter((o: any) => o.status === 'completed').reduce((s: number, o: any) => s + (o.seller_payout ?? 0), 0)
  const pendingPayout = (orders ?? []).filter((o: any) => ['in_escrow', 'shipped', 'delivered'].includes(o.status)).reduce((s: number, o: any) => s + (o.seller_payout ?? 0), 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Sales</h1>
          <p className="text-muted-foreground text-sm">Manage and ship your orders</p>
        </div>
        <Link href="/seller/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{(orders ?? []).length}</div>
          <div className="text-xs text-muted-foreground mt-1">Total orders</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total earned</div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{formatPrice(pendingPayout)}</div>
          <div className="text-xs text-muted-foreground mt-1">In escrow</div>
        </div>
      </div>

      {/* Active orders */}
      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-4">Active Orders ({active.length})</h2>
          <div className="space-y-4">
            {active.map((order: any) => {
              const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' }
              const needsShipping = order.status === 'in_escrow'
              return (
                <div key={order.id} className="rounded-2xl border bg-card overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="h-16 w-20 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                      {order.listing?.images?.[0] && (
                        <Image src={order.listing.images[0]} alt={order.listing.title} fill className="object-cover" sizes="80px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm line-clamp-1">{order.listing?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Buyer: {order.buyer?.display_name ?? order.buyer?.full_name}
                          </p>
                        </div>
                        <Badge variant={cfg.variant as any} className="text-xs shrink-0">{cfg.label}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-sm">{formatPrice(order.seller_payout)}</span>
                          <span className="text-xs text-muted-foreground ml-2">payout · {timeAgo(order.created_at)}</span>
                        </div>
                        {needsShipping && (
                          <form action={async (formData: FormData) => {
                            'use server'
                            await markShipped(order.id, formData.get('tracking') as string ?? '')
                          }} className="flex gap-2">
                            <Input name="tracking" placeholder="Tracking # (optional)" className="h-8 text-xs w-40" />
                            <Button size="sm" type="submit">Mark Shipped</Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                  {order.delivery_address && (
                    <div className="border-t px-4 py-2 bg-muted/30 text-xs text-muted-foreground">
                      Ship to: {order.delivery_address.name} · {order.delivery_address.address}, {order.delivery_address.emirate} · {order.delivery_address.phone}
                    </div>
                  )}
                  {order.tracking_number && (
                    <div className="border-t px-4 py-2 bg-muted/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Tracking</span>
                      <span className="font-mono text-xs">{order.tracking_number}</span>
                    </div>
                  )}
                  {order.status === 'disputed' && (
                    <div className="border-t px-4 py-2 bg-destructive/5 text-xs text-destructive">
                      ⚠️ Dispute opened by buyer. Our team will review within 48 hours.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Past orders */}
      {past.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-4">Completed Orders</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Item', 'Buyer', 'Amount', 'Payout', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {past.map((order: any) => {
                  const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' }
                  return (
                    <tr key={order.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 text-xs max-w-36 truncate">{order.listing?.title}</td>
                      <td className="px-4 py-3 text-xs">{order.buyer?.display_name ?? order.buyer?.full_name}</td>
                      <td className="px-4 py-3 text-xs font-medium">{formatPrice(order.total_amount)}</td>
                      <td className="px-4 py-3 text-xs text-green-600 font-medium">{formatPrice(order.seller_payout)}</td>
                      <td className="px-4 py-3"><Badge variant={cfg.variant as any} className="text-xs">{cfg.label}</Badge></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(order.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(orders ?? []).length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-5">Orders will appear here when buyers purchase your listings.</p>
          <Link href="/seller/listings/new"><Button>Create a Listing</Button></Link>
        </div>
      )}
    </div>
  )
}
