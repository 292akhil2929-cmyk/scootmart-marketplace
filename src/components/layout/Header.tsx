'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Heart, Bell, User, ChevronDown, Zap, Sun, Moon, MessageSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { cn, getInitials } from '@/lib/utils'

const NAV = [
  { label: 'Browse', href: '/browse' },
  { label: 'UAE-Tested', href: '/uae-tested' },
  { label: 'Bundles', href: '/bundles' },
]

export function Header() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      if (data.user) {
        supabase.from('profiles').select('*').eq('id', data.user.id).single()
          .then(({ data: p }) => setProfile(p))
        // Fetch unread counts
        supabase.from('notifications').select('*', { count: 'exact', head: true })
          .eq('user_id', data.user.id).eq('read', false)
          .then(({ count }) => setUnreadNotifs(count ?? 0))
        supabase.from('messages').select('*', { count: 'exact', head: true })
          .eq('receiver_id', data.user.id).eq('read', false)
          .then(({ count }) => setUnreadMessages(count ?? 0))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) { setProfile(null); setUnreadNotifs(0); setUnreadMessages(0) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = () => setMenuOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/browse?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const avatarLetter = profile?.display_name ?? profile?.full_name ?? user?.email ?? '?'

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b transition-all duration-200',
      scrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'
    )}>
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="hidden sm:block">
            <span className="text-primary">Scoot</span>
            <span>Mart</span>
            <span className="text-muted-foreground text-sm font-normal">.ae</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search e-scooters, e-bikes..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={cn('px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent',
                pathname.startsWith(n.href) ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              )}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Dark mode */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <>
              {/* Messages */}
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">{unreadMessages}</span>
                  )}
                </Button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
              </Link>

              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">{unreadNotifs}</span>
                  )}
                </Button>
              </Link>

              {/* User menu */}
              <div className="relative" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {getInitials(avatarLetter)}
                  </div>
                  <span className="hidden sm:block max-w-20 truncate text-sm">{profile?.display_name ?? profile?.full_name ?? 'Account'}</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </Button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border bg-popover shadow-lg z-50">
                    <div className="p-1">
                      <div className="px-3 py-2 text-xs text-muted-foreground border-b mb-1">
                        {user.email}
                      </div>
                      <Link href="/account" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Account Settings</Link>
                      <Link href="/buyer/orders" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>My Orders</Link>
                      <Link href="/wishlist" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                      <Link href="/saved-searches" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Saved Searches</Link>
                      <Link href="/notifications" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>
                        Notifications {unreadNotifs > 0 && <span className="ml-auto bg-primary text-white text-xs rounded-full px-1.5">{unreadNotifs}</span>}
                      </Link>
                      {(profile?.role === 'seller' || profile?.role === 'admin') && (
                        <>
                          <hr className="my-1" />
                          <Link href="/seller/dashboard" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Seller Dashboard</Link>
                          <Link href="/seller/orders" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>My Sales</Link>
                          <Link href="/seller/listings/new" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>New Listing</Link>
                          <Link href="/seller/analytics" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Analytics</Link>
                          <Link href="/seller/payouts" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>Payouts</Link>
                        </>
                      )}
                      {profile?.role === 'admin' && (
                        <>
                          <hr className="my-1" />
                          <Link href="/admin" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-primary font-medium" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                          <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-primary" onClick={() => setMenuOpen(false)}>Manage Users</Link>
                          <Link href="/admin/analytics" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-primary" onClick={() => setMenuOpen(false)}>Revenue Analytics</Link>
                          <Link href="/admin/disputes" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-primary" onClick={() => setMenuOpen(false)}>Disputes</Link>
                        </>
                      )}
                      <hr className="my-1" />
                      <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent text-destructive">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(profile?.role === 'seller' || profile?.role === 'admin') && (
                <Link href="/seller/listings/new" className="hidden md:block">
                  <Button size="sm">+ List Item</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-4">
          <form onSubmit={handleSearch} className="pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </form>
          <nav className="mt-3 flex flex-col gap-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">{n.label}</Link>
            ))}
            {user && (
              <>
                <Link href="/messages" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-accent">Messages</Link>
                <Link href="/buyer/orders" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-accent">My Orders</Link>
                {(profile?.role === 'seller' || profile?.role === 'admin') && (
                  <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm rounded-md hover:bg-accent">Seller Dashboard</Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
