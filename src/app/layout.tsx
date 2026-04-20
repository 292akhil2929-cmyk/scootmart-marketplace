export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ScrollRevealInit } from '@/components/layout/ScrollRevealInit'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import { ChatBot } from '@/components/chatbot/ChatBot'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

const ADSENSE_ID = 'ca-pub-7981331825961236'

export const metadata: Metadata = {
  title: { default: 'ScootMart.ae – UAE Electric Scooter & E-Bike Marketplace', template: '%s | ScootMart.ae' },
  description: "UAE's #1 marketplace for new and certified used electric scooters and e-bikes. Verified sellers, escrow protection, UAE-tested reviews, and certified used program.",
  keywords: ['electric scooter UAE', 'e-bike Dubai', 'buy scooter Dubai', 'Segway UAE', 'NIU scooter Abu Dhabi', 'certified used scooter UAE'],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://scootmart-marketplace.vercel.app',
    siteName: 'ScootMart.ae',
    title: 'ScootMart.ae – UAE Electric Scooter & E-Bike Marketplace',
    description: 'Verified sellers, escrow protection, UAE-tested performance data.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* AdSense verification + script — must be in <head> for Google's crawler */}
        <meta name="google-adsense-account" content={ADSENSE_ID} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <ScrollRevealInit />
          {children}
          <Toaster />
          <ChatBot />
        </Providers>
      </body>
    </html>
  )
}
