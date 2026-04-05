import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchFilters } from '@/components/listings/SearchFilters'
import { SaveSearchButton } from '@/components/listings/SaveSearchButton'
import type { Listing, SearchFilters as Filters } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Browse E-Scooters & E-Bikes – UAE Marketplace' }

async function getListings(searchParams: Record<string, string>): Promise<{ listings: Listing[]; total: number }> {
  const supabase = await createClient()
  const page = Number(searchParams.page ?? 1)
  const limit = 24
  const offset = (page - 1) * limit

  let query = supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)', { count: 'exact' })
    .eq('status', 'active')

  if (searchParams.q) {
    query = query.textSearch('title', searchParams.q, { type: 'websearch' })
  }
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.condition) query = query.eq('condition', searchParams.condition)
  if (searchParams.brand) query = query.eq('brand', searchParams.brand)
  if (searchParams.emirate) query = query.eq('location_emirate', searchParams.emirate)
  if (searchParams.min_price) query = query.gte('price', searchParams.min_price)
  if (searchParams.max_price) query = query.lte('price', searchParams.max_price)
  if (searchParams.certified_used === 'true') query = query.eq('certified_used', true)
  if (searchParams.rta_compliant === 'true') query = query.eq('rta_compliant', true)
  if (searchParams.uae_tested === 'true') query = query.eq('uae_tested', true)

  const sort = searchParams.sort ?? 'newest'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'popular') query = query.order('view_count', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(offset, offset + limit - 1)

  const { data, count } = await query
  return { listings: (data as Listing[]) ?? [], total: count ?? 0 }
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const { listings, total } = await getListings(params)
  const query = params.q

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {query ? `Results for "${query}"` : 'Browse Electric Scooters & E-Bikes'}
            </h1>
            <p className="text-muted-foreground text-sm">{total} listings found in UAE</p>
          </div>
          <Suspense>
            <SaveSearchButton />
          </Suspense>
        </div>
      </div>

      <div className="mb-6">
        <Suspense>
          <SearchFilters />
        </Suspense>
      </div>

      {listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🛴</div>
          <h3 className="text-lg font-semibold mb-2">No listings found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}
