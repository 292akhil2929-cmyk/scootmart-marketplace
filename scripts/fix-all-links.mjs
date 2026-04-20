/**
 * ScootMart.ae — Fix all affiliate + Noon links
 *
 * - Applies real Amazon.ae /dp/ASIN URLs for every product we have an ASIN for
 * - Properly formats Noon affiliate redirect with partnerID=518012
 * - Replaces Noon search-wrapper redirects that point to a search URL
 *   with a cleaner direct search link for better UX
 *
 * Run: node scripts/fix-all-links.mjs
 */

const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3Byd2R0ZXhzbmptZ3B3bnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MTk0MSwiZXhwIjoyMDkyMDE3OTQxfQ.7jRGUWvBud8zR94bAdSMUh9QCWtiU4iXG-jJ5Y3no8o'
const BASE = 'https://vowprwdtexsnjmgpwnvs.supabase.co'
const TAG  = 'scootmartae-21'
const NOON = '518012'

// ── All confirmed Amazon.ae ASINs ────────────────────────────────────────────
// Map: listing UUID prefix → { asin, noonQuery }
const PRODUCT_MAP = {
  // ── Xiaomi Scooters ──────────────────────────────────────────────────────
  'dcf0cac7': { asin: 'B0C4379MHV', noonQuery: 'Xiaomi Electric Scooter 4 Lite' },
  'ddd39051': { asin: 'B0B7NT5LK8', noonQuery: 'Xiaomi Electric Scooter 4' },
  'a87d094b': { asin: 'B0CZHQHKTK', noonQuery: 'Xiaomi Electric Scooter 4 Pro' },
  '233a5c40': { asin: 'B0C1CK7FY1', noonQuery: 'Xiaomi Electric Scooter 4 Ultra' },
  'dfd4c47b': { asin: 'B09CPR2J78', noonQuery: 'Xiaomi Electric Scooter 3' },
  'b1c198af': { asin: 'B089WDJJ7H', noonQuery: 'Xiaomi Mi Electric Scooter Pro 2' },

  // ── Xiaomi E-Bikes ───────────────────────────────────────────────────────
  'fd23bd82': { asin: 'B08M5WTFN4', noonQuery: 'Xiaomi HIMO Z20 electric bike' },
  '625b47ad': { asin: 'B08LNCK27G', noonQuery: 'Xiaomi HIMO C26 electric bike' },

  // ── Segway ───────────────────────────────────────────────────────────────
  '9f41179c': { asin: 'B0B3RXSCR8', noonQuery: 'Segway Ninebot Max G2' },
  '4b48d2fc': { asin: 'B0C65CMKTK', noonQuery: 'Segway Ninebot Max G30D' },
  '2577f818': { asin: 'B09B7BXRMT', noonQuery: 'Segway Ninebot F40E' },
  'fd46961f': { asin: 'B0B3RZ5SLC', noonQuery: 'Segway Ninebot E2 Plus' },
  '86d234e6': { asin: 'B0B3RZVX6X', noonQuery: 'Segway Ninebot E2' },
  '6abeae63': { asin: 'B0B3RZVX6X', noonQuery: 'Segway Ninebot Air T15E' }, // best available ASIN

  // ── NIU ──────────────────────────────────────────────────────────────────
  'd6ec17bb': { asin: 'B0B73JDVSF', noonQuery: 'NIU KQi3 Pro electric scooter' },
  'b6f76029': { asin: 'B0B73JDVSF', noonQuery: 'NIU KQi3 Max electric scooter' },

  // ── Hiboy ────────────────────────────────────────────────────────────────
  '2525468b': { asin: 'B09BR8CCSS', noonQuery: 'Hiboy S2 Pro electric scooter' },
  'dac4d998': { asin: 'B086JHCJTX', noonQuery: 'Hiboy MAX3 electric scooter' },

  // ── Inokim ───────────────────────────────────────────────────────────────
  'c05c198c': { asin: 'B0D734RWRH', noonQuery: 'Inokim Light 2 electric scooter' },

  // ── Dualtron ─────────────────────────────────────────────────────────────
  '12bf9a1a': { asin: 'B09WNBDCP7', noonQuery: 'Dualtron Thunder 2 electric scooter' },

  // ── Kugoo ────────────────────────────────────────────────────────────────
  '042ca1d6': { asin: 'B08SL3XP3Q', noonQuery: 'Kugoo M4 Pro electric scooter' },

  // ── ADO ──────────────────────────────────────────────────────────────────
  'c99f9afd': { asin: 'B0D2V1YRMQ', noonQuery: 'ADO A20 folding e-bike' },
}

