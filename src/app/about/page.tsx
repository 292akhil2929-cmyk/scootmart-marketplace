import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About ScootMart.ae – UAE\'s Electric Scooter Marketplace',
  description: 'Learn how ScootMart.ae is making e-scooter and e-bike buying safe, transparent, and UAE-specific.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">About ScootMart.ae</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          UAE's first dedicated marketplace for electric scooters and e-bikes, built specifically for our climate, roads, and regulations.
        </p>
      </div>

      {/* Mission */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 mb-10">
        <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          ScootMart.ae exists because buying a scooter in the UAE has always been risky. Generic platforms don't tell you whether a scooter handles 45°C heat, whether it's RTA-compliant for Dubai paths, or whether the battery has degraded in the desert sun. We built the platform we always wished existed — transparent, local, and protected.
        </p>
      </div>

      {/* Why we're different */}
      <h2 className="text-2xl font-bold mb-6">What makes us different</h2>
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {[
          {
            icon: '🌡️',
            title: 'UAE-Tested Data',
            desc: 'Every listing shows real-world range in UAE summer heat (40°C+), not manufacturer claims made in German labs. We collect sand resistance scores, IP ratings, and heat performance notes so you know exactly what to expect on Sheikh Zayed Road in August.',
          },
          {
            icon: '🔒',
            title: 'Escrow Protection',
            desc: 'Your money never goes directly to the seller. It\'s held in our secure escrow account until you confirm the item arrived as described. No more "item not as described" disputes with no recourse. We\'re the trusted middleman.',
          },
          {
            icon: '✅',
            title: 'Verified Sellers Only',
            desc: 'Every seller submits a valid Emirates ID or trade license before listing. We manually review and approve each seller. You know exactly who you\'re buying from — individual, shop, or importer.',
          },
          {
            icon: '🔋',
            title: 'Certified Used Program',
            desc: 'Our certified mechanics inspect used scooters and test battery health. Listings that pass earn the "Certified Used" badge and come with a 3-month ScootMart platform warranty. Buy used with confidence.',
          },
          {
            icon: '🚦',
            title: 'RTA Compliance',
            desc: 'We flag every listing that\'s RTA-compliant for public paths in Dubai. Our bundles include step-by-step permit guidance. Ride legally without having to research the rules yourself.',
          },
          {
            icon: '🤖',
            title: 'AI Concierge',
            desc: 'Not sure what you need? Our UAE-trained AI assistant asks about your daily commute, weight, preferred emirate, and budget, then recommends the best options. It knows the difference between what works in Dubai Marina versus Al Ain.',
          },
        ].map(item => (
          <div key={item.title} className="rounded-xl border bg-card p-5">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="rounded-2xl border bg-card p-8 mb-10">
        <h2 className="text-2xl font-bold mb-3">Built in Dubai</h2>
        <p className="text-muted-foreground leading-relaxed">
          ScootMart.ae is a Dubai-based company. Our founders are daily scooter commuters who got tired of the risks that came with buying second-hand from unverified sellers. We launched to bring the trust layer that the UAE micro-mobility market was missing.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          We're registered in Dubai, UAE. All transactions are processed in AED. Our customer support team is available 7 days a week.
        </p>
      </div>

      {/* Commission transparency */}
      <div className="rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-8 mb-10">
        <h2 className="text-2xl font-bold mb-3">Our Fee Structure</h2>
        <p className="text-muted-foreground mb-4">We believe in full transparency about how we make money.</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'New items', fee: '8%' },
            { label: 'Used items', fee: '10%' },
            { label: 'Certified Used', fee: '12%' },
          ].map(f => (
            <div key={f.label} className="rounded-xl bg-background border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{f.fee}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Fees are deducted from the seller's payout after successful delivery confirmation. Buyers pay no platform fees — what you see is what you pay.</p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to ride?</h2>
        <p className="text-muted-foreground mb-6">Browse UAE-tested listings or list your own scooter today.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/browse"><Button size="lg">Browse Listings</Button></Link>
          <Link href="/register?role=seller"><Button size="lg" variant="outline">Become a Seller</Button></Link>
        </div>
      </div>
    </div>
  )
}
