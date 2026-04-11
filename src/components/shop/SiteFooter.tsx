'use client'

import Link from 'next/link'

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All scooters', href: '#shop' },
      { label: 'Commuter', href: '#shop' },
      { label: 'Performance', href: '#shop' },
      { label: 'Off-road', href: '#shop' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Vendor program', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Warranty', href: '#' },
      { label: 'Shipping & returns', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              <span className="font-semibold tracking-tight text-neutral-900 text-lg">
                Scootmart
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              UAE&apos;s curated marketplace for electric scooters and e-bikes.
              Verified vendors. Real specs. Transparent pricing.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Scootmart · UAE · All rights reserved
          </p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
