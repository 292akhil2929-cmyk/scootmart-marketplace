'use client'
import { useState, useMemo } from 'react'
import { SCOOTERS, getAmazonUrl } from '@/data/scooters'
import type { Scooter } from '@/data/scooters'
import { ScooterCard } from './ScooterCard'
import { Search, SlidersHorizontal, X, Check, Minus, ExternalLink } from 'lucide-react'

// ──────────────────────────────────────────────
// SEARCH HUB
// ──────────────────────────────────────────────
function SearchHub({ q, setQ, tab, setTab }: {
  q: string, setQ: (v: string) => void,
  tab: string, setTab: (v: string) => void
}) {
  return (
    <section className="pt-24 pb-16 px-4 bg-[#f6f4ef]" id="storefront">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="font-barlow font-900 text-[clamp(3rem,8vw,5.5rem)] leading-none tracking-tight text-[#111315] mb-3">
          Find Anything.
        </h2>
        <p className="font-dm text-[#111315]/50 text-lg">
          Search by model, brand, budget, or just describe your ideal ride.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(17,19,21,0.08)] border border-[rgba(17,19,21,0.06)] flex items-center p-2 mb-4">
          <Search className="ml-3 h-5 w-5 text-[#111315]/30 shrink-0" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Xiaomi, budget scooter, off-road..."
            className="flex-1 bg-transparent px-3 py-2.5 text-base text-[#111315] outline-none font-dm placeholder:text-[#111315]/30"
          />
          {q && (
            <button onClick={() => setQ('')} className="p-2 text-[#111315]/30 hover:text-[#111315]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 justify-center">
          {[['all', '⚡ All'], ['commuter', '🛴 Commuter'], ['performance', '🚀 Performance'], ['offroad', '🏔️ Off-Road']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`font-barlow font-600 text-sm uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                tab === v
                  ? 'bg-[#2f5cff] text-white shadow-[0_4px_20px_rgba(47,92,255,0.35)]'
                  : 'bg-white text-[#111315]/50 hover:bg-[#e8e3db]'
              }`}
            >{l}</button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// COMPARISON BAR (fixed bottom)
// ──────────────────────────────────────────────
function CompareBar({ ids, scooters, onRemove, onClear }: {
  ids: number[], scooters: Scooter[], onRemove: (id: number) => void, onClear: () => void
}) {
  const selected = scooters.filter(s => ids.includes(s.id))
  if (selected.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[4000] bg-white border-t border-[rgba(17,19,21,0.08)] shadow-[0_-4px_40px_rgba(17,19,21,0.12)] px-6 py-4 flex items-center gap-4 animate-fade-in-up">
      <div className="flex gap-3 flex-wrap flex-1">
        {selected.map(s => (
          <div key={s.id} className="flex items-center gap-2 bg-[#f6f4ef] rounded-full px-4 py-1.5 font-dm text-sm text-[#111315]">
            <span>{s.brand} {s.model}</span>
            <button onClick={() => onRemove(s.id)} className="text-[#111315]/30 hover:text-[#d93f4f] transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={onClear} className="font-dm text-sm text-[#111315]/40 hover:text-[#111315] transition-colors shrink-0">Clear all</button>
      <a
        href="/compare"
        className="font-barlow font-700 text-sm uppercase tracking-widest bg-[#2f5cff] text-white h-10 px-6 rounded-full flex items-center hover:opacity-90 transition-opacity shrink-0"
      >
        Compare Now →
      </a>
    </div>
  )
}

// ──────────────────────────────────────────────
// VENDOR SECTION
// ──────────────────────────────────────────────
function VendorSection() {
  const vendors = [
    { name: 'ScootCity UAE', tagline: 'Premium Urban Mobility', accent: '#2f5cff', stars: 4.8, reviews: 342, asin: null, prices: ['Xiaomi Pro 4: AED 1,999', 'Segway Max G2: AED 2,849', 'Apollo City: AED 4,200'] },
    { name: 'Amazon.ae', tagline: 'Fast Delivery Across UAE', accent: '#FF9900', stars: 4.5, reviews: 2841, asin: true, prices: ['Xiaomi Pro 4: AED 2,099', 'Segway Max: AED 2,949', 'Various brands'] },
    { name: 'Emirates Ride', tagline: 'Verified Dubai Dealer', accent: '#17835f', stars: 4.7, reviews: 189, asin: null, prices: ['Segway Max G2: AED 2,799', 'Kaabo Wolf: AED 12,400', 'Dualtron: AED 16,800'] },
  ]

  return (
    <section className="bg-[#f6f4ef] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-barlow font-300 text-xs uppercase tracking-[0.3em] text-[#2f5cff] mb-2">Verified Vendors</p>
          <h2 className="font-barlow font-900 text-[clamp(2.5rem,6vw,4rem)] leading-tight tracking-tight text-[#111315]">
            Compare Prices.<br />Buy With Confidence.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {vendors.map(v => (
            <div key={v.name} className="bg-white rounded-3xl overflow-hidden border border-[rgba(17,19,21,0.06)] shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-1.5" style={{ background: v.accent }} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-barlow font-700 text-lg text-[#111315]">{v.name}</h3>
                  <span className="font-barlow font-700 text-[10px] uppercase tracking-widest bg-[#f6f4ef] text-[#111315]/50 px-2 py-0.5 rounded-full">✓ Verified</span>
                </div>
                <p className="font-dm text-xs text-[#111315]/40 mb-3">{v.tagline}</p>
                <div className="flex items-center gap-1 text-xs font-dm text-[#111315]/50 mb-4">
                  <span className="text-yellow-500">★</span> {v.stars} · {v.reviews} reviews
                </div>
                {v.prices.map(p => (
                  <div key={p} className="font-dm text-sm text-[#111315]/70 py-1.5 border-b border-[rgba(17,19,21,0.05)] last:border-0">{p}</div>
                ))}
                {v.asin ? (
                  <a
                    href={getAmazonUrl(undefined, 'electric scooter UAE')}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 font-barlow font-700 text-xs uppercase tracking-widest border-2 text-center py-2.5 rounded-2xl transition-all hover:text-white"
                    style={{ borderColor: v.accent, color: v.accent }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = v.accent; (e.target as HTMLElement).style.color = 'white' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = ''; (e.target as HTMLElement).style.color = v.accent }}
                  >
                    Shop on Amazon <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <button
                    className="mt-4 w-full font-barlow font-700 text-xs uppercase tracking-widest border-2 py-2.5 rounded-2xl transition-all hover:text-white"
                    style={{ borderColor: v.accent, color: v.accent }}
                  >
                    Visit Store →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// SCOOTBOT CHAT
// ──────────────────────────────────────────────
function ScootBot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hey! I'm ScootBot 🛴 Tell me your budget, how far you commute, or what vibe you're going for." }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const CHIPS = ["Best under AED 2,000", "Fastest scooter", "Best for Dubai roads", "Need suspension", "Foldable & light", "Dual motor?"]

  const reply = (msg: string) => {
    setMessages(m => [...m, { from: 'user', text: msg }])
    setTyping(true)
    setTimeout(() => {
      let bot = "Great question! Let me check our database for that..."
      const lower = msg.toLowerCase()
      if (lower.includes('2000') || lower.includes('budget') || lower.includes('cheap')) {
        bot = "For under AED 2,000, I'd recommend the Xiaomi Mi Pro 4 (AED 1,999) — excellent range, IP54 waterproof, and 600W motor. It's our top seller! 🛴"
      } else if (lower.includes('fast') || lower.includes('speed')) {
        bot = "For raw speed, the Kaabo Wolf King GT hits 100km/h and the Dualtron Thunder 2 reaches 95km/h. Both are beasts but on the pricey side. The Apollo City Pro at 45km/h is the sweet spot for speed + value. 🚀"
      } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('road')) {
        bot = "For Dubai roads, I recommend IP55+ rating (Segway Max G2) for sand & humidity resistance, 10\" tubeless tires, and RTA-compliant 25km/h models. The Segway Max G2 at AED 2,849 is purpose-built for UAE. 🌡️"
      } else if (lower.includes('suspension')) {
        bot = "For suspension, check the Segway Max G2 (dual suspension), Apollo City Pro (front fork), or Kaabo Wolf King GT (front+rear). Great for Dubai's speed bumps! 🏙️"
      } else if (lower.includes('fold') || lower.includes('light')) {
        bot = "Lightest foldable options: Ninebot Air T15E at 12.5kg (AED 2,199) or Xiaomi Mi Pro 4 at 16.8kg (AED 1,999). Both subway-friendly. 📦"
      } else if (lower.includes('dual') || lower.includes('motor')) {
        bot = "Dual motor beasts: Kaabo Wolf King GT (6720W, 120km range, AED 12,500) and Dualtron Thunder 2 (8640W, 150km range, AED 16,900). Absolute monsters! ⚡"
      }
      setMessages(m => [...m, { from: 'bot', text: bot }])
      setTyping(false)
    }, 1400)
  }

  return (
    <section className="bg-[#111315] py-20 px-4" id="scootbot">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <div className="w-14 h-14 rounded-full bg-[#2f5cff] flex items-center justify-center text-2xl mb-5">🛴</div>
          <h2 className="font-barlow font-900 text-[clamp(2.5rem,5vw,4rem)] text-white leading-tight tracking-tight mb-4">
            Your personal<br />scooter expert.
          </h2>
          {[
            ['🧠', 'Knows all 6 featured models in depth'],
            ['💰', 'Speaks your budget — from AED 1,000 to AED 20,000'],
            ['🌡️', 'Recommends UAE-specific configurations'],
          ].map(([icon, text]) => (
            <div key={text as string} className="flex items-center gap-3 mb-3">
              <span className="text-xl">{icon}</span>
              <span className="font-dm text-white/50 text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-2xl" style={{ minHeight: 520 }}>
          <div className="bg-[#2f5cff] px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🛴</div>
            <div>
              <p className="font-barlow font-700 text-white text-sm">ScootBot</p>
              <p className="font-dm text-white/60 text-xs">Always online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 340, minHeight: 200 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl font-dm text-sm leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-[#2f5cff] text-white rounded-br-sm'
                    : 'bg-[#f6f4ef] text-[#111315] rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#f6f4ef] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111315]/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111315]/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111315]/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chips */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
            {CHIPS.map(c => (
              <button
                key={c}
                onClick={() => { setInput(''); reply(c) }}
                className="font-dm text-xs text-[#2f5cff] border border-[#2f5cff]/30 rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-[#2f5cff] hover:text-white transition-colors shrink-0"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { reply(input.trim()); setInput('') } }}
              placeholder="Ask ScootBot anything..."
              className="flex-1 bg-[#f6f4ef] rounded-xl px-4 py-2.5 text-sm font-dm text-[#111315] outline-none"
            />
            <button
              onClick={() => { if (input.trim()) { reply(input.trim()); setInput('') } }}
              className="w-10 h-10 rounded-xl bg-[#2f5cff] flex items-center justify-center text-white hover:opacity-90 shrink-0"
            >→</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#111315] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <p className="font-barlow font-900 text-2xl tracking-[0.2em] uppercase bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">ScootMart</p>
          <p className="font-dm text-white/30 text-sm mb-4">Your ride starts here.</p>
          <div className="flex gap-3">
            {['IG', 'TK', 'X', 'YT'].map(s => (
              <a key={s} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center font-dm text-xs text-white/30 hover:text-[#2f5cff] hover:border-[#2f5cff]/50 transition-colors">{s}</a>
            ))}
          </div>
        </div>
        {[
          { title: 'Shop', links: ['All Scooters', 'E-Bikes', 'Accessories', 'Compare', 'Best Deals'] },
          { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Vendor Program', 'Blog'] },
          { title: 'Support', links: ['Help Centre', 'Contact', 'Warranty', 'Returns', 'UAE Regulations'] },
        ].map(col => (
          <div key={col.title}>
            <p className="font-barlow font-700 text-sm uppercase tracking-widest text-white/60 mb-3">{col.title}</p>
            {col.links.map(l => (
              <a key={l} href="#" className="block font-dm text-sm text-white/30 hover:text-white/70 py-1 transition-colors">{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-dm text-xs text-white/20">© 2025 ScootMart.ae · Amazon Associate · AE-21</p>
        <p className="font-dm text-xs text-white/20">Made with ⚡ in Dubai 🇦🇪</p>
      </div>
    </footer>
  )
}

// ──────────────────────────────────────────────
// MAIN STOREFRONT ORCHESTRATOR
// ──────────────────────────────────────────────
export function Storefront() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')
  const [compareIds, setCompareIds] = useState<number[]>([])

  const filtered = useMemo(() => {
    return SCOOTERS.filter(s => {
      const matchTab = tab === 'all' || s.category === tab
      const matchQ = !q || `${s.brand} ${s.model} ${s.category}`.toLowerCase().includes(q.toLowerCase())
      return matchTab && matchQ
    })
  }, [q, tab])

  const toggleCompare = (id: number) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  return (
    <div id="storefront">
      {/* Zone divider */}
      <div className="bg-white py-6 flex items-center justify-center gap-4">
        <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-[#2f5cff]/30 to-transparent" />
        <span className="font-barlow font-300 text-sm tracking-[0.3em] uppercase text-[#111315]/30">— The Store —</span>
        <div className="flex-1 max-w-xs h-px bg-gradient-to-l from-transparent via-[#2f5cff]/30 to-transparent" />
      </div>

      {/* Search hub */}
      <SearchHub q={q} setQ={setQ} tab={tab} setTab={setTab} />

      {/* Scooter catalog */}
      <section className="bg-white py-12 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="font-dm text-sm text-[#111315]/40">
              Showing <strong>{filtered.length}</strong> of {SCOOTERS.length} scooters
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => (
                <ScooterCard
                  key={s.id}
                  scooter={s}
                  onCompare={toggleCompare}
                  comparing={compareIds.includes(s.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🛴</div>
              <p className="font-barlow font-700 text-xl text-[#111315]/50">No scooters found for that search</p>
              <button onClick={() => { setQ(''); setTab('all') }} className="mt-4 font-dm text-sm text-[#2f5cff] hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Vendor pricing */}
      <VendorSection />

      {/* ScootBot */}
      <ScootBot />

      {/* Footer */}
      <Footer />

      {/* Compare bar */}
      <CompareBar
        ids={compareIds}
        scooters={SCOOTERS}
        onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))}
        onClear={() => setCompareIds([])}
      />
    </div>
  )
}
