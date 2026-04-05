'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shield, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [emirate, setEmirate] = useState('')
  const [type, setType] = useState('')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (emirate) p.set('emirate', emirate)
    if (type) p.set('type', type)
    router.push(`/browse?${p.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            UAE's #1 E-Scooter & E-Bike Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Find Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Electric Ride
            </span>{' '}
            in the UAE
          </h1>

          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Verified sellers, escrow protection, UAE-tested reviews, and certified used inspections.
            The smartest way to buy or sell e-scooters and e-bikes.
          </p>

          {/* Search bar */}
          <form onSubmit={search} className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex flex-col sm:flex-row gap-2 mb-8 border border-white/20 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search Segway, NIU, Xiaomi..."
                className="w-full bg-transparent text-white placeholder:text-white/50 pl-9 pr-3 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select value={emirate} onChange={e => setEmirate(e.target.value)}
                className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 min-w-28">
                <option value="">All UAE</option>
                {['Dubai','Abu Dhabi','Sharjah','Ajman','RAK','Fujairah'].map(e => (
                  <option key={e} value={e} className="bg-slate-800">{e}</option>
                ))}
              </select>
              <select value={type} onChange={e => setType(e.target.value)}
                className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 min-w-28">
                <option value="">All types</option>
                <option value="scooter" className="bg-slate-800">Scooters</option>
                <option value="ebike" className="bg-slate-800">E-Bikes</option>
              </select>
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 shrink-0">
                Search
              </Button>
            </div>
          </form>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-400" /> Escrow Protected</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-400" /> Verified Sellers</span>
            <span className="flex items-center gap-1.5">🌡️ UAE-Tested Reviews</span>
            <span className="flex items-center gap-1.5">🔋 Battery Health Certified</span>
          </div>
        </div>
      </div>
    </section>
  )
}
