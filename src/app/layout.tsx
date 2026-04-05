import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatBot } from '@/components/chatbot/ChatBot'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'ScootMart.ae – UAE Electric Scooter & E-Bike Marketplace', template: '%s | ScootMart.ae' },
  description: 'UAE\'s #1 marketplace for new and certified used electric scooters and e-bikes. Verified sellers, escrow protection, UAE-tested reviews, and certified used program.',
  keywords: ['electric scooter UAE', 'e-bike Dubai', 'buy scooter Dubai', 'Segway UAE', 'NIU scooter Abu Dhabi', 'certified used scooter UAE'],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://scootmart.ae',
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
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatBot />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
