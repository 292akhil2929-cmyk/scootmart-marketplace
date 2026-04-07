'use client'
import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'

const COMPARE_DATA = [
  {
    name: 'Xiaomi 4 Pro',
    price: 'AED 2,199',
    image: '🛴',
    specs: {
      range: '55 km',
      speed: '25 km/h',
      weight: '14.9 kg',
      motor: '700W',
      battery: '446 Wh',
      waterproof: 'IP55',
      foldable: true,
      dualMotor: false,
    }
  },
  {
    name: 'Segway Max G2',
    price: 'AED 3,499',
    image: '🛴',
    highlight: true,
    specs: {
      range: '70 km',
      speed: '25 km/h',
      weight: '19.7 kg',
      motor: '900W',
      battery: '551 Wh',
      waterproof: 'IP55',
      foldable: true,
      dualMotor: false,
    }
  },
  {
    name: 'Kaabo Wolf King',
    price: 'AED 8,999',
    image: '🛴',
    specs: {
      range: '100 km',
      speed: '80 km/h',
      weight: '52 kg',
      motor: '2×1200W',
      battery: '1320 Wh',
      waterproof: 'IP54',
      foldable: false,
      dualMotor: true,
    }
  },
]

const SPEC_LABELS: Record<string, string> = {
  range: '🔋 Range',
  speed: '⚡ Top Speed',
  weight: '⚖️ Weight',
  motor: '🔧 Motor',
  battery: '🔌 Battery',
  waterproof: '💧 Waterproof',
  foldable: '📦 Foldable',
  dualMotor: '🚀 Dual Motor',
}

export function ComparisonTeaser() {
  return (
    <section className="bg-[#1d1d1f] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-3">Smart Comparison</p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white leading-tight tracking-[-0.02em]">
            Compare Side by Side.
            <br />
            <span className="text-white/30">Decide with Confidence.</span>
          </h2>
          <p className="text-white/40 mt-4 text-base max-w-lg mx-auto">
            Real spec data aggregated from verified UAE vendors. No guesswork.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left p-5 text-white/30 font-medium text-xs uppercase tracking-wide w-32">Specification</th>
                {COMPARE_DATA.map(s => (
                  <th key={s.name} className={`p-5 text-center ${s.highlight ? 'bg-emerald-500/10' : ''}`}>
                    <div className="text-3xl mb-2">{s.image}</div>
                    <div className={`font-bold text-base ${s.highlight ? 'text-emerald-400' : 'text-white'}`}>{s.name}</div>
                    <div className="text-white/40 text-sm mt-0.5">{s.price}</div>
                    {s.highlight && <div className="mt-2 inline-block text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Best Value</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(SPEC_LABELS).map(([key, label]) => (
                <tr key={key} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4 text-white/40 text-xs font-medium">{label}</td>
                  {COMPARE_DATA.map(s => {
                    const val = s.specs[key as keyof typeof s.specs]
                    return (
                      <td key={s.name} className={`p-4 text-center ${s.highlight ? 'bg-emerald-500/5' : ''}`}>
                        {typeof val === 'boolean' ? (
                          val
                            ? <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                            : <Minus className="h-4 w-4 text-white/20 mx-auto" />
                        ) : (
                          <span className={`font-semibold ${s.highlight ? 'text-emerald-300' : 'text-white/80'}`}>{val as string}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 bg-white text-[#1d1d1f] font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all hover:scale-[1.02] shadow-xl"
          >
            Compare Any Scooters <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-white/25 text-xs mt-3">Choose from 500+ models in our database</p>
        </div>
      </div>
    </section>
  )
}