// Products NOT on Amazon.ae — specialty UAE retailers only
// For these, we keep the Amazon search link but improve the Noon search term
const NOON_ONLY = {
  '339b3c78': 'TurboAnt X7 Pro electric scooter',
  'd8f4dc3d': 'NIU KQi2 Pro electric scooter',
  'b2299cd1': 'Segway Ninebot GT1E electric scooter',
  'be549386': 'Eleglide M1 Plus electric bike',
  '663d3164': 'Engwe Engine Pro fat tyre e-bike',
  '65d76c54': 'Engwe C20 Pro city e-bike',
  'cf7a7b1b': 'Fiido D11 folding e-bike',
  'df52d0c6': 'Hiboy P10 electric bike',
  '8c690c21': 'Lankeleisi RV800 fat tyre e-bike',
}

function amazonUrl(asin)  { return `https://www.amazon.ae/dp/${asin}?tag=${TAG}` }
function noonRedirect(q)  {
  const search = `https://www.noon.com/uae-en/search/?q=${encodeURIComponent(q)}`
  return `https://www.noon.com/uae-en/redirect?partnerID=${NOON}&url=${encodeURIComponent(search)}`
}

async function fetchAll() {
  const res = await fetch(`${BASE}/rest/v1/listings?select=id,title,affiliate_url,price_sources&status=eq.active&is_affiliate=eq.true&limit=100`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  })
  return res.json()
}

async function updateListing(id, affiliate_url, price_sources) {
  const res = await fetch(`${BASE}/rest/v1/listings?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=minimal'
    },
    body: JSON.stringify({ affiliate_url, price_sources })
  })
  return res.ok
}

async function main() {
  console.log('🔗 ScootMart Link Fixer — applying real product URLs\n')
  const listings = await fetchAll()
  console.log(`Found ${listings.length} active affiliate listings\n`)

  let updated = 0

  for (const listing of listings) {
    const prefix = listing.id.substring(0, 8)
    const sources = listing.price_sources ?? []

    const productEntry = PRODUCT_MAP[prefix]
    const noonOnlyQuery = NOON_ONLY[prefix]

    if (!productEntry && !noonOnlyQuery) {
      // Specialty brand — nothing to do for now
      continue
    }

    // Build new affiliate_url
    const newAffUrl = productEntry
      ? amazonUrl(productEntry.asin)
      : listing.affiliate_url  // keep existing search link

    // Fix Noon sources
    const query = productEntry?.noonQuery ?? noonOnlyQuery ?? listing.title
    const newSources = sources.map(src => {
      if (src.platform === 'noon' || (src.url ?? '').includes('noon.com')) {
        return { ...src, url: noonRedirect(query) }
      }
      if ((src.platform === 'amazon' || (src.url ?? '').includes('amazon.ae')) && productEntry) {
        return { ...src, url: amazonUrl(productEntry.asin) }
      }
      return src
    })

    const changed = newAffUrl !== listing.affiliate_url ||
      JSON.stringify(newSources) !== JSON.stringify(sources)

    if (!changed) {
      console.log(`⏭  ${listing.title.substring(0, 45)} (no change)`)
      continue
    }

    const ok = await updateListing(listing.id, newAffUrl, newSources)
    if (ok) {
      updated++
      const marker = productEntry ? '✅' : '🔗'
      console.log(`${marker} ${listing.title.substring(0, 45)}`)
      if (productEntry) console.log(`   → amazon.ae/dp/${productEntry.asin}`)
      console.log(`   → noon: ${query}`)
    } else {
      console.log(`❌ FAILED: ${listing.title}`)
    }
  }

  console.log(`\n✅ Done — ${updated} listings updated`)
}

main().catch(e => { console.error(e); process.exit(1) })
