'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ExternalLink, ShoppingCart, X, ChevronRight } from 'lucide-react'

const AMAZON_TAG = 'scootmartae-21'
const NOON_PARTNER = '518012'

const TIER_CONFIG: Record<string, { tier: 1 | 2 | 3; badge: string; label: string; badgeClass: string }> = {
  amazon:     { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  noon:       { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  sharaf_dg:  { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  carrefour:  { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  microless:  { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  xiaomi:     { tier: 1, badge: '✓', label: 'Official Store',   badgeClass: 'bg-orange-100 text-orange-700 border-orange-200' },
  jumbo:      { tier: 1, badge: '✓', label: 'Verified Partner', badgeClass: 'bg-green-100 text-green-700 border-green-200' },
  scootup:    { tier: 2, badge: '🏪', label: 'Local Specialist', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  eveons:     { tier: 2, badge: '🏪', label: 'Local Specialist', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  ubuy:       { tier: 3, badge: '⚠️', label: 'Third Party',      badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  other:      { tier: 2, badge: '🏪', label: 'Retailer',         badgeClass: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
}

const SAFETY_GEAR = [
  { id: 'helmet', name: 'Certified Helmet', emoji: '⛑️', price: 'AED 89+', url: `https://www.amazon.ae/s?k=electric+scooter+helmet+certified&tag=${AMAZON_TAG}`, required: true },
  { id: 'lock',   name: 'U-Lock',           emoji: '🔒', price: 'AED 55+', url: `https://www.amazon.ae/s?k=bicycle+u+lock+heavy+duty&tag=${AMAZON_TAG}`,        required: false },
  { id: 'vest',   name: 'Reflective Vest',  emoji: '🦺', price: 'AED 25+', url: `https://www.amazon.ae/s?k=reflective+safety+vest+cycling&tag=${AMAZON_TAG}`,   required: false },
]

function buildAffiliateUrl(url: string, platform: string): string {
  try {
    const u = new URL(url)
    if (platform === 'amazon' || u.hostname.includes('amazon.ae')) {
      u.searchParams.set('tag', AMAZON_TAG)
      return u.toString()
    }
    if (platform === 'noon' || u.hostname.includes('noon.com')) {
      return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(url)}`
    }
    return url
  } catch { return url }
}

interface PriceSource {
  platform: string
  label: string
  price: number
  url: string
  price_scraped_at?: string
}

function timeAgo(iso?: string): string | null {
  if (!iso) return null
  const diffMs = Date.now() - new Date(iso).getTime()
  if (diffMs < 0) return null
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 2)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function ListingBuyPanel({
  priceSources,
  affiliateUrl,
  affiliatePlatform,
  listingPrice,
  originalPrice,
}: {
  priceSources: PriceSource[]
  affiliateUrl: string | null
  affiliatePlatform: string | null
  listingPrice: number
  originalPrice: number | null
}) {
  const [safetyShown, setSafetyShown] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [safetyOpen, setSafetyOpen] = useState(false)

  // Exit intent
  const handleMouseOut = useCallback((e: MouseEvent) => {
    if (!safetyShown && e.clientY <= 0) {
      setSafetyShown(true)
      setSafetyOpen(true)
    }
  }, [safetyShown])

  useEffect(() => {
    document.addEventListener('mouseout', handleMouseOut)
    return () => document.removeEventListener('mouseout', handleMouseOut)
  }, [handleMouseOut])

  const handleBuyClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!safetyShown) {
      e.preventDefault()
      setSafetyShown(true)
      setPendingUrl(url)
      setSafetyOpen(true)
    }
  }

  const continueTo = (url?: string) => {
    const dest = url || pendingUrl
    if (dest) window.open(dest, '_blank', 'noopener,noreferrer')
    setSafetyOpen(false)
    setPendingUrl(null)
  }

  const sources = priceSources.length > 0 ? priceSources : (
    affiliateUrl ? [{ platform: affiliatePlatform ?? 'other', label: affiliatePlatform === 'amazon' ? 'Amazon.ae' : affiliatePlatform === 'noon' ? 'Noon' : 'Retailer', price: listingPrice, url: affiliateUrl }] : []
  )

  const sortedSources = [...sources].sort((a, b) => a.price - b.price)

  return (
    <>
      {/* Safety Modal */}
      <AnimatePresence>
        {safetyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSafetyOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-neutral-950 p-5">
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-5 h-5 text-green-400 shrink-0" />
                  <h2 className="font-bold text-white text-base">Wait! Safety First</h2>
                  <button onClick={() => setSafetyOpen(false)} className="ml-auto text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/50 text-xs">UAE RTA requires helmets for all e-scooter riders</p>
              </div>

              <div className="p-5">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                  ⛑️ Dubai RTA <strong>requires a helmet</strong> — fine is <strong>AED 200</strong> if caught without one.
                </div>

                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Add to your order</p>
                <div className="space-y-2 mb-5">
                  {SAFETY_GEAR.map(item => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 transition-colors group"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-neutral-900">{item.name}</span>
                        {item.required && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">REQUIRED</span>}
                      </div>
                      <span className="text-sm font-bold text-neutral-700">{item.price}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 shrink-0" />
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={SAFETY_GEAR[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-neutral-950 text-white font-bold py-3 rounded-xl text-sm text-center hover:bg-neutral-800 transition-colors"
                  >
                    Add Safety Gear First
                  </a>
                  <button
                    onClick={() => continueTo()}
                    className="w-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 font-medium py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
                  >
                    Continue to Store <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price panel */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-bold">Compare Prices</h2>
          <div className="flex items-center gap-3">
            {(() => {
              const freshest = sortedSources
                .map(s => s.price_scraped_at)
                .filter(Boolean)
                .sort()
                .at(-1)
              const ago = timeAgo(freshest)
              return ago ? (
                <span className="text-[10px] text-green-600 font-medium bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  ↻ checked {ago}
                </span>
              ) : null
            })()}
            <span className="text-xs text-neutral-400">{sortedSources.length} store{sortedSources.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {sortedSources.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {sortedSources.map((src, i) => {
              const tier = TIER_CONFIG[src.platform] ?? TIER_CONFIG.other
              const finalUrl = buildAffiliateUrl(src.url, src.platform)
              return (
                <div
                  key={src.platform + i}
                  className={`flex items-center justify-between px-5 py-3.5 ${i === 0 ? 'bg-neutral-950' : 'hover:bg-neutral-50'} transition-colors`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    {i === 0 && (
                      <span className="text-[10px] font-bold bg-green-400 text-black px-1.5 py-0.5 rounded-full w-fit mb-0.5">
                        BEST PRICE
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-neutral-800'}`}>
                        {src.label}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${tier.badgeClass}`}>
                        {tier.badge} {tier.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-neutral-900'}`}>
                      AED {src.price.toLocaleString()}
                    </span>
                    <a
                      href={finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => handleBuyClick(e, finalUrl)}
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                        i === 0
                          ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      <ShoppingCart className="w-3 h-3" /> Shop
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-neutral-400">
            No store prices available yet.
          </div>
        )}

        {sortedSources.length > 0 && (
          <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
            <p className="text-[10px] text-neutral-400 text-center">
              ✓ Verified Partner links include affiliate commission at no extra cost to you.
              Tier 3 stores are unverified — check seller ratings before purchasing.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
