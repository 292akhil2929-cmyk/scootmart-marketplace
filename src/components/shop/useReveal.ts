'use client'
// Tiny IntersectionObserver reveal hook. Adds `.is-visible` class once.

import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
