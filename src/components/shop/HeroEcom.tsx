'use client'
// Clean e-commerce hero. Typography-first. One product visual. Zero noise.

import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, ShieldCheck, Truck, Zap } from 'lucide-react'
import { HeroScooterArt } from '@/components/cinematic/HeroScooterArt'

const STATS = [
  { icon: Zap, label: '500+ models' },
  { icon: ShieldCheck, label: 'Verified vendors' },
  { icon: Truck, label: 'Free UAE delivery' },
]

export function HeroEcom() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white pt-24 pb-20 md:pt-32 md:pb-28">
      {/* Soft gradient accent */}
      <div
        className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)' }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        {/* ── Left: copy ── */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/5 border border-neutral-900/10 text-xs font-medium text-neutral-700 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now shipping across the UAE
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-5">
            Electric scooters,
            <br />
            <span className="text-neutral-400">engineered</span> for the UAE.
          </h1>

          {/* Subhead */}
          <p className="text-base md:text-lg text-neutral-600 max-w-xl leading-relaxed mb-8">
            Verified brands. Real performance data. Transparent pricing.
            Find, compare and buy your next ride — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Shop the range
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-neutral-300 text-neutral-900 text-sm font-medium hover:border-neutral-900 transition-colors"
            >
              Why Scootmart
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {STATS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-neutral-500">
                <Icon className="w-4 h-4 text-neutral-400" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: product visual ── */}
        <div
          className={`relative transition-all duration-1000 delay-200 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative aspect-[4/3] w-full">
            {/* Soft product pedestal */}
            <div className="absolute inset-x-4 bottom-4 h-10 rounded-full bg-neutral-900/5 blur-2xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <HeroScooterArt
                primary="#1f2937"
                secondary="#3b82f6"
                glow="#3b82f6"
              />
            </div>

            {/* Floating spec chip (top-left) */}
            <div className="absolute top-4 left-4 md:top-8 md:left-0 bg-white rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.08)] border border-neutral-100 px-4 py-3 hidden md:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">Top speed</p>
              <p className="text-lg font-semibold text-neutral-900 tabular-nums">95 km/h</p>
            </div>

            {/* Floating range chip (bottom-right) */}
            <div className="absolute bottom-8 right-0 md:bottom-16 md:right-4 bg-white rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.08)] border border-neutral-100 px-4 py-3 hidden md:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">Range</p>
              <p className="text-lg font-semibold text-neutral-900 tabular-nums">150 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-400 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  )
}
