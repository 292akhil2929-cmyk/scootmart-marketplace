import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MinimalNav } from '@/components/shop/MinimalNav'
import { SiteFooter } from '@/components/shop/SiteFooter'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { ListingBuyPanel } from '@/components/listings/ListingBuyPanel'
import { Shield, ArrowLeft, BarChart3 } from 'lucide-react'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')

  // Avoid passing a non-UUID string to a UUID column — causes Postgres error
  if (UUID_RE.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`)
  } else {
    query = query.eq('slug', id)
  }

  const { data, error } = await query.single()
  if (error || !data) return null

  supabase.from('listings').update({ view_count: ((data as any).view_count ?? 0) + 1 }).eq('id', data.id)

  return data as Listing
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  let query = supabase.from('listings').select('title,description,images').eq('status', 'active')
  if (UUID_RE.test(id)) {
    query = query.or(`id.eq.${id},slug.eq.${id}`)
  } else {
    query = query.eq('slug', id)
  }
  const { data } = await query.single()
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
  const priceSources: { platform: string; label: string; price: number; url: string }[] =
    ((listing as any).price_sources ?? []).sort((a: any, b: any) => a.price - b.price)

  const affiliateUrl: string | null = (listing as any).affiliate_url ?? null
  const affiliatePlatform: string | null = (listing as any).affiliate_source ?? null
  const isAffiliate: boolean = !!(listing as any).is_affiliate

  const discount = listing.original_price
    ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
    : 0

  const bestPrice = priceSources[0]?.price ?? listing.price

  return (
    <main className="bg-white text-neutral-900 antialiased min-h-screen">
      <MinimalNav />

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* LEFT: image + specs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image gallery with swipe */}
            <ImageGallery
              images={listing.images ?? []}
              alt={listing.title}
              discount={discount > 5 ? discount : undefined}
              rtaCompliant={listing.rta_compliant}
            />

            {/* Title */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{listing.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{listing.title}</h1>
              {listing.description && (
                <p className="text-neutral-500 text-sm mt-3 leading-relaxed">{listing.description}</p>
              )}
            </div>

            {/* Spec grid */}
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
                  {specs.battery_kwh && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Battery</p>
                      <p className="text-lg font-bold">{specs.battery_kwh} kWh</p>
                    </div>
                  )}
                  {specs.max_rider_weight_kg && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Max Rider</p>
                      <p className="text-lg font-bold">{specs.max_rider_weight_kg} kg</p>
                    </div>
                  )}
                  {specs.warranty_months && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Warranty</p>
                      <p className="text-lg font-bold">{specs.warranty_months} mo</p>
                    </div>
                  )}
                  {specs.hill_climb_degrees && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Climb Angle</p>
                      <p className="text-lg font-bold">{specs.hill_climb_degrees}°</p>
                    </div>
                  )}
                  {specs.brake_type && (
                    <div className="rounded-xl border bg-neutral-50 p-3">
                      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">Brakes</p>
                      <p className="text-sm font-bold leading-tight">{specs.brake_type}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compare CTA */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-neutral-900">Compare with other scooters</p>
                <p className="text-xs text-neutral-500">Side-by-side specs &amp; prices</p>
              </div>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-neutral-900 text-white px-4 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5" /> Compare
              </Link>
            </div>
          </div>

          {/* RIGHT: pricing panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-4">
              {/* Price header */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
                  {isAffiliate ? 'Starting from' : 'Listed at'}
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold">AED {bestPrice.toLocaleString()}</span>
                  {listing.original_price && (
                    <span className="text-sm text-neutral-400 line-through">
                      AED {listing.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
                {priceSources.length > 0 && (
                  <p className="text-xs text-neutral-400">Cheapest: {priceSources[0].label}</p>
                )}
              </div>

              {/* Buy panel with safety modal + store tiers */}
              <ListingBuyPanel
                priceSources={priceSources}
                affiliateUrl={affiliateUrl}
                affiliatePlatform={affiliatePlatform}
                listingPrice={listing.price}
                originalPrice={listing.original_price ?? null}
              />

              {/* Trust badges */}
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
                {listing.certified_used && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5">
                    ✓ Certified Used
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
