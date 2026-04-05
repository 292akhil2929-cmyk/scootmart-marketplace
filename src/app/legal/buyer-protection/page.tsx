import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Buyer Protection – ScootMart.ae' }

export default function BuyerProtectionPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>Buyer Protection Policy</h1>
      <p className="lead">Every purchase on ScootMart.ae is protected by our escrow system and buyer guarantee.</p>

      <h2>What You're Protected Against</h2>
      <ul>
        <li><strong>Item not received</strong> – Full refund if the seller fails to ship within 5 business days</li>
        <li><strong>Significantly not as described</strong> – Refund if the item materially differs from the listing (wrong model, hidden damage, battery health significantly below stated)</li>
        <li><strong>Counterfeit items</strong> – Full refund + seller account banned</li>
        <li><strong>Seller no-show</strong> – Refund if seller becomes unresponsive after payment</li>
      </ul>

      <h2>How to Claim Protection</h2>
      <ol>
        <li>Do <strong>not</strong> confirm receipt if there's an issue</li>
        <li>Open a dispute from your Orders page within <strong>7 days of delivery</strong></li>
        <li>Upload photos/videos as evidence</li>
        <li>ScootMart mediates within 3–5 business days</li>
        <li>If resolved in your favour, full refund is processed within 5–10 business days</li>
      </ol>

      <h2>Certified Used Program</h2>
      <p>Used listings with the "Certified Used" badge have undergone:</p>
      <ul>
        <li>Battery health test (% reported)</li>
        <li>Motor, brake, and tire inspection</li>
        <li>Electronics and frame check</li>
        <li>Optional 3-month platform warranty</li>
      </ul>
      <p>If a certified listing's battery health is more than 10% below the stated figure, you're eligible for a full refund or price adjustment.</p>

      <h2>UAE Consumer Protection</h2>
      <p>ScootMart.ae complies with <strong>UAE Federal Law No. 15 of 2020</strong> on consumer protection. You have a 7-day right of return for items that don't match their description.</p>

      <h2>Contact</h2>
      <p>For disputes: <a href="mailto:support@scootmart.ae">support@scootmart.ae</a> or use the in-app dispute button on your order.</p>
    </div>
  )
}
