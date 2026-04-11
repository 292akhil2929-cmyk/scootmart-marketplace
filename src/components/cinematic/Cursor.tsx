'use client'
// ═══════════════════════════════════════════════════════════
// CURSOR — DNA-aware with trail for SPEED/BEAST, gold diamond for LUXURY
// ═══════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react'
import { useCinematicStore } from '@/store/cinematicStore'

export function Cursor() {
  const activeDNA = useCinematicStore((s) => s.activeDNA)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trail1Ref = useRef<HTMLDivElement>(null)
  const trail2Ref = useRef<HTMLDivElement>(null)
  const trail3Ref = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const trailPos = useRef([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ])
  const rawPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [onCanvas, setOnCanvas] = useState(false)

  const color = activeDNA.primaryColor
  const useTrail = activeDNA.category === 'SPEED' || activeDNA.category === 'BEAST'
  const isLuxury = activeDNA.category === 'LUXURY'
  const isEco = activeDNA.category === 'ECO'

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    setVisible(true)
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
      const target = e.target as HTMLElement
      setOnCanvas(!!target.closest('canvas'))
      setHovering(!!target.closest('a, button, [role=button]'))
    }

    const animate = () => {
      const { x: tx, y: ty } = rawPos.current
      ringPos.current.x += (tx - ringPos.current.x) * 0.12
      ringPos.current.y += (ty - ringPos.current.y) * 0.12

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      }

      // Trail for SPEED/BEAST
      if (useTrail) {
        const [p1, p2, p3] = trailPos.current
        p1.x += (tx - p1.x) * 0.08
        p1.y += (ty - p1.y) * 0.08
        p2.x += (p1.x - p2.x) * 0.08
        p2.y += (p1.y - p2.y) * 0.08
        p3.x += (p2.x - p3.x) * 0.08
        p3.y += (p2.y - p3.y) * 0.08
        if (trail1Ref.current) trail1Ref.current.style.transform = `translate(${p1.x - 4}px, ${p1.y - 4}px)`
        if (trail2Ref.current) trail2Ref.current.style.transform = `translate(${p2.x - 4}px, ${p2.y - 4}px)`
        if (trail3Ref.current) trail3Ref.current.style.transform = `translate(${p3.x - 4}px, ${p3.y - 4}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      document.documentElement.style.cursor = ''
    }
  }, [useTrail])

  if (!visible) return null

  return (
    <>
      {/* Trail ghosts (SPEED/BEAST) */}
      {useTrail && (
        <>
          <div ref={trail1Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full w-2 h-2" style={{ background: color, opacity: 0.5 }} />
          <div ref={trail2Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full w-2 h-2" style={{ background: color, opacity: 0.3 }} />
          <div ref={trail3Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full w-2 h-2" style={{ background: color, opacity: 0.15 }} />
        </>
      )}

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-150"
        style={{
          width: onCanvas ? 0 : hovering ? 20 : 8,
          height: onCanvas ? 0 : hovering ? 20 : 8,
          background: color,
          boxShadow: hovering ? `0 0 14px ${color}99` : `0 0 6px ${color}66`,
          marginLeft: hovering ? -6 : 0,
          marginTop: hovering ? -6 : 0,
        }}
      />

      {/* Ring — circle or diamond */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-200 ${isLuxury ? '' : 'rounded-full'}`}
        style={{
          width: onCanvas ? 32 : hovering ? 64 : 40,
          height: onCanvas ? 32 : hovering ? 64 : 40,
          border: `1.5px ${hovering ? 'dashed' : 'solid'} ${color}${hovering ? '99' : '73'}`,
          transform: isLuxury ? `rotate(45deg) translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)` : undefined,
          marginLeft: onCanvas ? -16 : hovering ? -12 : 0,
          marginTop: onCanvas ? -16 : hovering ? -12 : 0,
          boxShadow: isEco ? `inset 0 0 12px ${color}60` : undefined,
        }}
      />

      {/* Crosshair on canvas */}
      {onCanvas && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: rawPos.current.x,
            top: rawPos.current.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-8 h-[1px] absolute left-1/2 -translate-x-1/2 top-1/2" style={{ background: color }} />
          <div className="h-8 w-[1px] absolute top-1/2 -translate-y-1/2 left-1/2" style={{ background: color }} />
          <div className="w-8 h-8 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ border: `1px solid ${color}` }} />
        </div>
      )}
    </>
  )
}
