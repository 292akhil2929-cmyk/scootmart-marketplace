import Link from 'next/link'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background mt-20">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span><span className="text-primary">Scoot</span>Mart<span className="text-muted-foreground text-sm font-normal">.ae</span></span>
            </Link>
            <p className="text-sm text-muted-foreground">UAE's smartest marketplace for electric scooters and e-bikes. Verified sellers, escrow protection, certified used program.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-foreground">Browse All</Link></li>
              <li><Link href="/browse?condition=new" className="hover:text-foreground">New Scooters</Link></li>
              <li><Link href="/browse?certified_used=true" className="hover:text-foreground">Certified Used</Link></li>
              <li><Link href="/uae-tested" className="hover:text-foreground">UAE-Tested</Link></li>
              <li><Link href="/bundles" className="hover:text-foreground">Bundles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Sellers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register?role=seller" className="hover:text-foreground">Become a Seller</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-foreground">Seller Dashboard</Link></li>
              <li><Link href="/seller/listings/new" className="hover:text-foreground">List an Item</Link></li>
              <li><Link href="/seller/orders" className="hover:text-foreground">My Sales</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Legal & Trust</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About ScootMart.ae</Link></li>
              <li><Link href="/legal/how-escrow-works" className="hover:text-foreground">How Escrow Works</Link></li>
              <li><Link href="/legal/buyer-protection" className="hover:text-foreground">Buyer Protection</Link></li>
              <li><Link href="/legal/refund-policy" className="hover:text-foreground">Refund Policy (7 days)</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ScootMart.ae — All rights reserved. Registered in Dubai, UAE.</p>
          <div className="flex items-center gap-4">
            <span>🔒 Escrow Protected</span>
            <span>✓ Verified Sellers</span>
            <span>🌡️ UAE-Tested</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
