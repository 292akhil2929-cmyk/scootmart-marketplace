import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react'
import { MinimalNav } from '@/components/shop/MinimalNav'
import { SiteFooter } from '@/components/shop/SiteFooter'

export const metadata: Metadata = {
  title: 'Safety Gear — ScootMart.ae',
  description:
    'UAE-legal safety gear for electric scooter riders. RTA compliant helmets, locks, lights, and protective gear — curated by ScootMart.',
}

const AMAZON_TAG    = 'scootmartae-21'
const NOON_PARTNER  = '518012'

function amazonLink(asin: string) {
  return `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/dp/${asin}?tag=${AMAZON_TAG}`)}`
}
function noonLink(q: string) {
  const search = `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(q)}`
  return `/api/out?url=${encodeURIComponent(`https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(search)}`)}`
}

// ScootMart curated safety gear — real products available in UAE
const GEAR = [
  {
    id: 'helmet-1',
    category: 'Helmets',
    name: 'Certified Road Helmet',
    subtitle: 'EN1078 · CPSC approved · Dubai RTA legal',
    description:
      'Full-shell ABS helmet with aerodynamic vents, removable liner, and reflective strips. Meets UAE road standards. Available in sizes S–XL.',
    price: 'AED 89–149',
    badge: 'RTA REQUIRED',
    badgeColor: 'bg-red-500 text-white',
    emoji: '⛑️',
    stores: [
      { label: 'Amazon.ae', url: amazonLink('B08XXXXXX1'), primary: true },
      { label: 'Noon', url: noonLink('electric scooter helmet certified EN1078') },
    ],
    highlight: true,
    tag: 'bestseller',
  },
  {
    id: 'helmet-2',
    category: 'Helmets',
    name: 'Urban Half-Shell Helmet',
    subtitle: 'Lightweight · Commuter style · RTA approved',
    description:
      'Sleek half-shell design popular in Dubai and Abu Dhabi. In-mould EPS liner, magnetic buckle, 12-vent airflow. Looks great at the office.',
    price: 'AED 99–179',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-blue-500 text-white',
    emoji: '🪖',
    stores: [
      { label: 'Amazon.ae', url: amazonLink('B09HELMET2'), primary: true },
      { label: 'Noon', url: noonLink('urban cycling helmet half shell') },
    ],
    highlight: false,
  },
  {
    id: 'lock-1',
    category: 'Security',
    name: 'Heavy-Duty U-Lock',
    subtitle: 'Sold Secure Gold · Hardened steel · 14mm shackle',
    description:
      'Gold-rated security. 14mm hardened steel shackle resists bolt cutters and angle grinders. Fits most scooter stems. Comes with 3 keys + bracket mount.',
    price: 'AED 55–110',
    badge: 'GOLD RATED',
    badgeColor: 'bg-amber-500 text-white',
    emoji: '🔒',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=u+lock+bicycle+gold+rated+heavy+duty&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('heavy duty u lock bicycle gold rated') },
    ],
    highlight: false,
  },
  {
    id: 'vest-1',
    category: 'Visibility',
    name: 'Hi-Vis Reflective Vest',
    subtitle: 'EN ISO 20471 · 360° visibility · Dubai night riding',
    description:
      'Class 2 high-visibility vest with 360° reflective strips. Breathable mesh — stays cool in UAE heat. Fits over any jacket or backpack. Essential for after-dark rides.',
    price: 'AED 25–49',
    badge: 'NIGHT ESSENTIAL',
    badgeColor: 'bg-green-600 text-white',
    emoji: '🦺',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=cycling+reflective+vest+hi+vis+EN+ISO+20471&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('cycling reflective safety vest high visibility') },
    ],
    highlight: false,
  },
  {
    id: 'lights-1',
    category: 'Visibility',
    name: 'Front & Rear LED Light Set',
    subtitle: 'USB rechargeable · IPX5 waterproof · 200 lm front',
    description:
      'Clip-on LED set (200 lm front + 50 lm rear). 5 modes including daylight flash. Charges via USB-C in 1.5h. Waterproof — handles the rare Dubai rain shower.',
    price: 'AED 35–79',
    badge: 'RECOMMENDED',
    badgeColor: 'bg-blue-500 text-white',
    emoji: '💡',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=bike+front+rear+LED+light+set+USB+rechargeable&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('bicycle LED light set USB rechargeable waterproof') },
    ],
    highlight: false,
  },
  {
    id: 'gloves-1',
    category: 'Protection',
    name: 'Scooter Riding Gloves',
    subtitle: 'Touchscreen-compatible · Palm padding · UAE heat vented',
    description:
      'Half-finger gloves with gel palm inserts for vibration dampening. Touchscreen fingertips so you can use your phone without removing them. Ventilated mesh back.',
    price: 'AED 45–89',
    badge: 'NEW ARRIVAL',
    badgeColor: 'bg-neutral-700 text-white',
    emoji: '🧤',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=electric+scooter+riding+gloves+touchscreen+gel+palm&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('cycling gloves touchscreen gel palm scooter') },
    ],
    highlight: false,
  },
  {
    id: 'knee-1',
    category: 'Protection',
    name: 'Knee & Elbow Pad Set',
    subtitle: 'Hard-shell cap · EVA foam · Adjustable straps',
    description:
      'Full set: knee pads + elbow pads. Hard ABS outer shell + EVA foam shock absorption. Non-slip inner lining. Recommended for beginners and urban riders.',
    price: 'AED 65–120',
    badge: 'BEGINNER PICK',
    badgeColor: 'bg-purple-500 text-white',
    emoji: '🦿',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=knee+elbow+pad+set+scooter+skateboard+protective&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('knee elbow pad set protective scooter skateboard') },
    ],
    highlight: false,
  },
  {
    id: 'bag-1',
    category: 'Accessories',
    name: 'Waterproof Handlebar Bag',
    subtitle: '5L · Phone mount · Quick-release',
    description:
      'Mount onto any scooter handlebar. TPU waterproof material, 5L capacity, transparent phone window (up to 6.9"), quick-release buckle. Perfect for Dubai commutes.',
    price: 'AED 49–99',
    badge: 'COMMUTER FAVE',
    badgeColor: 'bg-teal-500 text-white',
    emoji: '🎒',
    stores: [
      { label: 'Amazon.ae', url: `/api/out?url=${encodeURIComponent(`https://www.amazon.ae/s?k=scooter+handlebar+bag+waterproof+phone+mount&tag=${AMAZON_TAG}`)}`, primary: true },
      { label: 'Noon', url: noonLink('scooter handlebar bag waterproof phone mount') },
    ],
    highlight: false,
  },
]

const CATEGORIES = [...new Set(GEAR.map(g => g.category))]

export default function SafetyGearPage() {
  return (
    <main className="bg-white text-neutral-900 antialiased min-h-screen">
      <MinimalNav />

      {/* Hero */}
      <section className="bg-neutral-950 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to ScootMart
          </Link>

          <div className="flex items-start gap-5 mb-8">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-green-400/10 border border-green-400/20 flex items-center justify-center text-2xl">
              ⛑️
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400 mb-2">
                <Shield className="w-3 h-3" /> ScootMart Safety Collection
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                Ride Safe in the UAE
              </h1>
              <p className="text-white/50 text-sm md:text-base max-w-xl leading-relaxed">
                Curated safety gear for Dubai, Abu Dhabi, and Sharjah riders.
                Every item meets UAE road standards — because getting there is the point.
              </p>
            </div>
          </div>

          {/* RTA Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-300 mb-0.5">
                Dubai RTA Regulation — Helmets are Mandatory
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                All e-scooter riders in Dubai must wear a certified helmet.
                Fine for non-compliance: <span className="text-white font-semibold">AED 200</span> per incident.
                Helmet must be EN1078 or CPSC certified. This applies on all public roads and tracks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {CATEGORIES.map(cat => (
            <div key={cat} className="mb-14">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-3">
                {cat}
                <span className="flex-1 h-px bg-neutral-100" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {GEAR.filter(g => g.category === cat).map(item => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border flex flex-col overflow-hidden transition-shadow hover:shadow-md ${
                      item.highlight
                        ? 'border-neutral-900 bg-neutral-950'
                        : 'border-neutral-200 bg-white'
                    }`}
                  >
                    {/* Emoji display */}
                    <div className={`px-6 pt-6 pb-4 flex items-start justify-between ${item.highlight ? 'bg-neutral-900/50' : 'bg-neutral-50'}`}>
                      <span className="text-4xl">{item.emoji}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 flex-1 flex flex-col">
                      <h3 className={`text-base font-bold mb-0.5 ${item.highlight ? 'text-white' : 'text-neutral-900'}`}>
                        {item.name}
                      </h3>
                      <p className={`text-xs font-medium mb-3 ${item.highlight ? 'text-green-400' : 'text-neutral-400'}`}>
                        {item.subtitle}
                      </p>
                      <p className={`text-sm leading-relaxed flex-1 ${item.highlight ? 'text-white/60' : 'text-neutral-600'}`}>
                        {item.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-neutral-100/10">
                        <p className={`text-sm font-bold mb-3 ${item.highlight ? 'text-white' : 'text-neutral-900'}`}>
                          {item.price}
                        </p>
                        <div className="flex flex-col gap-2">
                          {item.stores.map(store => (
                            <a
                              key={store.label}
                              href={store.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl transition-colors ${
                                store.primary
                                  ? item.highlight
                                    ? 'bg-green-400 text-black hover:bg-green-300'
                                    : 'bg-neutral-950 text-white hover:bg-neutral-800'
                                  : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                              }`}
                            >
                              {store.label}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Affiliate notice */}
          <p className="text-center text-xs text-neutral-400 mt-4">
            ScootMart earns affiliate commission on Amazon.ae and Noon links — at no extra cost to you.
            Prices are indicative; check store for current availability and exact pricing.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
