'use client'
import { useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { motion } from 'framer-motion'
import { DubaiSkyline } from './DubaiSkyline'
import { ParticleField } from './ParticleField'

interface Props {
  scrollYProgress: MotionValue<number>
  phase: number
}

export function PhaseBackground({ scrollYProgress, phase }: Props) {
  // Phase boundary opacities
  const p1Op = useTransform(scrollYProgress, [0, 0.08, 0.13, 0.18], [1, 1, 0.5, 0])
  const p2Op = useTransform(scrollYProgress, [0.12, 0.18, 0.36, 0.43], [0, 1, 1, 0])
  const p3Op = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.63], [0, 1, 1, 0])
  const p4Op = useTransform(scrollYProgress, [0.58, 0.65, 0.78, 0.85], [0, 1, 1, 0])
  const p5Op = useTransform(scrollYProgress, [0.80, 0.87, 1.0, 1.0], [0, 1, 1, 1])

  const isDark = phase >= 4

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">

      {/* PHASE 1 — Warm studio */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: p1Op }}
      >
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(30,50,120,0.25), transparent 70%), #f6f4ef'
        }} />
        {/* Blue radial glow behind scooter */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 600px 500px at 50% 55%, rgba(47,92,255,0.12), transparent 70%)'
        }} />
        {/* Film grain overlay */}
        <div className="absolute inset-0 film-grain" />
      </motion.div>

      {/* PHASE 2 — Dubai golden hour */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: p2Op }}
      >
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #1a0d00 0%, #3d1a05 30%, #7a3810 60%, #c97b3a 100%)'
        }} />
        <DubaiSkyline />
        {/* Warm sidelight on scooter */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 500px 400px at 75% 50%, rgba(255,140,40,0.15), transparent 65%)'
        }} />
      </motion.div>

      {/* PHASE 3 — Clean white dot grid */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: p3Op }}
      >
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(47,92,255,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      </motion.div>

      {/* PHASE 4 — Deep space with particles */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: p4Op }}
      >
        <div className="absolute inset-0" style={{ background: '#0a0a0f' }} />
        <ParticleField active={phase >= 4 && phase < 5} />
      </motion.div>

      {/* PHASE 5 — Film noir spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: p5Op }}
      >
        <div className="absolute inset-0 bg-black" />
        {/* Spotlight cone from above */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 500px 700px at 50% -5%, rgba(255,255,255,0.07), transparent 70%)'
        }} />
        {/* Floor halo */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-64 h-16" style={{
          background: 'radial-gradient(ellipse, rgba(47,92,255,0.4), transparent 70%)',
          filter: 'blur(16px)',
        }} />
        {/* Film grain */}
        <div className="absolute inset-0 film-grain" style={{ opacity: 0.06 }} />
      </motion.div>

      {/* Phase transition flash (subtle shutter effect) */}
    </div>
  )
}
