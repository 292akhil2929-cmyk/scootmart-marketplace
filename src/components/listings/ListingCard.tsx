'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Star, Zap, Battery } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { VerifiedBadge, UAETestedBadge, CertifiedUsedBadge, RTABadge } from '@/components/shared/VerifiedBadge'
import { formatPrice, timeAgo } from '@/lib/utils'
import type { Listing } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  const [wishlisted, setWishlisted] = useState(listing.is_wishlisted ?? false)
  const [toggling, setToggling] = useState(false)
  const discount = listing.original_price
    ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
    : 0

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setToggling(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    if (wishlisted) {
      await supabase.from('wishlists').delete().match({ user_id: user.id, listing_id: listing.id })
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, listing_id: listing.id })
    }
    setWishlisted(!wishlisted)
    setToggling(false)
  }

  const image = listing.images?.[0] ?? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'

  return (
    <Link href={`/listings/${listing.slug ?? listing.id}`}>
      <Card className={cn('group overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5', className)}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={image}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {listing.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary text-white">Featured</Badge>
            </div>
          )}
          {discount > 5 && (
            <div className="absolute top-2 right-10">
              <Badge variant="destructive">-{discount}%</Badge>
            </div>
          )}
          <button
            onClick={toggleWishlist}
            disabled={toggling}
            className={cn('absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-colors',
              wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
            )}
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
          </button>
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {listing.uae_tested && <UAETestedBadge />}
            {listing.certified_used && <CertifiedUsedBadge />}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{listing.brand}</p>
            <div className="flex gap-1">
              {listing.rta_compliant && <RTABadge />}
            </div>
          </div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">{listing.title}</h3>

          {/* Specs chips */}
          {listing.specs && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {listing.specs.range_km_uae_heat && (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 rounded px-1.5 py-0.5 dark:bg-orange-900/30 dark:text-orange-300">
                  <Zap className="h-3 w-3" />{listing.specs.range_km_uae_heat}km UAE heat
                </span>
              )}
              {listing.specs.battery_health_percent && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 rounded px-1.5 py-0.5 dark:bg-green-900/30 dark:text-green-300">
                  <Battery className="h-3 w-3" />{listing.specs.battery_health_percent}% battery
                </span>
              )}
              {listing.specs.top_speed_kmh && (
                <span className="text-xs bg-muted rounded px-1.5 py-0.5">{listing.specs.top_speed_kmh} km/h</span>
              )}
              {listing.specs.ip_rating && (
                <span className="text-xs bg-muted rounded px-1.5 py-0.5">{listing.specs.ip_rating}</span>
              )}
            </div>
          )}

          {/* Seller */}
          {listing.seller && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {(listing.seller.display_name ?? listing.seller.full_name ?? '?')[0]}
              </div>
              <span className="text-xs text-muted-foreground truncate">{listing.seller.display_name ?? listing.seller.full_name}</span>
              {listing.seller.verified_badge && <VerifiedBadge className="text-[10px]" />}
              {listing.seller.rating > 0 && (
                <span className="ml-auto flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{listing.seller.rating.toFixed(1)}
                </span>
              )}
            </div>
          )}

          {/* Price + location */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-lg font-bold">{formatPrice(listing.price)}</div>
              {listing.original_price && (
                <div className="text-xs text-muted-foreground line-through">{formatPrice(listing.original_price)}</div>
              )}
            </div>
            {listing.location_emirate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />{listing.location_emirate}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{timeAgo(listing.created_at)}</p>
        </div>
      </Card>
    </Link>
  )
}
