'use client'
import { useEffect } from 'react'

// Initializes IntersectionObserver for all .scroll-reveal elements on every page
export function ScrollRevealInit() {
  useEffect(() => {
    const init = () => {
      const elements = document.querySelectorAll('.scroll-reveal:not(.visible)')
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
      )
      elements.forEach(el => observer.observe(el))
      return observer
    }

    const observer = init()
    return () => observer.disconnect()
  }, [])

  return null
}
