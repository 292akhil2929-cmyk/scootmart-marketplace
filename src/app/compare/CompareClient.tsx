'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Minus, ArrowRight, BarChart3, Shield, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/types/database'

const AMAZON_TAG = 'scootmartae-21'
const NOON_PARTNER = '518012'

// Store tiers
type StoreTier = 1 | 2 | 3
const STORE_TIERS: Record<string, { tier: StoreTier; label: string; badge: string; color: string }> = {
  'amazon.ae':            { tier: 1, label: 'Verified Partner', badge: '✓', color: 'text-[#00FF00]' },
  'noon.com':             { tier: 1, label: 'Verified Partner', badge: '✓', color: 'text-[#00FF00]' },
  'sharafdg.com':         { tier: 1, label: 'Verified Partner', badge: '✓', color: 'text-[#00FF00]' },
  'carrefouruae.com':     { tier: 1, label: 'Verified Partner', badge: '✓', color: 'text-[#00FF00]' },
  'microless.com':        { tier: 1, label: 'Verified Partner', badge: '✓', color: 'text-[#00FF00]' },
  'scootup.ae':           { tier: 2, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' },
  'eveons.ae':            { tier: 2, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' },
  'e-scooteruaehub.com':  { tier: 2, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' },
  'uae-scooters.com':     { tier: 2, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' },
  'dubaiscooters.ae':     { tier: 2, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' },
  'ubuy.ae':              { tier: 3, label: 'Third Party',      badge: '⚠️', color: 'text-yellow-500' },
  'almubdie.com':         { tier: 3, label: 'Third Party',      badge: '⚠️', color: 'text-yellow-500' },
  'electricscooters.ae':  { tier: 3, label: 'Third Party',      badge: '⚠️', color: 'text-yellow-500' },
}

function getStoreMeta(url: string) {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    const match = Object.entries(STORE_TIERS).find(([k]) => host.includes(k))
    if (match) return { hostname: host, ...match[1] }
  } catch {}
  return { hostname: url, tier: 2 as StoreTier, label: 'Local Specialist', badge: '🏪', color: 'text-blue-400' }
}

function affiliateUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('amazon.ae')) {
      u.searchParams.set('tag', AMAZON_TAG)
      return `/api/out?url=${encodeURIComponent(u.toString())}`
    }
    if (u.hostname.includes('noon.com')) {
      return `/api/out?url=${encodeURIComponent(url)}`
    }
    return url
  } catch { return url }
}

function amazonSearchUrl(brand: string, model: string) {
  return `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=${encodeURIComponent(brand + ' ' + model)}&tag=${AMAZON_TAG}`)}`
}

function noonSearchUrl(brand: string, model: string) {
  const search = `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(brand + ' ' + model)}`
  return `/api/out?url=${encodeURIComponent(search)}`
}

// Safety gear
const SAFETY_GEAR = [
  { id: 'helmet', name: 'Certified Helmet', emoji: '⛑️', price: 'AED 89+', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=electric+scooter+helmet+certified&tag=${AMAZON_TAG}`)}`, required: true, fine: 'AED 200 fine if caught without' },
  { id: 'lock',   name: 'U-Lock',           emoji: '🔒', price: 'AED 55+', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=bicycle+u+lock+heavy+duty&tag=${AMAZON_TAG}`)}`,  required: false, fine: null },
  { id: 'vest',   name: 'Reflective Vest',  emoji: '🦺', price: 'AED 25+', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=reflective+safety+vest+cycling&tag=${AMAZON_TAG}`)}`, required: false, fine: null },
]

const SPEC_LABELS: { key: keyof NonNullable<Listing['specs']>; label: string; unit?: string; higher?: boolean }[] = [
  { key: 'range_km',            label: '🔋 Range',          unit: 'km',  higher: true },
  { key: 'top_speed_kmh',       label: '⚡ Top Speed',       unit: 'km/h', higher: true },
  { key: 'weight_kg',           label: '⚖️ Weight',          unit: 'kg',  higher: false },
  { key: 'motor_watts',         label: '🔧 Motor Power',     unit: 'W',   higher: true },
  { key: 'battery_kwh',         label: '🔌 Battery',         unit: 'kWh', higher: true },
  { key: 'ip_rating',           label: '💧 Waterproof',      unit: '' },
  { key: 'charging_time_hours', label: '⏱️ Charge Time',    unit: 'hrs', higher: false },
  { key: 'hill_climb_degrees',  label: '🏔️ Climb Angle',    unit: '°',   higher: true },
  { key: 'max_rider_weight_kg', label: '👤 Max Payload',     unit: 'kg',  higher: true },
  { key: 'brake_type',          label: '🛑 Brakes',          unit: '' },
  { key: 'wheel_size_inch',     label: '⭕ Tire Size',       unit: '"' },
  { key: 'suspension',          label: '🌊 Suspension',      unit: '' },
  { key: 'rta_permit_included', label: '📋 RTA Permit',      unit: '' },
]

function SafetyModal({ pendingUrl, onContinue, onClose }: { pendingUrl: string; onContinue: () => void; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ y: 60, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#0a0a0a] border border-[#00FF00]/20 rounded-2xl w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#00FF00]/10 border-b border-[#00FF00]/20 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-[#00FF00]/20 rounded-full p-2">
                <Shield className="w-5 h-5 text-[#00FF00]" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg leading-tight">Wait! Safety First</h2>
                <p className="text-white/50 text-xs">Dubai RTA regulations apply</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* RTA warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-5">
              <p className="text-yellow-400 text-sm font-medium">
                ⛑️ Dubai RTA <strong>requires helmets</strong> for all e-scooter riders.
                <br />
                <span className="text-yellow-500/70">Fine: AED 200 if caught without one.</span>
              </p>
            </div>

            {/* Gear items */}
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">Recommended Safety Gear</p>
            <div className="space-y-2 mb-5">
              {SAFETY_GEAR.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00FF00]/30 transition-all group"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{item.name}</span>
                      {item.required && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">REQUIRED</span>}
                    </div>
                    {item.fine && <p className="text-red-400/70 text-[10px]">{item.fine}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-[#00FF00] text-sm font-bold">{item.price}</div>
                    <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-[#00FF00] ml-auto transition-colors" />
                  </div>
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <a
                href={SAFETY_GEAR.find(g => g.id === 'helmet')!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#00FF00] text-black font-bold py-3 rounded-xl text-sm text-center hover:bg-[#00e600] transition-colors"
              >
                Add Gear to My Order
              </a>
              <button
                onClick={onContinue}
                className="w-full border border-white/20 text-white/70 hover:text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                Continue to Store
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function CompareClient({ listings }: { listings: Listing[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [safetyModal, setSafetyModal] = useState<{ url: string } | null>(null)
  const [safetyShown, setSafetyShown] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Exit-intent: show safety modal when mouse leaves viewport
  const handleMouseOut = useCallback((e: MouseEvent) => {
    if (!safetyShown && e.clientY <= 0 && selected.length > 0) {
      setSafetyShown(true)
      setSafetyModal({ url: '' })
    }
  }, [safetyShown, selected.length])

  useEffect(() => {
    document.addEventListener('mouseout', handleMouseOut)
    return () => document.removeEventListener('mouseout', handleMouseOut)
  }, [handleMouseOut])

  const filtered = listings.filter(l =>
    `${l.brand} ${l.model} ${l.title}`.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const compareItems = listings.filter(l => selected.includes(l.id))

  const getBest = (key: keyof NonNullable<Listing['specs']>, higher?: boolean) => {
    const vals = compareItems.map(l => Number(l.specs?.[key] ?? NaN)).filter(v => !isNaN(v))
    if (!vals.length) return null
    return higher ? Math.max(...vals) : Math.min(...vals)
  }

  const handleExternalClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!safetyShown) {
      e.preventDefault()
      setSafetyShown(true)
      setSafetyModal({ url })
    }
  }

  const continueTo = () => {
    if (safetyModal?.url) {
      window.open(safetyModal.url, '_blank', 'noopener,noreferrer')
    }
    setSafetyModal(null)
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Safety modal */}
      {safetyModal && (
        <SafetyModal
          pendingUrl={safetyModal.url}
          onContinue={continueTo}
          onClose={() => setSafetyModal(null)}
        />
      )}

      {/* Hero header */}
      <div className="relative bg-black border-b border-white/10 py-16 px-4 text-center overflow-hidden">
        {/* Electric green glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#00FF00]/10 blur-3xl rounded-full" />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-[0.2em] text-[#00FF00] mb-3"
        >
          Smart Comparison
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white leading-tight tracking-[-0.02em] mb-3"
        >
          Compare E-Scooters
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-lg mx-auto text-sm"
        >
          Select up to 3 scooters from our UAE marketplace for a real side-by-side spec breakdown.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Picker */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Pick Scooters to Compare</h2>
            <span className="text-sm text-white/40 font-mono">{selected.length}/3</span>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brand or model..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-[#00FF00]/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filtered.map(l => {
              const isSelected = selected.includes(l.id)
              const isFull = selected.length >= 3 && !isSelected
              const img = l.images?.[0]
              return (
                <motion.button
                  key={l.id}
                  onClick={() => !isFull && toggle(l.id)}
                  disabled={isFull}
                  whileHover={!isFull ? { scale: 1.02 } : {}}
                  whileTap={!isFull ? { scale: 0.98 } : {}}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#00FF00]/60 bg-[#00FF00]/5 shadow-[0_0_20px_rgba(0,255,0,0.1)]'
                      : isFull
                      ? 'border-white/5 bg-white/3 opacity-30 cursor-not-allowed'
                      : 'border-white/10 bg-white/3 hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#00FF00] text-black rounded-full w-4 h-4 flex items-center justify-center z-10">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                  )}
                  {img && !imageErrors[l.id] ? (
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-white/5">
                      <Image
                        src={img}
                        alt={l.title}
                        fill
                        className="object-contain p-1"
                        onError={() => setImageErrors(p => ({ ...p, [l.id]: true }))}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-lg bg-white/5 flex items-center justify-center mb-2 text-3xl">
                      🛴
                    </div>
                  )}
                  <div className="text-[10px] text-white/40 font-medium">{l.brand}</div>
                  <div className="font-bold text-white text-xs leading-tight">{l.model || l.title}</div>
                  <div className="text-[#00FF00] font-bold text-sm mt-1">
                    AED {l.price.toLocaleString()}
                  </div>
                  {l.rta_compliant && (
                    <span className="inline-block text-[9px] bg-[#00FF00]/10 text-[#00FF00] px-1.5 py-0.5 rounded mt-1">RTA ✓</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Comparison table */}
        <AnimatePresence>
          {compareItems.length >= 2 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#00FF00]" />
                  <h2 className="font-bold text-white text-base">Comparison Results</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-left w-36 text-xs font-medium text-white/30 uppercase tracking-wide">Spec</th>
                      {compareItems.map(l => (
                        <th key={l.id} className="p-4 text-center min-w-[160px]">
                          <div className="relative inline-flex flex-col items-center">
                            <button
                              onClick={() => toggle(l.id)}
                              className="absolute -top-1 -right-4 text-white/20 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            {l.images?.[0] && !imageErrors[l.id] ? (
                              <div className="relative w-16 h-12 mb-2">
                                <Image
                                  src={l.images[0]}
                                  alt={l.title}
                                  fill
                                  className="object-contain"
                                  onError={() => setImageErrors(p => ({ ...p, [l.id]: true }))}
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="text-3xl mb-2">🛴</div>
                            )}
                            <div className="text-[10px] text-white/40">{l.brand}</div>
                            <div className="font-bold text-white text-sm">{l.model || l.title}</div>
                            <div className="text-[#00FF00] font-bold text-base mt-0.5">AED {l.price.toLocaleString()}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_LABELS.map(spec => {
                      const best = getBest(spec.key, spec.higher)
                      return (
                        <tr key={spec.key as string} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-3.5 text-xs text-white/40 font-medium">{spec.label}</td>
                          {compareItems.map(l => {
                            const raw = l.specs?.[spec.key]
                            const numVal = Number(raw)
                            const isBest = raw !== null && raw !== undefined && !isNaN(numVal) && best !== null && numVal === best
                            return (
                              <td key={l.id} className="p-3.5 text-center">
                                {raw === null || raw === undefined ? (
                                  <Minus className="h-4 w-4 text-white/15 mx-auto" />
                                ) : typeof raw === 'boolean' ? (
                                  raw
                                    ? <Check className="h-4 w-4 text-[#00FF00] mx-auto" />
                                    : <Minus className="h-4 w-4 text-white/15 mx-auto" />
                                ) : (
                                  <span className={`font-semibold text-sm ${isBest ? 'text-[#00FF00]' : 'text-white/80'}`}>
                                    {String(raw)}{spec.unit && !isNaN(numVal) ? ` ${spec.unit}` : ''}
                                    {isBest && <span className="ml-1 text-[#00FF00] text-[9px]">★ Best</span>}
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

              {/* Store links */}
              <div className="p-5 border-t border-white/10">
                <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Buy from a Trusted Store</p>

                {/* Store tier legend */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs">
                  <span className="flex items-center gap-1 text-[#00FF00]/70">
                    <span className="font-bold text-[#00FF00]">✓</span> Verified Partner
                  </span>
                  <span className="flex items-center gap-1 text-blue-400/70">
                    <span>🏪</span> Local Specialist
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500/70">
                    <span>⚠️</span> Third Party (verify before purchase)
                  </span>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${compareItems.length}, 1fr)` }}>
                  <div />
                  {compareItems.map(l => (
                    <div key={l.id} className="flex flex-col gap-2">
                      {/* Amazon.ae */}
                      <StoreButton
                        label="Amazon.ae"
                        tier={1}
                        href={amazonSearchUrl(l.brand, l.model || l.title)}
                        onBeforeNavigate={handleExternalClick}
                      />
                      {/* Noon */}
                      <StoreButton
                        label="Noon"
                        tier={1}
                        href={noonSearchUrl(l.brand, l.model || l.title)}
                        onBeforeNavigate={handleExternalClick}
                      />
                      {/* View on ScootMart */}
                      <Link
                        href={`/listings/${l.id}`}
                        className="flex items-center justify-center gap-1 border border-white/10 text-white/70 hover:text-white hover:border-white/30 font-medium py-2 px-3 rounded-xl text-xs transition-colors"
                      >
                        ScootMart Listing <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Tier 3 disclaimer */}
                <p className="mt-4 text-[10px] text-white/20 text-center">
                  ⚠️ Third party stores are not vetted partners. Always verify seller authenticity before purchasing.
                  ScootMart earns affiliate commissions from Amazon.ae and Noon purchases at no extra cost to you.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-16 text-center"
            >
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Select at least 2 scooters</h3>
              <p className="text-white/30 text-sm">Choose from the list above to start comparing side by side</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-8">
          <Link href="/browse" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-medium text-sm transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Browse all listings
          </Link>
        </div>
      </div>
    </div>
  )
}

function StoreButton({
  label,
  tier,
  href,
  onBeforeNavigate,
}: {
  label: string
  tier: StoreTier
  href: string
  onBeforeNavigate: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void
}) {
  const tierStyle =
    tier === 1 ? 'border-[#00FF00]/30 text-[#00FF00] hover:bg-[#00FF00]/10' :
    tier === 2 ? 'border-blue-400/30 text-blue-400 hover:bg-blue-400/5' :
                 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/5'
  const badge = tier === 1 ? '✓' : tier === 2 ? '🏪' : '⚠️'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => onBeforeNavigate(e, href)}
      className={`flex items-center justify-between gap-1 border font-medium py-2 px-3 rounded-xl text-xs transition-colors ${tierStyle}`}
    >
      <span className="flex items-center gap-1">
        <span>{badge}</span> {label}
      </span>
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  )
}
