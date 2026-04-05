import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import { VerifiedBadge } from '@/components/shared/VerifiedBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, timeAgo } from '@/lib/utils'
import { MapPin, Star, Package, MessageSquare } from 'lucide-react'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('display_name,full_name,bio').eq('id', id).single()
  if (!data) return {}
  return {
    title: `${data.display_name ?? data.full_name} – Seller on ScootMart.ae`,
    description: data.bio ?? undefined,
  }
}

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: seller } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .in('role', ['seller', 'admin'])
    .single()

  if (!seller) notFound()

  const { data: listings } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('seller_id', id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(12)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviews_reviewer_id_fkey(display_name,full_name)')
    .eq('seller_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: totalSales } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', id)
    .eq('status', 'completed')

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Seller header */}
      <div className="rounded-2xl border bg-card p-6 mb-8">
        <div className="flex gap-5 items-start">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shrink-0 overflow-hidden">
            {seller.avatar_url ? (
              <Image src={seller.avatar_url} alt={seller.display_name ?? ''} width={80} height={80} className="object-cover" />
            ) : (
              (seller.display_name ?? seller.full_name ?? '?')[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold">{seller.display_name ?? seller.full_name}</h1>
              {seller.verified_badge && <VerifiedBadge />}
            </div>
            {seller.location_emirate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5" />{seller.location_emirate}
              </div>
            )}
            {seller.bio && <p className="text-sm text-muted-foreground mb-3 max-w-xl">{seller.bio}</p>}
            <div className="flex flex-wrap gap-4 text-sm">
              {seller.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{seller.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({seller.rating_count} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{totalSales ?? 0} sales completed</span>
              </div>
              <div className="text-muted-foreground">
                Member since {new Date(seller.created_at).toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          <Link href={`/messages?seller=${id}`}>
            <Button variant="outline" className="gap-2 shrink-0">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Active listings */}
          <h2 className="font-semibold text-lg mb-4">Listings ({(listings ?? []).length})</h2>
          {(listings ?? []).length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(listings as Listing[]).map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
              No active listings from this seller.
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Recent Reviews</h2>
          {(reviews ?? []).length > 0 ? (
            <div className="space-y-3">
              {(reviews ?? []).map((review: any) => (
                <div key={review.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                  {review.comment && <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {review.reviewer?.display_name ?? review.reviewer?.full_name ?? 'Verified buyer'} · {timeAgo(review.created_at)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
              No reviews yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
