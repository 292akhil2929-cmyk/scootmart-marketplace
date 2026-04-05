import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ – ScootMart.ae',
  description: 'Frequently asked questions about buying, selling, and the escrow system on ScootMart.ae.',
}

const FAQS = [
  {
    category: 'Buying',
    items: [
      {
        q: 'How does escrow work?',
        a: 'When you pay, your money goes to ScootMart\'s secure escrow account — not directly to the seller. The seller ships the item and adds a tracking number. Once you confirm receipt (or 7 days pass with no action), we release payment to the seller. If something\'s wrong, open a dispute and we\'ll investigate.',
      },
      {
        q: 'What if the item doesn\'t match the listing?',
        a: 'Open a dispute from your orders page within 7 days of delivery. Our team will review the listing, photos, and your report. If the item doesn\'t match, we\'ll issue a full refund from escrow. The seller gets nothing.',
      },
      {
        q: 'How do I know if a scooter handles UAE heat?',
        a: 'Every listing includes a "UAE Heat Range" — the real-world range tested in 40°C+ conditions, not the manufacturer claim. Listings with the "UAE-Tested" badge have been independently ridden and documented in UAE summer conditions.',
      },
      {
        q: 'What does "Certified Used" mean?',
        a: 'Certified Used scooters have been inspected by ScootMart\'s certified mechanics. We check battery health (shown as a %), brakes, motor, frame, and electronics. Certified Used listings come with a 3-month ScootMart platform warranty.',
      },
      {
        q: 'Can I negotiate price with the seller?',
        a: 'Yes. Use the "Message Seller" button on any listing to discuss price before purchasing. All transactions then go through our secure escrow checkout.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit/debit cards (Visa, Mastercard), Apple Pay, and Google Pay via Stripe\'s secure checkout. All prices are in AED.',
      },
    ],
  },
  {
    category: 'Selling',
    items: [
      {
        q: 'How do I become a seller?',
        a: 'Register for a seller account, complete identity verification (Emirates ID for individuals, trade license for businesses), and you can start listing. Verification usually takes 1 business day.',
      },
      {
        q: 'How much does ScootMart charge sellers?',
        a: 'We charge 8% on new items, 10% on used items, and 12% on Certified Used listings. These fees are deducted from your payout after the buyer confirms receipt. There are no listing fees or monthly charges.',
      },
      {
        q: 'When do I get paid?',
        a: 'Payment is released from escrow when the buyer confirms receipt, or automatically after 7 days if no action is taken. Payouts are processed to your registered bank account (IBAN) within 2–3 business days.',
      },
      {
        q: 'What happens if a buyer opens a dispute?',
        a: 'We\'ll pause the payment release and review both sides. We may ask for photos, tracking evidence, and your listing description. If your item matched the listing, payment will be released. We aim to resolve disputes within 48 hours.',
      },
      {
        q: 'Can I list multiple items?',
        a: 'Yes, there\'s no limit to the number of active listings. Sellers can manage all listings from the Seller Dashboard.',
      },
    ],
  },
  {
    category: 'RTA & Legal',
    items: [
      {
        q: 'Do I need an RTA permit to ride in Dubai?',
        a: 'Yes. In Dubai, e-scooters and e-bikes used on public paths, parks, and designated roads require an RTA permit. Our bundles include step-by-step guidance. Listings marked "RTA Compliant" meet the specifications required for permit eligibility.',
      },
      {
        q: 'What are the rules in Abu Dhabi and Sharjah?',
        a: 'Regulations vary by emirate. Abu Dhabi has designated e-scooter zones. Sharjah allows e-scooters in specific areas. Always check with your local municipality. Our AI assistant can give emirate-specific guidance.',
      },
      {
        q: 'Can I ride a scooter on UAE roads?',
        a: 'No. E-scooters and e-bikes are not permitted on public roads shared with cars in the UAE. They are restricted to dedicated cycling paths, parks, and certain residential areas. Always follow local RTA guidelines.',
      },
    ],
  },
  {
    category: 'Account & Technical',
    items: [
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot password?" on the login page. We\'ll send a reset link to your registered email address.',
      },
      {
        q: 'Can I have both a buyer and seller account?',
        a: 'Yes. Any account can buy and sell. To enable seller features, go to Account Settings and upgrade to a seller account, then complete verification.',
      },
      {
        q: 'Is my personal data safe?',
        a: 'Yes. We use Supabase (SOC 2 certified) for data storage with row-level security. Payments are handled by Stripe (PCI DSS Level 1). We never store card details. See our Privacy Policy for full details.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about ScootMart.ae</p>
      </div>

      <div className="space-y-10">
        {FAQS.map(section => (
          <section key={section.category}>
            <h2 className="text-lg font-bold mb-4 text-primary">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map(item => (
                <details key={item.q} className="group rounded-xl border bg-card overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-sm list-none select-none hover:bg-muted/50 transition-colors">
                    {item.q}
                    <span className="ml-4 shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-muted/50 border p-6 text-center">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">Our support team is available 7 days a week, 9am–9pm UAE time.</p>
        <Link href="/contact" className="text-primary hover:underline text-sm font-medium">Contact Support →</Link>
      </div>
    </div>
  )
}
