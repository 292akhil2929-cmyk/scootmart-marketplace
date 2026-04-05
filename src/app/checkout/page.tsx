import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CheckoutClient } from '@/components/checkout/CheckoutClient'

export const metadata: Metadata = { title: 'Secure Checkout – ScootMart.ae' }

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Loading checkout…</div>}>
      <CheckoutClient />
    </Suspense>
  )
}
