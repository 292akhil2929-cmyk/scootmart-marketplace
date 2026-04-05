// Email sending via Resend
// Docs: https://resend.com/docs

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM ?? 'noreply@scootmart.ae'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scootmart.ae'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

async function sendEmail(payload: EmailPayload) {
  if (!RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set – skipping email:', payload.subject)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, ...payload }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('[Email] Failed to send:', err)
  }
}

export async function sendOrderConfirmationBuyer(to: string, orderId: string, listingTitle: string, amount: number) {
  await sendEmail({
    to,
    subject: `Order confirmed – ${listingTitle}`,
    html: `
      <h2>Your order is confirmed!</h2>
      <p>Thank you for your purchase on ScootMart.ae.</p>
      <p><strong>Item:</strong> ${listingTitle}</p>
      <p><strong>Amount:</strong> AED ${amount.toLocaleString()}</p>
      <p>Your payment is held securely in escrow. The seller has been notified to ship your item.</p>
      <p><a href="${APP_URL}/buyer/orders" style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">View Order</a></p>
      <hr/>
      <p style="color:#666;font-size:12px;">ScootMart.ae – UAE's #1 Electric Scooter Marketplace</p>
    `,
  })
}

export async function sendOrderNotificationSeller(to: string, orderId: string, listingTitle: string, payout: number) {
  await sendEmail({
    to,
    subject: `New sale! Ship "${listingTitle}" now`,
    html: `
      <h2>Congratulations – you made a sale! 🎉</h2>
      <p><strong>Item sold:</strong> ${listingTitle}</p>
      <p><strong>Your payout:</strong> AED ${payout.toLocaleString()} (released after buyer confirms receipt)</p>
      <p><strong>Action required:</strong> Please ship the item within 3 business days and add a tracking number.</p>
      <p><a href="${APP_URL}/seller/dashboard" style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">View in Dashboard</a></p>
      <hr/>
      <p style="color:#666;font-size:12px;">ScootMart.ae – UAE's #1 Electric Scooter Marketplace</p>
    `,
  })
}

export async function sendListingApprovedEmail(to: string, listingTitle: string, listingSlug: string) {
  await sendEmail({
    to,
    subject: `Your listing is live: ${listingTitle}`,
    html: `
      <h2>Your listing is approved and live! ✅</h2>
      <p><strong>${listingTitle}</strong> is now visible to buyers across the UAE.</p>
      <p><a href="${APP_URL}/listings/${listingSlug}" style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">View Listing</a></p>
      <p>Consider promoting your listing for more visibility.</p>
      <hr/>
      <p style="color:#666;font-size:12px;">ScootMart.ae – UAE's #1 Electric Scooter Marketplace</p>
    `,
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: 'Welcome to ScootMart.ae!',
    html: `
      <h2>Welcome to ScootMart.ae, ${name}! 🛴</h2>
      <p>You've joined the UAE's smartest marketplace for electric scooters and e-bikes.</p>
      <ul>
        <li>🔒 Every purchase is escrow-protected</li>
        <li>✅ All sellers are verified</li>
        <li>🌡️ Real UAE heat performance data</li>
        <li>🤖 AI assistant to find your perfect ride</li>
      </ul>
      <p><a href="${APP_URL}/browse" style="background:#22c55e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">Browse Listings</a></p>
      <hr/>
      <p style="color:#666;font-size:12px;">ScootMart.ae – UAE's #1 Electric Scooter Marketplace · <a href="${APP_URL}/legal/privacy">Privacy Policy</a></p>
    `,
  })
}
