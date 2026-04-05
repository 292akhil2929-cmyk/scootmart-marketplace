import Stripe from 'stripe'

// Lazy singleton — only instantiated at runtime, not build time
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return _stripe
}

// Keep backward-compat export used by webhook and orders
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop]
  },
})

export async function createPaymentIntent({
  amount,
  currency = 'aed',
  metadata,
}: {
  amount: number
  currency?: string
  metadata: Record<string, string>
}) {
  return getStripe().paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    capture_method: 'automatic',
  })
}

export async function createCheckoutSession({
  orderId,
  listingTitle,
  amount,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  orderId: string
  listingTitle: string
  amount: number
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}) {
  return getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: { name: listingTitle, description: 'Held in escrow until delivery confirmed' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { orderId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })
}
