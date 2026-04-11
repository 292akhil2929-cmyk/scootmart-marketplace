'use client'
import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const rawPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [onCanvas, setOnCanvas] = useState(false)

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    setVisible(true)
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
      // Check if over canvas
      const target = e.target as HTMLElement
      setOnCanvas(!!target.closest('canvas'))
      setHovering(!!target.closest('a, button, [role=button]'))
    }

    const animate = () => {
      const { x: tx, y: ty } = rawPos.current
      ringPos.current.x += (tx - ringPos.current.x) * 0.15
      ringPos.current.y += (ty - ringPos.current.y) * 0.15

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
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
  }, [])

  if (!visible) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-150"
        style={{
          width: onCanvas ? 0 : hovering ? 20 : 8,
          height: onCanvas ? 0 : hovering ? 20 : 8,
          background: '#2f5cff',
          boxShadow: hovering ? '0 0 12px rgba(47,92,255,0.6)' : 'none',
          marginLeft: hovering ? -6 : 0,
          marginTop: hovering ? -6 : 0,
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-200"
        style={{
          width: onCanvas ? 32 : hovering ? 64 : 40,
          height: onCanvas ? 32 : hovering ? 64 : 40,
          border: `1.5px ${hovering ? 'dashed' : 'solid'} rgba(47,92,255,${hovering ? 0.6 : 0.45})`,
          marginLeft: onCanvas ? -16 : hovering ? -12 : 0,
          marginTop: onCanvas ? -16 : hovering ? -12 : 0,
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
          <div className="w-8 h-[1px] bg-white absolute left-1/2 -translate-x-1/2 top-1/2" />
          <div className="h-8 w-[1px] bg-white absolute top-1/2 -translate-y-1/2 left-1/2" />
          <div className="w-8 h-8 rounded-full border border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
    </>
  )
}
