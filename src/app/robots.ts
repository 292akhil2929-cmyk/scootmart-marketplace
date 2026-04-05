import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/seller/dashboard', '/buyer/orders', '/checkout', '/api/'] },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://scootmart.ae'}/sitemap.xml`,
  }
}
