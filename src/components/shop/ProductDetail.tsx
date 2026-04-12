'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Check, X, Loader2, Battery, Gauge, Zap, Weight, Clock, Wifi, Droplets } from 'lucide-react'
import type { Product } from '@/lib/products'
import { HeroScooterArt } from '@/components/cinematic/HeroScooterArt'
import { MinimalNav } from './MinimalNav'

const ACCENTS: Record<string, string> = {
  commuter: '#3b82f6', performance: '#8b5cf6', offroad: '#ef4444',
}

// ── Spec row ──
function SpecRow({ icon: Icon, label, value, bar, max }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  bar?: number // 0-100
  max?: number
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-neutral-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-neutral-500" />
      </div>
      <span className="text-sm text-neutral-500 w-28 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-neutral-900 flex-1">{value}</span>
      {bar !== undefined && (
        <div className="w-24 h-1.5 rounded-full bg-neutral-100 hidden md:block">
          <div className="h-full rounded-full bg-neutral-900 transition-all duration-700" style={{ width: `${Math.min(100, bar)}%` }} />
        </div>
      )}
    </div>
  )
}

// ── Inquiry modal ──
function InquiryModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: `${product.brand} ${product.model}`,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Make an enquiry</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100"><X className="w-4 h-4" /></button>
        </div>

        {state === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">Enquiry sent!</h3>
            <p className="text-sm text-neutral-500 mb-5">A vendor will contact you within 24 hours.</p>
            <button onClick={onClose} className="h-10 px-5 rounded-full bg-neutral-900 text-white text-sm font-medium">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <p className="text-sm text-neutral-500">Enquiring about: <strong className="text-neutral-900">{product.brand} {product.model}</strong></p>
            {[
              { name: 'name', label: 'Your name', type: 'text', required: true },
              { name: 'email', label: 'Email address', type: 'email', required: true },
              { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', required: true },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  value={form[f.name as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  className="w-full h-10 px-4 rounded-xl border border-neutral-200 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Message (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={3}
                placeholder="Any specific questions about this model?"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 outline-none focus:border-neutral-900 transition-colors resize-none"
              />
            </div>
            {state === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={state === 'loading'}
              className="w-full h-11 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {state === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function ProductDetail({ product: p }: { product: Product }) {
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const accent = ACCENTS[p.category] ?? '#3b82f6'

  const startCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: p.id, productName: `${p.brand} ${p.model}`, priceAed: p.priceAed }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Unable to start checkout. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const specs = [
    p.rangeKm && { icon: Battery, label: 'Range', value: `${p.rangeKm} km`, bar: Math.min(100, (p.rangeKm / 160) * 100) },
    p.speedKmh && { icon: Gauge, label: 'Top speed', value: `${p.speedKmh} km/h`, bar: Math.min(100, (p.speedKmh / 100) * 100) },
    p.motorWatts && { icon: Zap, label: 'Motor', value: `${p.motorWatts.toLocaleString()}W`, bar: Math.min(100, (p.motorWatts / 10000) * 100) },
    p.weightKg && { icon: Weight, label: 'Weight', value: `${p.weightKg} kg` },
    p.batteryWh && { icon: Battery, label: 'Battery', value: `${p.batteryWh} Wh` },
    p.chargeHours && { icon: Clock, label: 'Charge time', value: `${p.chargeHours}h` },
    p.ipRating && { icon: Droplets, label: 'Weather rating', value: p.ipRating },
    p.tyreSize && { icon: Gauge, label: 'Tyres', value: p.tyreSize },
    { icon: Wifi, label: 'App connected', value: p.hasApp ? 'Yes' : 'No' },
  ].filter(Boolean) as Array<{ icon: React.ComponentType<{ className?: string }>; label: string; value: string; bar?: number }>

  return (
    <div className="min-h-screen bg-white">
      <MinimalNav />
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-20">
        {/* Breadcrumb */}
        <Link href="/scooters" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All scooters
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── LEFT: visual ── */}
          <div className="sticky top-24">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl overflow-hidden">
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: accent }} />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <HeroScooterArt primary="#1f2937" secondary={accent} glow={accent} />
              </div>
              {p.badge && (
                <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-sm">
                  {p.badge === 'sale' ? 'Sale' : p.badge === 'hot' ? 'Bestseller' : p.badge === 'new' ? 'New' : 'Top spec'}
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Truck, text: 'Free delivery' },
                { icon: ShieldCheck, text: '2-yr warranty' },
                { icon: RotateCcw, text: '14-day returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                  <Icon className="w-4 h-4 text-neutral-500" />
                  <span className="text-[10px] font-medium text-neutral-600">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: info ── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">{p.brand}</p>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-3">{p.model}</h1>

            {p.rating && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.floor(p.rating!) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                ))}
                <span className="font-medium text-neutral-700">{p.rating}</span>
                {p.reviewCount && <span>({p.reviewCount} reviews)</span>}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-semibold text-neutral-900 tabular-nums">AED {p.priceAed.toLocaleString()}</span>
              {p.oldPriceAed && <span className="text-lg text-neutral-400 line-through tabular-nums">AED {p.oldPriceAed.toLocaleString()}</span>}
            </div>
            <div className="flex items-center gap-2 mb-7">
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${p.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                <span className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                {p.inStock ? `In stock${p.stockCount ? ` (${p.stockCount} available)` : ''}` : 'Out of stock'}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              {p.stripePriceId ? (
                <button onClick={startCheckout} disabled={checkoutLoading || !p.inStock}
                  className="flex-1 h-12 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {checkoutLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Buy now'}
                </button>
              ) : null}
              <button onClick={() => setInquiryOpen(true)}
                className={`${p.stripePriceId ? 'flex-1' : 'w-full'} h-12 rounded-full border border-neutral-300 text-neutral-900 text-sm font-medium hover:border-neutral-900 transition-colors`}>
                Make an enquiry
              </button>
            </div>

            {/* Description */}
            {p.description && (
              <p className="text-sm text-neutral-600 leading-relaxed mb-8 pb-8 border-b border-neutral-100">{p.description}</p>
            )}

            {/* Spec table */}
            <div>
              <h2 className="text-base font-semibold text-neutral-900 mb-1">Specifications</h2>
              <div>
                {specs.map((s) => (
                  <SpecRow key={s.label} icon={s.icon} label={s.label} value={s.value} bar={s.bar} />
                ))}
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                p.hasSuspension && 'Suspension',
                p.hasApp && 'App connected',
                p.hasHydraulicBrakes && 'Hydraulic brakes',
                p.isFoldable && 'Foldable',
                p.hasSeat && 'Seat included',
              ].filter(Boolean).map((f) => (
                <span key={f as string} className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 px-3 py-1.5 rounded-full bg-neutral-100">
                  <Check className="w-3 h-3 text-emerald-500" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {inquiryOpen && <InquiryModal product={p} onClose={() => setInquiryOpen(false)} />}
    </div>
  )
}
