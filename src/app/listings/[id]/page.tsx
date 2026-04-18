import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MinimalNav } from '@/components/shop/MinimalNav'
import { SiteFooter } from '@/components/shop/SiteFooter'
import { ProductImage } from '@/components/listings/ProductImage'
import { Zap, Gauge, Weight, Battery, Shield, ArrowLeft, ExternalLink, ShoppingCart } from 'lucide-react'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const STORE_COLORS: Record<string, string> = {
  amazon:     'bg-[#FF9900] text-black',
  noon:       'bg-[#FEEE00] text-black',
  sharaf_dg:  'bg-[#E31837] text-white',
  carrefour:  'bg-[#004F9F] text-white',
  xiaomi:     'bg-[#FF6900] text-white',
  jumbo:      'bg-[#003087] text-white',
  virgin:     'bg-[#ED1C24] text-white',
  lulu:       'bg-[#0068B4] text-white',
  microless:  'bg-[#222] text-white',
  other:      'bg-neutral-200 text-neutral-800',
}

async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .or(`id.eq.${id},slug.eq.${id}`)
    .eq('status', 'active')
    .single()

  if (error || !data) return null

  // fire-and-forget view count
  supabase.from('listings').update({ view_count: (data.view_count ?? 0) + 1 }).eq('id', data.id)

  return data as Listing
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('title,description,images')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single()
  if (!data) return {}
  return {
    title: `${data.title} — ScootMart UAE`,
    description: data.description ?? undefined,
    openGraph: { images: data.images?.[0] ? [data.images[0]] : [] },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const specs = listing.specs
  const priceSources: any[] = ((listing as any).price_sources ?? []).sort((a: any, b: any) => a.price - b.price)
  const isAffiliate = (listing as any).is_affiliate
  const discount = listing.original_price
    ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
    : 0

  return (
    <main className="bg-white text-neutral-900 antialiased min-h-screen">
      <MinimalNav />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* Breadcrumb */}
        <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* LEFT: image + specs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
              <ProductImage src={listing.images?.[0]} alt={listing.title} />
              {discount > 5 && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              {listing.rta_compliant && (
                <span className="absolute bottom-3 left-3 text-xs font-semibold bg-green-500 text-white px-2.5 py-1 rounded-full">
                  ✓ RTA Compliant
                </span>
              )}
            </div>

            {/* Extra images */}
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                    <ProductImage src={img} alt={`${listing.title} ${i + 2}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Title + brand */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{listing.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{listing.title}</h1>
              {listing.description && (
                <p className="text-neutral-500 text-sm mt-3 leading-relaxed">{listing.description}</p>
              )}
            </div>

            {/* Key specs grid */}
            {specs && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-3">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.range_km_uae_heat && (
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                      <p className="text-[11px] font-medium text-orange-500 uppercase tracking-wide mb-0.5">UAE Range</p>
                      <p className="text-lg font-bold text-orange-700">{specs.range_km_uae_heat} km</p>
                      <p className="text-[10px] text-orange-400">in 45°C heat</p>
                    </div>
                  )}
                  {specs.range_km && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Claimed Range</p>
                      <p className="text-lg font-bold">{specs.range_km} km</p>
                    </div>
                  )}
                  {specs.top_speed_kmh && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Top Speed</p>
                      <p className="text-lg font-bold">{specs.top_speed_kmh} km/h</p>
                    </div>
                  )}
                  {specs.motor_watts && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Motor</p>
                      <p className="text-lg font-bold">{specs.motor_watts} W</p>
                    </div>
                  )}
                  {specs.weight_kg && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Weight</p>
                      <p className="text-lg font-bold">{specs.weight_kg} kg</p>
                    </div>
                  )}
                  {specs.ip_rating && (
                    <div className="rounded-xl border bg-blue-50 border-blue-100 p-3">
                      <p className="text-[11px] font-medium text-blue-400 uppercase tracking-wide mb-0.5">Water Rating</p>
                      <p className="text-lg font-bold text-blue-700">{specs.ip_rating}</p>
                    </div>
                  )}
                  {specs.charging_time_hours && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Charge Time</p>
                      <p className="text-lg font-bold">{specs.charging_time_hours}h</p>
                    </div>
                  )}
                  {specs.warranty_months && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Warranty</p>
                      <p className="text-lg font-bold">{specs.warranty_months} mo</p>
                    </div>
                  )}
                  {specs.max_rider_weight_kg && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Max Rider</p>
                      <p className="text-lg font-bold">{specs.max_rider_weight_kg} kg</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: price comparison */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              {/* Best price header */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Starting from</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold">
                    AED {(priceSources[0]?.price ?? listing.price).toLocaleString()}
                  </span>
                  {listing.original_price && (
                    <span className="text-sm text-neutral-400 line-through">
                      AED {listing.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                {priceSources.length > 0 && (
                  <p className="text-xs text-neutral-400">Cheapest: {priceSources[0]?.label}</p>
                )}
              </div>

              {/* Price comparison table */}
              {priceSources.length > 0 && (
                <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold">Compare Prices</h2>
                    <span className="text-xs text-neutral-400">{priceSources.length} stores</span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {priceSources.map((src: any, i: number) => (
                      <div
                        key={src.platform}
                        className={`flex items-center justify-between px-5 py-3.5 ${i === 0 ? 'bg-neutral-950' : 'bg-white hover:bg-neutral-50'} transition-colors`}
                      >
                        <div className="flex items-center gap-2.5">
                          {i === 0 && (
                            <span className="text-[10px] font-bold bg-white text-neutral-900 px-1.5 py-0.5 rounded-full shrink-0">
                              BEST
                            </span>
                          )}
                          <span className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-neutral-800'}`}>
                            {src.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-neutral-900'}`}>
                            AED {src.price.toLocaleString()}
                          </span>
                          <a
                            href={src.url ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                              i === 0
                                ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            <ShoppingCart className="w-3 h-3" /> Shop
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-[11px] text-neutral-400 text-center">
                      Prices updated regularly · Affiliate links coming soon
                    </p>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {listing.rta_compliant && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1.5">
                    <Shield className="w-3.5 h-3.5" /> RTA Compliant
                  </span>
                )}
                {listing.uae_tested && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1.5">
                    🌡️ UAE Tested
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
