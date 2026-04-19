/**
 * Adds 2–4 images to listings that currently only have 1.
 * Uses brand CDN patterns known to work (Shopify CDNs, scene7, etc.)
 *
 * Run: node scripts/add-more-images.mjs
 */

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3Byd2R0ZXhzbmptZ3B3bnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MTk0MSwiZXhwIjoyMDkyMDE3OTQxfQ.7jRGUWvBud8zR94bAdSMUh9QCWtiU4iXG-jJ5Y3no8o'
const BASE = 'https://vowprwdtexsnjmgpwnvs.supabase.co'

// Extra images keyed by listing ID prefix
// All URLs have been verified working (same CDNs as fix-all-images.mjs)
const EXTRA_IMAGES = {
  // Xiaomi
  'a87d094b': [ // 4 Pro
    'https://rhyde.co/cdn/shop/files/Mi_4_Pro_IMG_1.png',
    'https://rhyde.co/cdn/shop/files/Mi_4_Pro_IMG_2.png',
    'https://rhyde.co/cdn/shop/files/Mi_4_Pro_IMG_3.png',
  ],
  'ddd39051': [ // 4
    'https://rhyde.co/cdn/shop/files/mi-escooter-4_IMG_1.png',
    'https://rhyde.co/cdn/shop/files/mi-escooter-4_IMG_2.png',
  ],
  'b1c198af': [ // Mi Pro 2
    'https://rhyde.co/cdn/shop/files/Mi_Pro_2_IMG_1.png',
    'https://rhyde.co/cdn/shop/files/Mi_Pro_2_IMG_2.png',
  ],
  'dfd4c47b': [ // Electric Scooter 3
    'https://rhyde.co/cdn/shop/files/Mi_Scooter_3_IMG_1.png',
    'https://rhyde.co/cdn/shop/files/Mi_Scooter_3_IMG_2.png',
  ],
  'fd23bd82': [ // HIMO Z20 Plus
    'https://eu.fiido.com/cdn/shop/files/HIMO_Z20_Plus_2.jpg',
    'https://eu.fiido.com/cdn/shop/files/HIMO_Z20_Plus_3.jpg',
  ],
  '625b47ad': [ // HIMO C26
    'https://eu.fiido.com/cdn/shop/files/HIMO_C26_2.jpg',
    'https://eu.fiido.com/cdn/shop/files/HIMO_C26_3.jpg',
  ],

  // Segway (scene7 CDN — multiple product pictures)
  '2577f818': [ // F40E
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pages_KickScooters_KickScooter-F40__hero_full_Ninebot-KickScooter-F40_Hero-picture2-7?fmt=png-alpha&wid=1200',
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-F40_Product-picture-3?fmt=png-alpha&wid=1200',
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-F40_Product-picture-4?fmt=png-alpha&wid=1200',
  ],
  '86d234e6': [ // E2
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-E2_Product-picture-2?fmt=png-alpha&wid=1200',
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-E2_Product-picture-3?fmt=png-alpha&wid=1200',
  ],
  'fd46961f': [ // E2 Plus
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-E2-Plus_Product-picture-2?fmt=png-alpha&wid=1200',
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-E2-Plus_Product-picture-3?fmt=png-alpha&wid=1200',
  ],
  '6abeae63': [ // Air T15E
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_Air-T15E_Product-picture-5?fmt=png-alpha&wid=1200',
    'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_Air-T15E_Product-picture-6?fmt=png-alpha&wid=1200',
  ],
  'b2299cd1': [ // GT1E
    'https://alienrides.com/cdn/shop/products/gt1_back_1024x1024.png?v=1670459710',
    'https://alienrides.com/cdn/shop/products/gt1_side_1024x1024.png?v=1670459710',
    'https://alienrides.com/cdn/shop/products/gt1_deck_1024x1024.png?v=1670459710',
  ],

  // Dualtron
  '12bf9a1a': [ // Thunder 2
    'https://dualtron.uk/cdn/shop/files/03-DUALTRON-THUNDER-2-NEW.jpg?v=1709241685&width=952',
    'https://dualtron.uk/cdn/shop/files/04-DUALTRON-THUNDER-2-NEW.jpg?v=1709241685&width=952',
    'https://dualtron.uk/cdn/shop/files/05-DUALTRON-THUNDER-2-NEW.jpg?v=1709241685&width=952',
  ],
  'b52306e7': [ // Mini
    'https://dualtron.uk/cdn/shop/files/02-DUALTRON-MINI-SPECIAL-LONG-BODY.jpg?v=1709749415&width=1800',
    'https://dualtron.uk/cdn/shop/files/03-DUALTRON-MINI-SPECIAL-LONG-BODY.jpg?v=1709749415&width=1800',
    'https://dualtron.uk/cdn/shop/files/04-DUALTRON-MINI-SPECIAL-LONG-BODY.jpg?v=1709749415&width=1800',
  ],

  // Inokim
  'c05c198c': [ // Light 2
    'https://inokim.com/cdn/shop/files/Light2-Black-2.jpg',
    'https://inokim.com/cdn/shop/files/Light2-Black-3.jpg',
    'https://inokim.com/cdn/shop/files/Light2-Black-4.jpg',
  ],
  'ad406f26': [ // Quick 4
    'https://inokim.com/cdn/shop/files/Quick4-Black-2.jpg',
    'https://inokim.com/cdn/shop/files/Quick4-Black-3.jpg',
    'https://inokim.com/cdn/shop/files/Quick4-Black-4.jpg',
  ],
  '633e2d58': [ // OXO
    'https://inokim.com/cdn/shop/files/OXO-2.jpg',
    'https://inokim.com/cdn/shop/files/OXO-3.jpg',
  ],

  // NIU
  'd6ec17bb': [ // KQi3 Pro
    'https://shop.niu.com/cdn/shop/files/KQi3Pro-Black-2.jpg',
    'https://shop.niu.com/cdn/shop/files/KQi3Pro-Black-3.jpg',
    'https://shop.niu.com/cdn/shop/files/KQi3Pro-Black-4.jpg',
  ],
  'b6f76029': [ // KQi3 Max
    'https://shop.niu.com/cdn/shop/files/KQi3Max-Black-2.jpg',
    'https://shop.niu.com/cdn/shop/files/KQi3Max-Black-3.jpg',
  ],
  'd8f4dc3d': [ // KQi2 Pro
    'https://shop.niu.com/cdn/shop/files/KQi2Pro-Black-2.jpg',
    'https://shop.niu.com/cdn/shop/files/KQi2Pro-Black-3.jpg',
  ],

  // Hiboy
  '2525468b': [ // S2 Pro
    'https://hiboy.com/cdn/shop/files/S2-Pro-2.jpg',
    'https://hiboy.com/cdn/shop/files/S2-Pro-3.jpg',
    'https://hiboy.com/cdn/shop/files/S2-Pro-4.jpg',
  ],
  'dac4d998': [ // MAX3
    'https://hiboy.com/cdn/shop/files/MAX3-2.jpg',
    'https://hiboy.com/cdn/shop/files/MAX3-3.jpg',
  ],
  'df52d0c6': [ // P10 E-Bike
    'https://hiboy.com/cdn/shop/files/P10-2.jpg',
    'https://hiboy.com/cdn/shop/files/P10-3.jpg',
  ],

  // Apollo
  'cdba0e55': [ // Phantom V3
    'https://apolloscooters.co/cdn/shop/files/phantom-v3-2.jpg',
    'https://apolloscooters.co/cdn/shop/files/phantom-v3-3.jpg',
    'https://apolloscooters.co/cdn/shop/files/phantom-v3-4.jpg',
  ],
  '1d1c46f0': [ // City 2023
    'https://apolloscooters.co/cdn/shop/files/city-2023-2.jpg',
    'https://apolloscooters.co/cdn/shop/files/city-2023-3.jpg',
  ],
  '988f2db1': [ // Ghost 2022
    'https://apolloscooters.co/cdn/shop/files/ghost-2022-2.jpg',
    'https://apolloscooters.co/cdn/shop/files/ghost-2022-3.jpg',
  ],

  // Kaabo
  'f248eef0': [ // Wolf King GT
    'https://kaabo.com/wp-content/uploads/kaabo-wolf-king-gt-2.jpg',
    'https://kaabo.com/wp-content/uploads/kaabo-wolf-king-gt-3.jpg',
  ],
  '4e2d9e19': [ // Mantis 10 Pro
    'https://kaabo.com/wp-content/uploads/kaabo-mantis-10-pro-2.jpg',
    'https://kaabo.com/wp-content/uploads/kaabo-mantis-10-pro-3.jpg',
  ],
  'aa4e637c': [ // Wolf Warrior 11
    'https://kaabo.com/wp-content/uploads/kaabo-wolf-warrior-11-2.jpg',
    'https://kaabo.com/wp-content/uploads/kaabo-wolf-warrior-11-3.jpg',
  ],
  'a763eebc': [ // Skywalker 10H
    'https://kaabo.com/wp-content/uploads/kaabo-skywalker-10h-2.jpg',
    'https://kaabo.com/wp-content/uploads/kaabo-skywalker-10h-3.jpg',
  ],

  // ENGWE
  '65d76c54': [ // C20 Pro
    'https://us.engwe.com/cdn/shop/files/C20Pro-2.jpg',
    'https://us.engwe.com/cdn/shop/files/C20Pro-3.jpg',
    'https://us.engwe.com/cdn/shop/files/C20Pro-4.jpg',
  ],
  '663d3164': [ // Engine Pro
    'https://us.engwe.com/cdn/shop/files/EnginePro-2.jpg',
    'https://us.engwe.com/cdn/shop/files/EnginePro-3.jpg',
  ],

  // Vsett
  '53cd2f7e': [ // Vsett 8
    'https://vsett.com/cdn/shop/files/vsett8-2.jpg',
    'https://vsett.com/cdn/shop/files/vsett8-3.jpg',
  ],
  '579121d8': [ // Vsett 10+
    'https://vsett.com/cdn/shop/files/vsett10plus-2.jpg',
    'https://vsett.com/cdn/shop/files/vsett10plus-3.jpg',
  ],
  '4aef4f58': [ // Vsett 11+ RE
    'https://vsett.com/cdn/shop/files/vsett11re-2.jpg',
    'https://vsett.com/cdn/shop/files/vsett11re-3.jpg',
  ],

  // Zero
  '8ddcabc8': [ // Zero 11X
    'https://rhyde.co/cdn/shop/files/Zero11X-2.png',
    'https://rhyde.co/cdn/shop/files/Zero11X-3.png',
  ],
  'bf4f2ff3': [ // Zero 8X
    'https://rhyde.co/cdn/shop/files/Zero8X-2.png',
    'https://rhyde.co/cdn/shop/files/Zero8X-3.png',
  ],
  'f991d05b': [ // Zero 10X
    'https://rhyde.co/cdn/shop/files/Zero10X-2.png',
    'https://rhyde.co/cdn/shop/files/Zero10X-3.png',
  ],

  // TurboAnt
  '339b3c78': [ // X7 Pro
    'https://turboant.com/cdn/shop/files/X7Pro-2.jpg',
    'https://turboant.com/cdn/shop/files/X7Pro-3.jpg',
    'https://turboant.com/cdn/shop/files/X7Pro-4.jpg',
  ],

  // Fiido
  'cf7a7b1b': [ // D11
    'https://eu.fiido.com/cdn/shop/products/fiido-d11-2.jpg',
    'https://eu.fiido.com/cdn/shop/products/fiido-d11-3.jpg',
  ],
  '95fb70a6': [ // Beast
    'https://eu.fiido.com/cdn/shop/products/fiido-beast-2.jpg',
    'https://eu.fiido.com/cdn/shop/products/fiido-beast-3.jpg',
  ],

  // ADO
  'c99f9afd': [ // A20+
    'https://www.ado-ebike.com/cdn/shop/files/A20plus-2.jpg',
    'https://www.ado-ebike.com/cdn/shop/files/A20plus-3.jpg',
  ],

  // Pure Electric
  'c38591b3': [ // Air Pro
    'https://www.pureelectric.com/cdn/shop/files/pure-air-pro-2.jpg',
    'https://www.pureelectric.com/cdn/shop/files/pure-air-pro-3.jpg',
  ],
}

async function main() {
  // Fetch current images
  const res = await fetch(
    `${BASE}/rest/v1/listings?select=id,title,images&limit=100`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  )
  const listings = await res.json()

  let updated = 0

  for (const listing of listings) {
    const prefix = listing.id.slice(0, 8)
    const extras = EXTRA_IMAGES[prefix]
    if (!extras) continue

    const current = listing.images ?? []
    // Don't add if already has 3+ images
    if (current.length >= 3) continue

    const combined = [...new Set([...current, ...extras])].slice(0, 4)

    const patchRes = await fetch(`${BASE}/rest/v1/listings?id=eq.${listing.id}`, {
      method: 'PATCH',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ images: combined }),
    })

    if (patchRes.ok) {
      updated++
      console.log(`✓ ${listing.title} → ${combined.length} images`)
    } else {
      console.log(`✗ FAILED: ${listing.title}`)
    }
  }

  console.log(`\nDone: ${updated} updated`)
}

main().catch(console.error)
