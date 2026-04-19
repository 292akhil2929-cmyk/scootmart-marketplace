import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 min

const TAG = 'scootmartae-21'
const NOON_PARTNER = '518012'

/** Add affiliate tag to Amazon URL */
function tagAmazon(url: string): string {
  try {
    const u = new URL(url)
    if (!u.hostname.includes('amazon')) return url
    u.searchParams.set('tag', TAG)
    return u.toString()
  } catch { return url }
}

/** Wrap Noon URL with affiliate redirect */
function tagNoon(url: string): string {
  if (url.includes('partnerID')) return url
  return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(url)}`
}

/** Apply affiliate tags to a price_sources array */
function tagPriceSources(sources: any[]): any[] {
  return sources.map(src => {
    let url: string = src.url ?? ''
    const p: string = src.platform ?? ''
    if (p === 'amazon' || url.includes('amazon.ae')) url = tagAmazon(url)
    else if (p === 'noon'   || url.includes('noon.com'))  url = tagNoon(url)
    return { ...src, url }
  })
}

export async function GET(req: NextRequest) {
  // Auth: Vercel cron sends Authorization header, or CRON_SECRET query param
  const auth  = req.headers.get('Authorization') ?? ''
  const qsec  = req.nextUrl.searchParams.get('secret') ?? ''
  const secret = process.env.CRON_SECRET ?? ''

  if (secret && auth !== `Bearer ${secret}` && qsec !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Pull all active affiliate listings
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, title, brand, model, affiliate_url, affiliate_source, price_sources')
    .eq('status', 'active')
    .eq('is_affiliate', true)
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let updated = 0
  const log: string[] = []

  for (const listing of listings ?? []) {
    const sources: any[] = listing.price_sources ?? []
    const tagged = tagPriceSources(sources)

    // Also ensure affiliate_url has tag
    let affUrl: string = listing.affiliate_url ?? ''
    const src = listing.affiliate_source ?? ''
    if (src === 'amazon' || affUrl.includes('amazon.ae')) affUrl = tagAmazon(affUrl)
    else if (src === 'noon' || affUrl.includes('noon.com'))  affUrl = tagNoon(affUrl)

    const changed =
      affUrl !== listing.affiliate_url ||
      JSON.stringify(tagged) !== JSON.stringify(sources)

    if (!changed) continue

    const { error: patchErr } = await supabase
      .from('listings')
      .update({ affiliate_url: affUrl, price_sources: tagged })
      .eq('id', listing.id)

    if (!patchErr) {
      updated++
      log.push(`✓ ${listing.title}`)
    } else {
      log.push(`✗ ${listing.title}: ${patchErr.message}`)
    }
  }

  return NextResponse.json({
    ok: true,
    total: listings?.length ?? 0,
    updated,
    log,
    ts: new Date().toISOString(),
  })
}
