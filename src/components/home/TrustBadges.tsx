const badges = [
  { icon: '🔒', title: 'Escrow Protection', desc: 'Funds held safely until you confirm delivery' },
  { icon: '✅', title: 'Verified Sellers', desc: 'Emirates ID and trade license verified' },
  { icon: '🌡️', title: 'UAE-Tested', desc: 'Real performance data in 40°C+ Dubai heat' },
  { icon: '🔋', title: 'Battery Certified', desc: 'Mandatory health check on every used listing' },
  { icon: '🛡️', title: '3-Month Warranty', desc: 'Platform-backed warranty on certified used' },
  { icon: '🚦', title: 'RTA Compliance', desc: 'Guidance on Dubai road permit requirements' },
]

export function TrustBadges() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">Why Buyers & Sellers Trust ScootMart</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map(b => (
            <div key={b.title} className="flex flex-col items-center text-center p-4 bg-background rounded-xl border hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
