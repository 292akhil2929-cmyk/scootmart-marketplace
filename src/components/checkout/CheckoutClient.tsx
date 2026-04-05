'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EscrowBadge } from '@/components/shared/VerifiedBadge'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Shield, Lock } from 'lucide-react'

export function CheckoutClient() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing')
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [delivery, setDelivery] = useState('seller_arranged')
  const [address, setAddress] = useState({ name: '', address: '', emirate: '', phone: '' })

  useEffect(() => {
    if (!listingId) return
    const supabase = createClient()
    supabase.from('listings')
      .select('*, seller:profiles(*), specs:listing_specs(*)')
      .eq('id', listingId)
      .single()
      .then(({ data }) => { setListing(data); setLoading(false) })
  }, [listingId])

  const deliveryFee = delivery === 'white_glove' ? 150 : 0
  const total = listing ? listing.price + deliveryFee : 0
  const commission = Math.round(total * 0.1)

  const placeOrder = async () => {
    if (!address.name || !address.address || !address.emirate || !address.phone) {
      setError('Please fill in all delivery fields')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          delivery_option: delivery,
          delivery_address: address,
          payment_method: 'stripe',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>
  if (!listing) return <div className="container py-20 text-center">Listing not found.</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="md:col-span-3 space-y-5">
          {/* Delivery */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-3">Delivery Method</h2>
            <div className="space-y-2">
              {[
                { value: 'seller_arranged', label: 'Seller Arranged', desc: 'Free – seller coordinates delivery with you', price: 'Free' },
                { value: 'white_glove', label: 'White Glove (Aramex/Fetchr)', desc: 'Professional delivery + basic setup assistance', price: '+AED 150' },
                { value: 'pickup', label: 'Pickup from Seller', desc: 'Coordinate directly with seller for pickup', price: 'Free' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${delivery === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                  <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value} onChange={e => setDelivery(e.target.value)} className="text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{opt.label}</span>
                      <span className="text-sm font-medium text-primary">{opt.price}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-sm">Full Name *</label>
                <Input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="Ahmed Al Rashidi" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm">Address *</label>
                <Input value={address.address} onChange={e => setAddress(a => ({ ...a, address: e.target.value }))} placeholder="Apartment 204, Building 5, Al Quoz" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Emirate *</label>
                <Select value={address.emirate} onValueChange={v => setAddress(a => ({ ...a, emirate: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm">Phone *</label>
                <Input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+971 50 123 4567" />
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Lock className="h-4 w-4" /> Payment</h2>
            <p className="text-sm text-muted-foreground mb-3">You'll be redirected to Stripe's secure checkout. Cards, Apple Pay, and Google Pay accepted.</p>
            <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
              <span>💳 Visa / Mastercard</span>
              <span>🍎 Apple Pay</span>
              <span>🔒 256-bit SSL</span>
              <EscrowBadge />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card p-5 sticky top-20 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>

            <div className="flex gap-3">
              <div className="h-16 w-20 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                {listing.images?.[0] && (
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{listing.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{listing.condition} · {listing.brand}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t pt-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Item price</span><span>{formatPrice(listing.price)}</span></div>
              {deliveryFee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(deliveryFee)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
              <p className="text-xs text-muted-foreground">Incl. AED {commission} platform fee (held until delivery confirmed)</p>
            </div>

            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-xs text-green-800 dark:text-green-200">
              <div className="font-semibold mb-1 flex items-center gap-1"><Shield className="h-3 w-3" /> Escrow Protected</div>
              Your {formatPrice(total)} is held securely. Released to seller only after you confirm receipt.
            </div>

            <Button className="w-full" size="lg" onClick={placeOrder} disabled={submitting}>
              {submitting ? 'Processing…' : `Pay ${formatPrice(total)} Securely`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By placing this order you agree to our{' '}
              <a href="/legal/terms" className="underline">Terms</a> and{' '}
              <a href="/legal/escrow-terms" className="underline">Escrow Terms</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
