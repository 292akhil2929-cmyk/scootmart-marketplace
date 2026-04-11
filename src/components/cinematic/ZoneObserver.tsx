'use client'
// ═══════════════════════════════════════════════════════════
// ZONE OBSERVER — Updates activeZone + DNA based on scroll
// ═══════════════════════════════════════════════════════════

import { useEffect } from 'react'
import { useCinematicStore } from '@/store/cinematicStore'
import { NEUTRAL_DNA } from '@/data/scooterDNA'
import { FEATURED_HERO_ID } from '@/data/featuredHero'

export function ZoneObserver() {
  const setActiveZone = useCinematicStore((s) => s.setActiveZone)
  const setActiveDNA = useCinematicStore((s) => s.setActiveDNA)
  const openModelId = useCinematicStore((s) => s.openModelId)

  useEffect(() => {
    if (openModelId !== null) return // model cinematic manages its own state

    const onScroll = () => {
      const y = window.scrollY
      const h = window.innerHeight

      if (y < h * 0.9) {
        // Zone 0 — hero (DNA = featured)
        setActiveZone('hero')
        setActiveDNA(FEATURED_HERO_ID)
      } else if (y < h * 8) {
        // Zone 1 — cinematic (neutral DNA)
        setActiveZone('cinematic')
        // Use neutral ScootSphere DNA during main cinematic
        if (useCinematicStore.getState().activeDNA.id !== NEUTRAL_DNA.id) {
          useCinematicStore.setState({ activeDNA: NEUTRAL_DNA })
        }
      } else {
        setActiveZone('storefront')
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setActiveZone, setActiveDNA, openModelId])

  return null
}
