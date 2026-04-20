import Link from 'next/link'
import { Shield, ChevronRight, AlertTriangle } from 'lucide-react'

const PREVIEW_ITEMS = [
  { emoji: '⛑️', name: 'Helmets',         badge: 'RTA REQUIRED', badgeColor: 'bg-red-500 text-white',    from: 'AED 89' },
  { emoji: '🔒', name: 'Security Locks',  badge: 'GOLD RATED',   badgeColor: 'bg-amber-500 text-white',  from: 'AED 55' },
  { emoji: '🦺', name: 'Reflective Vests',badge: 'NIGHT SAFETY', badgeColor: 'bg-green-600 text-white',  from: 'AED 25' },
  { emoji: '🧤', name: 'Riding Gloves',   badge: 'COMFORT',      badgeColor: 'bg-blue-500 text-white',   from: 'AED 45' },
]

export function SafetyGearStrip() {
  return (
    <section className="bg-neutral-950 py-14">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-green-400 mb-1">
                Stay Safe · Stay Legal
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                ScootMart Safety Store
              </h2>
            </div>
          </div>
          <Link
            href="/safety-gear"
            className="shrink-0 inline-flex items-center gap-1.5 bg-green-400 text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-green-300 transition-colors"
          >
            Shop All Safety Gear <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* RTA warning banner */}
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 mb-8">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 leading-relaxed">
            <span className="font-bold text-red-300">Dubai RTA law</span> — all e-scooter riders must wear a certified helmet.
            Fine: <span className="font-bold text-white">AED 200</span>. Shop our curated gear below.
          </p>
        </div>

        {/* Preview cards — click any to go to /safety-gear */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {PREVIEW_ITEMS.map(item => (
            <Link
              key={item.name}
              href="/safety-gear"
              className="group relative rounded-2xl border border-white/10 bg-white/3 hover:bg-white/7 hover:border-white/20 transition-all flex flex-col p-5 cursor-pointer"
            >
              <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${item.badgeColor}`}>
                {item.badge}
              </span>
              <span className="text-3xl mb-3">{item.emoji}</span>
              <span className="text-sm font-bold text-white mb-1">{item.name}</span>
              <span className="text-xs text-white/40">from {item.from}</span>
              <span className="mt-3 text-[10px] font-bold text-green-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Shop now <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        <p className="text-[11px] text-white/25 text-center">
          ScootMart curated picks · Affiliate commission on some links at no extra cost to you
        </p>
      </div>
    </section>
  )
}
