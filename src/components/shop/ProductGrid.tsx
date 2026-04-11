'use client'
// Clean product grid with category filter + search. Minimal cards.

import { useMemo, useState } from 'react'
import { Search, Star, ArrowRight, Battery, Gauge, Zap } from 'lucide-react'
import { SCOOTERS, getAmazonUrl, type Scooter } from '@/data/scooters'
import { HeroScooterArt } from '@/components/cinematic/HeroScooterArt'
import { useReveal } from './useReveal'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'commuter', label: 'Commuter' },
  { value: 'performance', label: 'Performance' },
  { value: 'offroad', label: 'Off-road' },
]

// Accent color per scooter id — stays consistent but subtle
const ACCENTS: Record<number, string> = {
  1: '#10b981', // xiaomi → emerald
  2: '#f59e0b', // segway → amber
  3: '#ef4444', // kaabo → red
  4: '#3b82f6', // ninebot → blue
  5: '#8b5cf6', // apollo → violet
  6: '#0ea5e9', // dualtron → sky
}

function ProductCard({ s }: { s: Scooter }) {
  const accent = ACCENTS[s.id] ?? '#3b82f6'
  return (
    <article className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] hover:-translate-y-1">
      {/* Badge */}
      {s.badge && (
        <span
          className="absolute top-4 left-4 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-sm"
        >
          {s.badge === 'sale' && 'Sale'}
          {s.badge === 'hot' && 'Bestseller'}
          {s.badge === 'new' && 'New'}
          {s.badge === 'beast' && 'Top spec'}
        </span>
      )}

      {/* Visual */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: accent }}
        />
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="w-full scale-[0.78] translate-y-2 transition-transform duration-500 group-hover:scale-[0.82]">
            <HeroScooterArt primary="#1f2937" secondary={accent} glow={accent} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">
              {s.brand}
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 leading-tight">
              {s.model}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 shrink-0 pt-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium tabular-nums">{s.rating}</span>
            <span className="text-neutral-300">·</span>
            <span className="tabular-nums">{s.reviews}</span>
          </div>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Gauge className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium">{s.speed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Battery className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium">{s.range}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Zap className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium">{s.motor}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">
              From
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-neutral-900 tabular-nums">
                AED {s.price.toLocaleString()}
              </span>
              {s.oldPrice && (
                <span className="text-xs text-neutral-400 line-through tabular-nums">
                  {s.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <a
            href={s.amazonAsin ? getAmazonUrl(s.amazonAsin) : '#shop'}
            target={s.amazonAsin ? '_blank' : undefined}
            rel={s.amazonAsin ? 'noopener noreferrer' : undefined}
            className="group/btn inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            View
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function ProductGrid() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const ref = useReveal<HTMLDivElement>()

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return SCOOTERS.filter((s) => {
      if (cat !== 'all' && s.category !== cat) return false
      if (!needle) return true
      return `${s.brand} ${s.model} ${s.category}`.toLowerCase().includes(needle)
    })
  }, [q, cat])

  return (
    <section id="shop" className="bg-neutral-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section header */}
        <div ref={ref} className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-3">
              The collection
            </p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-neutral-900 leading-[1.1] max-w-2xl">
              Every ride, hand-picked and tested in the UAE.
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brand or model"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${
                cat === c.value
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'
              }`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto self-center text-sm text-neutral-400">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((s) => (
              <ProductCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 text-sm">No scooters match that search.</p>
            <button
              onClick={() => { setQ(''); setCat('all') }}
              className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
