'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageGalleryProps {
  images: string[]
  alt: string
  discount?: number
  rtaCompliant?: boolean
}

export function ImageGallery({ images, alt, discount, rtaCompliant }: ImageGalleryProps) {
  const validImages = images?.filter(Boolean) ?? []
  const [current, setCurrent] = useState(0)
  const [failed, setFailed] = useState<Record<number, boolean>>({})
  const [direction, setDirection] = useState(0)

  // Touch swipe
  const touchStart = useRef<number | null>(null)

  const live = validImages.filter((_, i) => !failed[i])
  const safeIdx = Math.min(current, Math.max(live.length - 1, 0))

  const go = useCallback((dir: number) => {
    setDirection(dir)
    setCurrent(p => (p + dir + live.length) % live.length)
  }, [live.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchStart.current = null
  }

  if (live.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-neutral-100 flex items-center justify-center text-5xl">
        🛴
      </div>
    )
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={safeIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 400, damping: 38 }}
            className="absolute inset-0"
          >
            <Image
              src={live[safeIdx]}
              alt={`${alt} — image ${safeIdx + 1}`}
              fill
              unoptimized
              className="object-contain p-4"
              onError={() => {
                const origIdx = validImages.indexOf(live[safeIdx])
                setFailed(p => ({ ...p, [origIdx]: true }))
                if (safeIdx >= live.length - 1) setCurrent(0)
              }}
              priority={safeIdx === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        {discount && discount > 5 && (
          <span className="absolute top-3 right-3 text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full z-10">
            -{discount}%
          </span>
        )}
        {rtaCompliant && (
          <span className="absolute bottom-3 left-3 text-xs font-semibold bg-green-500 text-white px-2.5 py-1 rounded-full z-10">
            ✓ RTA Compliant
          </span>
        )}

        {/* Nav arrows (only when > 1 image) */}
        {live.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 z-10 transition-all opacity-70 hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-800" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-1.5 z-10 transition-all opacity-70 hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-neutral-800" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {live.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {live.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > safeIdx ? 1 : -1); setCurrent(i) }}
                className={`rounded-full transition-all ${i === safeIdx ? 'bg-neutral-900 w-4 h-1.5' : 'bg-neutral-400/50 w-1.5 h-1.5'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {live.length > 1 && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
            {safeIdx + 1}/{live.length}
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {live.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {live.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > safeIdx ? 1 : -1); setCurrent(i) }}
              className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-100 transition-all ${
                i === safeIdx ? 'ring-2 ring-neutral-900 ring-offset-1' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                unoptimized
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
