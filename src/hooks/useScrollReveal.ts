'use client'
import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target) // animate once
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return containerRef
}
