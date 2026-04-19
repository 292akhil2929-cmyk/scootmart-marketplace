import Link from 'next/link'
import { Mail, Globe, Heart } from 'lucide-react'

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
              <span className="font-bold tracking-tight text-neutral-900 text-lg">ScootMart.ae</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-4">
              UAE's e-scooter &amp; e-bike comparison platform. Find the best deal across Amazon.ae, Noon, and verified local sellers — all in one place.
            </p>

            {/* Contact links */}
            <div className="space-y-2 mb-4">
              <a
                href="mailto:scootmartae@gmail.com"
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
              >
                <Mail className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
                scootmartae@gmail.com
              </a>
              <a
                href="https://scootmart.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors group"
              >
                <Globe className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
                scootmart.ae
              </a>
            </div>

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

        {/* About Us */}
        <div className="mb-10 rounded-2xl bg-neutral-50 border border-neutral-100 px-7 py-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="shrink-0 text-3xl select-none">⚡</div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" /> Our Story
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed max-w-2xl">
              ScootMart was born in a college dorm room. We're two students from the UAE who got tired of spending hours jumping between Amazon, Noon, and random seller WhatsApp groups just to find a decent scooter at a fair price. We thought — <em>why isn't there a Skyscanner for this?</em>
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl mt-2">
              We have no investors, no office, no guarantee this works. Just two laptops, a shared dream, and a genuine belief that sustainable transport in the UAE deserves better than a Google search. Every listing you browse, every comparison you make — it means everything to us.
            </p>
            <p className="text-sm text-neutral-500 mt-3 font-medium">
              If you love what we're building, tell a friend. That's all we ask. 🛴
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} ScootMart.ae · Built with ❤️ in the UAE
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:scootmartae@gmail.com" className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors">
              scootmartae@gmail.com
            </a>
            <span className="text-neutral-200">·</span>
            <a href="https://scootmart.ae" target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors">
              scootmart.ae
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
