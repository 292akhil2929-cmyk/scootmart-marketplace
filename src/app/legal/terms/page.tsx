import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Terms of Service – ScootMart.ae' }

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: April 2025</p>

      <p>By using ScootMart.ae, you agree to these terms. ScootMart.ae is a marketplace platform registered in Dubai, UAE.</p>

      <h2>1. Marketplace Role</h2>
      <p>ScootMart.ae is a marketplace platform connecting buyers and sellers. We are not the seller of any item. We provide listing infrastructure, escrow protection, and dispute resolution.</p>

      <h2>2. Seller Obligations</h2>
      <ul>
        <li>All listings must be accurate and not misleading</li>
        <li>Used listings require a battery health check and inspection report</li>
        <li>Sellers must verify identity via Emirates ID or trade license</li>
        <li>8–12% commission applies to all completed sales</li>
        <li>Sellers must ship within 3 business days of payment confirmation</li>
      </ul>

      <h2>3. Buyer Obligations</h2>
      <ul>
        <li>Buyers must confirm or dispute receipt within 7 days</li>
        <li>Disputes must be supported by evidence (photos/video)</li>
        <li>Fraudulent disputes result in account termination</li>
      </ul>

      <h2>4. Prohibited Items</h2>
      <p>Stolen goods, counterfeit products, items exceeding UAE road legal limits without proper disclosure, and any items requiring special import licenses are prohibited.</p>

      <h2>5. Governing Law</h2>
      <p>These terms are governed by the laws of Dubai, UAE. Any disputes are subject to the jurisdiction of Dubai courts.</p>
    </div>
  )
}
