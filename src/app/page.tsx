import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/home/Hero'
import { CategorySection } from '@/components/home/CategorySection'
import { VideoReveal } from '@/components/home/VideoReveal'
import { SmartSearch } from '@/components/home/SmartSearch'
import { ComparisonTeaser } from '@/components/home/ComparisonTeaser'
import { BrandsMarquee } from '@/components/home/BrandsMarquee'
import { AffiliateProducts } from '@/components/home/AffiliateProducts'
import { UAESection } from '@/components/home/UAESection'
import { ListingCard } from '@/components/listings/ListingCard'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScootMart.ae — UAE\'s #1 Electric Scooter & E-Bike Marketplace',
  description: 'Find, compare and buy electric scooters and e-bikes in UAE. 500+ models, verified vendors, real specs, direct purchase or seller links.',
}

async function getFeaturedListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles(*), specs:listing_specs(*)')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(8)
  return (data as Listing[]) ?? []
}

async function getStats() {
  try {
    const supabase = await createClient()
    const [{ count: listings }, { count: sellers }] = await Promise.all([
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    ])
    return { listings: listings ?? 0, sellers: sellers ?? 0 }
  } catch {
    return { listings: 0, sellers: 0 }
  }
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    getFeaturedListings(),
    getStats(),
  ])

  return (
    <div className="homepage-root">
      {/* 1. HERO — Apple/BMW full-screen with scroll parallax */}
      <Hero />

      {/* 2. STATS BAR */}
      <div className="bg-[#1d1d1f] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 text-sm">
          <span className="text-white/50">⚡ <span className="text-white font-semibold">{stats.listings > 0 ? `${stats.listings}+` : '500+'}</span> Active Listings</span>
          <span className="text-white/50">✓ <span className="text-white font-semibold">{stats.sellers > 0 ? `${stats.sellers}+` : '50+'}</span> Verified Vendors</span>
          <span className="text-white/50">🌡️ <span className="text-white font-semibold">UAE-Tested</span> Performance Data</span>
          <span className="text-white/50">🔒 <span className="text-white font-semibold">100%</span> Escrow Protected</span>
        </div>
      </div>

      {/* 3. CATEGORY CARDS — Apple product lineup style */}
      <CategorySection />

      {/* 4. BMW SCROLL VIDEO REVEAL */}
      <VideoReveal />

      {/* 5. SMART SEARCH — Skyscanner-inspired */}
      <SmartSearch />

      {/* 6. FEATURED LISTINGS */}
      {featured.length > 0 && (
        <section className="bg-white py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Live Listings</p>
                <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[#1d1d1f] leading-tight tracking-[-0.02em]">
                  Top Picks Right Now
                </h2>
              </div>
              <Link
                href="/browse"
                className="text-sm font-semibold text-[#0071e3] hover:underline hidden md:block"
              >
                View all listings →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="text-center mt-10 md:hidden">
              <Link href="/browse" className="text-sm font-semibold text-[#0071e3] hover:underline">
                View all listings →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. COMPARISON TEASER — Dark section */}
      <ComparisonTeaser />

      {/* 8. BRANDS MARQUEE */}
      <BrandsMarquee />

      {/* 9. AMAZON AFFILIATE PRODUCTS */}
      <AffiliateProducts />

      {/* 10. UAE-SPECIFIC TRUST SECTION */}
      <UAESection />

      {/* 11. SELL CTA — Apple-style dark banner */}
      <section className="bg-[#1d1d1f] py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-4">For Vendors & Sellers</p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-tight tracking-[-0.03em] mb-6">
            Sell Your Scooter.
            <br />
            <span className="text-white/30">Reach UAE Buyers.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            List in minutes. Zero upfront cost. Only pay a small commission on successful sales.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register?role=seller"
              className="bg-white text-[#1d1d1f] font-bold px-10 py-4 rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.02] shadow-xl text-base"
            >
              Start Selling Free
            </Link>
            <Link
              href="/vendor"
              className="border border-white/20 text-white font-semibold px-10 py-4 rounded-2xl hover:bg-white/5 transition-all text-base"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
