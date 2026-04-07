'use client'
import { useEffect, useRef, useState } from 'react'

// BMW-style scroll-triggered video/image reveal section
export function VideoReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const total = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / total)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Phases based on progress
  const textOpacity = progress < 0.3 ? progress / 0.3 : progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1
  const videoScale = 0.55 + progress * 0.45
  const videoBorderRadius = Math.max(0, 32 - progress * 32)
  const textY = (0.3 - Math.min(progress, 0.3)) * 80

  // Stats counter
  const statsOpacity = progress > 0.4 ? Math.min(1, (progress - 0.4) / 0.2) : 0

  return (
    <div ref={containerRef} className="relative bg-[#050505]" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Video/Image container */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: `${videoScale * 100}%`,
            height: `${videoScale * 100}%`,
            borderRadius: `${videoBorderRadius}px`,
            transition: 'border-radius 0.1s ease',
          }}
        >
          {/* Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="/videos/scooter-hero.mp4"
          />
          {/* Gradient fallback overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-slate-900/50 to-black/80" />

          {/* Overlay text centered on the video */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8"
            style={{ opacity: statsOpacity }}
          >
            <div className="grid grid-cols-3 gap-12">
              {[
                { value: '500+', label: 'Models' },
                { value: '45°C', label: 'UAE Tested' },
                { value: '50+', label: 'Brands' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-4xl md:text-6xl font-black text-emerald-400">{s.value}</div>
                  <div className="text-white/50 text-sm mt-1 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating text above/outside the video */}
        <div
          className="absolute z-10 text-center text-white pointer-events-none w-full px-8"
          style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 mb-4">Built for the UAE</p>
          <h2 className="text-[clamp(2rem,6vw,5rem)] font-black leading-tight tracking-[-0.02em]">
            Power. Range.
            <br />
            <span className="text-white/30">Heat Resistant.</span>
          </h2>
          <p className="text-white/40 mt-4 text-lg max-w-lg mx-auto">
            Every scooter on ScootMart is evaluated for UAE road conditions — heat, humidity, sand.
          </p>
        </div>
      </div>
    </div>
  )
}
