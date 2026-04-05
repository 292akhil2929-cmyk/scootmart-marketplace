import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Escrow Terms – ScootMart.ae' }

export default function EscrowTermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>Escrow Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: April 2025</p>

      <h2>1. How ScootMart Escrow Works</h2>
      <p>ScootMart.ae acts as an escrow agent for all transactions. When a buyer completes checkout, funds are captured by Stripe and held by ScootMart until the buyer confirms receipt or the auto-release period expires.</p>

      <h2>2. Escrow Hold Period</h2>
      <ul>
        <li>Funds are held from payment until buyer confirmation or <strong>7 days after delivery</strong></li>
        <li>If buyer does not act within 7 days of delivery confirmation, funds auto-release to seller</li>
        <li>Disputed orders pause the auto-release until resolved</li>
      </ul>

      <h2>3. Seller Obligations</h2>
      <ul>
        <li>Ship within <strong>3 business days</strong> of payment notification</li>
        <li>Provide valid tracking number</li>
        <li>Item must match listing description exactly</li>
        <li>Failure to ship results in full refund to buyer and suspension</li>
      </ul>

      <h2>4. Buyer Obligations</h2>
      <ul>
        <li>Inspect item promptly upon receipt</li>
        <li>Confirm or dispute within <strong>7 days</strong></li>
        <li>Not to claim dispute fraudulently</li>
      </ul>

      <h2>5. Commission</h2>
      <p>ScootMart deducts <strong>8–12% commission</strong> (as shown at time of listing) from the seller payout upon escrow release. Commission is non-refundable if the sale completes. Commission is refunded to seller if the order is refunded due to seller fault.</p>

      <h2>6. Disputes</h2>
      <p>ScootMart's dispute decisions are final. We reserve the right to release or refund escrow funds based on evidence provided by both parties. Both parties agree to cooperate fully with the investigation process.</p>

      <h2>7. Governing Law</h2>
      <p>These escrow terms are governed by the laws of Dubai, UAE and the DIFC Courts have jurisdiction over any disputes.</p>
    </div>
  )
}
