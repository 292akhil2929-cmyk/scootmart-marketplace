'use client'
// ═══════════════════════════════════════════════════════════
// DNA PARTICLE FIELD — 7 particle personalities
// lightning-bolts · floating-leaves · stars · embers
// rain · circuit-nodes · diamonds
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import type { ParticleKind } from '@/data/scooterDNA'

interface Props {
  kind: ParticleKind
  color: string
  count: number
  speed: 'storm' | 'drift' | 'pulse'
  active?: boolean
}

export function DNAParticleField({ kind, color, count, speed, active = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    let raf = 0
    let time = 0

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Particle state by kind
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    type Base = { x: number; y: number; vx: number; vy: number; r: number; a: number; rot: number; phase: number }
    let particles: Base[] = []

    const init = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 3 + 1,
        a: Math.random() * 0.6 + 0.2,
        rot: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
      }))
    }
    init()

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Renderers
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const hexToRgb = (hex: string) => {
      const m = hex.match(/^#([0-9a-f]{6})$/i)
      if (!m) return { r: 255, g: 255, b: 255 }
      const n = parseInt(m[1], 16)
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    }
    const rgb = hexToRgb(color)
    const rgba = (a: number) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`

    const drawLightningBolts = () => {
      particles.forEach((p) => {
        p.phase -= 1
        if (p.phase <= 0) {
          p.x = Math.random() * W()
          p.y = Math.random() * H() * 0.3
          p.phase = 20 + Math.random() * 60
        }
        const alpha = Math.max(0, Math.min(1, p.phase / 10))
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        let cx = p.x
        let cy = p.y
        for (let k = 0; k < 6; k++) {
          cx += (Math.random() - 0.5) * 20
          cy += 10 + Math.random() * 15
          ctx.lineTo(cx, cy)
        }
        ctx.strokeStyle = rgba(alpha)
        ctx.lineWidth = 1.5
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.stroke()
      })
      ctx.shadowBlur = 0
    }

    const drawFloatingLeaves = () => {
      particles.forEach((p) => {
        p.x += Math.sin(time * 0.01 + p.phase) * 0.4
        p.y -= 0.3 + p.r * 0.1
        p.rot += 0.01
        if (p.y < -20) { p.y = H() + 20; p.x = Math.random() * W() }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = rgba(p.a * 0.6)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.r * 2, p.r * 4, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const drawStars = () => {
      particles.forEach((p, i) => {
        const isSpeedLine = i < 10
        if (isSpeedLine) {
          // Horizontal warp lines
          p.x -= 8
          if (p.x < -50) p.x = W() + 50
          ctx.strokeStyle = rgba(0.4)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + 40, p.y)
          ctx.stroke()
        } else {
          p.phase += 0.02
          const twinkle = 0.4 + Math.sin(p.phase) * 0.3
          ctx.fillStyle = `rgba(255,255,255,${twinkle})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }

    const drawEmbers = () => {
      particles.forEach((p) => {
        p.y -= 1 + p.r * 0.2
        p.x += Math.sin(time * 0.02 + p.phase) * 0.5
        if (p.y < -10) { p.y = H() + 10; p.x = Math.random() * W() }
        const heightPct = p.y / H()
        const alpha = heightPct * 0.8
        ctx.fillStyle = rgba(alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const drawRain = () => {
      particles.forEach((p) => {
        p.y += 8 + p.r * 2
        p.x -= 2
        if (p.y > H() + 20) { p.y = -20; p.x = Math.random() * W() }
        ctx.strokeStyle = rgba(0.4)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - 5, p.y + 15)
        ctx.stroke()
      })
    }

    const drawCircuitNodes = () => {
      particles.forEach((p) => {
        p.x += (Math.random() - 0.5) * 0.6
        p.y += (Math.random() - 0.5) * 0.6
        if (p.x < 0) p.x = W()
        if (p.x > W()) p.x = 0
        if (p.y < 0) p.y = H()
        if (p.y > H()) p.y = 0
      })
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.strokeStyle = rgba((1 - d / 100) * 0.3)
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      // Nodes
      particles.forEach((p) => {
        ctx.fillStyle = rgba(0.9)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawDiamonds = () => {
      particles.forEach((p) => {
        p.y -= 0.4
        p.rot += 0.005
        p.phase += 0.03
        const alpha = 0.4 + Math.sin(p.phase) * 0.2
        if (p.y < -20) { p.y = H() + 20; p.x = Math.random() * W() }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4)
        ctx.fillStyle = rgba(alpha)
        const s = p.r * 2
        ctx.fillRect(-s / 2, -s / 2, s, s)
        ctx.restore()
      })
    }

    const render = () => {
      if (!active) { raf = requestAnimationFrame(render); return }
      time++
      ctx.clearRect(0, 0, W(), H())
      switch (kind) {
        case 'lightning-bolts': drawLightningBolts(); break
        case 'floating-leaves': drawFloatingLeaves(); break
        case 'stars': drawStars(); break
        case 'embers': drawEmbers(); break
        case 'rain': drawRain(); break
        case 'circuit-nodes': drawCircuitNodes(); break
        case 'diamonds': drawDiamonds(); break
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [kind, color, count, speed, active])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
