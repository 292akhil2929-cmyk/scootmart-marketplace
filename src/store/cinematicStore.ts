'use client'
// ═══════════════════════════════════════════════════════════
// CINEMATIC STORE — Zustand
// Global state for active DNA, compare cart, audio toggle,
// active model cinematic, zone awareness
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand'
import { getDNA, NEUTRAL_DNA, type ScooterDNA } from '@/data/scooterDNA'

interface CinematicState {
  // Active DNA — drives cursor, navbar, hero, particles
  activeDNA: ScooterDNA
  activeZone: 'hero' | 'cinematic' | 'storefront' | 'model'
  setActiveDNA: (id: number) => void
  setActiveZone: (z: CinematicState['activeZone']) => void

  // Compare cart
  compareIds: number[]
  toggleCompare: (id: number) => void
  clearCompare: () => void

  // Audio
  audioEnabled: boolean
  setAudioEnabled: (v: boolean) => void
  toggleAudio: () => void

  // Active per-model cinematic (null = closed)
  openModelId: number | null
  openModel: (id: number) => void
  closeModel: () => void
}

export const useCinematicStore = create<CinematicState>((set) => ({
  activeDNA: NEUTRAL_DNA,
  activeZone: 'hero',
  setActiveDNA: (id) => set({ activeDNA: getDNA(id) }),
  setActiveZone: (z) => set({ activeZone: z }),

  compareIds: [],
  toggleCompare: (id) =>
    set((s) => ({
      compareIds: s.compareIds.includes(id)
        ? s.compareIds.filter((x) => x !== id)
        : s.compareIds.length < 3
        ? [...s.compareIds, id]
        : s.compareIds,
    })),
  clearCompare: () => set({ compareIds: [] }),

  audioEnabled: false, // OFF by default (mobile-first, autoplay policy)
  setAudioEnabled: (v) => set({ audioEnabled: v }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  openModelId: null,
  openModel: (id) => set({ openModelId: id, activeDNA: getDNA(id), activeZone: 'model' }),
  closeModel: () => set({ openModelId: null, activeZone: 'storefront' }),
}))
