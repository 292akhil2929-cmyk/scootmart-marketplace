import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UAE-Tested E-Scooters – Real Performance in Dubai Heat',
  description: 'Every listing here has been tested in UAE conditions: 40°C+ heat, Dubai streets, sand entry points. Real range data, not manufacturer claims.',
}

export default async function UAETestedPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')
    .eq('uae_tested', true)
    .order('view_count', { ascending: false })

  const listings = (data as Listing[]) ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-4 py-1.5 text-sm font-semibold mb-4 dark:bg-orange-900 dark:text-orange-200">
          🌡️ UAE-Tested Program
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Tested in UAE Conditions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every listing in this section has been real-world tested in UAE heat (40°C+). We document actual range, heat performance, sand resistance, and hill climbing ability — not manufacturer claims.
        </p>
      </div>

      {/* What UAE-Tested means */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: '🌡️', title: 'Heat Range', desc: 'Actual range at 40°C+, not lab conditions' },
          { icon: '🏔️', title: 'Hill Climbing', desc: 'Tested on Dubai Marina and JBR ramps' },
          { icon: '🌪️', title: 'Sand Resistance', desc: 'Real-world dust and occasional sand exposure' },
          { icon: '🔋', title: 'Battery Behaviour', desc: 'How battery performs over 6+ months in UAE climate' },
        ].map(b => (
          <div key={b.title} className="rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 p-4">
            <div className="text-2xl mb-2">{b.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
            <p className="text-xs text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Listings */}
      {listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">No UAE-tested listings yet. Check back soon.</div>
      )}
    </div>
  )
}
