import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const AMAZON_TAG = 'scootmartae-21'
const NOON_PARTNER = '518012'

function buildAffiliateUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl)
    if (u.hostname.includes('amazon.ae') || u.hostname.includes('amazon.com')) {
      u.searchParams.set('tag', AMAZON_TAG)
      return u.toString()
    }
    if (u.hostname.includes('noon.com')) {
      if (u.hostname.includes('redirect') || rawUrl.includes('partnerID')) return rawUrl
      return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(rawUrl)}`
    }
    return rawUrl
  } catch {
    return rawUrl
  }
}

function detectPlatform(url: string): string {
  if (url.includes('amazon.ae'))       return 'amazon'
  if (url.includes('noon.com'))        return 'noon'
  if (url.includes('sharafdg'))        return 'sharaf_dg'
  if (url.includes('carrefour'))       return 'carrefour'
  if (url.includes('microless'))       return 'microless'
  if (url.includes('mi.com'))          return 'xiaomi'
  if (url.includes('scootup'))         return 'scootup'
  if (url.includes('eveons'))          return 'eveons'
  if (url.includes('ubuy'))            return 'ubuy'
  return 'other'
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  const decoded = decodeURIComponent(url)
  const destination = buildAffiliateUrl(decoded)
  const platform = detectPlatform(decoded)
  const listingId = req.nextUrl.searchParams.get('lid') ?? null

  // Fire-and-forget click tracking (non-blocking)
  trackClick({
    listing_id: listingId,
    platform,
    destination_url: destination,
    referer: req.headers.get('referer') ?? null,
    user_agent: req.headers.get('user-agent') ?? null,
  }).catch(() => {}) // silently ignore if table doesn't exist yet

  return NextResponse.redirect(destination, { status: 302 })
}

async function trackClick(data: {
  listing_id: string | null
  platform: string
  destination_url: string
  referer: string | null
  user_agent: string | null
}) {
  try {
    const supabase = await createClient()
    await supabase.from('affiliate_clicks').insert({
      listing_id: data.listing_id || null,
      platform: data.platform,
      destination_url: data.destination_url,
      referer: data.referer,
      user_agent: data.user_agent,
      country: 'AE',
    })
  } catch {
    // Table may not exist yet — run supabase/migrations/005_affiliate_clicks.sql
  }
}
