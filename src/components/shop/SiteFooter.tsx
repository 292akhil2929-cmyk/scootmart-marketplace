import Link from 'next/link'

const COLS = [
  {
    title: 'Browse',
    links: [
      { label: 'All scooters', href: '/browse' },
      { label: 'RTA Compliant', href: '/browse?rta_compliant=true' },
      { label: 'Under AED 2,000', href: '/browse?max_price=2000' },
      { label: 'Compare models', href: '/compare' },
    ],
  },
  {
    title: 'Platforms',
    links: [
      { label: 'Amazon.ae deals', href: '/browse?source=amazon' },
      { label: 'Noon deals', href: '/browse?source=noon' },
      { label: 'UAE sellers', href: '/browse?type=p2p' },
      { label: 'Sell on ScootMart', href: '/seller/listings/new' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms of Use', href: '/legal/terms' },
      { label: 'Affiliate Disclosure', href: '/legal/terms' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-sm font-bold">S</div>
              <span className="font-bold tracking-tight text-neutral-900 text-lg">ScootMart</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-4">
              UAE's e-scooter comparison platform. We aggregate listings from Amazon.ae, Noon, and verified local sellers so you can find the best deal in one place.
            </p>
            <p className="text-xs text-neutral-400">
              We earn affiliate commissions on some links — at no extra cost to you.
            </p>
          </div>

          {COLS.map(col => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} ScootMart · UAE · All rights reserved
          </p>
          <p className="text-xs text-neutral-400">
            Questions? <a href="mailto:hello@scootmart.com" className="hover:text-neutral-900 transition-colors">hello@scootmart.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
