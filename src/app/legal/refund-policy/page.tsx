import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Refund Policy – ScootMart.ae' }

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>Refund Policy</h1>
      <p className="text-muted-foreground">Last updated: April 2025. Compliant with UAE Federal Law No. 15 of 2020.</p>

      <h2>7-Day Return Window</h2>
      <p>You may open a return/refund request within <strong>7 days</strong> of confirming delivery, provided the item:</p>
      <ul>
        <li>Was significantly misrepresented in the listing</li>
        <li>Has undisclosed major defects</li>
        <li>Is a different model or variant than listed</li>
        <li>Has battery health more than 10% below the stated figure (certified used)</li>
      </ul>

      <h2>Non-Refundable Situations</h2>
      <ul>
        <li>Buyer's remorse (changed your mind, found a better deal)</li>
        <li>Normal wear and tear on used items disclosed in listing</li>
        <li>Damage caused by buyer after delivery</li>
        <li>Items confirmed received and rated positively, then disputed later</li>
      </ul>

      <h2>Refund Process</h2>
      <ol>
        <li>Open dispute within 7 days via Orders page</li>
        <li>ScootMart reviews evidence (3–5 business days)</li>
        <li>If approved: escrow is refunded to original payment method</li>
        <li>Card refunds: 5–10 business days</li>
        <li>Bank transfer refunds: 3–7 business days</li>
      </ol>

      <h2>Partial Refunds</h2>
      <p>For minor discrepancies (e.g. cosmetic damage not disclosed), ScootMart may approve a partial refund agreed between buyer and seller.</p>

      <h2>Warranty Claims</h2>
      <p>For certified used listings with platform warranty, warranty claims are handled separately. Contact <a href="mailto:warranty@scootmart.ae">warranty@scootmart.ae</a> with your order ID and inspection report.</p>
    </div>
  )
}
