import { Search, ShieldCheck, Truck, Star } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Browse & Compare', desc: 'Search UAE-specific filters: range in 40°C heat, rider weight, RTA compliance, IP rating, and more.', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  { icon: ShieldCheck, title: 'Buy with Escrow', desc: 'Pay securely. Your money is held in escrow until you confirm delivery. Zero risk to buyer or seller.', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  { icon: Truck, title: 'Receive & Inspect', desc: 'Seller ships your order. You have 7 days to inspect and confirm. If anything\'s wrong, we step in.', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  { icon: Star, title: 'Review & Repeat', desc: 'Leave a UAE-specific review. Rate heat performance, seller speed, accuracy of listing description.', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How ScootMart Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Built from the ground up for UAE buyers and sellers. Transparent, secure, and fully protected.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-orange-200 to-purple-200 dark:from-blue-800 dark:via-green-800 dark:via-orange-800 dark:to-purple-800" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className={`h-20 w-20 rounded-2xl flex items-center justify-center mb-4 ${step.color} relative z-10`}>
                <step.icon className="h-9 w-9" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-2 border-muted-foreground/20 flex items-center justify-center text-xs font-bold text-muted-foreground z-20">
                {i + 1}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4 bg-primary/5 rounded-2xl p-6 border border-primary/10">
          {[
            { label: '8–12%', desc: 'Transparent commission. Sellers keep the rest.' },
            { label: '7-day', desc: 'Escrow protection window for every purchase.' },
            { label: '3-month', desc: 'Platform warranty on certified used listings.' },
          ].map(({ label, desc }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-primary">{label}</div>
              <div className="text-sm text-muted-foreground mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
