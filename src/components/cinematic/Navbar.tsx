'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Discover', href: '/#storefront' },
  { label: 'Scooters', href: '/browse?type=scooter' },
  { label: 'Gear', href: '/browse?type=accessory' },
  { label: 'Compare', href: '/compare' },
  { label: 'AI Bot', href: '/#scootbot' },
  { label: 'Help', href: '/faq' },
]

export function Navbar({ isDark = false }: { isDark?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = scrolled
    ? 'bg-[rgba(246,244,239,0.88)] backdrop-blur-2xl border-b border-black/5'
    : isDark
    ? 'bg-transparent'
    : 'bg-transparent'

  const textCol = scrolled ? 'text-[#111315]/70' : 'text-white/80'
  const logoCol = scrolled ? 'from-[#2f5cff] to-[#6d8cff]' : 'from-white to-white/80'

  return (
    <header className={`fixed top-0 left-0 right-0 z-[5000] h-16 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className={`font-barlow font-900 text-2xl tracking-[0.2em] uppercase bg-gradient-to-r ${logoCol} bg-clip-text text-transparent`}>
          ScootMart
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-dm font-500 text-sm relative group transition-colors ${textCol} hover:text-[#2f5cff]`}
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#2f5cff] transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/vendor"
            className="hidden md:flex font-barlow font-700 text-sm uppercase tracking-widest bg-[#2f5cff] text-white h-9 px-5 rounded-full items-center hover:scale-[1.03] transition-transform"
          >
            List Your Store
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 ${textCol}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-black/5 px-5 py-4 space-y-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block font-dm font-500 text-sm text-[#111315]/70 py-2 border-b border-black/4 hover:text-[#2f5cff]"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/vendor" className="block font-barlow font-700 text-sm uppercase tracking-widest bg-[#2f5cff] text-white text-center h-10 rounded-full flex items-center justify-center mt-3 hover:opacity-90">
            List Your Store
          </Link>
        </div>
      )}
    </header>
  )
}
