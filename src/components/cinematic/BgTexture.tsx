'use client'
// ═══════════════════════════════════════════════════════════
// BG TEXTURE — 7 background textures (canvas / CSS / SVG)
// lightning-storm · circuit-grid · carbon-fiber · marble
// sand-dunes · deep-space · rain-slick
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import type { BgTextureKind } from '@/data/scooterDNA'

interface Props {
  kind: BgTextureKind
  color: string
  active?: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIGHTNING STORM (canvas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function LightningStorm({ color, active }: { color: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const bolts: Array<{ x: number; y: number; pts: Array<{ x: number; y: number }>; life: number }> = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => {
      const x = Math.random() * canvas.offsetWidth
      const pts: Array<{ x: number; y: number }> = [{ x, y: 0 }]
      let cy = 0
      let cx = x
      while (cy < canvas.offsetHeight) {
        cy += 15 + Math.random() * 25
        cx += (Math.random() - 0.5) * 40
        pts.push({ x: cx, y: cy })
      }
      bolts.push({ x, y: 0, pts, life: 8 })
    }

    let last = 0
    const draw = (t: number) => {
      if (!active) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      if (t - last > 400 + Math.random() * 800) {
        spawn()
        last = t
      }

      bolts.forEach((b, i) => {
        ctx.beginPath()
        ctx.moveTo(b.pts[0].x, b.pts[0].y)
        b.pts.forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.shadowColor = color
        ctx.shadowBlur = 15
        ctx.globalAlpha = b.life / 8
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        b.life -= 1
        if (b.life <= 0) bolts.splice(i, 1)
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [color, active])

  return (
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, #0a0005 0%, #150010 50%, #0a0005 100%)',
    }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CIRCUIT GRID (CSS + pulsing nodes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CircuitGrid({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          linear-gradient(180deg, #020f08, #010604),
          repeating-linear-gradient(0deg, transparent 0, transparent 29px, ${color}22 29px, ${color}22 30px),
          repeating-linear-gradient(90deg, transparent 0, transparent 29px, ${color}22 29px, ${color}22 30px)
        `,
      }}
    >
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="node-glow">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={`${(i % 6) * 20 + 10}%`}
            cy={`${Math.floor(i / 6) * 25 + 10}%`}
            r="20"
            fill="url(#node-glow)"
            opacity="0.35"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.5;0.1"
              dur={`${2 + (i % 4)}s`}
              repeatCount="indefinite"
              begin={`${i * 0.15}s`}
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARBON FIBER (CSS weave + sheen sweep)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function CarbonFiber() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          repeating-linear-gradient(45deg, #181818 0, #181818 2px, #222 2px, #222 4px),
          repeating-linear-gradient(135deg, #181818 0, #181818 2px, #222 2px, #222 4px),
          #050505
        `,
        backgroundBlendMode: 'multiply, multiply, normal',
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
          animation: 'carbonSheen 6s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes carbonSheen {
          0%, 100% { transform: translateX(-30%); }
          50% { transform: translateX(30%); }
        }
      `}</style>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARBLE (layered gradients with vein SVG)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Marble() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.08), transparent 40%),
          radial-gradient(ellipse at 80% 60%, rgba(201,152,26,0.1), transparent 50%),
          linear-gradient(135deg, #0a0a12 0%, #12101a 50%, #0a0a12 100%)
        `,
      }}
    >
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M ${Math.random() * 100}% ${Math.random() * 100}% Q ${Math.random() * 100}% ${Math.random() * 100}% ${Math.random() * 100}% ${Math.random() * 100}%`}
            stroke="rgba(201,152,26,0.15)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAND DUNES (SVG silhouettes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SandDunes() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #1a0a00 0%, #3d1f00 40%, #5c2d00 70%, #8b5e00 100%)',
      }}
    >
      {/* Sun */}
      <div
        className="absolute"
        style={{
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffd166 0%, #f46a2f 50%, transparent 80%)',
          filter: 'blur(10px)',
        }}
      />
      <svg className="absolute bottom-0 w-full" height="300" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path
          d="M 0 300 L 0 220 Q 200 180 400 200 T 800 190 T 1200 210 L 1200 300 Z"
          fill="#8b5e00"
          opacity="0.9"
        />
        <path
          d="M 0 300 L 0 250 Q 300 220 600 235 T 1200 245 L 1200 300 Z"
          fill="#5c2d00"
          opacity="0.95"
        />
        <path
          d="M 0 300 L 0 275 Q 400 260 800 270 T 1200 280 L 1200 300 Z"
          fill="#2a1400"
        />
      </svg>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEEP SPACE (canvas starfield + nebula)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function DeepSpace({ color, active }: { color: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const stars: Array<{ x: number; y: number; r: number; alpha: number; tw: number }> = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      stars.length = 0
      for (let i = 0; i < 300; i++) {
        stars.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random(),
          tw: Math.random() * 0.02,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!active) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      stars.forEach((s) => {
        s.alpha += s.tw
        if (s.alpha > 1 || s.alpha < 0.2) s.tw *= -1
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #020510 0%, #000000 100%)' }}>
      {/* Nebula blob */}
      <div
        className="absolute"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}22 0%, transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAIN SLICK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RainSlick({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const drops: Array<{ x: number; y: number; v: number; len: number }> = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      drops.length = 0
      for (let i = 0; i < 200; i++) {
        drops.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          v: 8 + Math.random() * 6,
          len: 20 + Math.random() * 20,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!active) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      ctx.strokeStyle = 'rgba(180,200,255,0.35)'
      ctx.lineWidth = 1
      drops.forEach((d) => {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.len * 0.26, d.y + d.len)
        ctx.stroke()
        d.y += d.v
        d.x -= d.v * 0.26
        if (d.y > canvas.offsetHeight) {
          d.y = -d.len
          d.x = Math.random() * canvas.offsetWidth
        }
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a0f18 0%, #050810 100%)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function BgTexture({ kind, color, active = true }: Props) {
  switch (kind) {
    case 'lightning-storm': return <LightningStorm color={color} active={active} />
    case 'circuit-grid': return <CircuitGrid color={color} />
    case 'carbon-fiber': return <CarbonFiber />
    case 'marble': return <Marble />
    case 'sand-dunes': return <SandDunes />
    case 'deep-space': return <DeepSpace color={color} active={active} />
    case 'rain-slick': return <RainSlick active={active} />
    default: return null
  }
}
