import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders' }

const STATUS_CONFIG: Record<string, { label: string; variant: string; desc: string }> = {
  pending_payment: { label: 'Awaiting Payment', variant: 'warning', desc: 'Complete payment to proceed' },
  payment_received: { label: 'Payment Received', variant: 'default', desc: 'Processing your order' },
  in_escrow: { label: 'In Escrow', variant: 'default', desc: 'Seller notified — awaiting shipment' },
  shipped: { label: 'Shipped', variant: 'default', desc: 'Your item is on its way' },
  delivered: { label: 'Delivered', variant: 'default', desc: 'Confirm receipt to release payment' },
  completed: { label: 'Completed', variant: 'success', desc: 'Order complete — payment released to seller' },
  disputed: { label: 'Disputed', variant: 'destructive', desc: 'Under review by ScootMart team' },
  refunded: { label: 'Refunded', variant: 'secondary', desc: 'Refund processed to original payment method' },
  cancelled: { label: 'Cancelled', variant: 'secondary', desc: 'Order cancelled' },
}

async function confirmReceipt(orderId: string) {
  'use server'
  const supabase = await createClient()
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'confirm_receipt' }),
  })
  // Direct DB update as fallback since server action can't use fetch with cookies
  await supabase.from('orders').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', orderId)
  await supabase.from('escrow_transactions').update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'buyer_confirmed' }).eq('order_id', orderId)
  await supabase.from('notifications').insert({
    user_id: (await supabase.from('orders').select('seller_id').eq('id', orderId).single()).data?.seller_id,
    type: 'payment',
    title: 'Payment released!',
    body: 'Buyer confirmed receipt. Payment released from escrow.',
    data: { order_id: orderId },
  })
  revalidatePath('/buyer/orders')
}

async function openDispute(orderId: string) {
  'use server'
  const supabase = await createClient()
  await supabase.from('orders').update({ status: 'disputed', disputed_at: new Date().toISOString() }).eq('id', orderId)
  revalidatePath('/buyer/orders')
}

export default async function BuyerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      listing:listings(title, images, slug, brand, model, price),
      seller:profiles!orders_seller_id_fkey(display_name, full_name, verified_badge, rating, avatar_url)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-6 text-sm">All purchases are escrow-protected until you confirm receipt.</p>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary', desc: '' }
            return (
              <div key={order.id} className="rounded-2xl border bg-card overflow-hidden">
                {/* Main row */}
                <div className="flex gap-4 p-4">
                  <div className="h-20 w-24 rounded-xl bg-muted overflow-hidden shrink-0 relative">
                    {order.listing?.images?.[0] && (
                      <Image src={order.listing.images[0]} alt={order.listing.title} fill className="object-cover" sizes="96px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{order.listing?.title}</p>
                        <p className="text-xs text-muted-foreground">{order.listing?.brand}</p>
                      </div>
                      <Badge variant={cfg.variant as any} className="text-xs shrink-0">{cfg.label}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">{cfg.desc}</p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-bold text-sm">{formatPrice(order.total_amount)}</span>
                        <span className="text-xs text-muted-foreground ml-2">· {timeAgo(order.created_at)}</span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {/* Confirm receipt */}
                        {(order.status === 'shipped' || order.status === 'delivered') && (
                          <form action={confirmReceipt.bind(null, order.id)}>
                            <Button size="sm" type="submit">Confirm Receipt & Release Payment</Button>
                          </form>
                        )}

                        {/* Open dispute */}
                        {['in_escrow', 'shipped', 'delivered'].includes(order.status) && (
                          <form action={openDispute.bind(null, order.id)}>
                            <Button size="sm" variant="outline" type="submit" className="text-destructive border-destructive/30">Open Dispute</Button>
                          </form>
                        )}

                        {/* Review */}
                        {order.status === 'completed' && (
                          <Link href={`/listings/${order.listing?.slug ?? order.listing_id}#reviews`}>
                            <Button size="sm" variant="outline">Leave Review</Button>
                          </Link>
                        )}

                        {/* View listing */}
                        {order.listing?.slug && (
                          <Link href={`/listings/${order.listing.slug}`}>
                            <Button size="sm" variant="ghost">View Listing</Button>
                          </Link>
                        )}

                        {/* Message seller */}
                        <Link href={`/messages?listing=${order.listing_id}&seller=${order.seller_id}`}>
                          <Button size="sm" variant="ghost">Message Seller</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                {order.tracking_number && (
                  <div className="border-t px-4 py-2 bg-muted/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Tracking number</span>
                    <span className="font-mono text-xs font-medium">{order.tracking_number}</span>
                  </div>
                )}

                {/* Escrow info */}
                {order.status === 'in_escrow' && (
                  <div className="border-t px-4 py-2 bg-green-50 dark:bg-green-900/10 text-xs text-green-700 dark:text-green-300">
                    🔒 AED {formatPrice(order.total_amount)} held securely in escrow. Releases to seller after you confirm receipt (auto-releases in 7 days if no action).
                  </div>
                )}

                {/* Seller info */}
                {order.seller && (
                  <div className="border-t px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Seller:</span>
                    <span className="font-medium">{order.seller.display_name ?? order.seller.full_name}</span>
                    {order.seller.verified_badge && <span className="text-blue-600">✓ Verified</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-5">Browse UAE's best e-scooters and e-bikes</p>
          <Link href="/browse"><Button size="lg">Browse Listings</Button></Link>
        </div>
      )}
    </div>
  )
}
