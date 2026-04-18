'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const LINKS = [
  { href: '/browse', label: 'Browse' },
  { href: '/compare', label: 'Compare' },
  { href: '/browse?rta_compliant=true', label: 'RTA Compliant' },
]

export function MinimalNav() {
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    const supabase = supabaseRef.current
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-sm font-bold">S</div>
          <span className="font-bold text-neutral-900 text-lg tracking-tight">ScootMart</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {loggedIn ? (
            <Link href="/buyer/orders" title="My Account"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors">
              <User className="w-4 h-4 text-neutral-700" />
            </Link>
          ) : (
            <Link href="/login"
              className="flex items-center h-9 px-4 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Sign in
            </Link>
          )}
          <Link href="/browse"
            className="hidden md:flex items-center h-9 px-4 rounded-full bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors">
            Browse all
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-neutral-100">
          <nav className="px-5 py-3 flex flex-col">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-neutral-800 border-b border-neutral-100 last:border-0">
                {l.label}
              </Link>
            ))}
            <Link href="/browse" onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-neutral-800">
              Browse all
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
