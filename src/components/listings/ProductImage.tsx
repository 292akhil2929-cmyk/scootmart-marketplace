'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex items-center justify-center h-full text-4xl bg-neutral-100">🛴</div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      onError={() => setFailed(true)}
    />
  )
}
