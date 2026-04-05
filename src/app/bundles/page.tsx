import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Scooter Bundles – Complete Riding Kits | ScootMart.ae' }

export default async function BundlesPage() {
  const supabase = await createClient()
  const { data: bundles } = await supabase
    .from('bundles')
    .select('*, listing:listings(title,images,price,slug)')
    .eq('is_active', true)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Complete Riding Bundles</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Everything you need in one purchase. Scooter + safety gear + lock + charger. Bundled for UAE riders.
        </p>
      </div>

      <div className="mb-8 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-5 flex items-center gap-4">
        <div className="text-3xl">🚦</div>
        <div>
          <h3 className="font-semibold">RTA Permit Guidance Included</h3>
          <p className="text-sm text-muted-foreground">Every bundle comes with step-by-step guidance to obtain your Dubai RTA permit. Ride legally on public paths.</p>
        </div>
      </div>

      {bundles && bundles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle: any) => {
            const accessories: any[] = bundle.accessories ?? []
            const accessoriesTotal = accessories.reduce((s: number, a: any) => s + a.price, 0)

            return (
              <div key={bundle.id} className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                {bundle.listing?.images?.[0] && (
                  <div className="aspect-video bg-muted relative">
                    <img src={bundle.listing.images[0]} alt={bundle.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{bundle.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>

                  {bundle.listing && (
                    <div className="rounded-lg bg-muted p-3 mb-3">
                      <p className="text-xs text-muted-foreground">Includes scooter:</p>
                      <p className="font-medium text-sm">{bundle.listing.title}</p>
                      <p className="text-primary font-bold">{formatPrice(bundle.listing.price)}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 mb-4">
                    {accessories.map((acc: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5">
                          {acc.required && <span className="text-xs bg-primary/10 text-primary rounded px-1">Required</span>}
                          {acc.name}
                        </span>
                        <span className="text-muted-foreground">AED {acc.price}</span>
                      </div>
                    ))}
                  </div>

                  {bundle.rta_guidance && (
                    <div className="text-xs text-green-700 dark:text-green-400 mb-3">✓ RTA permit guidance included</div>
                  )}

                  {bundle.total_savings > 0 && (
                    <div className="text-sm text-green-600 font-medium mb-3">Save AED {bundle.total_savings} vs buying separately</div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Bundle total</div>
                      <div className="text-xl font-bold">{formatPrice((bundle.listing?.price ?? 0) + accessoriesTotal - bundle.total_savings)}</div>
                    </div>
                    {bundle.listing?.slug && (
                      <Link href={`/listings/${bundle.listing.slug}?bundle=${bundle.id}`}>
                        <Button>Get Bundle</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">Bundles coming soon. Browse individual listings in the meantime.</div>
      )}
    </div>
  )
}
