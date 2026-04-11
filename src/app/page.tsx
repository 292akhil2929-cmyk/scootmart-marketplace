import type { Metadata } from 'next'
import { Cursor } from '@/components/cinematic/Cursor'
import { Navbar } from '@/components/cinematic/Navbar'
import { HeroSection } from '@/components/cinematic/HeroSection'
import { CinematicSequence } from '@/components/cinematic/CinematicSequence'
import { Storefront } from '@/components/storefront/Storefront'
import { AudioEngine } from '@/components/cinematic/AudioEngine'
import { ModelCinematicMount } from '@/components/cinematic/ModelCinematic'
import { ZoneObserver } from '@/components/cinematic/ZoneObserver'

export const metadata: Metadata = {
  title: "ScootSphere — UAE's #1 Electric Scooter Marketplace",
  description:
    'Find, compare and buy electric scooters and e-bikes in UAE. 500+ models, verified vendors, real specs, cinematic experience.',
}

export default function Page() {
  return (
    <div className="cinematic-root">
      <Cursor />
      <Navbar />
      <AudioEngine />
      <ZoneObserver />

      {/* ZONE 0 — Flagship hero ad */}
      <HeroSection />

      {/* ZONE 1 — 700vh cinematic scroll (anchor for hero "Learn More") */}
      <div id="cinematic">
        <CinematicSequence />
      </div>

      {/* ZONE 2 — Full storefront */}
      <Storefront />

      {/* Per-model cinematic — portal over everything */}
      <ModelCinematicMount />
    </div>
  )
}
