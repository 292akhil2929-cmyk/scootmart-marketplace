import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, timeAgo } from '@/lib/utils'
import { MapPin, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Details – ScootMart.ae' }

const STATUS_CONFIG: Record<string, { label: string; variant: string; desc: string; icon: any }> = {
  pending_payment: { label: 'Awaiting Payment', variant: 'warning', desc: 'Complete payment to proceed', icon: Clock },
  in_escrow: { label: 'Payment Received', variant: 'default', desc: 'Seller preparing to ship', icon: Package },
  shipped: { label: 'Shipped', variant: 'default', desc: 'Your item is on its way', icon: Truck },
  delivered: { label: 'Delivered', variant: 'default', desc: 'Confirm receipt to release payment', icon: Truck },
  completed: { label: 'Completed', variant: 'success', desc: 'Order complete', icon: CheckCircle },
  disputed: { label: 'Disputed', variant: 'destructive', desc: 'Under review', icon: AlertCircle },
  refunded: { label: 'Refunded', variant: 'secondary', desc: 'Refund processed', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'secondary', desc: 'Order cancelled', icon: AlertCircle },
}

const TIMELINE = [
  { status: 'pending_payment', label: 'Order placed' },
  { status: 'in_escrow', label: 'Payment confirmed' },
  { status: 'shipped', label: 'Shipped by seller' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'completed', label: 'Order complete' },
]

const STATUS_ORDER = ['pending_payment', 'in_escrow', 'shipped', 'delivered', 'completed']

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      listing:listings(title, images, slug, brand, model, condition),
      seller:profiles!orders_seller_id_fkey(id, display_name, full_name, verified_badge, avatar_url, location_emirate, rating, rating_count),
      escrow:escrow_transactions(*)
    `)
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single()

  if (!order) notFound()

  const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary', desc: '', icon: Clock }
  const currentStep = STATUS_ORDER.indexOf(order.status)
  const escrow = Array.isArray(order.escrow) ? order.escrow[0] : order.escrow

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/buyer/orders" className="text-muted-foreground hover:text-foreground text-sm">← My Orders</Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-mono">{order.id.slice(0, 8)}…</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Badge variant={cfg.variant as any}>{cfg.label}</Badge>
      </div>

      {/* Timeline */}
      {!['disputed', 'refunded', 'cancelled'].includes(order.status) && (
        <div className="rounded-xl border bg-card p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-muted" />
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step.status} className="relative flex flex-col items-center gap-1 z-10">
                  <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                    ${done ? 'bg-primary border-primary text-white' : 'bg-background border-muted-foreground/30 text-muted-foreground'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs text-center max-w-16 leading-tight ${active ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {/* Item */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Item</h2>
          <div className="flex gap-4">
            <div className="h-20 w-24 rounded-xl bg-muted overflow-hidden shrink-0 relative">
              {order.listing?.images?.[0] && (
                <Image src={order.listing.images[0]} alt={order.listing.title} fill className="object-cover" sizes="96px" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{order.listing?.title}</p>
              <p className="text-sm text-muted-foreground capitalize">{order.listing?.brand} · {order.listing?.condition}</p>
              <p className="font-bold mt-1">{formatPrice(order.listing_price)}</p>
            </div>
          </div>
          {order.listing?.slug && (
            <Link href={`/listings/${order.listing.slug}`} className="mt-3 block">
              <Button variant="outline" size="sm">View Listing</Button>
            </Link>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Payment</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Item price</span><span>{formatPrice(order.listing_price)}</span></div>
            {order.delivery_fee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total paid</span><span>{formatPrice(order.total_amount)}</span></div>
          </div>
          <div className={`mt-3 rounded-lg p-3 text-xs ${escrow?.status === 'released' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}>
            {escrow?.status === 'released'
              ? '✅ Payment released to seller after delivery confirmed.'
              : escrow?.status === 'refunded'
              ? '↩️ Payment refunded to your original payment method.'
              : `🔒 AED ${formatPrice(order.total_amount)} held securely in escrow.`}
          </div>
        </div>

        {/* Delivery */}
        {order.delivery_address && (
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Address</h2>
            <p className="text-sm">{order.delivery_address.name}</p>
            <p className="text-sm text-muted-foreground">{order.delivery_address.address}, {order.delivery_address.emirate}</p>
            <p className="text-sm text-muted-foreground">{order.delivery_address.phone}</p>
          </div>
        )}

        {/* Tracking */}
        {order.tracking_number && (
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-2 flex items-center gap-2"><Truck className="h-4 w-4" /> Tracking</h2>
            <p className="font-mono text-sm bg-muted rounded-lg px-3 py-2 inline-block">{order.tracking_number}</p>
            {order.shipped_at && (
              <p className="text-xs text-muted-foreground mt-2">Shipped {timeAgo(order.shipped_at)}</p>
            )}
          </div>
        )}

        {/* Seller */}
        {order.seller && (
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-3">Seller</h2>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {(order.seller.display_name ?? order.seller.full_name ?? '?')[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{order.seller.display_name ?? order.seller.full_name}</p>
                {order.seller.verified_badge && <span className="text-xs text-blue-600">✓ Verified</span>}
              </div>
              <Link href={`/messages?listing=${order.listing_id}&seller=${order.seller_id}`} className="ml-auto">
                <Button variant="outline" size="sm">Message</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.from('orders').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', order.id)
              await supabase.from('escrow_transactions').update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'buyer_confirmed' }).eq('order_id', order.id)
              const { data: o } = await supabase.from('orders').select('seller_id').eq('id', order.id).single()
              if (o) await supabase.from('notifications').insert({ user_id: o.seller_id, type: 'payment', title: 'Payment released!', body: 'Buyer confirmed receipt.', data: { order_id: order.id } })
            }}>
              <Button type="submit">Confirm Receipt & Release Payment</Button>
            </form>
          )}
          {['in_escrow', 'shipped', 'delivered'].includes(order.status) && (
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.from('orders').update({ status: 'disputed', disputed_at: new Date().toISOString() }).eq('id', order.id)
            }}>
              <Button type="submit" variant="outline" className="text-destructive border-destructive/30">Open Dispute</Button>
            </form>
          )}
          {order.status === 'completed' && order.listing?.slug && (
            <Link href={`/listings/${order.listing.slug}#reviews`}>
              <Button variant="outline">Leave a Review</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
