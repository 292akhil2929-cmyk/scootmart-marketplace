'use client'

const BRANDS = [
  { name: 'Xiaomi', emoji: '⚡' },
  { name: 'Segway', emoji: '🛴' },
  { name: 'NIU', emoji: '🔋' },
  { name: 'Kaabo', emoji: '⚡' },
  { name: 'VSETT', emoji: '🚀' },
  { name: 'Inokim', emoji: '🌟' },
  { name: 'Mercane', emoji: '⚡' },
  { name: 'Zero', emoji: '🔥' },
  { name: 'Apollo', emoji: '🚀' },
  { name: 'Dualtron', emoji: '⚡' },
  { name: 'Nami', emoji: '🌊' },
  { name: 'Speedway', emoji: '💨' },
]

export function BrandsMarquee() {
  const doubled = [...BRANDS, ...BRANDS]
  return (
    <section className="bg-[#050505] py-16 overflow-hidden border-y border-white/5">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/30">50+ Brands Available</p>
      </div>
      <div className="relative">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/8 bg-white/3 shrink-0 cursor-default hover:border-emerald-500/30 hover:bg-white/6 transition-all"
            >
              <span className="text-base">{brand.emoji}</span>
              <span className="text-sm font-medium text-white/60">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
