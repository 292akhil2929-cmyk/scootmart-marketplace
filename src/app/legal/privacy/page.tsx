import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Policy – ScootMart.ae' }

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: April 2025. Compliant with UAE Data Protection Law (Federal Decree-Law No. 45 of 2021).</p>

      <h2>Data We Collect</h2>
      <ul>
        <li><strong>Account data</strong>: Name, email, phone number</li>
        <li><strong>Verification data</strong>: Emirates ID, trade license (stored encrypted, accessed only by verification team)</li>
        <li><strong>Transaction data</strong>: Order history, payment amounts (not card numbers — processed by Stripe)</li>
        <li><strong>Usage data</strong>: Pages viewed, search queries, listing views</li>
        <li><strong>Communication data</strong>: Messages between buyers and sellers</li>
      </ul>

      <h2>How We Use Your Data</h2>
      <ul>
        <li>To operate the marketplace and process transactions</li>
        <li>To verify seller identities and prevent fraud</li>
        <li>To send order updates and notifications</li>
        <li>To improve our AI recommendations</li>
        <li>To comply with UAE legal requirements</li>
      </ul>

      <h2>Data Sharing</h2>
      <p>We share data with:</p>
      <ul>
        <li><strong>Stripe</strong> – payment processing</li>
        <li><strong>Supabase</strong> – database hosting (EU servers)</li>
        <li><strong>Aramex/Fetchr</strong> – delivery partners (delivery address only)</li>
        <li><strong>UAE authorities</strong> – if legally required</li>
      </ul>
      <p>We <strong>never sell</strong> your personal data to third parties.</p>

      <h2>Your Rights</h2>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your account and data</li>
        <li>Export your data</li>
      </ul>
      <p>Contact: <a href="mailto:privacy@scootmart.ae">privacy@scootmart.ae</a></p>

      <h2>Cookies</h2>
      <p>We use essential cookies for authentication and preference cookies for dark mode / language. No advertising trackers.</p>

      <h2>Data Retention</h2>
      <p>Account data is retained for 7 years for UAE tax compliance. You may request deletion of non-transactional data at any time.</p>
    </div>
  )
}
