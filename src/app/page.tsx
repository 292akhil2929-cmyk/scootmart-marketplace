import type { Metadata } from 'next'
import { MinimalNav } from '@/components/shop/MinimalNav'
import { HeroEcom } from '@/components/shop/HeroEcom'
import { FeatureStrip } from '@/components/shop/FeatureStrip'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { NewsletterBand } from '@/components/shop/NewsletterBand'
import { SiteFooter } from '@/components/shop/SiteFooter'

export const metadata: Metadata = {
  title: 'Scootmart — Electric Scooters & E-Bikes for the UAE',
  description:
    'Shop verified electric scooters and e-bikes in the UAE. Real specs, transparent pricing, free delivery, 2-year warranty.',
}

export default function Page() {
  return (
    <main className="shop-root bg-white text-neutral-900 antialiased">
      <MinimalNav />
      <HeroEcom />
      <FeatureStrip />
      <ProductGrid />
      <NewsletterBand />
      <SiteFooter />
    </main>
  )
}
