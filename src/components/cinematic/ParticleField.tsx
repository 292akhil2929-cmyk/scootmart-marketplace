'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number; opacity: number
}

export function ParticleField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Initialize 200 particles
    particles.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const animate = () => {
      if (!active) { rafRef.current = requestAnimationFrame(animate); return }

      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)

      const pts = particles.current
      // Update positions
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      }

      // Draw connection lines
      ctx.strokeStyle = 'rgba(47,92,255,0.15)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.4
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw dots
      for (const p of pts) {
        ctx.globalAlpha = p.opacity * (active ? 1 : 0)
        ctx.fillStyle = `rgba(47,92,255,0.7)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
