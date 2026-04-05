import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scootmart.ae'
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('slug,id,updated_at')
    .eq('status', 'active')

  const listingUrls = (listings ?? []).map(l => ({
    url: `${base}/listings/${l.slug ?? l.id}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/uae-tested`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/bundles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/how-escrow-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/buyer-protection`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/refund-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  return [...staticPages, ...listingUrls]
}
