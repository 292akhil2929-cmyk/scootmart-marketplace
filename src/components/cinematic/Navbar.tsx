'use client'
// ═══════════════════════════════════════════════════════════
// NAVBAR — DNA-aware with sound toggle
// ═══════════════════════════════════════════════════════════

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, Volume2, VolumeX } from 'lucide-react'
import { useCinematicStore } from '@/store/cinematicStore'

const LINKS = [
  { label: 'Discover', href: '/#storefront' },
  { label: 'Scooters', href: '/browse?type=scooter' },
  { label: 'Gear', href: '/browse?type=accessory' },
  { label: 'Compare', href: '/compare' },
  { label: 'AI Bot', href: '/#scootbot' },
  { label: 'Help', href: '/faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeDNA = useCinematicStore((s) => s.activeDNA)
  const activeZone = useCinematicStore((s) => s.activeZone)
  const audioEnabled = useCinematicStore((s) => s.audioEnabled)
  const toggleAudio = useCinematicStore((s) => s.toggleAudio)

  const isDarkZone = activeZone === 'hero' || activeZone === 'cinematic' || activeZone === 'model'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = scrolled
    ? isDarkZone
      ? 'bg-[rgba(10,10,15,0.88)] backdrop-blur-2xl'
      : 'bg-[rgba(246,244,239,0.88)] backdrop-blur-2xl border-b border-black/5'
    : 'bg-transparent'

  const textCol = scrolled
    ? isDarkZone ? 'text-white/80' : 'text-[#111315]/70'
    : 'text-white/80'

  const primary = activeDNA.primaryColor
  const secondary = activeDNA.secondaryColor

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[5000] h-16 transition-all duration-300 ${navBg}`}
      style={{
        borderBottom: scrolled ? `2px solid ${primary}40` : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-barlow font-900 text-2xl tracking-[0.2em] uppercase bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
          }}
        >
          ScootSphere
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-dm font-500 text-sm relative group transition-colors ${textCol}`}
              style={{ color: undefined }}
            >
              <span className="group-hover:text-transparent group-hover:bg-clip-text"
                style={{ backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})` }}>
                {l.label}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 transition-all duration-200 group-hover:w-full"
                style={{ background: primary }}
              />
            </Link>
          ))}
        </nav>

        {/* Right: sound toggle + CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-all ${textCol} hover:scale-110`}
            aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            title={audioEnabled ? 'Sound on' : 'Sound off'}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-50" />}
          </button>

          <Link
            href="/vendor"
            className="hidden md:flex font-barlow font-700 text-sm uppercase tracking-widest h-9 px-5 rounded-full items-center hover:scale-[1.03] transition-transform text-white"
            style={{
              background: primary,
              boxShadow: `0 0 24px ${primary}60`,
            }}
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
        <div className="md:hidden bg-[rgba(10,10,15,0.96)] backdrop-blur-2xl border-t border-white/5 px-5 py-4 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block font-dm font-500 text-sm text-white/70 py-2 border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { toggleAudio(); setMenuOpen(false) }}
            className="flex items-center gap-2 font-dm text-sm text-white/70 py-2"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {audioEnabled ? 'Sound on' : 'Sound off'}
          </button>
          <Link
            href="/vendor"
            className="block font-barlow font-700 text-sm uppercase tracking-widest text-white text-center h-10 rounded-full flex items-center justify-center mt-3"
            style={{ background: primary }}
          >
            List Your Store
          </Link>
        </div>
      )}
    </header>
  )
}
