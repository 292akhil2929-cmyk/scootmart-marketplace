import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
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
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // fils
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
  return stripe.checkout.sessions.create({
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
