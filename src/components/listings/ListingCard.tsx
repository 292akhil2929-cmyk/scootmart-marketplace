import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Zap, Gauge, ExternalLink, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Listing } from '@/types/database'

const PLATFORM_LABELS: Record<string, string> = {
  amazon:    'Amazon.ae',
  noon:      'Noon',
  xiaomi:    'Xiaomi Store',
  carrefour: 'Carrefour',
  sharaf_dg: 'Sharaf DG',
  other:     'Retailer',
}

export function ListingCard({ listing }: { listing: Listing }) {
  const isAffiliate = (listing as any).is_affiliate
  const source = (listing as any).affiliate_source
  const platform = isAffiliate ? (PLATFORM_LABELS[source] ?? 'Retailer') : null
  const image = listing.images?.[0]
  const discount = listing.original_price
    ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
    : 0

  return (
    <Link
      href={`/listings/${listing.slug ?? listing.id}`}
      className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {image ? (
          <Image src={image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">🛴</div>
        )}

        {/* Platform badge */}
        <div className="absolute top-2 left-2">
          {platform ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white shadow-sm border border-neutral-100">
              <ExternalLink className="w-3 h-3" />{platform}
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white shadow-sm border border-neutral-100 text-neutral-700">
              UAE Seller
            </span>
          )}
        </div>

        {/* Discount */}
        {discount > 5 && (
          <span className="absolute top-2 right-2 text-[11px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* RTA badge */}
        {listing.rta_compliant && (
          <span className="absolute bottom-2 left-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-green-500 text-white">
            ✓ RTA
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-0.5">{listing.brand}</p>
        <h3 className="font-semibold text-sm text-neutral-900 leading-tight line-clamp-2 mb-3">{listing.title}</h3>

        {/* Key specs */}
        {listing.specs && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {listing.specs.range_km_uae_heat && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-orange-50 text-orange-700 rounded-full px-2 py-0.5">
                <Zap className="w-3 h-3" />{listing.specs.range_km_uae_heat}km UAE
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
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-neutral-900">{formatPrice(listing.price)}</p>
            {listing.original_price && (
              <p className="text-xs text-neutral-400 line-through">{formatPrice(listing.original_price)}</p>
            )}
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 group-hover:gap-2 transition-all">
            {isAffiliate ? 'Buy' : 'View'}
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Location for P2P */}
        {!isAffiliate && listing.location_emirate && (
          <div className="flex items-center gap-1 text-xs text-neutral-400 mt-2">
            <MapPin className="w-3 h-3" />{listing.location_emirate}
          </div>
        )}
      </div>
    </Link>
  )
}
