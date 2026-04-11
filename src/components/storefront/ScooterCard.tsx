'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import type { Scooter } from '@/data/scooters'
import { getAmazonUrl } from '@/data/scooters'
import { scooterFrames } from '@/data/scooterFrames'

interface Props {
  scooter: Scooter
  onCompare?: (id: number) => void
  comparing?: boolean
}

const BADGE_STYLES: Record<string, string> = {
  sale:  'bg-[#17835f] text-white',
  hot:   'bg-[#f46a2f] text-white',
  new:   'bg-[#2f5cff] text-white',
  beast: 'bg-[#d93f4f] text-white',
}

// Inline SVG thumbnail at 3/4 angle (frame 9)
function ScooterThumb({ frameIdx = 9 }: { frameIdx?: number }) {
  const svg = scooterFrames[frameIdx] ?? scooterFrames[0]
  return (
    <div
      className="w-full h-48 flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ transform: 'scale(0.55)', transformOrigin: 'center' }}
    />
  )
}

export function ScooterCard({ scooter: s, onCompare, comparing }: Props) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="group relative bg-white rounded-3xl border border-[rgba(17,19,21,0.06)] shadow-[0_4px_40px_rgba(17,19,21,0.06)] hover:shadow-[0_8px_60px_rgba(47,92,255,0.15)] hover:-translate-y-2 hover:border-[rgba(47,92,255,0.3)] transition-all duration-300 overflow-hidden">

      {/* Badge */}
      {s.badge && (
        <span className={`absolute top-4 left-4 z-10 font-barlow font-700 text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full ${BADGE_STYLES[s.badge]}`}>
          {s.badge === 'beast' ? '🔥 BEAST' : s.badge.toUpperCase()}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setLiked(l => !l)}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-all"
        aria-label="Wishlist"
      >
        <Heart
          className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-[#111315]/30'}`}
        />
      </button>

      {/* Scooter illustration */}
      <div className="bg-[#f6f4ef] overflow-hidden rounded-t-3xl">
        <ScooterThumb frameIdx={9} />
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="font-dm text-xs text-[#111315]/40 font-500 mb-0.5">{s.brand}</p>
        <h3 className="font-barlow font-700 text-xl text-[#111315] leading-tight mb-2">{s.model}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`h-3 w-3 ${i <= Math.floor(s.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-[#e8e3db]'}`} />
            ))}
          </div>
          <span className="font-dm text-xs text-[#111315]/40">{s.rating} ({s.reviews})</span>
        </div>

        {/* Specs row */}
        <div className="flex gap-3 text-xs text-[#111315]/50 font-dm mb-4 flex-wrap">
          <span>🔋 {s.range}</span>
          <span>⚡ {s.speed}</span>
          <span>🔧 {s.motor}</span>
          <span>⚖️ {s.weight}</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="font-barlow font-900 text-[1.75rem] leading-none text-[#2f5cff]">
            AED {s.price.toLocaleString()}
          </span>
          {s.oldPrice && (
            <span className="font-dm text-sm text-[#111315]/30 line-through mb-0.5">
              AED {s.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={s.amazonAsin ? getAmazonUrl(s.amazonAsin) : `/browse?q=${encodeURIComponent(s.brand + ' ' + s.model)}`}
            target={s.amazonAsin ? '_blank' : undefined}
            rel={s.amazonAsin ? 'noopener noreferrer' : undefined}
            className="flex-1 font-barlow font-600 text-xs uppercase tracking-widest border border-[rgba(17,19,21,0.12)] text-[#111315]/60 rounded-xl py-2.5 text-center hover:bg-[#f6f4ef] transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => onCompare?.(s.id)}
            className={`flex-1 font-barlow font-600 text-xs uppercase tracking-widest rounded-xl py-2.5 transition-all ${
              comparing
                ? 'bg-[#2f5cff] text-white'
                : 'border border-[#2f5cff] text-[#2f5cff] hover:bg-[#2f5cff] hover:text-white'
            }`}
          >
            {comparing ? '✓ Selected' : '+ Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}
