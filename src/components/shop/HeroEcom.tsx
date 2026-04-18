'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

const QUICK_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Under AED 2,000', value: 'max_price=2000' },
  { label: 'RTA Compliant', value: 'rta_compliant=true' },
  { label: 'On Amazon.ae', value: 'source=amazon' },
  { label: 'On Noon', value: 'source=noon' },
  { label: 'UAE Sellers', value: 'type=p2p' },
]

export function HeroEcom() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [active, setActive] = useState('')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (active) active.split('&').forEach(p => { const [k,v] = p.split('='); params.set(k, v) })
    router.push(`/browse${params.size ? `?${params}` : ''}`)
  }

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-white">
      <div className="max-w-3xl mx-auto px-5 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-600 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Compare e-scooters from Amazon, Noon & UAE sellers
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-neutral-900 leading-[1.1] mb-4">
          Find your perfect scooter in the UAE
        </h1>
        <p className="text-base md:text-lg text-neutral-500 mb-10 max-w-xl mx-auto">
          Real specs. Best prices. All platforms in one search.
        </p>

        {/* Search bar */}
        <form onSubmit={search} className="relative mb-5">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search brand, model or category…"
            className="w-full h-14 pl-14 pr-36 rounded-2xl border-2 border-neutral-200 bg-white text-neutral-900 text-base outline-none focus:border-neutral-900 transition-colors shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick filter pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_FILTERS.map(f => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                const next = active === f.value ? '' : f.value
                setActive(next)
                const params = new URLSearchParams()
                if (q.trim()) params.set('q', q.trim())
                if (next) next.split('&').forEach(p => { const [k,v] = p.split('='); params.set(k, v) })
                router.push(`/browse${params.size ? `?${params}` : ''}`)
              }}
              className={`h-8 px-4 rounded-full text-sm font-medium transition-colors border ${
                active === f.value
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
