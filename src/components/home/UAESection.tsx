'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: '🌡️',
    title: 'Tested at 45°C',
    desc: 'Every scooter is real-world tested in UAE heat. Battery performance, tire pressure & braking data included.',
  },
  {
    icon: '🏛️',
    title: 'RTA Compliant',
    desc: 'Verified RTA road-legal models for Dubai, Abu Dhabi & across all 7 emirates.',
  },
  {
    icon: '🔒',
    title: 'Escrow Protected',
    desc: 'Funds held securely until delivery confirmed. 100% buyer protection on every purchase.',
  },
  {
    icon: '🏪',
    title: '50+ Verified Vendors',
    desc: 'From small shops in Al Quoz to premium dealers in Downtown Dubai. All vetted and verified.',
  },
]

export function UAESection() {
  return (
    <section className="bg-[#050505] py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-4">Built for the UAE</p>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-tight tracking-[-0.02em] mb-6">
              The Only Platform
              <br />
              Designed for
              <br />
              <span className="text-emerald-400">UAE Riders.</span>
            </h2>
            <p className="text-white/40 text-lg mb-8 leading-relaxed">
              We don't just list scooters — we test them in 45°C heat, sand, and humidity so you know exactly what to expect on Dubai roads.
            </p>
            <Link
              href="/uae-tested"
              className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all"
            >
              See UAE-Tested results <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/5 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
