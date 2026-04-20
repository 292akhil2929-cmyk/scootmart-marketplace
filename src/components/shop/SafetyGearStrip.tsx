import Link from 'next/link'
import { Shield, ExternalLink } from 'lucide-react'

const AMAZON_TAG = 'scootmartae-21'

const GEAR_ITEMS = [
  {
    emoji: '⛑️',
    name: 'Certified Helmet',
    tagline: 'Legally required by Dubai RTA',
    desc: 'EN1078 / CPSC certified. Mandatory for all riders — AED 200 fine if caught without one.',
    price: 'from AED 89',
    badge: 'REQUIRED BY LAW',
    badgeClass: 'bg-red-500 text-white',
    url: `https://www.amazon.ae/s?k=electric+scooter+helmet+certified+en1078&tag=${AMAZON_TAG}`,
    highlight: true,
  },
  {
    emoji: '🔒',
    name: 'Heavy-Duty U-Lock',
    tagline: "Dubai's #1 scooter theft deterrent",
    desc: 'Hardened steel shackle. Rated Sold Secure Gold. Fits most scooter stems and posts.',
    price: 'from AED 55',
    badge: 'RECOMMENDED',
    badgeClass: 'bg-blue-500 text-white',
    url: `https://www.amazon.ae/s?k=bicycle+u-lock+heavy+duty+gold+rated&tag=${AMAZON_TAG}`,
    highlight: false,
  },
  {
    emoji: '🦺',
    name: 'Reflective Vest',
    tagline: 'Be seen at night on Dubai roads',
    desc: 'High-visibility EN ISO 20471 rated. Essential for Marina, JBR, and highway-side paths.',
    price: 'from AED 25',
    badge: 'SAFETY ESSENTIAL',
    badgeClass: 'bg-amber-500 text-white',
    url: `https://www.amazon.ae/s?k=cycling+reflective+vest+hi+vis&tag=${AMAZON_TAG}`,
    highlight: false,
  },
]

export function SafetyGearStrip() {
  return (
    <section className="bg-neutral-950 py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Section header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-green-400 mb-1">
              Stay Safe · Stay Legal
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Essential Safety Gear
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Dubai RTA mandates helmets for all e-scooter riders.
              Fine: <span className="text-white font-semibold">AED 200</span>.
              Shop Amazon.ae — delivered to your door in 24h.
            </p>
          </div>
        </div>

        {/* Gear cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {GEAR_ITEMS.map(item => (
            <a
              key={item.name}
              href={`/api/out?url=${encodeURIComponent(item.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                item.highlight
                  ? 'border-green-400/30 bg-white/5 hover:bg-white/8 hover:border-green-400/60'
                  : 'border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20'
              }`}
            >
              {/* Required badge ribbon */}
              <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                {item.badge}
              </div>

              <div className="p-6 flex-1">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                <p className={`text-xs font-semibold mb-3 ${item.highlight ? 'text-green-400' : 'text-white/50'}`}>
                  {item.tagline}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="px-6 pb-5 flex items-center justify-between">
                <span className="text-sm font-bold text-white/80">{item.price}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  item.highlight
                    ? 'bg-green-400 text-black group-hover:bg-green-300'
                    : 'bg-white/10 text-white group-hover:bg-white/20'
                }`}>
                  View on Amazon <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-white/25 text-center">
          Affiliate links — we earn a small commission at no extra cost to you.
          Prices shown are starting prices; check Amazon.ae for current availability.
        </p>
      </div>
    </section>
  )
}
