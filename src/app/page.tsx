import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/seo/JsonLd'
import { MinimalNav } from '@/components/shop/MinimalNav'
import { HeroEcom } from '@/components/shop/HeroEcom'
import { FeatureStrip } from '@/components/shop/FeatureStrip'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { SiteFooter } from '@/components/shop/SiteFooter'
import type { Listing } from '@/types/database'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ScootMart — Compare Electric Scooters & E-Bikes in UAE',
  description:
    'Compare electric scooters from Amazon.ae, Noon, and verified UAE sellers. Real specs, UAE heat range, RTA compliance — all in one place.',
}

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, specs:listing_specs(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(12)

  const listings = (data as Listing[]) ?? []

  return (
    <main className="bg-white text-neutral-900 antialiased">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <MinimalNav />
      <HeroEcom />
      <FeatureStrip />
      <ProductGrid listings={listings} />
      <SiteFooter />
    </main>
  )
}
