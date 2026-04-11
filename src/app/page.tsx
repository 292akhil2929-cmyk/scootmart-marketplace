import type { Metadata } from 'next'
import { CinematicSequence } from '@/components/cinematic/CinematicSequence'
import { Storefront } from '@/components/storefront/Storefront'
import { Cursor } from '@/components/cinematic/Cursor'
import { Navbar } from '@/components/cinematic/Navbar'

export const metadata: Metadata = {
  title: 'ScootMart.ae — UAE\'s #1 Electric Scooter & E-Bike Marketplace',
  description: 'Find, compare and buy electric scooters and e-bikes in UAE. 500+ models, verified vendors, real specs, direct purchase or seller links.',
}

export default function Page() {
  return (
    <div className="cinematic-root">
      <Cursor />
      <Navbar />
      {/* ZONE 1 — Cinematic 700vh scroll experience */}
      <CinematicSequence />
      {/* ZONE 2 — Full storefront */}
      <Storefront />
    </div>
  )
}
