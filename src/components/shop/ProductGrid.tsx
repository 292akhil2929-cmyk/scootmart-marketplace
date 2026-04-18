import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Battery, Gauge, Zap, ExternalLink } from 'lucide-react'
import type { Listing } from '@/types/database'

const PLATFORM_LABELS: Record<string, { label: string; color: string }> = {
  amazon:     { label: 'Amazon.ae',       color: '#FF9900' },
  noon:       { label: 'Noon',            color: '#FEEE00' },
  xiaomi:     { label: 'Xiaomi Store',    color: '#FF6900' },
  carrefour:  { label: 'Carrefour',       color: '#004F9F' },
  sharaf_dg:  { label: 'Sharaf DG',       color: '#E31837' },
  other:      { label: 'Retailer',        color: '#6b7280' },
}

function PlatformBadge({ source }: { source?: string }) {
  const p = source ? (PLATFORM_LABELS[source] ?? PLATFORM_LABELS.other) : null
  if (!p) return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">UAE Seller</span>
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
      <ExternalLink className="w-3 h-3" />
      {p.label}
    </span>
  )
}

function ListingRow({ listing }: { listing: Listing }) {
  const isAffiliate = (listing as any).is_affiliate
  const affiliateSource = (listing as any).affiliate_source
  const image = listing.images?.[0]
  const discount = listing.original_price
    ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
    : 0

  return (
    <Link
      href={`/listings/${listing.slug ?? listing.id}`}
      className="group flex gap-4 p-4 rounded-2xl border border-neutral-100 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-200"
    >
      {/* Image */}
      <div className="relative w-28 h-20 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
        {image ? (
          <Image src={image} alt={listing.title} fill className="object-cover" sizes="112px" />
        ) : (
          <div className="flex items-center justify-center h-full text-3xl">🛴</div>
        )}
        {discount > 5 && (
          <span className="absolute top-1 left-1 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">{listing.brand}</p>
            <h3 className="font-semibold text-sm text-neutral-900 leading-tight truncate">{listing.title}</h3>
          </div>
          <PlatformBadge source={isAffiliate ? affiliateSource : undefined} />
        </div>

        {/* Spec pills */}
        {listing.specs && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {listing.specs.range_km_uae_heat && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-orange-50 text-orange-700 rounded-full px-2 py-0.5">
                <Zap className="w-3 h-3" />{listing.specs.range_km_uae_heat}km UAE range
              </span>
            )}
            {listing.specs.top_speed_kmh && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">
                <Gauge className="w-3 h-3" />{listing.specs.top_speed_kmh} km/h
              </span>
            )}
            {listing.specs.ip_rating && (
              <span className="text-[11px] bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{listing.specs.ip_rating}</span>
            )}
            {listing.rta_compliant && (
              <span className="text-[11px] bg-green-50 text-green-700 rounded-full px-2 py-0.5">✓ RTA</span>
            )}
          </div>
        )}
      </div>

      {/* Price + CTA */}
      <div className="shrink-0 text-right flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold text-neutral-900">AED {listing.price.toLocaleString()}</p>
          {listing.original_price && (
            <p className="text-xs text-neutral-400 line-through">AED {listing.original_price.toLocaleString()}</p>
          )}
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 group-hover:gap-2 transition-all">
          {isAffiliate ? 'Buy now' : 'View'}
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <section id="shop" className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <div className="text-5xl mb-4">🛴</div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No listings yet</h2>
          <p className="text-neutral-500 text-sm">Add your first scooter from the admin panel to get started.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="shop" className="py-16 md:py-20 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-900">{listings.length} scooter{listings.length !== 1 ? 's' : ''} available</h2>
          <Link href="/browse" className="text-sm font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {listings.map(l => <ListingRow key={l.id} listing={l} />)}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full border-2 border-neutral-900 text-neutral-900 text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Browse all listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
