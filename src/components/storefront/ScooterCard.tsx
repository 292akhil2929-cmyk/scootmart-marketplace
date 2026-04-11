'use client'
// ═══════════════════════════════════════════════════════════
// SCOOTER CARD — DNA-aware hover glow, triggers ModelCinematic
// ═══════════════════════════════════════════════════════════

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import type { Scooter } from '@/data/scooters'
import { getAmazonUrl } from '@/data/scooters'
import { getDNA } from '@/data/scooterDNA'
import { scooterFrames } from '@/data/scooterFrames'
import { useCinematicStore } from '@/store/cinematicStore'

interface Props {
  scooter: Scooter
  onCompare?: (id: number) => void
  comparing?: boolean
}

const CATEGORY_BADGE: Record<string, { label: string; bg: string }> = {
  SPEED: { label: 'SPEED', bg: '#ff2200' },
  ECO: { label: 'ECO', bg: '#00c853' },
  LUXURY: { label: 'LUXURY', bg: '#c9981a' },
  BEAST: { label: 'BEAST', bg: '#c0392b' },
  COMMUTER: { label: 'COMMUTER', bg: '#f46a2f' },
  PERFORMANCE: { label: 'PERFORMANCE', bg: '#2f5cff' },
}

function ScooterThumb({ frameIdx = 9 }: { frameIdx?: number }) {
  const svg = scooterFrames[frameIdx] ?? scooterFrames[0]
  return (
    <div
      className="w-full h-48 flex items-center justify-center pointer-events-none"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ transform: 'scale(0.55)', transformOrigin: 'center' }}
    />
  )
}

export function ScooterCard({ scooter: s, onCompare, comparing }: Props) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const openModel = useCinematicStore((st) => st.openModel)
  const dna = getDNA(s.id)
  const badge = CATEGORY_BADGE[dna.category] ?? { label: dna.category, bg: dna.primaryColor }

  return (
    <div
      className="group relative bg-white rounded-3xl border border-[rgba(17,19,21,0.06)] transition-all duration-300 overflow-hidden"
      style={{
        boxShadow: hovered
          ? `0 24px 60px ${dna.primaryColor}35, 0 0 0 1.5px ${dna.primaryColor}66`
          : '0 4px 40px rgba(17,19,21,0.06)',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Category badge */}
      <span
        className="absolute top-4 left-4 z-10 font-barlow font-700 text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full text-white"
        style={{ background: badge.bg, boxShadow: `0 0 20px ${badge.bg}66` }}
      >
        {badge.label}
      </span>

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); setLiked((l) => !l) }}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-all"
        aria-label="Wishlist"
      >
        <Heart
          className={`h-4 w-4 transition-all duration-200 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-[#111315]/30'}`}
        />
      </button>

      {/* Illustration — clickable */}
      <button
        type="button"
        onClick={() => openModel(s.id)}
        className="w-full text-left"
        aria-label={`Open ${s.brand} ${s.model} cinematic`}
      >
        <div
          className="overflow-hidden rounded-t-3xl transition-colors duration-300"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${dna.primaryColor}12, #f6f4ef)`
              : '#f6f4ef',
          }}
        >
          <ScooterThumb frameIdx={9} />
        </div>
      </button>

      {/* Info */}
      <div className="p-5">
        <p className="font-dm text-xs text-[#111315]/40 font-500 mb-0.5">{s.brand}</p>
        <h3 className="font-barlow font-700 text-xl text-[#111315] leading-tight mb-2">{s.model}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-3 w-3 ${i <= Math.floor(s.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-[#e8e3db]'}`} />
            ))}
          </div>
          <span className="font-dm text-xs text-[#111315]/40">{s.rating} ({s.reviews})</span>
        </div>

        {/* Specs row with DNA colors */}
        <div className="flex gap-3 text-xs font-dm mb-4 flex-wrap">
          <span style={{ color: dna.specColors.range }}>🔋 {s.range}</span>
          <span style={{ color: dna.specColors.speed }}>⚡ {s.speed}</span>
          <span style={{ color: dna.specColors.motor }}>🔧 {s.motor}</span>
          <span style={{ color: dna.specColors.weight }}>⚖️ {s.weight}</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span
            className="font-barlow font-900 text-[1.75rem] leading-none"
            style={{ color: dna.primaryColor }}
          >
            AED {s.price.toLocaleString()}
          </span>
          {s.oldPrice && (
            <span className="font-dm text-sm text-[#111315]/30 line-through mb-0.5">
              AED {s.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => openModel(s.id)}
            className="flex-1 font-barlow font-600 text-xs uppercase tracking-widest rounded-xl py-2.5 text-white transition-all hover:scale-[1.02]"
            style={{
              background: dna.primaryColor,
              boxShadow: `0 0 20px ${dna.primaryColor}40`,
            }}
          >
            View Details
          </button>
          <button
            onClick={() => onCompare?.(s.id)}
            className="flex-1 font-barlow font-600 text-xs uppercase tracking-widest rounded-xl py-2.5 transition-all"
            style={{
              border: `1.5px solid ${dna.primaryColor}`,
              color: comparing ? '#ffffff' : dna.primaryColor,
              background: comparing ? dna.primaryColor : 'transparent',
            }}
          >
            {comparing ? '✓ Selected' : '+ Compare'}
          </button>
        </div>

        {s.amazonAsin && (
          <Link
            href={getAmazonUrl(s.amazonAsin)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block text-center font-dm text-[10px] uppercase tracking-widest text-[#111315]/40 hover:text-[#111315] mt-3"
          >
            Also on Amazon.ae →
          </Link>
        )}
      </div>
    </div>
  )
}
