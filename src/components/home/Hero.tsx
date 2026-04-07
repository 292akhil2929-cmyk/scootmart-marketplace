'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Zap } from 'lucide-react'

const QUICK_TAGS = ['Electric Scooters', 'E-Bikes', 'Under AED 2,000', 'Dubai Tested', 'Xiaomi', 'Segway']

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textOpacity = Math.max(0, 1 - scrollY / 400)
  const textTranslate = scrollY * 0.25

  const handleSearch = useCallback((q?: string) => {
    const term = q ?? query
    const p = new URLSearchParams()
    if (term) p.set('q', term)
    router.push(`/browse?${p.toString()}`)
  }, [query, router])

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-bg-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(52,211,153,0.15),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Parallax content */}
      <div
        className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto w-full"
        style={mounted ? { opacity: textOpacity, transform: `translateY(${-textTranslate}px)` } : {}}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
          <Zap className="h-3 w-3" />
          UAE&apos;s #1 Electric Vehicle Marketplace
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.03em] mb-5">
          Find the Perfect
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 animate-gradient bg-[length:200%_auto]">
            Electric Scooter
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[clamp(1rem,2vw,1.25rem)] text-white/60 mb-10 max-w-2xl mx-auto font-light">
          Compare 500+ models from verified UAE vendors.
          Real specs. Real prices. Delivered to your door.
        </p>

        {/* Search bar */}
        <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-2 max-w-2xl mx-auto flex items-center gap-2 shadow-2xl mb-6">
          <Search className="ml-3 text-white/40 h-5 w-5 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search by brand, model, range..."
            className="flex-1 bg-transparent text-white placeholder:text-white/35 px-3 py-3 text-base outline-none"
          />
          <button
            onClick={() => handleSearch()}
            className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold px-7 py-3 rounded-xl transition-all text-sm"
          >
            Search
          </button>
        </div>

        {/* Quick filter tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => handleSearch(tag)}
              className="px-4 py-1.5 rounded-full border border-white/15 text-white/55 text-xs hover:bg-white/10 hover:text-white/90 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  )
}
