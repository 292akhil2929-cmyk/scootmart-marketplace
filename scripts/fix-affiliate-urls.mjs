/**
 * Fixes affiliate URLs in the DB:
 * - Sets real Amazon.ae product page ASINs where found
 * - Ensures all Amazon URLs have ?tag=scootmartae-21
 * - Ensures all Noon URLs have partnerID=518012 redirect
 *
 * Run: node scripts/fix-affiliate-urls.mjs
 */

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3Byd2R0ZXhzbmptZ3B3bnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MTk0MSwiZXhwIjoyMDkyMDE3OTQxfQ.7jRGUWvBud8zR94bAdSMUh9QCWtiU4iXG-jJ5Y3no8o'
const BASE  = 'https://vowprwdtexsnjmgpwnvs.supabase.co'
const TAG   = 'scootmartae-21'
const NOON_PARTNER = '518012'

// Real Amazon.ae ASINs found via DuckDuckGo search
// Format: { id: <listing UUID prefix>, asin: <ASIN> }
const ASIN_MAP = {
  // Xiaomi
  'dcf0cac7': { asin: 'B0C4379MHV', name: 'Xiaomi Electric Scooter 4 Lite' },
  '233a5c40': { asin: 'B0C1CK7FY1', name: 'Xiaomi Electric Scooter 4 Ultra' },
  'a87d094b': { asin: 'B0CZHQHKTK', name: 'Xiaomi Electric Scooter 4 Pro' },
  'ddd39051': { asin: 'B0B7NT5LK8', name: 'Xiaomi Electric Scooter 4' },
  // Segway
  '9f41179c': { asin: 'B0B3RXSCR8', name: 'Segway Ninebot Max G2' },
  '4b48d2fc': { asin: 'B0C65CMKTK', name: 'Segway Ninebot Max G30D II' },
  '2577f818': { asin: 'B09B7BXRMT', name: 'Segway Ninebot F40E' },
  'fd46961f': { asin: 'B0B3RZ5SLC', name: 'Segway Ninebot E2 Plus' },
  // NIU
  'd6ec17bb': { asin: 'B0B73JDVSF', name: 'Niu KQi3 Pro' },
  'b6f76029': { asin: 'B0B73JDVSF', name: 'Niu KQi3 Max' },
  // Hiboy
  '2525468b': { asin: 'B09BR8CCSS', name: 'Hiboy S2 Pro' },
  'dac4d998': { asin: 'B086JHCJTX', name: 'Hiboy MAX3' },
  // Inokim
  'c05c198c': { asin: 'B0D734RWRH', name: 'Inokim Light 2' },
}

function makeAmazonUrl(asin) {
  return `https://www.amazon.ae/dp/${asin}?tag=${TAG}`
}

function makeAmazonSearchUrl(query) {
  return `https://www.amazon.ae/s?k=${encodeURIComponent(query)}&tag=${TAG}`
}

function makeNoonUrl(query) {
  const base = `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(query)}`
  return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(base)}`
}

async function patch(id, body) {
  const res = await fetch(`${BASE}/rest/v1/listings?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  })
  return res.ok
}

async function main() {
  // Fetch all affiliate listings
  const res = await fetch(
    `${BASE}/rest/v1/listings?select=id,title,brand,model,is_affiliate,affiliate_source,affiliate_url,price_sources&is_affiliate=eq.true&limit=100`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  )
  const listings = await res.json()
  console.log(`Found ${listings.length} affiliate listings\n`)

  let updated = 0
  let skipped = 0

  for (const listing of listings) {
    const prefix = listing.id.slice(0, 8)
    const asinEntry = ASIN_MAP[prefix]
    const query = `${listing.brand} ${listing.model}`

    // Build the primary affiliate_url
    let newAffiliateUrl
    if (asinEntry) {
      newAffiliateUrl = makeAmazonUrl(asinEntry.asin)
    } else if (listing.affiliate_source === 'amazon') {
      newAffiliateUrl = makeAmazonSearchUrl(query)
    } else {
      newAffiliateUrl = listing.affiliate_url
    }

    // Update price_sources to add affiliate tags to Amazon + Noon links
    const priceSources = (listing.price_sources ?? []).map(src => {
      let url = src.url
      try {
        if (src.platform === 'amazon' || url.includes('amazon.ae')) {
          const u = new URL(url)
          // If it's a search URL, upgrade to ASIN URL if we have one
          if (asinEntry && (u.pathname.startsWith('/s') || !u.pathname.includes('/dp/'))) {
            url = makeAmazonUrl(asinEntry.asin)
          } else {
            u.searchParams.set('tag', TAG)
            url = u.toString()
          }
        } else if (src.platform === 'noon' || url.includes('noon.com')) {
          // Add noon affiliate if not already there
          if (!url.includes('partnerID')) {
            url = makeNoonUrl(query)
          }
        }
      } catch {}
      return { ...src, url }
    })

    const changed =
      newAffiliateUrl !== listing.affiliate_url ||
      JSON.stringify(priceSources) !== JSON.stringify(listing.price_sources)

    if (!changed) {
      skipped++
      continue
    }

    const ok = await patch(listing.id, {
      affiliate_url: newAffiliateUrl,
      price_sources: priceSources,
    })

    if (ok) {
      updated++
      console.log(`✓ ${listing.title}`)
      if (asinEntry) console.log(`  → amazon.ae/dp/${asinEntry.asin}`)
    } else {
      console.log(`✗ FAILED: ${listing.title}`)
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} already correct`)
}

main().catch(console.error)
