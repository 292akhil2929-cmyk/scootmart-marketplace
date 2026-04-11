'use client'
// ═══════════════════════════════════════════════════════════
// HERO SECTION — ZONE 0 FLAGSHIP AD
// CMS-swappable via /public/config/hero.json or FEATURED_HERO_ID
// Full-bleed 100vh takeover with DNA entrance, bgTexture, particles, sound
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FEATURED_HERO_ID, loadHeroConfig, type HeroConfig } from '@/data/featuredHero'
import { getDNA } from '@/data/scooterDNA'
import { SCOOTERS, getAmazonUrl } from '@/data/scooters'
import { BgTexture } from './BgTexture'
import { DNAParticleField } from './DNAParticleField'
import { Entrance } from './Entrances'
import { HeroScooterArt } from './HeroScooterArt'
import { useCinematicStore } from '@/store/cinematicStore'
import { ArrowDown } from 'lucide-react'

function CountUp({ to, suffix = '', duration = 600, start }: { to: number; suffix?: string; duration?: number; start: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) return
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration, start])
  return <span className="tabular-nums">{n.toLocaleString()}{suffix}</span>
}

export function HeroSection() {
  const setActiveDNA = useCinematicStore((s) => s.setActiveDNA)
  const setActiveZone = useCinematicStore((s) => s.setActiveZone)
  const [config, setConfig] = useState<HeroConfig>({ scooterId: FEATURED_HERO_ID, campaignLabel: 'FEATURED' })
  const [entranceDone, setEntranceDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  const scooter = SCOOTERS.find((s) => s.id === config.scooterId) ?? SCOOTERS[SCOOTERS.length - 1]
  const dna = getDNA(config.scooterId)

  useEffect(() => {
    setMounted(true)
    loadHeroConfig().then(setConfig)
  }, [])

  useEffect(() => {
    setActiveDNA(config.scooterId)
  }, [config.scooterId, setActiveDNA])

  // Zone detection (parallax fade out)
  useEffect(() => {
    const onScroll = () => {
      if (!rootRef.current) return
      const rect = rootRef.current.getBoundingClientRect()
      const inView = rect.bottom > 100
      if (inView) setActiveZone('hero')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setActiveZone])

  // Extract numeric values from spec strings
  const motorW = parseInt(scooter.motor) || 0
  const speedKmh = parseInt(scooter.speed) || 0
  const rangeKm = parseInt(scooter.range) || 0

  return (
    <section
      ref={rootRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: dna.backgroundColor }}
      aria-label={`Featured scooter: ${scooter.brand} ${scooter.model}`}
    >
      {/* Background texture */}
      <div className="absolute inset-0">
        <BgTexture kind={dna.bgTexture} color={dna.particleColor} active={mounted} />
      </div>

      {/* DNA particle field */}
      <div className="absolute inset-0">
        <DNAParticleField
          kind={dna.particleStyle}
          color={dna.particleColor}
          count={dna.particleCount}
          speed={dna.particleSpeed}
          active={mounted}
        />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }}
      />

      {/* Entrance animation overlay */}
      {mounted && !entranceDone && (
        <Entrance
          kind={dna.heroEntrance}
          primary={dna.primaryColor}
          secondary={dna.secondaryColor}
          onComplete={() => setEntranceDone(true)}
        />
      )}

      {/* Content grid */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top row: FEATURED label + campaign tag */}
        <div className="pt-20 md:pt-24 px-6 md:px-12 flex items-center gap-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="font-barlow font-700 text-xs tracking-[0.35em] uppercase text-white/70"
          >
            {config.campaignLabel ?? 'FEATURED'}
          </motion.span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="flex-1 h-px origin-left"
            style={{ background: `linear-gradient(90deg, ${dna.primaryColor}, transparent)` }}
          />
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.95, duration: 0.6 }}
            className="font-barlow font-700 text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded-full border"
            style={{ borderColor: `${dna.primaryColor}60`, color: dna.primaryColor }}
          >
            {dna.category}
          </motion.span>
        </div>

        {/* Center: scooter glyph */}
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.08, 1], opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, times: [0, 0.7, 1], ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              animate={{ y: entranceDone ? [0, -6, 0] : 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <HeroScooterArt
                primary={dna.primaryColor}
                secondary={dna.secondaryColor}
                glow={dna.glowColor}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom row: brand + specs + tagline + CTAs */}
        <div className="px-6 md:px-12 pb-8 md:pb-12 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-end">
          {/* Brand name */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="font-barlow font-300 text-xs tracking-[0.4em] uppercase text-white/40 mb-1"
            >
              {scooter.brand}
            </motion.p>
            <div className="overflow-hidden">
              {scooter.model.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: -120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.025, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className="inline-block font-barlow font-900 text-[clamp(3rem,7vw,6rem)] leading-[0.85] tracking-tight text-white"
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="h-[3px] w-24 origin-left mt-3"
              style={{ background: dna.primaryColor, boxShadow: `0 0 20px ${dna.primaryColor}` }}
            />
          </div>

          {/* Tagline */}
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: entranceDone ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className={`font-barlow font-${dna.fontWeight} text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight tracking-tight text-white mb-2`}
              style={{ textTransform: dna.headlineCase === 'uppercase' ? 'uppercase' : 'none' }}
            >
              {dna.entranceTagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: entranceDone ? 0.6 : 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-dm text-sm text-white"
            >
              {dna.entranceSubline}
            </motion.p>
          </div>

          {/* Spec values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: entranceDone ? 1 : 0, x: entranceDone ? 0 : 30 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="space-y-2 min-w-[200px]"
          >
            {[
              { label: 'Motor', n: motorW, suf: 'W', color: dna.specColors.motor },
              { label: 'Speed', n: speedKmh, suf: ' km/h', color: dna.specColors.speed },
              { label: 'Range', n: rangeKm, suf: ' km', color: dna.specColors.range },
              { label: 'Price', n: scooter.price, suf: '', color: dna.primaryColor, prefix: 'AED ' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-baseline gap-3">
                <span className="font-barlow font-300 text-[10px] tracking-[0.3em] uppercase text-white/40 w-14">
                  {s.label}
                </span>
                <span
                  className="font-barlow font-800 text-xl md:text-2xl leading-none tabular-nums"
                  style={{ color: s.color, textShadow: `0 0 20px ${s.color}40` }}
                >
                  {s.prefix}<CountUp to={s.n} suffix={s.suf} start={entranceDone} duration={500 + i * 100} />
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTAs + scroll hint */}
        <div className="px-6 md:px-12 pb-10 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: entranceDone ? 1 : 0, y: entranceDone ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-3"
          >
            <a
              href={scooter.amazonAsin ? getAmazonUrl(scooter.amazonAsin) : '#storefront'}
              target={scooter.amazonAsin ? '_blank' : undefined}
              rel={scooter.amazonAsin ? 'noopener noreferrer' : undefined}
              className="font-barlow font-700 text-sm uppercase tracking-[0.2em] h-12 px-7 rounded-full flex items-center text-white transition-all hover:scale-105"
              style={{
                background: dna.primaryColor,
                boxShadow: `0 0 40px ${dna.primaryColor}60`,
              }}
            >
              Configure Yours
            </a>
            <a
              href="#cinematic"
              className="font-barlow font-700 text-sm uppercase tracking-[0.2em] h-12 px-7 rounded-full flex items-center gap-2 border text-white transition-all hover:bg-white/10"
              style={{ borderColor: `${dna.primaryColor}80` }}
            >
              Learn More <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entranceDone ? 0.4 : 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="hidden md:flex items-center gap-2"
          >
            <div className="w-[1px] h-10 bg-white/30 animate-pulse" />
            <span className="font-barlow font-300 text-[10px] tracking-[0.3em] uppercase text-white/50">
              Scroll for more
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
