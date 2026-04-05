import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { TrustBadges } from '@/components/home/TrustBadges'
import { ListingCard } from '@/components/listings/ListingCard'
import { Button } from '@/components/ui/button'
import type { Listing } from '@/types/database'

async function getFeaturedListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data as Listing[]) ?? []
}

async function getUAETestedListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')
    .eq('uae_tested', true)
    .order('view_count', { ascending: false })
    .limit(4)
  return (data as Listing[]) ?? []
}

async function getStats() {
  const supabase = await createClient()
  const [{ count: listings }, { count: sellers }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
  ])
  return { listings: listings ?? 0, sellers: sellers ?? 0 }
}

export default async function HomePage() {
  const [featured, uaeTested, stats] = await Promise.all([
    getFeaturedListings(),
    getUAETestedListings(),
    getStats(),
  ])

  return (
    <div>
      <Hero />

      {/* Stats bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm font-medium">
          <span>🛵 {stats.listings}+ Active Listings</span>
          <span>✓ {stats.sellers}+ Verified Sellers</span>
          <span>🌡️ UAE-Tested Performance Data</span>
          <span>🔒 100% Escrow Protected</span>
        </div>
      </div>

      {/* UAE-Tested section */}
      {uaeTested.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-semibold mb-2 dark:bg-orange-900 dark:text-orange-200">
                  🌡️ UAE-Tested
                </div>
                <h2 className="text-2xl font-bold">Tested in UAE Conditions</h2>
                <p className="text-muted-foreground mt-1">Real-world performance data at 40°C+ Dubai heat</p>
              </div>
              <Link href="/uae-tested"><Button variant="outline">See all UAE-Tested</Button></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {uaeTested.map(listing => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          </div>
        </section>
      )}

      <TrustBadges />

      {/* Featured listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Listings</h2>
              <p className="text-muted-foreground mt-1">Top-rated scooters and e-bikes in the UAE</p>
            </div>
            <Link href="/browse"><Button variant="outline">Browse all</Button></Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map(listing => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No listings yet — be the first to list!</p>
              <Link href="/register?role=seller"><Button className="mt-4">Start Selling</Button></Link>
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Scooter or E-Bike to Sell?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">List in minutes. Access thousands of serious UAE buyers. 8–12% commission only on successful sales. Full escrow protection for both parties.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register?role=seller"><Button size="xl" className="bg-white text-primary hover:bg-white/90">Start Selling</Button></Link>
            <Link href="/browse"><Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">Browse Listings</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
