'use client'
// ═══════════════════════════════════════════════════════════
// ENTRANCE ANIMATIONS — 6 DNA-specific hero openers
// lightning-strike · earth-crack · gold-unfurl
// circuit-assemble · nebula-form · rain-curtain
// ═══════════════════════════════════════════════════════════

import { motion, AnimatePresence } from 'framer-motion'
import type { EntranceKind } from '@/data/scooterDNA'
import { useEffect, useRef, useState } from 'react'

interface Props {
  kind: EntranceKind
  primary: string
  secondary: string
  onComplete?: () => void
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIGHTNING STRIKE (Dualtron — SPEED)
// Thor-level multi-bolt fractal strike with screen shake
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type Seg = [number, number, number, number, number] // x1,y1,x2,y2,width
interface Bolt { segs: Seg[]; age: number; maxAge: number; intensity: number }

function LightningStrike({ primary, secondary, onComplete }: { primary: string; secondary: string; onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boltsRef = useRef<Bolt[]>([])
  const [phase, setPhase] = useState<'build' | 'strike' | 'flash' | 'after' | 'done'>('build')
  const [flashOp, setFlashOp] = useState(0)
  const [shakeTrigger, setShakeTrigger] = useState(0)

  // ── Fractal bolt generator (L-system-ish midpoint displacement) ──
  const genBolt = (x1: number, y1: number, x2: number, y2: number, disp: number, detail: number, width: number, out: Seg[] = [], branch = true): Seg[] => {
    if (detail <= 0) {
      out.push([x1, y1, x2, y2, width])
      return out
    }
    const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp
    const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp * 0.25
    genBolt(x1, y1, mx, my, disp / 2, detail - 1, width, out, branch)
    genBolt(mx, my, x2, y2, disp / 2, detail - 1, width, out, branch)
    // Random branches
    if (branch && detail > 2 && Math.random() < 0.32) {
      const ang = Math.atan2(y2 - my, x2 - mx) + (Math.random() - 0.5) * 1.4
      const len = Math.hypot(x2 - mx, y2 - my) * (0.3 + Math.random() * 0.5)
      const bx = mx + Math.cos(ang) * len
      const by = my + Math.sin(ang) * len
      genBolt(mx, my, bx, by, disp / 2.5, detail - 2, width * 0.55, out, false)
    }
    return out
  }

  // ── Canvas render loop ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    let raf = 0
    const render = () => {
      ctx.clearRect(0, 0, W(), H())

      // Draw each bolt with 3 passes: wide halo → mid glow → white core
      const survivors: Bolt[] = []
      for (const b of boltsRef.current) {
        const fade = Math.max(0, 1 - b.age / b.maxAge)
        if (fade <= 0) continue
        const ease = Math.pow(fade, 1.4)
        ctx.globalCompositeOperation = 'lighter'

        // Halo
        ctx.shadowColor = primary
        ctx.shadowBlur = 40
        ctx.strokeStyle = `rgba(255, 180, 60, ${ease * 0.35 * b.intensity})`
        ctx.lineCap = 'round'
        for (const [x1, y1, x2, y2, w] of b.segs) {
          ctx.lineWidth = w * 6
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        // Mid plasma
        ctx.shadowColor = secondary
        ctx.shadowBlur = 22
        ctx.strokeStyle = `rgba(255, 230, 140, ${ease * 0.8 * b.intensity})`
        for (const [x1, y1, x2, y2, w] of b.segs) {
          ctx.lineWidth = w * 2.2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        // White-hot core
        ctx.shadowBlur = 8
        ctx.strokeStyle = `rgba(255, 255, 255, ${ease * b.intensity})`
        for (const [x1, y1, x2, y2, w] of b.segs) {
          ctx.lineWidth = Math.max(0.8, w * 0.9)
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        b.age++
        survivors.push(b)
      }
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      boltsRef.current = survivors
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [primary, secondary])

  // ── Phase timeline ──
  useEffect(() => {
    const canvas = canvasRef.current

    const spawn = (intensity: number, width: number) => {
      if (!canvas) return
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const startX = W * (0.15 + Math.random() * 0.7)
      const endX = W * (0.25 + Math.random() * 0.5)
      const segs = genBolt(startX, -40, endX, H + 40, Math.min(220, W * 0.18), 8, width)
      boltsRef.current.push({ segs, age: 0, maxAge: 28, intensity })
    }

    // Phase 0 (0 → 450ms): dark buildup
    // Phase 1 (450ms): first precursor bolt
    const t1 = setTimeout(() => {
      setPhase('strike')
      spawn(0.55, 2.5)
    }, 450)
    // Phase 2 (620ms): MAIN strike — triple bolt cluster + white flash + shake
    const t2 = setTimeout(() => {
      setPhase('flash')
      spawn(1.0, 5)
      setTimeout(() => spawn(0.9, 4), 35)
      setTimeout(() => spawn(0.85, 3.5), 75)
      setFlashOp(1)
      setShakeTrigger((n) => n + 1)
    }, 620)
    // Flash decay
    const t3 = setTimeout(() => setFlashOp(0.35), 750)
    const t4 = setTimeout(() => setFlashOp(0), 900)
    // Phase 3 (1000ms): afterglow with faint residual bolt
    const t5 = setTimeout(() => {
      setPhase('after')
      spawn(0.35, 1.8)
    }, 1000)
    // Phase 4: done — reveal hero
    const t6 = setTimeout(() => { setPhase('done'); onComplete?.() }, 1550)

    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout) }

  }, [onComplete])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-40"
      animate={shakeTrigger > 0 ? { x: [0, -14, 16, -10, 8, -5, 0], y: [0, 6, -10, 8, -4, 3, 0] } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      key={`shake-${shakeTrigger}`}
    >
      {/* Dark storm vignette during buildup */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'done' ? 0 : phase === 'build' || phase === 'strike' ? 0.82 : 0.3 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(6,8,20,0.55) 0%, rgba(0,0,5,0.96) 75%)',
        }}
      />

      {/* Pre-flicker charged static */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === 'build' ? [0, 0.15, 0, 0.25, 0, 0.1, 0] : 0,
        }}
        transition={{ duration: 0.45, times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1] }}
        style={{ background: `radial-gradient(ellipse at center top, ${primary}40, transparent 60%)` }}
      />

      {/* Canvas — the actual fractal lightning */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Blinding white flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: flashOp }}
        transition={{ duration: 0.08 }}
      />

      {/* Colored afterglow tint */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${primary}55 0%, ${primary}15 40%, transparent 75%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'after' ? 1 : phase === 'flash' ? 0.6 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Ground-up shockwave ring (subtle, anchors the strike) */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            className="absolute left-1/2 top-[58%] rounded-full"
            style={{
              border: `2px solid ${secondary}`,
              boxShadow: `0 0 80px ${primary}, inset 0 0 40px ${primary}80`,
            }}
            initial={{ width: 10, height: 10, x: '-50%', y: '-50%', opacity: 1 }}
            animate={{ width: 2400, height: 2400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
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
    case 'lightning-strike': return <LightningStrike primary={primary} secondary={secondary} onComplete={onComplete} />
    case 'earth-crack': return <EarthCrack primary={primary} onComplete={onComplete} />
    case 'gold-unfurl': return <GoldUnfurl primary={primary} onComplete={onComplete} />
    case 'circuit-assemble': return <CircuitAssemble primary={primary} onComplete={onComplete} />
    case 'nebula-form': return <NebulaForm primary={primary} onComplete={onComplete} />
    case 'rain-curtain': return <RainCurtain primary={primary} secondary={secondary} onComplete={onComplete} />
    default: return null
  }
}
