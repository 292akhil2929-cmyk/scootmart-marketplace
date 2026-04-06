import Link from 'next/link'
import { Zap, ShieldCheck, TrendingUp, Package, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell on ScootMart.ae — UAE\'s Electric Scooter Marketplace',
  description: 'List your e-scooters and e-bikes on ScootMart.ae. Reach thousands of buyers across UAE. Escrow-protected payments, verified seller badges, and dedicated support.',
}

const STEPS = [
  {
    n: '01',
    title: 'Create Your Account',
    desc: 'Sign up for free as a seller. Individual, shop, or official importer — all welcome.',
    icon: '📝',
  },
  {
    n: '02',
    title: 'Submit Verification',
    desc: 'Upload your Emirates ID (individuals) or Trade License (shops/importers). We verify within 24 hours.',
    icon: '🪪',
  },
  {
    n: '03',
    title: 'List Your Products',
    desc: 'Use our structured listing form with UAE-specific specs: heat performance, RTA compliance, battery health.',
    icon: '🛴',
  },
  {
    n: '04',
    title: 'Admin Reviews & Approves',
    desc: 'Our team reviews every listing for quality and accuracy before it goes live. Usually within a few hours.',
    icon: '✅',
  },
  {
    n: '05',
    title: 'Sell & Get Paid',
    desc: 'Buyers pay via escrow. Once they confirm receipt, funds are released to your account minus our commission.',
    icon: '💰',
  },
]

const BENEFITS = [
  { icon: ShieldCheck, title: 'Escrow-Protected Payments', desc: 'Never get scammed. Buyer pays upfront, you receive funds after delivery confirmation.' },
  { icon: Star, title: 'Verified Seller Badge', desc: 'Stand out with a blue verification badge that builds trust with serious buyers.' },
  { icon: TrendingUp, title: 'Serious UAE Buyers', desc: 'Reach buyers actively looking for e-scooters — not casual browsers on generic classifieds.' },
  { icon: Package, title: 'Smart Listing Templates', desc: 'UAE-specific specs (heat range, RTA status, IP rating) that help buyers compare properly.' },
]

const COMMISSIONS = [
  { type: 'Standard', rate: '10%', note: 'Per sale, includes escrow & payment processing' },
  { type: 'Premium Listing', rate: 'AED 299', note: 'Featured placement for 30 days' },
  { type: 'Spotlight', rate: 'AED 999', note: 'Homepage spotlight for 30 days' },
]

export default function VendorPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 mb-6">
            <Zap className="h-4 w-4" /> Now accepting seller applications
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Reach UAE&apos;s Most Serious<br />E-Scooter Buyers
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ScootMart.ae is the dedicated marketplace for electric scooters and e-bikes in the UAE.
            List once, sell with full escrow protection.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register?role=seller">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Selling Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-base px-8">See the Marketplace</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Why Sell on ScootMart.ae?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {BENEFITS.map(b => (
              <div key={b.title} className="rounded-2xl border bg-card p-6 flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex gap-4 items-start rounded-2xl border bg-card p-5">
                <div className="text-3xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">{step.n}</span>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <CheckCircle2 className="h-5 w-5 text-primary/40 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commissions */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-10">No listing fees. Pay only when you sell.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {COMMISSIONS.map(c => (
              <div key={c.type} className="rounded-2xl border bg-card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{c.rate}</div>
                <div className="font-semibold mb-2">{c.type}</div>
                <p className="text-xs text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Commission range: 8–12% depending on category and volume. <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for bulk/importer rates.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Join UAE&apos;s most trusted electric scooter marketplace. Free to join, pay only on sales.
          </p>
          <Link href="/register?role=seller">
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
              Create Seller Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
