'use client'
// Clean, minimal top nav. Sticky, frosted on scroll.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const LINKS = [
  { href: '#shop', label: 'Shop' },
  { href: '#features', label: 'Features' },
  { href: '#compare', label: 'Compare' },
  { href: '#faq', label: 'Support' },
]

export function MinimalNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-black/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <span className="font-semibold tracking-tight text-neutral-900 text-lg">
            Scootmart
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            aria-label="Cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>
          {user ? (
            <Link
              href="/buyer/orders"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors"
              title="My Account"
            >
              <User className="w-4 h-4 text-neutral-800" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center h-9 px-4 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Sign in
            </Link>
          )}
          <a
            href="#shop"
            className="hidden md:inline-flex items-center h-9 px-4 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Shop Now
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-b border-black/5">
          <nav className="px-5 py-4 flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-neutral-800 border-b border-neutral-100 last:border-0"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/buyer/orders"
                onClick={() => setOpen(false)}
                className="mt-3 text-center py-3 rounded-full border border-neutral-300 text-neutral-800 text-sm font-medium"
              >
                My Account
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 text-center py-3 rounded-full border border-neutral-300 text-neutral-800 text-sm font-medium"
              >
                Sign in
              </Link>
            )}
            <a
              href="#shop"
              onClick={() => setOpen(false)}
              className="mt-2 text-center py-3 rounded-full bg-neutral-900 text-white text-sm font-medium"
            >
              Shop Now
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
