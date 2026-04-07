'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  {
    title: 'Electric Scooters',
    subtitle: 'Top-speed. Long range. UAE-tested.',
    href: '/browse?type=scooter',
    gradient: 'from-emerald-900/80 via-emerald-950/60 to-black/90',
    accent: '#30d158',
    videoSrc: '/videos/scooter.mp4',
    bgColor: '#0a1f12',
    icon: '🛴',
    stat: '300+ models',
  },
  {
    title: 'Electric Bikes',
    subtitle: 'Commute smarter. Ride further.',
    href: '/browse?type=ebike',
    gradient: 'from-blue-900/80 via-blue-950/60 to-black/90',
    accent: '#0071e3',
    videoSrc: '/videos/ebike.mp4',
    bgColor: '#050a1a',
    icon: '🚴',
    stat: '150+ models',
  },
  {
    title: 'Accessories',
    subtitle: 'Helmets, locks, chargers & more.',
    href: '/browse?type=accessory',
    gradient: 'from-purple-900/80 via-purple-950/60 to-black/90',
    accent: '#bf5af2',
    videoSrc: '/videos/accessories.mp4',
    bgColor: '#0f0518',
    icon: '🔋',
    stat: '500+ items',
  },
  {
    title: 'Help Centre',
    subtitle: 'Expert guides, buying advice & support.',
    href: '/faq',
    gradient: 'from-slate-800/80 via-slate-900/60 to-black/90',
    accent: '#98989d',
    videoSrc: '/videos/help.mp4',
    bgColor: '#0a0a0e',
    icon: '💬',
    stat: '24/7 support',
  },
]

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleEnter = () => {
    setHovered(true)
    videoRef.current?.play().catch(() => {})
  }
  const handleLeave = () => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Link
      href={cat.href}
      className="relative group rounded-3xl overflow-hidden block"
      style={{ backgroundColor: cat.bgColor, minHeight: '360px' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Animated gradient bg */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-opacity duration-700`}
        style={{ opacity: hovered ? 0.5 : 0.8 }}
      />

      {/* Video (plays on hover) */}
      <video
        ref={videoRef}
        src={cat.videoSrc}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{ opacity: hovered ? 0.35 : 0, transform: hovered ? 'scale(1.05)' : 'scale(1.0)' }}
      />

      {/* Glow dot */}
      <div
        className="absolute top-6 right-6 w-2 h-2 rounded-full opacity-60"
        style={{ backgroundColor: cat.accent, boxShadow: `0 0 12px ${cat.accent}` }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col h-full justify-between" style={{ minHeight: '360px' }}>
        {/* Top */}
        <div>
          <div className="text-4xl mb-4">{cat.icon}</div>
          <h3 className="text-3xl font-bold text-white leading-tight">{cat.title}</h3>
          <p className="text-white/50 mt-2 text-sm max-w-xs">{cat.subtitle}</p>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-8">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{cat.stat}</span>
          <span
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
            style={{ color: cat.accent }}
          >
            Explore <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-3xl border-2 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: cat.accent, opacity: hovered ? 0.3 : 0 }}
      />
    </Link>
  )
}

export function CategorySection() {
  return (
    <section className="bg-[#050505] py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-3">Browse By Category</p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white leading-tight tracking-[-0.02em]">
            Everything Electric,
            <br />
            <span className="text-white/40">All in One Place.</span>
          </h2>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.title} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
