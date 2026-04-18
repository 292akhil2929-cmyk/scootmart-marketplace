'use client'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function GAPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  )
}

// ── Event helpers — call these anywhere in the app ───────────────────────────

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function track(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

export const analytics = {
  // Product views
  viewProduct: (id: string, title: string, price: number, brand: string) =>
    track('view_item', {
      currency: 'AED',
      value: price,
      items: [{ item_id: id, item_name: title, price, item_brand: brand }],
    }),

  // Add to wishlist
  addToWishlist: (id: string, title: string, price: number) =>
    track('add_to_wishlist', {
      currency: 'AED',
      value: price,
      items: [{ item_id: id, item_name: title, price }],
    }),

  // Checkout started
  beginCheckout: (id: string, title: string, price: number) =>
    track('begin_checkout', {
      currency: 'AED',
      value: price,
      items: [{ item_id: id, item_name: title, price }],
    }),

  // Purchase completed
  purchase: (orderId: string, total: number, items: { id: string; title: string; price: number }[]) =>
    track('purchase', {
      transaction_id: orderId,
      currency: 'AED',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.title, price: i.price })),
    }),

  // Affiliate click (Amazon)
  affiliateClick: (productTitle: string, destination: string) =>
    track('affiliate_click', { product_title: productTitle, destination }),

  // Chatbot opened
  chatbotOpen: () => track('chatbot_open'),

  // Search
  search: (query: string) => track('search', { search_term: query }),

  // Contact form
  contactFormSubmit: () => track('contact_form_submit'),

  // Seller registration
  sellerSignup: () => track('seller_signup'),
}
