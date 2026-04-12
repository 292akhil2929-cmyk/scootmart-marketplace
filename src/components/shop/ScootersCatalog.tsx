'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Star, ArrowRight, Battery, Gauge, Zap, SlidersHorizontal, Check } from 'lucide-react'
import type { Product } from '@/lib/products'
import { HeroScooterArt } from '@/components/cinematic/HeroScooterArt'
import { MinimalNav } from './MinimalNav'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'commuter', label: 'Commuter' },
  { value: 'performance', label: 'Performance' },
  { value: 'offroad', label: 'Off-road' },
]

const ACCENTS: Record<string, string> = {
  commuter: '#3b82f6', performance: '#8b5cf6', offroad: '#ef4444',
}

function CatalogCard({ p }: { p: Product }) {
  const accent = ACCENTS[p.category] ?? '#3b82f6'
  return (
    <Link
      href={`/scooters/${p.slug}`}
      className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] hover:-translate-y-1"
    >
      {p.badge && (
        <span className="absolute top-4 left-4 z-10 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-sm">
          {p.badge === 'sale' ? 'Sale' : p.badge === 'hot' ? 'Bestseller' : p.badge === 'new' ? 'New' : 'Top spec'}
        </span>
      )}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: accent }} />
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="w-full scale-[0.78] translate-y-2 transition-transform duration-500 group-hover:scale-[0.82]">
            <HeroScooterArt primary="#1f2937" secondary={accent} glow={accent} />
          </div>
        </div>
        {!p.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-neutral-500 bg-white px-3 py-1 rounded-full border border-neutral-200">Out of stock</span>
          </div>
        )}
      </div>
      <div className="p-5 relative">
        <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">{p.brand}</p>
        <h3 className="text-lg font-semibold text-neutral-900 leading-tight mb-2">{p.model}</h3>
        {p.rating && (
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-3">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-medium tabular-nums">{p.rating}</span>
            {p.reviewCount && <span className="text-neutral-300">· {p.reviewCount} reviews</span>}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 mb-4">
          {p.speedKmh && <div className="flex items-center gap-1.5 text-xs text-neutral-600"><Gauge className="w-3.5 h-3.5 text-neutral-400" /><span className="font-medium">{p.speedKmh} km/h</span></div>}
          {p.rangeKm && <div className="flex items-center gap-1.5 text-xs text-neutral-600"><Battery className="w-3.5 h-3.5 text-neutral-400" /><span className="font-medium">{p.rangeKm} km</span></div>}
          {p.motorWatts && <div className="flex items-center gap-1.5 text-xs text-neutral-600"><Zap className="w-3.5 h-3.5 text-neutral-400" /><span className="font-medium">{p.motorWatts}W</span></div>}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 mb-0.5">From</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-neutral-900 tabular-nums">AED {p.priceAed.toLocaleString()}</span>
              {p.oldPriceAed && <span className="text-xs text-neutral-400 line-through tabular-nums">{p.oldPriceAed.toLocaleString()}</span>}
            </div>
          </div>
          <div className="group/btn inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-neutral-900 text-white text-xs font-medium">
            View <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ScootersCatalog({ initialProducts }: { initialProducts: Product[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return initialProducts.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (!needle) return true
      return `${p.brand} ${p.model}`.toLowerCase().includes(needle)
    })
  }, [initialProducts, q, cat])

  return (
    <div className="min-h-screen bg-neutral-50">
      <MinimalNav />
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500 mb-3">The full range</p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-neutral-900 mb-2">Electric scooters, UAE-ready.</h1>
          <p className="text-neutral-500 text-sm">Verified brands. Free delivery. 2-year warranty.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand or model"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900 transition-colors" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setCat(c.value)}
                className={`h-11 px-4 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${cat === c.value ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'}`}>
                {cat === c.value && <Check className="w-3.5 h-3.5" />}
                {c.label}
              </button>
            ))}
          </div>
          <span className="self-center text-sm text-neutral-400 ml-auto hidden md:block">{filtered.length} results</span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((p) => <CatalogCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 text-sm">No scooters match your search.</p>
            <button onClick={() => { setQ(''); setCat('all') }} className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-4">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
