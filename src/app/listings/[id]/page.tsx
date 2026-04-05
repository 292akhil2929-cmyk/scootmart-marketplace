import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VerifiedBadge, UAETestedBadge, CertifiedUsedBadge, RTABadge, EscrowBadge } from '@/components/shared/VerifiedBadge'
import { ReviewForm } from '@/components/listings/ReviewForm'
import { formatPrice, timeAgo, getBatteryColor, getScoreLabel } from '@/lib/utils'
import { MapPin, Star, Zap, Battery, Shield, Phone, MessageSquare, Package } from 'lucide-react'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*), inspection:certified_inspections(*), reviews(*)')
    .or(`id.eq.${id},slug.eq.${id}`)
    .eq('status', 'active')
    .single()

  if (data) {
    // Increment view count
    await supabase.from('listings').update({ view_count: (data as Listing).view_count + 1 }).eq('id', data.id)
  }
  return data as Listing | null
}

async function getSimilar(listing: Listing): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')
    .eq('type', listing.type)
    .neq('id', listing.id)
    .limit(4)
  return (data as Listing[]) ?? []
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('listings').select('title,description,images').or(`id.eq.${id},slug.eq.${id}`).single()
  if (!data) return {}
  return {
    title: data.title,
    description: data.description ?? undefined,
    openGraph: { images: data.images?.[0] ? [data.images[0]] : [] },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const similar = await getSimilar(listing)
  const specs = listing.specs
  const inspection = listing.inspection as unknown as typeof listing.inspection extends Array<infer T> ? T : typeof listing.inspection
  const reviews = (listing.reviews as unknown as typeof listing.reviews) ?? []

  // Check if current user can leave a review (completed order, no existing review)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let canReview = false
  if (user) {
    const { data: completedOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('buyer_id', user.id)
      .eq('status', 'completed')
      .single()
    if (completedOrder) {
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('reviewer_id', user.id)
        .single()
      canReview = !existingReview
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-4 aspect-video relative rounded-xl overflow-hidden bg-muted">
              {listing.images?.[0] ? (
                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="100vw" priority />
              ) : (
                <div className="flex items-center justify-center h-full text-5xl">🛴</div>
              )}
            </div>
            {listing.images?.slice(1, 4).map((img, i) => (
              <div key={i} className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                <Image src={img} alt={`${listing.title} ${i + 2}`} fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {listing.uae_tested && <UAETestedBadge />}
            {listing.certified_used && <CertifiedUsedBadge />}
            {listing.rta_compliant && <RTABadge />}
            <EscrowBadge />
          </div>

          {/* Title */}
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{listing.brand} · {listing.condition === 'new' ? 'New' : 'Used'}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{listing.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              {listing.location_emirate && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location_emirate}{listing.location_area ? `, ${listing.location_area}` : ''}</span>}
              <span>{timeAgo(listing.created_at)}</span>
              <span>{listing.view_count} views</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              {listing.certified_used && <TabsTrigger value="inspection">Inspection Report</TabsTrigger>}
              <TabsTrigger value="reviews">Reviews ({(reviews as unknown[]).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-4">
              {specs ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Claimed Range', value: specs.range_km ? `${specs.range_km} km` : null, icon: '📏' },
                    { label: '🌡️ UAE Heat Range', value: specs.range_km_uae_heat ? `${specs.range_km_uae_heat} km` : null, icon: '🔥', highlight: true },
                    { label: 'Top Speed', value: specs.top_speed_kmh ? `${specs.top_speed_kmh} km/h` : null, icon: '⚡' },
                    { label: 'Motor Power', value: specs.motor_watts ? `${specs.motor_watts}W` : null, icon: '🔌' },
                    { label: 'Battery', value: specs.battery_kwh ? `${specs.battery_kwh} kWh` : null, icon: '🔋' },
                    { label: 'Charging Time', value: specs.charging_time_hours ? `${specs.charging_time_hours}h` : null, icon: '⏱️' },
                    { label: 'Weight', value: specs.weight_kg ? `${specs.weight_kg} kg` : null, icon: '⚖️' },
                    { label: 'Max Rider Weight', value: specs.max_rider_weight_kg ? `${specs.max_rider_weight_kg} kg` : null, icon: '👤' },
                    { label: 'Hill Climb', value: specs.hill_climb_degrees ? `${specs.hill_climb_degrees}°` : null, icon: '⛰️' },
                    { label: 'IP Rating', value: specs.ip_rating, icon: '💧' },
                    { label: 'Battery Health', value: specs.battery_health_percent ? `${specs.battery_health_percent}%` : null, icon: '🔋' },
                    { label: 'Warranty', value: specs.warranty_months ? `${specs.warranty_months} months` : null, icon: '🛡️' },
                  ].filter(s => s.value).map(spec => (
                    <div key={spec.label} className={`rounded-lg border p-3 ${spec.highlight ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' : ''}`}>
                      <div className="text-xs text-muted-foreground mb-0.5">{spec.icon} {spec.label}</div>
                      <div className="font-semibold text-sm">{spec.value}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-muted-foreground">No specs available.</p>}

              {specs?.heat_performance_note && (
                <div className="mt-4 rounded-lg bg-orange-50 border border-orange-200 p-4 dark:bg-orange-900/20 dark:border-orange-800">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">🌡️ UAE Heat Performance Note</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">{specs.heat_performance_note}</p>
                </div>
              )}
              {specs?.connectivity && specs.connectivity.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {specs.connectivity.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="description" className="mt-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{listing.description ?? 'No description provided.'}</p>
            </TabsContent>

            {listing.certified_used && (
              <TabsContent value="inspection" className="mt-4">
                {inspection ? (
                  <div className="space-y-4">
                    <div className="rounded-xl border p-4 bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Certified Inspection Report</h3>
                        <Badge variant="success">Score: {(inspection as any).overall_score}/10 – {getScoreLabel((inspection as any).overall_score)}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {[
                          { label: 'Battery Health', value: `${(inspection as any).battery_health_percent}%`, color: getBatteryColor((inspection as any).battery_health_percent) },
                          { label: 'Motor', value: (inspection as any).motor_condition },
                          { label: 'Brakes', value: (inspection as any).brakes_condition },
                          { label: 'Tires', value: (inspection as any).tires_condition },
                          { label: 'Electronics', value: (inspection as any).electronics_ok ? 'OK' : 'Issues' },
                          { label: 'Frame Damage', value: (inspection as any).frame_damage ? 'Yes' : 'None' },
                        ].map(item => (
                          <div key={item.label} className="rounded-lg bg-background border p-2">
                            <div className="text-xs text-muted-foreground">{item.label}</div>
                            <div className={`font-semibold capitalize ${item.color ?? ''}`}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Inspected by <strong>{(inspection as any).mechanic_name}</strong>{(inspection as any).mechanic_shop ? ` at ${(inspection as any).mechanic_shop}` : ''}
                        {(inspection as any).is_platform_partner && <span className="ml-2 text-purple-600 font-medium">✓ ScootMart Partner</span>}
                      </div>
                      {(inspection as any).platform_warranty && (
                        <div className="mt-3 rounded-lg bg-green-100 dark:bg-green-900/30 p-3 text-sm text-green-800 dark:text-green-200">
                          🛡️ <strong>{(inspection as any).warranty_months}-month platform warranty included</strong> — ScootMart backs this listing.
                        </div>
                      )}
                    </div>
                  </div>
                ) : <p className="text-muted-foreground">Inspection report not available.</p>}
              </TabsContent>
            )}

            <TabsContent value="reviews" className="mt-4 space-y-4" id="reviews">
              {canReview && <ReviewForm listingId={listing.id} />}
              {(reviews as any[]).length === 0 && !canReview && (
                <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review after your purchase.</p>
              )}
              {(reviews as any[]).map((review: any) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                    <span className="font-medium text-sm">{review.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  {review.uae_tested_tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {review.uae_tested_tags.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag.replace(/_/g, ' ')}</Badge>)}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Price + Seller + CTA */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="rounded-xl border bg-card p-5 sticky top-20">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold">{formatPrice(listing.price)}</span>
              {listing.original_price && (
                <span className="text-muted-foreground line-through text-sm">{formatPrice(listing.original_price)}</span>
              )}
            </div>
            {listing.condition === 'used' && specs?.battery_health_percent && (
              <div className={`text-sm font-medium mb-3 ${getBatteryColor(specs.battery_health_percent)}`}>
                Battery: {specs.battery_health_percent}% health
              </div>
            )}

            <div className="space-y-2 mb-4">
              <Link href={`/checkout?listing=${listing.id}`}>
                <Button className="w-full" size="lg">Buy Now – Escrow Protected</Button>
              </Link>
              <Link href={listing.seller ? `/messages?listing=${listing.id}&seller=${listing.seller.id}` : '/login'} className="block">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <MessageSquare className="h-4 w-4" /> Message Seller
                </Button>
              </Link>
            </div>

            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-xs text-green-800 dark:text-green-200">
              <div className="font-semibold mb-1">🔒 ScootMart Escrow Protection</div>
              Your payment is held securely. Money is only released to the seller after you confirm receipt.
            </div>

            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div>✓ 7-day inspection window</div>
              <div>✓ Full refund if item doesn't match listing</div>
              <div>✓ Dispute resolution support</div>
            </div>
          </div>

          {/* Seller card */}
          {listing.seller && (
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold mb-3">Seller</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {(listing.seller.display_name ?? listing.seller.full_name ?? '?')[0]}
                </div>
                <div>
                  <div className="font-medium">{listing.seller.display_name ?? listing.seller.full_name}</div>
                  {listing.seller.verified_badge && <VerifiedBadge />}
                </div>
              </div>
              {listing.seller.rating > 0 && (
                <div className="flex items-center gap-1 text-sm mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{listing.seller.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({listing.seller.rating_count} reviews)</span>
                </div>
              )}
              {listing.seller.location_emirate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5" />{listing.seller.location_emirate}
                </div>
              )}
              {listing.seller.bio && <p className="text-xs text-muted-foreground">{listing.seller.bio}</p>}
            </div>
          )}

          {/* Delivery info */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Package className="h-4 w-4" /> Delivery Options</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span>📦</span><span>Seller-arranged delivery (free or negotiated)</span></div>
              <div className="flex items-center gap-2"><span>🚐</span><span>White-glove delivery via Aramex/Fetchr (+AED 150)</span></div>
              <div className="flex items-center gap-2"><span>🏪</span><span>Pickup from seller location</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-5">Similar Listings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map(l => (
              <Link key={l.id} href={`/listings/${l.slug ?? l.id}`} className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-muted">
                  {l.images?.[0] && <Image src={l.images[0]} alt={l.title} fill className="object-cover" sizes="25vw" />}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm line-clamp-1">{l.title}</p>
                  <p className="text-primary font-bold">{formatPrice(l.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
