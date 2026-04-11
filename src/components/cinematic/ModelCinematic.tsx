'use client'
// ═══════════════════════════════════════════════════════════
// MODEL CINEMATIC — Per-scooter 500vh takeover
// 5 scenes: Identity · Speed · Range · Power · Verdict
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SCOOTERS, getAmazonUrl } from '@/data/scooters'
import { getDNA } from '@/data/scooterDNA'
import { scooterFrames } from '@/data/scooterFrames'
import { BgTexture } from './BgTexture'
import { DNAParticleField } from './DNAParticleField'
import { Entrance } from './Entrances'
import { useCinematicStore } from '@/store/cinematicStore'

interface Props {
  scooterId: number
}

export function ModelCinematic({ scooterId }: Props) {
  const closeModel = useCinematicStore((s) => s.closeModel)
  const scooter = SCOOTERS.find((s) => s.id === scooterId)
  const dna = getDNA(scooterId)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Lock body scroll on open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModel])

  // Scene opacity ranges
  const scene1Op = useTransform(scrollYProgress, [0, 0.05, 0.18, 0.22], [0, 1, 1, 0])
  const scene2Op = useTransform(scrollYProgress, [0.20, 0.24, 0.36, 0.40], [0, 1, 1, 0])
  const scene3Op = useTransform(scrollYProgress, [0.38, 0.42, 0.54, 0.58], [0, 1, 1, 0])
  const scene4Op = useTransform(scrollYProgress, [0.56, 0.60, 0.70, 0.74], [0, 1, 1, 0])
  const scene5Op = useTransform(scrollYProgress, [0.72, 0.78, 1.0, 1.0], [0, 1, 1, 1])
  const scooterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7])

  if (!scooter) return null

  const motorW = parseInt(scooter.motor) || 0
  const speedKmh = parseInt(scooter.speed) || 0
  const rangeKm = parseInt(scooter.range) || 0

  return (
    <motion.div
      className="fixed inset-0 z-[8000]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
      style={{ backgroundColor: dna.backgroundColor }}
    >
      {/* Close button */}
      <button
        onClick={closeModel}
        className="fixed top-6 right-6 z-[9000] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110"
        style={{
          background: `${dna.backgroundColor}cc`,
          border: `1.5px solid ${dna.primaryColor}`,
          color: dna.primaryColor,
        }}
        aria-label="Close cinematic"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="relative" style={{ height: '500vh' }}>
          {/* Sticky viewport */}
          <div className="sticky top-0 w-full h-screen overflow-hidden">
            {/* Background texture */}
            <BgTexture kind={dna.bgTexture} color={dna.particleColor} active={true} />
            <DNAParticleField
              kind={dna.particleStyle}
              color={dna.particleColor}
              count={dna.particleCount}
              speed={dna.particleSpeed}
              active={true}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }}
            />

            {/* Entrance */}
            <Entrance kind={dna.heroEntrance} primary={dna.primaryColor} secondary={dna.secondaryColor} />

            {/* ━━━━━━━━━━━━━━━━━━━━━━
                SCENE 1 — IDENTITY
                ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{ opacity: scene1Op }}
            >
              <motion.div
                style={{ scale: scooterScale }}
                className="mb-8"
              >
                <div
                  style={{
                    width: 'min(600px, 70vw)',
                    filter: `drop-shadow(0 0 100px ${dna.glowColor}90)`,
                  }}
                  dangerouslySetInnerHTML={{ __html: scooterFrames[9] ?? scooterFrames[0] }}
                />
              </motion.div>
              <p className="font-barlow font-300 text-xs tracking-[0.4em] uppercase text-white/50 mb-2">
                {scooter.brand}
              </p>
              <h1
                className={`font-barlow font-${dna.fontWeight} text-[clamp(3rem,9vw,7rem)] leading-none tracking-tight text-white text-center mb-3`}
                style={{
                  textShadow: `0 0 80px ${dna.primaryColor}60`,
                  textTransform: dna.headlineCase === 'uppercase' ? 'uppercase' : 'none',
                }}
              >
                {scooter.model}
              </h1>
              <p className="font-barlow font-700 text-lg tracking-wide text-center max-w-2xl" style={{ color: dna.primaryColor }}>
                {dna.entranceTagline}
              </p>
            </motion.div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━
                SCENE 2 — SPEED
                ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{ opacity: scene2Op }}
            >
              <p className="font-barlow font-300 text-xs tracking-[0.4em] uppercase text-white/40 mb-4">
                Top Speed
              </p>
              <h2
                className="font-barlow font-900 text-[clamp(6rem,22vw,20rem)] leading-[0.8] tracking-tight tabular-nums"
                style={{
                  color: dna.specColors.speed,
                  textShadow: `0 0 120px ${dna.specColors.speed}80`,
                }}
              >
                {speedKmh}
              </h2>
              <p className="font-barlow font-700 text-2xl tracking-wider" style={{ color: dna.specColors.speed }}>
                KM/H
              </p>
              <p className="font-dm text-sm text-white/50 mt-6 text-center max-w-md">
                {dna.category === 'SPEED' || dna.category === 'BEAST'
                  ? 'Top recorded speed on Dubai roads.'
                  : 'RTA-compliant. Smooth, safe, sustainable.'}
              </p>
            </motion.div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━
                SCENE 3 — RANGE
                ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{ opacity: scene3Op }}
            >
              <p className="font-barlow font-300 text-xs tracking-[0.4em] uppercase text-white/40 mb-4">
                Range On One Charge
              </p>
              <div className="flex items-baseline">
                <h2
                  className="font-barlow font-900 text-[clamp(6rem,22vw,20rem)] leading-[0.8] tracking-tight tabular-nums"
                  style={{
                    color: dna.specColors.range,
                    textShadow: `0 0 120px ${dna.specColors.range}80`,
                  }}
                >
                  {rangeKm}
                </h2>
                <span className="font-barlow font-700 text-3xl ml-3" style={{ color: dna.specColors.range }}>KM</span>
              </div>
              {/* Route visualization */}
              <svg className="mt-8 w-[min(500px,80vw)]" height="60" viewBox="0 0 500 60">
                <circle cx="20" cy="30" r="6" fill={dna.specColors.range} />
                <motion.path
                  d="M 20 30 Q 150 10 250 30 T 480 30"
                  stroke={dna.specColors.range}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                />
                <circle cx="480" cy="30" r="6" fill={dna.specColors.range} />
                <text x="20" y="55" fill="white" opacity="0.5" fontSize="10" className="font-dm">Dubai Marina</text>
                <text x="420" y="55" fill="white" opacity="0.5" fontSize="10" className="font-dm">Abu Dhabi</text>
              </svg>
            </motion.div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━
                SCENE 4 — POWER
                ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-6"
              style={{ opacity: scene4Op }}
            >
              <p className="font-barlow font-300 text-xs tracking-[0.4em] uppercase text-white/40 mb-4">
                Motor Power
              </p>
              <h2
                className="font-barlow font-900 text-[clamp(5rem,18vw,16rem)] leading-[0.8] tracking-tight tabular-nums"
                style={{
                  color: dna.specColors.motor,
                  textShadow: `0 0 120px ${dna.specColors.motor}80`,
                }}
              >
                {motorW.toLocaleString()}
              </h2>
              <p className="font-barlow font-700 text-2xl tracking-wider" style={{ color: dna.specColors.motor }}>
                WATTS
              </p>
              {/* Orbital rings */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="500" height="500" viewBox="0 0 500 500">
                <motion.circle cx="250" cy="250" r="180" fill="none" stroke={dna.specColors.motor} strokeOpacity="0.15" strokeWidth="1"
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
                <motion.circle cx="250" cy="250" r="230" fill="none" stroke={dna.specColors.motor} strokeOpacity="0.08" strokeWidth="1"
                  animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
              </svg>
            </motion.div>

            {/* ━━━━━━━━━━━━━━━━━━━━━━
                SCENE 5 — VERDICT
                ━━━━━━━━━━━━━━━━━━━━━━ */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-6 py-10 overflow-y-auto"
              style={{ opacity: scene5Op }}
            >
              <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
                {/* Left: scooter + headline */}
                <div className="text-center md:text-left">
                  <div
                    className="mx-auto md:mx-0 mb-4"
                    style={{
                      width: 'min(280px, 60vw)',
                      filter: `drop-shadow(0 0 60px ${dna.glowColor})`,
                    }}
                    dangerouslySetInnerHTML={{ __html: scooterFrames[9] ?? scooterFrames[0] }}
                  />
                  <p className="font-barlow font-300 text-[10px] tracking-[0.4em] uppercase text-white/40">
                    Ready to ride?
                  </p>
                  <h3 className="font-barlow font-900 text-4xl md:text-5xl leading-none tracking-tight text-white mt-1 mb-2">
                    AED {scooter.price.toLocaleString()}
                  </h3>
                </div>

                {/* Right: spec table */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Top Speed', value: scooter.speed, color: dna.specColors.speed, pct: Math.min(100, (speedKmh / 100) * 100) },
                    { label: 'Range', value: scooter.range, color: dna.specColors.range, pct: Math.min(100, (rangeKm / 150) * 100) },
                    { label: 'Motor', value: scooter.motor, color: dna.specColors.motor, pct: Math.min(100, (motorW / 8640) * 100) },
                    { label: 'Weight', value: scooter.weight, color: dna.specColors.weight, pct: Math.min(100, 100 - (parseInt(scooter.weight) / 60) * 100) },
                    { label: 'Battery', value: scooter.battery, color: dna.primaryColor, pct: 75 },
                    { label: 'IP Rating', value: scooter.ip, color: dna.primaryColor, pct: 80 },
                  ].map((row) => (
                    <div key={row.label} className="backdrop-blur-sm rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-barlow font-300 text-[10px] tracking-[0.2em] uppercase text-white/50">{row.label}</span>
                        <span className="font-barlow font-700 text-sm tabular-nums" style={{ color: row.color }}>
                          {row.value}
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full"
                          style={{
                            background: row.color,
                            boxShadow: `0 0 10px ${row.color}`,
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${row.pct}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* CTAs */}
                  <div className="flex gap-2 pt-3">
                    <button
                      className="flex-1 font-barlow font-700 text-[11px] uppercase tracking-widest h-11 rounded-full border text-white/70 transition-all hover:bg-white/10"
                      style={{ borderColor: `${dna.primaryColor}60` }}
                    >
                      + Compare
                    </button>
                    <a
                      href={scooter.amazonAsin ? getAmazonUrl(scooter.amazonAsin) : getAmazonUrl(undefined, scooter.brand + ' ' + scooter.model)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 font-barlow font-700 text-[11px] uppercase tracking-widest h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
                      style={{ background: dna.primaryColor, boxShadow: `0 0 30px ${dna.primaryColor}80` }}
                    >
                      Buy on Amazon.ae →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOUNT WRAPPER — Reads store, animates presence
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function ModelCinematicMount() {
  const openModelId = useCinematicStore((s) => s.openModelId)
  return (
    <AnimatePresence>
      {openModelId !== null && <ModelCinematic key={openModelId} scooterId={openModelId} />}
    </AnimatePresence>
  )
}
