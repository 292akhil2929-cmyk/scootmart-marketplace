/**
 * ScootMart.ae — Real-time Price Scraper
 *
 * Fetches live prices from Amazon.ae and Noon for every active affiliate listing,
 * then updates Supabase with fresh prices and timestamps.
 *
 * Runs every 6h via GitHub Actions (.github/workflows/price-update.yml).
 *
 * Required env vars:
 *   SUPABASE_URL               – your project URL
 *   SUPABASE_SERVICE_ROLE_KEY  – service-role JWT (never expose publicly)
 *   SCRAPER_API_KEY            – (optional) ScraperAPI key for higher success rate
 *                                sign up free at https://www.scraperapi.com
 */

import { createClient } from '@supabase/supabase-js'

// ── Config ─────────────────────────────────────────────────────────────────
const SUPABASE_URL  = process.env.SUPABASE_URL
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const SCRAPER_KEY   = process.env.SCRAPER_API_KEY ?? ''   // optional
const AMAZON_TAG    = 'scootmartae-21'
const NOON_PARTNER  = '518012'
const REQUEST_DELAY = 2500   // ms between requests (politeness)
const FETCH_TIMEOUT = 20_000 // 20 s per request

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Browser-like request headers ────────────────────────────────────────────
const UA_LIST = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
]
function randomUA() { return UA_LIST[Math.floor(Math.random() * UA_LIST.length)] }

