'use client'
// Clean 4-up value props with minimal icons. Revealed on scroll.

import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'
import { useReveal } from './useReveal'

const FEATURES = [
  {
    icon: Truck,
    title: 'Free UAE delivery',
    body: 'Free standard shipping on every order. Next-day in Dubai & Abu Dhabi.',
  },
  {
    icon: ShieldCheck,
    title: '2-year warranty',
    body: 'Every ride covered by manufacturer warranty plus our 90-day protection.',
  },
  {
    icon: RotateCcw,
    title: '14-day returns',
    body: 'Not the right fit? Return it within 14 days. No hassle, no restocking fees.',
  },
  {
    icon: Headphones,
    title: 'Real support',
    body: 'Talk to a human 7 days a week. Average reply time: under 2 hours.',
  },
]

export function FeatureStrip() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="features" className="bg-white border-y border-neutral-100 py-16 md:py-20">
      <div ref={ref} className="reveal max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div className="w-10 h-10 rounded-xl bg-neutral-900/5 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-neutral-900" />
              </div>
              <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
