'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react'

const BRANDS = ['Xiaomi', 'Segway', 'NIU', 'Kaabo', 'VSETT', 'Inokim', 'Mercane', 'Zero', 'Apollo', 'Dualtron']
const SPEED_RANGES = ['Under 25 km/h', '25–45 km/h', '45–70 km/h', '70+ km/h']
const RANGE_OPTIONS = ['Under 30 km', '30–60 km', '60–90 km', '90+ km']
const PRICE_RANGES = ['Under AED 1,000', 'AED 1k–3k', 'AED 3k–6k', 'AED 6k+']

export function SmartSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [speedRange, setSpeedRange] = useState('')
  const [rangeOption, setRangeOption] = useState('')
  const [minRange, setMinRange] = useState(0)
  const [maxPrice, setMaxPrice] = useState(15000)
  const [type, setType] = useState('')

  const buildUrl = () => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (brand) p.set('brand', brand)
    if (type) p.set('type', type)
    if (maxPrice < 15000) p.set('max_price', String(maxPrice))
    if (minRange > 0) p.set('min_range', String(minRange))
    return `/browse?${p.toString()}`
  }

  const activeFilters = [brand, priceRange, speedRange, rangeOption, type].filter(Boolean).length

  return (
    <section className="bg-[#f5f5f7] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Smart Search</p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-black text-[#1d1d1f] leading-tight tracking-[-0.02em]">
            Find Your Exact Match
          </h2>
          <p className="text-[#6e6e73] mt-3 text-base max-w-lg mx-auto">
            Filter by speed, range, brand, price and more. We aggregate specs from verified UAE vendors.
          </p>
        </div>

        {/* Main search bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-3 flex items-center gap-3 mb-4">
          <Search className="ml-2 text-[#6e6e73] h-5 w-5 shrink-0" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && router.push(buildUrl())}
            placeholder="Brand, model, or keyword..."
            className="flex-1 bg-transparent text-[#1d1d1f] placeholder:text-[#6e6e73] px-2 py-2 text-base outline-none"
          />
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              open || activeFilters > 0
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/10 hover:bg-[#e8e8ed]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <span className="bg-white/30 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{activeFilters}</span>
            )}
          </button>
          <button
            onClick={() => router.push(buildUrl())}
            className="bg-[#1d1d1f] text-white font-semibold px-7 py-2.5 rounded-xl hover:bg-black transition-colors text-sm shrink-0"
          >
            Search
          </button>
        </div>

        {/* Advanced filters panel */}
        {open && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-lg p-6 mb-4 animate-fade-in-down">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {/* Type */}
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">Vehicle Type</label>
                <div className="flex flex-col gap-1.5">
                  {[{ v: '', l: 'All' }, { v: 'scooter', l: '🛴 Scooters' }, { v: 'ebike', l: '🚴 E-Bikes' }].map(o => (
                    <button
                      key={o.v}
                      onClick={() => setType(o.v)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${type === o.v ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-[#f5f5f7] text-[#1d1d1f]'}`}
                    >{o.l}</button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">Brand</label>
                <div className="flex flex-wrap gap-1.5">
                  {BRANDS.slice(0, 8).map(b => (
                    <button
                      key={b}
                      onClick={() => setBrand(brand === b ? '' : b)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${brand === b ? 'bg-emerald-500 text-white border-emerald-500' : 'border-black/10 text-[#1d1d1f] hover:border-emerald-300'}`}
                    >{b}</button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">
                  Max Price: AED {maxPrice.toLocaleString()}
                </label>
                <input
                  type="range" min={500} max={15000} step={500}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-[#6e6e73] mt-1">
                  <span>AED 500</span><span>AED 15,000</span>
                </div>
              </div>

              {/* Min Range */}
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">
                  Min Range: {minRange} km
                </label>
                <input
                  type="range" min={0} max={120} step={5}
                  value={minRange}
                  onChange={e => setMinRange(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-[#6e6e73] mt-1">
                  <span>0 km</span><span>120 km</span>
                </div>
              </div>
            </div>

            {/* Spec quick filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-black/5 pt-5">
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">Top Speed</label>
                <div className="flex flex-wrap gap-2">
                  {SPEED_RANGES.map(s => (
                    <button key={s} onClick={() => setSpeedRange(speedRange === s ? '' : s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${speedRange === s ? 'bg-emerald-500 text-white border-emerald-500' : 'border-black/10 hover:border-emerald-300'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">Range</label>
                <div className="flex flex-wrap gap-2">
                  {RANGE_OPTIONS.map(r => (
                    <button key={r} onClick={() => setRangeOption(rangeOption === r ? '' : r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${rangeOption === r ? 'bg-emerald-500 text-white border-emerald-500' : 'border-black/10 hover:border-emerald-300'}`}
                    >{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map(p => (
                    <button key={p} onClick={() => setPriceRange(priceRange === p ? '' : p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${priceRange === p ? 'bg-emerald-500 text-white border-emerald-500' : 'border-black/10 hover:border-emerald-300'}`}
                    >{p}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/5">
              <button onClick={() => { setBrand(''); setPriceRange(''); setSpeedRange(''); setRangeOption(''); setType(''); setMinRange(0); setMaxPrice(15000) }}
                className="flex items-center gap-1.5 text-sm text-[#6e6e73] hover:text-[#1d1d1f]">
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
              <button onClick={() => { router.push(buildUrl()); setOpen(false) }}
                className="bg-[#1d1d1f] text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-black transition-colors text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Spec pills quick access */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {['Waterproof IP54+', 'Under 15kg', 'Dual Motor', 'RTA Compliant', 'Fast Charge', 'Foldable'].map(spec => (
            <button
              key={spec}
              onClick={() => router.push(`/browse?q=${encodeURIComponent(spec)}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/8 text-sm text-[#1d1d1f] hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Zap className="h-3 w-3 text-emerald-500" />
              {spec}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
