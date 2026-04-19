import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Listing } from '@/types/database'

export function ProductGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <section id="shop" className="py-20 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <div className="text-5xl mb-4">🛴</div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No listings yet</h2>
          <p className="text-neutral-500 text-sm">Listings will appear here once added.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="shop" className="py-16 md:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-neutral-900">
            {listings.length} scooter{listings.length !== 1 ? 's' : ''} available
          </h2>
          <Link
            href="/browse"
            className="text-sm font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {listings.map(l => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        <div className="mt-10 text-center">
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
