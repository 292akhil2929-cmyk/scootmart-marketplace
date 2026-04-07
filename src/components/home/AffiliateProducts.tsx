'use client'
import { ExternalLink, Star } from 'lucide-react'

const AFFILIATE_TAG = 'scootmart-21'

// Amazon UAE affiliate products — real popular e-scooters
const PRODUCTS = [
  {
    name: 'Xiaomi Electric Scooter 4',
    brand: 'Xiaomi',
    price: 'AED 1,899',
    originalPrice: 'AED 2,299',
    rating: 4.5,
    reviews: 1243,
    badge: 'Best Seller',
    badgeColor: 'bg-orange-500',
    asin: 'B0BJMY4FKS',
    emoji: '🛴',
    specs: ['25 km/h', '35 km range', '12.5 kg', 'IP54'],
  },
  {
    name: 'Segway Ninebot E2 Plus',
    brand: 'Segway',
    price: 'AED 1,299',
    originalPrice: 'AED 1,599',
    rating: 4.3,
    reviews: 876,
    badge: 'Top Rated',
    badgeColor: 'bg-emerald-500',
    asin: 'B09FXWN7HK',
    emoji: '🛴',
    specs: ['20 km/h', '25 km range', '10.5 kg', 'IPX4'],
  },
  {
    name: 'Xiaomi Mi Scooter Pro 2',
    brand: 'Xiaomi',
    price: 'AED 2,499',
    originalPrice: null,
    rating: 4.6,
    reviews: 2105,
    badge: 'UAE Tested',
    badgeColor: 'bg-blue-500',
    asin: 'B082ZYYPB7',
    emoji: '🛴',
    specs: ['25 km/h', '45 km range', '14.2 kg', 'IP54'],
  },
  {
    name: 'Segway Ninebot Max G30D II',
    brand: 'Segway',
    price: 'AED 3,199',
    originalPrice: 'AED 3,799',
    rating: 4.7,
    reviews: 567,
    badge: 'Premium Pick',
    badgeColor: 'bg-purple-500',
    asin: 'B09N69NYKW',
    emoji: '🛴',
    specs: ['25 km/h', '65 km range', '18.7 kg', 'IPX5'],
  },
]

function buildAffiliateUrl(asin: string) {
  return `https://www.amazon.ae/dp/${asin}?tag=${AFFILIATE_TAG}&linkCode=ogi&th=1&psc=1`
}

export function AffiliateProducts() {
  return (
    <section className="bg-[#f5f5f7] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Shop on Amazon UAE</p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[#1d1d1f] leading-tight tracking-[-0.02em]">
              Top-Rated Scooters,
              <br />
              Delivered Fast.
            </h2>
          </div>
          <a
            href={`https://www.amazon.ae/s?k=electric+scooter&tag=${AFFILIATE_TAG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-[#0071e3] hover:underline shrink-0"
          >
            See all on Amazon <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map(p => (
            <a
              key={p.asin}
              href={buildAffiliateUrl(p.asin)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-black/3 group"
            >
              {/* Product image area */}
              <div className="bg-gradient-to-br from-[#f0f0f5] to-[#e8e8ed] h-44 flex items-center justify-center relative">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{p.emoji}</span>
                {p.badge && (
                  <span className={`absolute top-3 left-3 ${p.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-xs text-[#6e6e73] font-medium mb-1">{p.brand}</p>
                <h3 className="font-bold text-[#1d1d1f] text-base leading-tight mb-2">{p.name}</h3>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(p.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#6e6e73]">{p.rating} ({p.reviews.toLocaleString()})</span>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.specs.map(s => (
                    <span key={s} className="text-[11px] bg-[#f5f5f7] text-[#6e6e73] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[#1d1d1f]">{p.price}</span>
                    {p.originalPrice && (
                      <span className="ml-2 text-sm text-[#6e6e73] line-through">{p.originalPrice}</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[#FF9900] text-xs font-bold">
                    amazon
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-[#6e6e73] mt-8">
          As an Amazon Associate, ScootMart earns from qualifying purchases. Prices may vary.
        </p>
      </div>
    </section>
  )
}
