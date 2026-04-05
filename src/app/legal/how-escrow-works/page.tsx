import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'How Escrow Works – ScootMart.ae' }

export default function EscrowPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>How ScootMart Escrow Works</h1>
      <p className="lead">Your money is never at risk. ScootMart holds funds in escrow until you confirm you've received your item in the described condition.</p>

      <h2>Step by Step</h2>
      <ol>
        <li><strong>Buyer pays</strong> — Full amount is charged via Stripe and held in escrow. Seller does not receive anything yet.</li>
        <li><strong>Seller ships</strong> — Seller is notified and arranges delivery (or white-glove via Aramex/Fetchr).</li>
        <li><strong>Buyer receives</strong> — You have <strong>7 days</strong> to inspect the item after delivery confirmation.</li>
        <li><strong>Buyer confirms</strong> — Once you confirm receipt, funds are released to the seller (minus 8–12% platform commission).</li>
        <li><strong>Auto-release</strong> — If no action is taken within 7 days of delivery, funds auto-release to protect the seller.</li>
      </ol>

      <h2>If Something Is Wrong</h2>
      <p>If the item doesn't match the listing description, you can <strong>open a dispute within 7 days</strong>. Our team investigates and mediates. Refunds are issued if the listing was materially misrepresented.</p>

      <h2>UAE Consumer Protection</h2>
      <p>ScootMart.ae complies with UAE Consumer Protection Law (Federal Law No. 15 of 2020). Buyers have a <strong>7-day return window</strong> for items that do not match their description.</p>

      <h2>Commission</h2>
      <p>ScootMart charges sellers <strong>8–12% commission</strong> only on successful sales. This is deducted from the escrow payout to the seller. Buyers pay no extra fees.</p>
    </div>
  )
}
