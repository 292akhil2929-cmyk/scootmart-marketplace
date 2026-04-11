'use client'
import { useEffect, useRef, useCallback } from 'react'
import type { MotionValue } from 'framer-motion'
import { useMotionValueEvent } from 'framer-motion'
import { scooterFrames, TOTAL_FRAMES } from '@/data/scooterFrames'

interface Props {
  scrollYProgress: MotionValue<number>
  phase: number
}

export function ScooterCanvas({ scrollYProgress, phase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const rafRef = useRef<number>(0)
  const loadedRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const tiltRef = useRef({ x: 0, y: 0 })
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Preload all 72 SVG frames as Image objects
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES)
    let loaded = 0

    scooterFrames.forEach((svgStr, i) => {
      const img = new Image()
      const blob = new Blob([svgStr], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      img.onload = () => {
        loaded++
        loadedRef.current = loaded
        URL.revokeObjectURL(url)
        if (loaded === TOTAL_FRAMES) draw()
      }
      img.src = url
      imagesRef.current[i] = img
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mouse parallax (desktop only)
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mouseRef.current = {
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Sync scroll → target frame
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    targetFrameRef.current = p * (TOTAL_FRAMES - 1)
  })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }

    // Lerp current frame toward target
    const delta = targetFrameRef.current - currentFrameRef.current
    const lerpRate = Math.abs(delta) > 8 ? 0.22 : 0.10
    currentFrameRef.current += delta * lerpRate

    const frameIdx = Math.round(currentFrameRef.current) % TOTAL_FRAMES
    const img = imagesRef.current[frameIdx]

    ctx.clearRect(0, 0, W, H)

    if (img?.complete && img.naturalWidth > 0) {
      // Draw scooter centered, slightly above center for premium feel
      const scale = Math.min(W / 600, H / 400) * 0.9
      const sw = 600 * scale
      const sh = 400 * scale
      const sx = (W - sw) / 2
      const sy = (H - sh) * 0.45
      ctx.drawImage(img, sx, sy, sw, sh)
    }

    // Mouse parallax tilt on wrapper
    if (wrapperRef.current) {
      const tx = mouseRef.current.x * 6
      const ty = mouseRef.current.y * 4
      tiltRef.current.x += (tx - tiltRef.current.x) * 0.08
      tiltRef.current.y += (ty - tiltRef.current.y) * 0.08
      wrapperRef.current.style.transform =
        `perspective(1200px) rotateY(${tiltRef.current.x.toFixed(2)}deg) rotateX(${(-tiltRef.current.y).toFixed(2)}deg)`
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  // Start RAF loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0"
      style={{ transformOrigin: 'center center', willChange: 'transform' }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-hidden="true"
      />
    </div>
  )
}
