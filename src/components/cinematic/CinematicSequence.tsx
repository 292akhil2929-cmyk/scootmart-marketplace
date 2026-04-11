'use client'
import { useRef, useState } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { ScooterCanvas } from './ScooterCanvas'
import { ScrollHUD } from './ScrollHUD'
import { PhaseBackground } from './PhaseBackground'

// Phase boundaries  [0, 0.15, 0.40, 0.60, 0.82, 1.0]
function getPhase(p: number): number {
  if (p < 0.15) return 1
  if (p < 0.40) return 2
  if (p < 0.60) return 3
  if (p < 0.82) return 4
  return 5
}

export function CinematicSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Update phase on scroll
  scrollYProgress.on('change', (p) => {
    const newPhase = getPhase(p)
    setPhase(prev => prev !== newPhase ? newPhase : prev)
  })

  return (
    /* 700vh tall scroll container */
    <div ref={containerRef} style={{ height: '700vh' }} aria-label="Cinematic scooter showcase">

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Phase backgrounds */}
        <PhaseBackground scrollYProgress={scrollYProgress} phase={phase} />

        {/* Scooter canvas — the star */}
        <ScooterCanvas scrollYProgress={scrollYProgress} phase={phase} />

        {/* Text / HUD overlays */}
        <ScrollHUD scrollYProgress={scrollYProgress} phase={phase} />

        {/* Phase flash effect at boundaries */}
        {process.env.NODE_ENV !== 'production' && null /* no debug in prod */}

      </div>
    </div>
  )
}
