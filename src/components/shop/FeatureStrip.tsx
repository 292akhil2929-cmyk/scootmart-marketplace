// How it works — 3 simple steps. Clean, no fluff.

const STEPS = [
  {
    number: '01',
    title: 'Search',
    body: 'Type any brand, model, or budget. We search Amazon.ae, Noon, and verified UAE sellers at once.',
  },
  {
    number: '02',
    title: 'Compare',
    body: 'See real UAE specs side by side — actual range in 40°C heat, RTA compliance, IP rating, and price.',
  },
  {
    number: '03',
    title: 'Buy',
    body: "Click through to the retailer of your choice. No markup, no middleman — you pay the same price you'd pay direct.",
  },
]

export function FeatureStrip() {
  return (
    <section id="features" className="bg-neutral-950 py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-10">
          How it works
        </p>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map(s => (
            <div key={s.number} className="flex gap-5">
              <span className="text-3xl font-bold text-neutral-700 tabular-nums leading-none shrink-0 mt-0.5">
                {s.number}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
