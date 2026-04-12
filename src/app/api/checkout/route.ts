// Guest Stripe Checkout — no auth required. Customer pays on Stripe's PCI-compliant page.
// POST body: { productId: string, productName: string, priceAed: number, customerEmail?: string }
import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, productName, priceAed, customerEmail } = body

    if (!productId || !productName || !priceAed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof priceAed !== 'number' || priceAed <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await createCheckoutSession({
      orderId: `scoot_${productId}_${Date.now()}`,
      listingTitle: productName,
      amount: priceAed,
      successUrl: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/scooters`,
      customerEmail: customerEmail ?? undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[Checkout API]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