function baseHeaders(referer = '') {
  return {
    'User-Agent': randomUA(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-AE,en;q=0.9,ar;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'no-cache',
    ...(referer ? { 'Referer': referer } : {}),
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))

/** Extract Amazon ASIN from any Amazon URL  */
function extractAsin(url = '') {
  const m = url.match(/\/dp\/([A-Z0-9]{10})/i)
  return m ? m[1].toUpperCase() : null
}

/** Build a proxied URL if ScraperAPI key is present */
function proxyUrl(rawUrl) {
  if (!SCRAPER_KEY) return rawUrl
  return `https://api.scraperapi.com?api_key=${SCRAPER_KEY}&url=${encodeURIComponent(rawUrl)}&country_code=ae`
}

/** Robust fetch with timeout */
async function safeFetch(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  try {
    const res = await fetch(proxyUrl(url), { ...options, signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// ── Amazon.ae price scraper ──────────────────────────────────────────────────
async function fetchAmazonPrice(asin) {
  const url = `https://www.amazon.ae/dp/${asin}`
  let html = ''
  try {
    const res = await safeFetch(url, { headers: baseHeaders('https://www.amazon.ae/') })
    if (res.status === 503 || res.status === 403) {
      console.log(`    ⚠️  Amazon blocked request for ASIN ${asin} (HTTP ${res.status})`)
      return null
    }
    if (!res.ok) {
      console.log(`    ⚠️  Amazon returned HTTP ${res.status} for ASIN ${asin}`)
      return null
    }
    html = await res.text()
  } catch (err) {
    console.log(`    ⚠️  Amazon fetch error for ASIN ${asin}: ${err.message}`)
    return null
  }

  // CAPTCHA / robot check page
  if (html.includes('Type the characters you see') || html.includes('robot') || html.length < 5000) {
    console.log(`    ⚠️  Amazon returned CAPTCHA/bot-check for ASIN ${asin}`)
    return null
  }

  // Try multiple price extraction patterns (Amazon changes structure often)
  const patterns = [
    // 1. Accessibility price span (most reliable)
    /class="a-offscreen">AED\s*([\d,]+(?:\.\d+)?)</i,
    // 2. Coreweb price block
    /id="corePriceDisplay_desktop_feature_div"[^}]+?AED\s*([\d,]+(?:\.\d+)?)/is,
    // 3. priceblock_ourprice / dealprice
    /id="priceblock_(?:ourprice|dealprice)"[^>]*>AED\s*([\d,]+(?:\.\d+)?)/i,
    // 4. apex price (newer layout)
    /class="[^"]*apexPriceToPay[^"]*"[^>]*>.*?AED\s*([\d,]+(?:\.\d+)?)/is,
    // 5. JSON price in page data
    /"buyingPrice":\s*"?([\d.]+)"?/,
    /"priceAmount":\s*([\d.]+)/,
    /"price":\s*"([\d.]+)"/,
  ]

  for (const pattern of patterns) {
    const m = html.match(pattern)
    if (m) {
      const price = parseFloat(m[1].replace(/,/g, ''))
      if (price > 0 && price < 100_000) {
        return price
      }
    }
  }

  console.log(`    ⚠️  Could not parse price from Amazon.ae page for ASIN ${asin}`)
  return null
}

// ── Noon.com price scraper ────────────────────────────────────────────────────
async function fetchNoonPrice(productUrl) {
  // Use direct product URL if it looks like one, otherwise skip
  // (search URLs won't have a price we can parse reliably)
  if (productUrl.includes('/search?') || productUrl.includes('?q=')) {
    return null   // search pages have too many prices to parse correctly
  }
  let html = ''
  try {
    const res = await safeFetch(productUrl, { headers: baseHeaders('https://www.noon.com/') })
    if (!res.ok) return null
    html = await res.text()
  } catch {
    return null
  }

  const patterns = [
    // JSON-LD
    /"price"\s*:\s*"?([\d.]+)"?/,
    // Dynamic app data
    /"sellingPrice"\s*:\s*([\d.]+)/,
    /"now"\s*:\s*([\d.]+)/,
    // HTML price display
    /class="[^"]*price(?:Now)?[^"]*"[^>]*>AED\s*([\d,]+)/i,
    /AED\s*([\d,]+(?:\.\d+)?)/,
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) {
      const price = parseFloat(m[1].replace(/,/g, ''))
      if (price > 0 && price < 100_000) return price
    }
  }
  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const startedAt = Date.now()
  console.log('┌─────────────────────────────────────────────────────────┐')
  console.log('│         ScootMart.ae — Real-time Price Scraper          │')
  console.log('└─────────────────────────────────────────────────────────┘')
  console.log(`📅 ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} (UAE time)`)
  if (SCRAPER_KEY) {
    console.log('🔑 ScraperAPI key detected — using proxied requests for higher success rate')
  } else {
    console.log('ℹ️  No SCRAPER_API_KEY set — using direct requests (may be blocked by Amazon)')
    console.log('   → Set SCRAPER_API_KEY in GitHub Secrets for ~95% success rate (free tier)')
  }
  console.log('')

  // Fetch all active affiliate listings
  const { data: listings, error: fetchErr } = await supabase
    .from('listings')
    .select('id, title, price, affiliate_url, affiliate_source, price_sources')
    .eq('status', 'active')
    .eq('is_affiliate', true)
    .order('created_at', { ascending: false })

  if (fetchErr) throw new Error(`Supabase fetch failed: ${fetchErr.message}`)
  console.log(`📦 ${listings.length} active affiliate listings found\n`)

  const now = new Date().toISOString()
  let scraped = 0, updated = 0, failed = 0, skipped = 0

  for (const listing of listings) {
    const sources = Array.isArray(listing.price_sources) ? listing.price_sources : []
    const newSources = []
    let listingChanged = false

    console.log(`\n🔍 "${listing.title}"`)

    for (const src of sources) {
      const platform = src.platform ?? ''
      const srcUrl   = src.url ?? ''
      let newPrice = null

      // ── Amazon ──────────────────────────────────────────────────────────
      if (platform === 'amazon' || srcUrl.includes('amazon.ae')) {
        // Prefer ASIN from affiliate_url (most accurate), fall back to src.url
        const asin = extractAsin(listing.affiliate_url ?? '') ?? extractAsin(srcUrl)
        if (asin) {
          process.stdout.write(`  [Amazon] ASIN ${asin} → `)
          newPrice = await fetchAmazonPrice(asin)
          scraped++
          await sleep(REQUEST_DELAY + Math.random() * 1000)
        } else {
          process.stdout.write(`  [Amazon] no ASIN in URL, skipping\n`)
          skipped++
        }
      }
      // ── Noon ──────────────────────────────────────────────────────────
      else if (platform === 'noon' || srcUrl.includes('noon.com')) {
        process.stdout.write(`  [Noon] → `)
        newPrice = await fetchNoonPrice(srcUrl)
        scraped++
        await sleep(REQUEST_DELAY + Math.random() * 500)
      }
      // ── Other platforms — no scraper yet ─────────────────────────────
      else {
        newSources.push({ ...src, price_scraped_at: now })
        continue
      }

      if (newPrice && newPrice > 0) {
        const old = src.price ?? 0
        const changed = Math.abs(newPrice - old) > 0.01
        if (changed) {
          console.log(`AED ${newPrice}  (was ${old}) ✅`)
          listingChanged = true
        } else {
          console.log(`AED ${newPrice}  (unchanged)`)
        }
        newSources.push({ ...src, price: newPrice, price_scraped_at: now })
      } else {
        console.log(`failed — keeping AED ${src.price ?? '?'}`)
        newSources.push({ ...src, price_scraped_at: now })
      }
    }

    // Re-calculate listing price = lowest across all sources
    const validPrices = newSources.map(s => s.price).filter(p => typeof p === 'number' && p > 0)
    const bestPrice = validPrices.length > 0 ? Math.min(...validPrices) : listing.price

    if (listingChanged || bestPrice !== listing.price) {
      const { error: upErr } = await supabase
        .from('listings')
        .update({ price: bestPrice, price_sources: newSources })
        .eq('id', listing.id)

      if (upErr) {
        console.error(`  ❌ DB update failed: ${upErr.message}`)
        failed++
      } else {
        updated++
        if (bestPrice !== listing.price) {
          console.log(`  💰 Listing price: AED ${listing.price} → AED ${bestPrice}`)
        }
      }
    } else {
      // Still update price_scraped_at so we have a fresh timestamp
      await supabase
        .from('listings')
        .update({ price_sources: newSources })
        .eq('id', listing.id)
    }
  }

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1)

  console.log('\n┌─────────────────────────────────────────────────────────┐')
  console.log('│                     Run Summary                         │')
  console.log('└─────────────────────────────────────────────────────────┘')
  console.log(`  📦 Listings processed : ${listings.length}`)
  console.log(`  🌐 Store pages fetched: ${scraped}`)
  console.log(`  ✅ Prices updated     : ${updated}`)
  console.log(`  ⏭️  Sources skipped   : ${skipped}`)
  console.log(`  ❌ DB errors          : ${failed}`)
  console.log(`  ⏱️  Duration          : ${durationSec}s`)

  if (failed > 0) {
    console.error('\n⚠️  Some DB updates failed — exiting with code 1')
    process.exit(1)
  }

  console.log('\n✅ Scraper completed successfully')
}

main().catch(err => {
  console.error('\n💥 Scraper crashed:', err.message ?? err)
  process.exit(1)
})
