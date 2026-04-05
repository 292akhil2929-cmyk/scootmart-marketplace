import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, timeAgo } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dispute Management – ScootMart.ae' }

async function resolveDispute(orderId: string, refund: boolean, resolution: string) {
  'use server'
  const supabase = await createClient()
  const newStatus = refund ? 'refunded' : 'completed'
  await supabase.from('orders').update({ status: newStatus, resolution }).eq('id', orderId)
  if (refund) {
    await supabase.from('escrow_transactions')
      .update({ status: 'refunded', refunded_at: new Date().toISOString() })
      .eq('order_id', orderId)
  } else {
    await supabase.from('escrow_transactions')
      .update({ status: 'released', released_at: new Date().toISOString(), release_trigger: 'admin_override' })
      .eq('order_id', orderId)
  }
  // Notify both parties
  const { data: order } = await supabase.from('orders').select('buyer_id, seller_id').eq('id', orderId).single()
  if (order) {
    await supabase.from('notifications').insert([
      {
        user_id: order.buyer_id,
        type: 'dispute',
        title: refund ? 'Dispute resolved – refund issued' : 'Dispute resolved – payment released',
        body: resolution,
        data: { order_id: orderId },
      },
      {
        user_id: order.seller_id,
        type: 'dispute',
        title: refund ? 'Dispute resolved – payment returned to buyer' : 'Dispute resolved – payment released to you',
        body: resolution,
        data: { order_id: orderId },
      },
    ])
  }
  revalidatePath('/admin/disputes')
}

export default async function AdminDisputesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: disputes } = await supabase
    .from('orders')
    .select(`
      *,
      listing:listings(title, images, slug),
      buyer:profiles!orders_buyer_id_fkey(display_name, full_name, avatar_url),
      seller:profiles!orders_seller_id_fkey(display_name, full_name, verified_badge),
      escrow:escrow_transactions(*)
    `)
    .eq('status', 'disputed')
    .order('disputed_at', { ascending: true })

  const { data: resolvedRecently } = await supabase
    .from('orders')
    .select(`
      *,
      listing:listings(title),
      buyer:profiles!orders_buyer_id_fkey(display_name, full_name),
      seller:profiles!orders_seller_id_fkey(display_name, full_name)
    `)
    .in('status', ['refunded', 'completed'])
    .not('resolution', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dispute Management</h1>
          <p className="text-muted-foreground">Review and resolve buyer–seller disputes</p>
        </div>
        <a href="/admin" className="ml-auto text-sm text-muted-foreground hover:text-foreground">← Back to Admin</a>
      </div>

      {/* Active disputes */}
      <section className="mb-10">
        <h2 className="font-semibold text-lg mb-4">
          Active Disputes
          {(disputes?.length ?? 0) > 0 && (
            <span className="ml-2 bg-destructive text-white text-xs rounded-full px-2 py-0.5">{disputes!.length}</span>
          )}
        </h2>

        {disputes && disputes.length > 0 ? (
          <div className="space-y-6">
            {disputes.map((order: any) => {
              const escrow = Array.isArray(order.escrow) ? order.escrow[0] : order.escrow
              return (
                <div key={order.id} className="rounded-xl border border-destructive/30 bg-card overflow-hidden">
                  <div className="bg-destructive/5 px-4 py-2 flex items-center gap-2 text-sm">
                    <Badge variant="destructive" className="text-xs">Disputed</Badge>
                    <span className="text-muted-foreground">Order {order.id.slice(0, 8)} · opened {timeAgo(order.disputed_at)}</span>
                    <span className="ml-auto font-semibold">{formatPrice(order.total_amount)} in escrow</span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Item info */}
                    <div className="flex gap-3 items-center">
                      {order.listing?.images?.[0] ? (
                        <img src={order.listing.images[0]} alt={order.listing.title} className="h-14 w-20 object-cover rounded-lg" />
                      ) : (
                        <div className="h-14 w-20 bg-muted rounded-lg flex items-center justify-center text-2xl">🛴</div>
                      )}
                      <div>
                        <p className="font-medium">{order.listing?.title}</p>
                        <p className="text-xs text-muted-foreground">Listed for {formatPrice(order.total_amount)}</p>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Buyer</p>
                        <p className="font-medium text-sm">{order.buyer?.display_name ?? order.buyer?.full_name}</p>
                      </div>
                      <div className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Seller</p>
                        <p className="font-medium text-sm">{order.seller?.display_name ?? order.seller?.full_name}</p>
                        {order.seller?.verified_badge && <span className="text-blue-600 text-xs">✓ Verified</span>}
                      </div>
                    </div>

                    {/* Dispute reason */}
                    {order.dispute_reason && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Dispute reason:</p>
                        <p className="text-amber-700 dark:text-amber-300">{order.dispute_reason}</p>
                      </div>
                    )}

                    {/* Escrow status */}
                    <div className="text-xs text-muted-foreground">
                      Escrow status: <span className="font-medium capitalize">{escrow?.status ?? 'held'}</span>
                      {' '}· Held since {escrow?.created_at ? new Date(escrow.created_at).toLocaleDateString('en-AE') : 'unknown'}
                    </div>

                    {/* Action links */}
                    <div className="flex gap-2 text-xs">
                      <a href={`/listings/${order.listing?.slug ?? order.listing_id}`} target="_blank" className="text-primary underline">
                        View listing
                      </a>
                      <span className="text-muted-foreground">·</span>
                      <a href={`/messages?listing=${order.listing_id}&seller=${order.seller_id}`} className="text-primary underline">
                        View conversation
                      </a>
                    </div>

                    {/* Resolution actions */}
                    <div className="border-t pt-4 flex flex-wrap gap-2">
                      <form action={resolveDispute.bind(null, order.id, false, 'Admin reviewed and released payment to seller.')}>
                        <Button size="sm" variant="outline" type="submit">
                          Release to Seller
                        </Button>
                      </form>
                      <form action={resolveDispute.bind(null, order.id, true, 'Admin reviewed and issued refund to buyer.')}>
                        <Button size="sm" variant="destructive" type="submit">
                          Refund Buyer
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-10 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold">No active disputes</h3>
            <p className="text-muted-foreground text-sm mt-1">All disputes have been resolved.</p>
          </div>
        )}
      </section>

      {/* Recently resolved */}
      {(resolvedRecently?.length ?? 0) > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-4">Recently Resolved</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Order', 'Item', 'Buyer', 'Seller', 'Amount', 'Resolution', 'Outcome'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolvedRecently!.map((order: any) => (
                  <tr key={order.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-xs max-w-32 truncate">{order.listing?.title}</td>
                    <td className="px-4 py-3 text-xs">{order.buyer?.display_name ?? order.buyer?.full_name}</td>
                    <td className="px-4 py-3 text-xs">{order.seller?.display_name ?? order.seller?.full_name}</td>
                    <td className="px-4 py-3 text-xs font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3 text-xs max-w-40 truncate text-muted-foreground">{order.resolution}</td>
                    <td className="px-4 py-3">
                      <Badge variant={order.status === 'refunded' ? 'destructive' : 'success'} className="text-xs capitalize">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
