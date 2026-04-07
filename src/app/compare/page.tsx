'use client'
import { useState } from 'react'
import { Search, X, Check, Minus, ArrowRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

// Spec catalog for comparison (real world data)
const SCOOTER_DB = [
  {
    id: '1', name: 'Xiaomi 4 Pro', brand: 'Xiaomi', price: 2199, emoji: '🛴',
    specs: { range: 55, speed: 25, weight: 14.9, motorW: 700, battery: 446, waterproof: 'IP55', foldable: true, dualMotor: false, brakes: 'Electronic + Disc', tireSize: '10"', chargeTime: 8, climbAngle: 20, payload: 100, connectivity: 'Bluetooth', suspension: 'Front' },
    tags: ['Best Seller', 'Lightweight'], color: '#FF6600', available: true
  },
  {
    id: '2', name: 'Segway Max G2', brand: 'Segway', price: 3499, emoji: '🛴',
    specs: { range: 70, speed: 25, weight: 19.7, motorW: 900, battery: 551, waterproof: 'IP55', foldable: true, dualMotor: false, brakes: 'Mechanical + EBS', tireSize: '10"', chargeTime: 6, climbAngle: 22, payload: 120, connectivity: 'Bluetooth', suspension: 'Dual' },
    tags: ['Top Range', 'Best Value'], color: '#000000', available: true
  },
  {
    id: '3', name: 'NIU KQi3 Pro', brand: 'NIU', price: 2899, emoji: '🛴',
    specs: { range: 50, speed: 25, weight: 18.5, motorW: 800, battery: 486, waterproof: 'IP54', foldable: true, dualMotor: false, brakes: 'Disc + EBS', tireSize: '10"', chargeTime: 7, climbAngle: 18, payload: 100, connectivity: 'Bluetooth/App', suspension: 'None' },
    tags: ['App Connected'], color: '#0066CC', available: true
  },
  {
    id: '4', name: 'Kaabo Mantis King GT', brand: 'Kaabo', price: 6499, emoji: '🛴',
    specs: { range: 85, speed: 65, weight: 34, motorW: 2000, battery: 1008, waterproof: 'IP54', foldable: true, dualMotor: true, brakes: 'Hydraulic Disc', tireSize: '11"', chargeTime: 10, climbAngle: 35, payload: 150, connectivity: 'Bluetooth', suspension: 'Dual Spring' },
    tags: ['High Performance', 'Dual Motor'], color: '#CC0000', available: true
  },
  {
    id: '5', name: 'Dualtron Thunder 2', brand: 'Dualtron', price: 12999, emoji: '🛴',
    specs: { range: 120, speed: 85, weight: 52, motorW: 5400, battery: 1763, waterproof: 'IPX5', foldable: false, dualMotor: true, brakes: 'Hydraulic Disc', tireSize: '11"', chargeTime: 12, climbAngle: 45, payload: 150, connectivity: 'Bluetooth', suspension: 'Dual Hydraulic' },
    tags: ['Extreme Power', 'Longest Range'], color: '#6600CC', available: true
  },
  {
    id: '6', name: 'Apollo City Pro', brand: 'Apollo', price: 5299, emoji: '🛴',
    specs: { range: 75, speed: 40, weight: 27, motorW: 1000, battery: 800, waterproof: 'IP67', foldable: true, dualMotor: false, brakes: 'Hydraulic Disc', tireSize: '10"', chargeTime: 8, climbAngle: 25, payload: 120, connectivity: 'Bluetooth/App', suspension: 'Front Spring' },
    tags: ['IP67 Waterproof', 'City Commuter'], color: '#FF6600', available: true
  },
  {
    id: '7', name: 'Xiaomi Pro 2', brand: 'Xiaomi', price: 2499, emoji: '🛴',
    specs: { range: 45, speed: 25, weight: 14.2, motorW: 600, battery: 446, waterproof: 'IP54', foldable: true, dualMotor: false, brakes: 'Disc + EBS', tireSize: '8.5"', chargeTime: 8.5, climbAngle: 20, payload: 100, connectivity: 'Bluetooth', suspension: 'None' },
    tags: ['Lightweight'], color: '#888888', available: true
  },
  {
    id: '8', name: 'Segway GT2', brand: 'Segway', price: 8999, emoji: '🛴',
    specs: { range: 90, speed: 70, weight: 35, motorW: 3000, battery: 1512, waterproof: 'IPX5', foldable: false, dualMotor: true, brakes: 'Hydraulic Disc', tireSize: '11"', chargeTime: 12, climbAngle: 45, payload: 150, connectivity: 'Bluetooth', suspension: 'Dual Inverted' },
    tags: ['Flagship', 'Off-road'], color: '#333333', available: true
  },
]

const SPEC_LABELS: { key: string; label: string; unit?: string; higher?: boolean }[] = [
  { key: 'range',       label: '🔋 Range',         unit: 'km',  higher: true },
  { key: 'speed',       label: '⚡ Top Speed',      unit: 'km/h', higher: true },
  { key: 'weight',      label: '⚖️ Weight',         unit: 'kg',  higher: false },
  { key: 'motorW',      label: '🔧 Motor Power',    unit: 'W',   higher: true },
  { key: 'battery',     label: '🔌 Battery',        unit: 'Wh',  higher: true },
  { key: 'waterproof',  label: '💧 Waterproof',     unit: '' },
  { key: 'foldable',    label: '📦 Foldable',       unit: '' },
  { key: 'dualMotor',   label: '🚀 Dual Motor',     unit: '' },
  { key: 'brakes',      label: '🛑 Brakes',         unit: '' },
  { key: 'tireSize',    label: '⭕ Tire Size',      unit: '' },
  { key: 'chargeTime',  label: '⏱️ Charge Time',   unit: 'hrs', higher: false },
  { key: 'climbAngle',  label: '🏔️ Climb Angle',   unit: '°',   higher: true },
  { key: 'payload',     label: '👤 Max Payload',    unit: 'kg',  higher: true },
  { key: 'connectivity',label: '📱 Connectivity',   unit: '' },
  { key: 'suspension',  label: '🌊 Suspension',     unit: '' },
]

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const filtered = SCOOTER_DB.filter(s =>
    `${s.brand} ${s.name}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compareItems = SCOOTER_DB.filter(s => selected.includes(s.id))

  // Find best value for numeric specs
  const getBest = (key: string, higher?: boolean) => {
    const vals = compareItems.map(s => Number(s.specs[key as keyof typeof s.specs]))
    if (vals.some(isNaN)) return null
    return higher ? Math.max(...vals) : Math.min(...vals)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <div className="bg-[#1d1d1f] py-16 px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-3">Smart Comparison</p>
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-tight tracking-[-0.02em] mb-4">
          Compare Electric Scooters
        </h1>
        <p className="text-white/40 max-w-lg mx-auto text-base">
          Select up to 3 scooters for a detailed side-by-side spec breakdown.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Scooter picker */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#1d1d1f] text-lg">Pick Scooters to Compare</h2>
            <span className="text-sm text-[#6e6e73]">{selected.length}/3 selected</span>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6e6e73]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brand or model..."
              className="w-full pl-10 pr-4 py-3 bg-[#f5f5f7] rounded-xl text-sm text-[#1d1d1f] outline-none"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map(s => {
              const isSelected = selected.includes(s.id)
              const isFull = selected.length >= 3 && !isSelected
              return (
                <button
                  key={s.id}
                  onClick={() => !isFull && toggle(s.id)}
                  disabled={isFull}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : isFull
                      ? 'border-transparent bg-[#f5f5f7] opacity-40 cursor-not-allowed'
                      : 'border-transparent bg-[#f5f5f7] hover:border-emerald-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-xs text-[#6e6e73] font-medium">{s.brand}</div>
                  <div className="font-bold text-[#1d1d1f] text-sm leading-tight">{s.name}</div>
                  <div className="text-emerald-600 font-black text-sm mt-1">AED {s.price.toLocaleString()}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.tags.map(t => (
                      <span key={t} className="text-[10px] bg-black/5 text-[#6e6e73] px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Comparison table */}
        {compareItems.length >= 2 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <div className="flex items-center gap-2 text-[#1d1d1f]">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                <h2 className="font-bold text-lg">Comparison Results</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Headers */}
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="p-5 text-left w-40 text-xs font-medium text-[#6e6e73] uppercase tracking-wide">Specification</th>
                    {compareItems.map(s => (
                      <th key={s.id} className="p-5 text-center min-w-[180px]">
                        <div className="relative inline-block">
                          <button
                            onClick={() => toggle(s.id)}
                            className="absolute -top-2 -right-2 bg-[#f5f5f7] hover:bg-red-50 text-[#6e6e73] hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="text-4xl mb-2">{s.emoji}</div>
                          <div className="text-xs text-[#6e6e73] font-medium">{s.brand}</div>
                          <div className="font-black text-[#1d1d1f] text-base">{s.name}</div>
                          <div className="text-emerald-600 font-black text-lg mt-1">AED {s.price.toLocaleString()}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC_LABELS.map(spec => {
                    const best = getBest(spec.key, spec.higher)
                    return (
                      <tr key={spec.key} className="border-b border-black/3 hover:bg-[#f9f9fb] transition-colors">
                        <td className="p-4 text-sm text-[#6e6e73] font-medium">{spec.label}</td>
                        {compareItems.map(s => {
                          const raw = s.specs[spec.key as keyof typeof s.specs]
                          const numVal = Number(raw)
                          const isBest = !isNaN(numVal) && best !== null && numVal === best
                          return (
                            <td key={s.id} className="p-4 text-center">
                              {typeof raw === 'boolean' ? (
                                raw
                                  ? <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                                  : <Minus className="h-5 w-5 text-[#d1d1d6] mx-auto" />
                              ) : (
                                <span className={`font-semibold text-sm ${isBest ? 'text-emerald-600 font-black' : 'text-[#1d1d1f]'}`}>
                                  {raw}{spec.unit && !isNaN(numVal) ? ` ${spec.unit}` : ''}
                                  {isBest && <span className="ml-1 text-[10px] text-emerald-500 font-medium">★</span>}
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Buy buttons */}
            <div className="p-6 border-t border-black/5">
              <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${compareItems.length}, 1fr)` }}>
                <div className="text-xs text-[#6e6e73] font-medium pt-3">Buy Now</div>
                {compareItems.map(s => (
                  <div key={s.id} className="flex flex-col gap-2">
                    <Link
                      href={`/browse?q=${encodeURIComponent(s.name)}`}
                      className="bg-[#1d1d1f] text-white font-semibold py-3 px-4 rounded-xl text-sm text-center hover:bg-black transition-colors"
                    >
                      Find in UAE
                    </Link>
                    <a
                      href={`https://www.amazon.ae/s?k=${encodeURIComponent(s.brand + ' ' + s.name)}&tag=scootmart-21`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-black/10 text-[#1d1d1f] font-semibold py-2.5 px-4 rounded-xl text-sm text-center hover:bg-[#f5f5f7] transition-colors"
                    >
                      View on Amazon
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-black/5">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Select at least 2 scooters</h3>
            <p className="text-[#6e6e73] text-sm">Choose from the list above to start comparing side by side</p>
          </div>
        )}

        {/* Back to browse */}
        <div className="text-center mt-8">
          <Link href="/browse" className="inline-flex items-center gap-2 text-[#0071e3] font-semibold hover:underline text-sm">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Browse all listings
          </Link>
        </div>
      </div>
    </div>
  )
}
