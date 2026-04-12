import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmed — Scootmart',
  robots: { index: false },
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  // If we have a Stripe session ID, we could fetch session details.
  // For now we show a clean confirmation screen — Stripe webhook handles DB update.
  const ref = session_id ? session_id.slice(-8).toUpperCase() : 'SCOOT'

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-5 py-20">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.1)] overflow-hidden">
        {/* Green top band */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500" />

        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-emerald-500" />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Order confirmed! 🎉
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Your payment was successful. You&apos;ll receive a confirmation email shortly.
          </p>

          {/* Reference */}
          <div className="bg-neutral-50 rounded-2xl p-4 mb-6 text-left space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Reference</span>
              <span className="font-mono font-semibold text-neutral-900">#{ref}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Confirmed
              </span>
            </div>
          </div>

          {/* Next steps */}
          <div className="text-left mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              What happens next
            </p>
            <div className="space-y-3">
              {[
                { icon: Mail, text: 'Confirmation email sent to your inbox' },
                { icon: Package, text: 'Vendor notified — delivery arranged within 2–3 business days' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm text-neutral-700">
                  <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/scooters"
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Browse more scooters
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center h-11 px-5 rounded-full border border-neutral-200 text-neutral-900 text-sm font-medium hover:border-neutral-900 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Questions? Email{' '}
        <a href="mailto:hello@scootmart.ae" className="underline underline-offset-2 hover:text-neutral-700">
          hello@scootmart.ae
        </a>
      </p>
    </main>
  )
}
