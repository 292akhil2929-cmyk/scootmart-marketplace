import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Support – ScootMart.ae',
  description: 'Get help from the ScootMart.ae team. We respond within 4 hours, 7 days a week.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Contact Support</h1>
        <p className="text-muted-foreground">We're here to help, 7 days a week, 9am–9pm UAE time.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-5">
          {[
            { icon: '📧', title: 'Email', detail: 'support@scootmart.ae', sub: 'Response within 4 hours' },
            { icon: '💬', title: 'Live Chat', detail: 'Available in-app', sub: 'Fastest response' },
            { icon: '📍', title: 'Location', detail: 'Dubai, UAE', sub: 'Registered business' },
          ].map(c => (
            <div key={c.title} className="rounded-xl border bg-card p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-medium text-sm">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.detail}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
            </div>
          ))}

          <div className="rounded-xl border bg-amber-50 dark:bg-amber-900/10 border-amber-200 p-4">
            <div className="font-medium text-sm text-amber-800 dark:text-amber-200 mb-1">🚨 For disputes</div>
            <p className="text-xs text-amber-700 dark:text-amber-300">Open a dispute directly from your Orders page. This is faster and gives us full order context.</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
