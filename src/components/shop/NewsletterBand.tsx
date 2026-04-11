'use client'
// Dark CTA band — newsletter + high-contrast headline.

import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { useReveal } from './useReveal'

export function NewsletterBand() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const ref = useReveal<HTMLDivElement>()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section className="bg-neutral-950 py-20 md:py-28 relative overflow-hidden">
      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)' }}
      />

      <div ref={ref} className="reveal relative max-w-3xl mx-auto px-5 md:px-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
          Stay in the loop
        </p>
        <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold tracking-tight text-white leading-[1.1] mb-4">
          New drops. Better prices.
          <br />
          <span className="text-neutral-400">Straight to your inbox.</span>
        </h2>
        <p className="text-base text-neutral-400 mb-8 max-w-lg mx-auto">
          Join 12,000+ UAE riders who hear about launches first. No spam, ever.
        </p>

        {!subscribed ? (
          <form
            onSubmit={submit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30 backdrop-blur-sm transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
            <Check className="w-4 h-4" />
            You&apos;re in. Welcome aboard.
          </div>
        )}
      </div>
    </section>
  )
}
