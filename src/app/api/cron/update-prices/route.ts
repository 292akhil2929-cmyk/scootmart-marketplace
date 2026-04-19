import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCronReport } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const TAG          = 'scootmartae-21'
const NOON_PARTNER = '518012'
const INTERVAL_H   = 6
const ADMIN_EMAIL  = 'scootmartae@gmail.com'

function tagAmazon(url: string): string {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('amazon')) return url
    u.searchParams.set('tag', TAG)
    return u.toString()
  } catch { return url }
}

function tagNoon(url: string): string {
  if (url.includes('partnerID')) return url
  return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(url)}`
}

function tagPriceSources(sources: any[]): any[] {
  return sources.map(src => {
    let url: string = src.url ?? ''
    const p: string = src.platform ?? ''
    if (p === 'amazon' || url.includes('amazon.ae')) url = tagAmazon(url)
    else if (p === 'noon' || url.includes('noon.com'))  url = tagNoon(url)
    return { ...src, url }
  })
}

export async function GET(req: NextRequest) {
  const auth   = req.headers.get('Authorization') ?? ''
  const qsec   = req.nextUrl.searchParams.get('secret') ?? ''
  const secret = process.env.CRON_SECRET ?? ''

  if (secret && auth !== `Bearer ${secret}` && qsec !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const runAt    = new Date().toISOString()
  const since    = new Date(Date.now() - INTERVAL_H * 60 * 60 * 1000).toISOString()

  // ── 1. Update affiliate tags ────────────────────────────────────────────────
  const { data: listings } = await supabase
    .from('listings')
    .select('id,title,affiliate_url,affiliate_source,price_sources,view_count')
    .eq('status', 'active')
    .eq('is_affiliate', true)
    .limit(100)

  let updated = 0
  for (const l of listings ?? []) {
    const sources = tagPriceSources(l.price_sources ?? [])
    let affUrl    = l.affiliate_url ?? ''
    const src     = l.affiliate_source ?? ''
    if (src === 'amazon' || affUrl.includes('amazon.ae')) affUrl = tagAmazon(affUrl)
    else if (src === 'noon' || affUrl.includes('noon.com')) affUrl = tagNoon(affUrl)
    const changed =
      affUrl !== l.affiliate_url ||
      JSON.stringify(sources) !== JSON.stringify(l.price_sources ?? [])
    if (!changed) continue
    const { error } = await supabase
      .from('listings')
      .update({ affiliate_url: affUrl, price_sources: sources })
      .eq('id', l.id)
    if (!error) updated++
  }

  // ── 2. Gather listing stats ─────────────────────────────────────────────────
  const { data: allListings } = await supabase
    .from('listings')
    .select('id,title,view_count,is_affiliate')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(10)

  const totalListings     = allListings?.length ?? 0
  const affiliateListings = allListings?.filter((l: any) => l.is_affiliate).length ?? 0
  const totalViews        = allListings?.reduce((s: number, l: any) => s + (l.view_count ?? 0), 0) ?? 0
  const topViewedListings = (allListings ?? []).slice(0, 5).map((l: any) => ({
    title: l.title,
    views: l.view_count ?? 0,
  }))

  // ── 3. Click stats (if table exists) ───────────────────────────────────────
  let totalClicksPeriod  = 0
  let clicksByPlatform:  { platform: string; clicks: number }[] = []
  let topListings:       { title: string; clicks: number; platform: string }[] = []

  try {
    // Total clicks in period
    const { count } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since)
    totalClicksPeriod = count ?? 0

    // Clicks by platform
    const { data: platformData } = await supabase
      .from('affiliate_clicks')
      .select('platform')
      .gte('created_at', since)
    if (platformData) {
      const map: Record<string, number> = {}
      for (const row of platformData) {
        const p = row.platform ?? 'other'
        map[p] = (map[p] ?? 0) + 1
      }
      clicksByPlatform = Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([platform, clicks]) => ({ platform, clicks }))
    }

    // Top clicked listings
    const { data: clickData } = await supabase
      .from('affiliate_clicks')
      .select('listing_id, platform')
      .gte('created_at', since)
      .not('listing_id', 'is', null)
    if (clickData && clickData.length > 0) {
      const listingMap: Record<string, { clicks: number; platform: string }> = {}
      for (const row of clickData) {
        const id = row.listing_id as string
        if (!listingMap[id]) listingMap[id] = { clicks: 0, platform: row.platform ?? 'other' }
        listingMap[id].clicks++
      }
      const topIds = Object.entries(listingMap)
        .sort((a, b) => b[1].clicks - a[1].clicks)
        .slice(0, 5)
        .map(([id]) => id)
      const { data: topData } = await supabase
        .from('listings')
        .select('id, title')
        .in('id', topIds)
      topListings = (topData ?? []).map((l: any) => ({
        title: l.title,
        clicks: listingMap[l.id]?.clicks ?? 0,
        platform: listingMap[l.id]?.platform ?? 'other',
      }))
    }
  } catch {
    // affiliate_clicks table not yet created — run 005_affiliate_clicks.sql
  }

  // ── 4. Send report email ────────────────────────────────────────────────────
  await sendCronReport({
    runAt,
    intervalHours: INTERVAL_H,
    totalListings,
    activeListings: totalListings,
    affiliateListings,
    updatedThisRun: updated,
    totalClicksPeriod,
    clicksByPlatform,
    topListings,
    totalViews,
    topViewedListings,
  }).catch(err => console.error('[Cron] Email failed:', err))

  return NextResponse.json({
    ok: true,
    total: listings?.length ?? 0,
    updated,
    totalClicksPeriod,
    ts: runAt,
  })
}
