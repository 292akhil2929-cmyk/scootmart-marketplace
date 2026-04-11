'use client'
// ═══════════════════════════════════════════════════════════
// ENTRANCE ANIMATIONS — 6 DNA-specific hero openers
// lightning-strike · earth-crack · gold-unfurl
// circuit-assemble · nebula-form · rain-curtain
// ═══════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion'
import type { EntranceKind } from '@/data/scooterDNA'
import { useEffect, useState } from 'react'

interface Props {
  kind: EntranceKind
  primary: string
  secondary: string
  onComplete?: () => void
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIGHTNING STRIKE (Dualtron — SPEED)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function LightningStrike({ primary, onComplete }: { primary: string; onComplete?: () => void }) {
  const [phase, setPhase] = useState<'bolt' | 'flash' | 'shockwave' | 'done'>('bolt')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('flash'), 300)
    const t2 = setTimeout(() => setPhase('shockwave'), 400)
    const t3 = setTimeout(() => { setPhase('done'); onComplete?.() }, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {/* Bolt */}
      <AnimatePresence>
        {phase === 'bolt' && (
          <motion.svg
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.1, 0.7, 1] }}
            viewBox="0 0 1920 1080"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="bolt-glow">
                <feGaussianBlur stdDeviation="12" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d="M -100 -100 L 400 300 L 350 500 L 900 700 L 850 900 L 1920 1180"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              filter="url(#bolt-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.08 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* White flash */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.23, times: [0, 0.13, 0.48, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Shockwave */}
      <AnimatePresence>
        {phase === 'shockwave' && (
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ border: `3px solid ${primary}`, boxShadow: `0 0 60px ${primary}` }}
            initial={{ width: 20, height: 20, x: '-50%', y: '-50%', opacity: 1 }}
            animate={{ width: 2000, height: 2000, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EARTH CRACK (Kaabo — BEAST)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function EarthCrack({ primary, onComplete }: { primary: string; onComplete?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 1400)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 960 1080 L 955 800 L 975 600 L 950 400 L 980 200 L 965 0"
          stroke={primary}
          strokeWidth="6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1] }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 20px ${primary})` }}
        />
      </motion.svg>
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
        style={{ background: `linear-gradient(180deg, transparent, ${primary}, transparent)` }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 0.4], scaleX: [0, 20, 40] }}
        transition={{ duration: 1.4, times: [0, 0.5, 1] }}
      />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GOLD UNFURL (Segway — LUXURY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function GoldUnfurl({ primary, onComplete }: { primary: string; onComplete?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 1100)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${primary}, ${primary}, transparent)`,
          boxShadow: `0 0 40px ${primary}`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{ duration: 1.1, times: [0, 0.55, 0.85, 1] }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${primary}22 0%, transparent 60%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.1 }}
      />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CIRCUIT ASSEMBLE (Xiaomi — ECO)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CircuitAssemble({ primary, onComplete }: { primary: string; onComplete?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 1300)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
        {[
          'M 0 540 L 600 540 L 600 300 L 960 300',
          'M 1920 540 L 1320 540 L 1320 780 L 960 780',
          'M 960 0 L 960 200 L 700 200 L 700 400',
          'M 960 1080 L 960 900 L 1200 900 L 1200 700',
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={primary}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: i * 0.08 }}
            style={{ filter: `drop-shadow(0 0 8px ${primary})` }}
          />
        ))}
        <motion.circle
          cx="960"
          cy="540"
          r="40"
          fill={primary}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.6] }}
          transition={{ delay: 0.9, duration: 0.4 }}
          style={{ filter: `blur(8px)` }}
        />
      </motion.svg>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEBULA FORM (Apollo — PERFORMANCE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function NebulaForm({ primary, onComplete }: { primary: string; onComplete?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 1100)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${primary}aa 0%, ${primary}33 40%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
        initial={{ width: 40, height: 40, x: '-50%', y: '-50%', opacity: 0 }}
        animate={{ width: 800, height: 800, opacity: [0, 1, 0.2] }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAIN CURTAIN / SUNRISE (Ninebot — COMMUTER)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RainCurtain({ primary, secondary, onComplete }: { primary: string; secondary: string; onComplete?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 1200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(0deg, ${primary} 0%, ${secondary} 40%, transparent 100%)` }}
        initial={{ y: '100%', opacity: 0.9 }}
        animate={{ y: '0%', opacity: [0.9, 0.5, 0] }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function Entrance({ kind, primary, secondary, onComplete }: Props) {
  switch (kind) {
    case 'lightning-strike': return <LightningStrike primary={primary} onComplete={onComplete} />
    case 'earth-crack': return <EarthCrack primary={primary} onComplete={onComplete} />
    case 'gold-unfurl': return <GoldUnfurl primary={primary} onComplete={onComplete} />
    case 'circuit-assemble': return <CircuitAssemble primary={primary} onComplete={onComplete} />
    case 'nebula-form': return <NebulaForm primary={primary} onComplete={onComplete} />
    case 'rain-curtain': return <RainCurtain primary={primary} secondary={secondary} onComplete={onComplete} />
    default: return null
  }
}
