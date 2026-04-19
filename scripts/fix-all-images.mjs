const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3Byd2R0ZXhzbmptZ3B3bnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MTk0MSwiZXhwIjoyMDkyMDE3OTQxfQ.7jRGUWvBud8zR94bAdSMUh9QCWtiU4iXG-jJ5Y3no8o'
const BASE = 'https://vowprwdtexsnjmgpwnvs.supabase.co'

// All 46 broken listings with verified CDN image URLs
const FIXES = [
  { id: '2577f818-c615-4574-b625-d12c200b7510', title: 'Segway Ninebot F40E',
    images: ['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pages_KickScooters_KickScooter-F40__hero_full_Ninebot-KickScooter-F40_Hero-picture2-6?dpr=on,3&network=on'] },
  { id: 'b2299cd1-44c6-402c-b53d-5c40ce7f0929', title: 'Segway Ninebot GT1E',
    images: ['https://alienrides.com/cdn/shop/products/gt1_1024x1024.png?v=1670459710'] },
  { id: '4b48d2fc-7f86-477b-84fc-d474c411f408', title: 'Segway Ninebot Max G30D II',
    images: ['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pages_KickScooters_KickScooter-MAX-G30D-II__hero_full_23306_MAX-G30D-II_Lifestyle--NPr3rbcFaX?dpr=on,3&network=on'] },
  { id: 'fd46961f-b5e6-4316-a8aa-3f3cf4b1d5c1', title: 'Segway Ninebot E2 Plus',
    images: ['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_KickScooter-E2-Plus_Product-picture-website-1?dpr=on,3&network=on&fmt=png-alpha'] },
  { id: '6abeae63-3d3f-4adb-a194-9ba87015eb9a', title: 'Segway Ninebot Air T15E',
    images: ['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_Air-T15E_Product-picture-4?dpr=on,3&network=on&fmt=png-alpha'] },
  { id: '12bf9a1a-549e-46b9-a051-4e7ef9cc9bbf', title: 'Dualtron Thunder 2',
    images: ['https://dualtron.uk/cdn/shop/files/02-DUALTRON-THUNDER-2-NEW.jpg?v=1709241685&width=952'] },
  { id: 'b52306e7-dfcd-4f3a-ae57-26a1f8810939', title: 'Dualtron Mini',
    images: ['https://dualtron.uk/cdn/shop/files/01-DUALTRON-MINI-SPECIAL-LONG-BODY.jpg?v=1709749415&width=1800'] },
  { id: '53cd2f7e-17f5-4553-8807-9c10924de38c', title: 'Vsett 8',
    images: ['https://cdn.shopify.com/s/files/1/0210/2694/files/v-8r-banner.jpg'] },
  { id: '4aef4f58-21dc-423e-88ad-15d1470de576', title: 'Vsett 11+ RE',
    images: ['https://cdn.shopify.com/s/files/1/0210/2694/files/v11p-banner-01.jpg'] },
  { id: '579121d8-3bce-479b-a4cb-ded28601764a', title: 'Vsett 10+',
    images: ['https://cdn.shopify.com/s/files/1/0210/2694/files/v10p-banner-01.jpg'] },
  { id: '8ddcabc8-82d7-4c7d-b319-71feb6f2c797', title: 'Zero 11X',
    images: ['https://zeroelectricscooter.com/cdn/shop/products/Zero-11X-Electric-Scooter_15a2cbde-974c-4ba9-92a7-f9e34318c3d7_600x600.jpg?v=1634351544'] },
  { id: 'bf4f2ff3-a484-4e91-a50a-c5a9d7c2420c', title: 'Zero 8X',
    images: ['https://zeroelectricscooter.com/cdn/shop/products/zero-8x-electric-scooter_600x600.png?v=1634352148'] },
  { id: 'f991d05b-abba-4e4b-8f0a-d8f1a00af6c5', title: 'Zero 10X',
    images: ['https://zeroelectricscooter.com/cdn/shop/products/zero10x_d9750b21-1a3b-4521-a407-10bbfe697fd3_600x600.png?v=1590231548'] },
  { id: 'c05c198c-70ab-4db1-89f6-7bd7692a4254', title: 'Inokim Light 2',
    images: ['https://inokim.com/cdn/shop/files/light_aa258760-39df-48ff-b746-3f36c6ff7484_500x.png?v=1746305310'] },
  { id: 'ad406f26-be2b-4dc3-b202-74aefab9bf88', title: 'Inokim Quick 4',
    images: ['https://inokim.com/cdn/shop/files/Q_1_819x.png?v=1742157557'] },
  { id: '633e2d58-8950-4be4-b6a4-7bb3357cee2a', title: 'Inokim OXO',
    images: ['https://inokim.com/cdn/shop/files/carbon_01_d41db245-891a-4963-9d03-15ebaf02147a_819x.jpg?v=1742141079'] },
  { id: '1d1c46f0-70a9-4754-86ad-57e75d1cde39', title: 'Apollo City 2023',
    images: ['https://apolloscooters.co/cdn/shop/files/CityPro-new2023_afc1bb3a-4cea-4b53-bfdb-0530456272c0.png?v=1773931277'] },
  { id: 'cdba0e55-46cc-434b-b78d-2de6708e5189', title: 'Apollo Phantom V3',
    images: ['https://apolloscooters.co/cdn/shop/files/A11_Black_springs_update_20250604_2.png?v=1773931411&width=2160'] },
  { id: '988f2db1-a713-4f00-9011-25c29842f8f8', title: 'Apollo Ghost 2022',
    images: ['https://www.electrickicks.com.au/cdn/shop/products/apollo-ghost-electric-scooter.jpg'] },
  { id: 'dac4d998-5123-4644-a3b1-dd83a39685a5', title: 'Hiboy MAX3',
    images: ['https://electricrideco.com/cdn/shop/products/9_c61c3113-ad02-4726-92f6-87775987ed97_1024x1024.jpg?v=1678345516'] },
  { id: '2525468b-ce45-4800-8511-02c608647550', title: 'Hiboy S2 Pro',
    images: ['https://www.hiboy.com/cdn/shop/files/S2-Pro_10a19be9-8729-46dd-9749-aebd2f887079.png?v=1774941762&width=1500'] },
  { id: 'df52d0c6-ae45-4cbf-a225-8586ebed0869', title: 'Hiboy P10 E-Bike',
    images: ['https://www.hiboy.com/cdn/shop/files/900x1200_8_fd3f883d-4c39-4604-baa5-f54572cb29fa.jpg?v=1748590184'] },
  { id: 'd8f4dc3d-0a54-435c-abc5-3c7828c32d60', title: 'Niu KQi2 Pro',
    images: ['https://shop.niu.com/cdn/shop/products/Niu-Kqi2-Pro-Electric-Kick-Scooter-grey-4.jpg?v=1741076124&width=1500'] },
  { id: 'd6ec17bb-5c28-4ca4-b6cc-5de43ff13e57', title: 'Niu KQi3 Pro',
    images: ['https://shop.niu.com/cdn/shop/products/NiuKqi3ProElectricKickScooterBlack1.jpg?v=1640830318&width=3000'] },
  { id: 'b6f76029-082f-4a55-94fa-4f0b6eb17c06', title: 'Niu KQi3 Max',
    images: ['https://shop.niu.com/cdn/shop/products/1500_5.jpg?v=1773998080&width=1500'] },
  { id: '339b3c78-1006-40cc-ad9c-14687eb04f9f', title: 'TurboAnt X7 Pro',
    images: ['https://turboant.com/cdn/shop/files/X7Pro_01_0c0fb7e7-0733-49b4-ab3f-d20709e27dfa.jpg'] },
  { id: 'b1c198af-1076-49d5-8fcc-a8a81b424e6a', title: 'Xiaomi Mi Pro 2',
    images: ['https://rhyde.co/cdn/shop/files/Xiaomi_Pro_2_IMG_1_a908990b-324f-4dd5-9884-1bacbbde58d3.png?crop=center&height=2048&v=1765464950&width=2048'] },
  { id: 'ddd39051-57e3-493c-9a4a-94bc1607aa21', title: 'Xiaomi Electric Scooter 4',
    images: ['https://rhyde.co/cdn/shop/files/Xiaomi_4_IMG_1_658463b6-d469-42a1-bb5c-256d3028e087.png?crop=center&height=2457&v=1765468992&width=2048'] },
  { id: 'a87d094b-a840-4a31-b7af-2cfa638956df', title: 'Xiaomi Electric Scooter 4 Pro',
    images: ['https://rhyde.co/cdn/shop/files/Xiaomi_4_Pro_IMG_1.png?crop=center&height=2048&v=1765373938&width=2048'] },
  { id: 'dfd4c47b-a882-4407-b33c-c02d0eebe155', title: 'Xiaomi Electric Scooter 3',
    images: ['https://www.electricscooterslondon.com/cdn/shop/products/XiaomiMiElectricScooter3_3_2048x.jpg?v=1640070115'] },
  { id: 'fd23bd82-62cd-4fa8-873f-61d99cb2c4a1', title: 'Xiaomi HIMO Z20 Plus',
    images: ['https://www.electricscooterslondon.com/cdn/shop/products/himo_z20_max_1_2048x.jpg?v=1655369000'] },
  { id: '625b47ad-e88a-4966-98f7-ecfc3b2f4d97', title: 'Xiaomi HIMO C26',
    images: ['https://www.electricscooterslondon.com/cdn/shop/products/himo_c26_1_2048x.jpg?v=1655369001'] },
  { id: 'cf7a7b1b-225a-448e-bf88-59500dafe3c8', title: 'Fiido D11 Folding E-Bike',
    images: ['https://eu.fiido.com/cdn/shop/files/1-d11-grey_1024x.webp?v=1747311027'] },
  { id: '95fb70a6-a719-44a4-8645-788c4c007e97', title: 'Fiido Beast Fat Tyre E-Bike',
    images: ['https://electroheads.com/cdn/shop/files/fiido-fiido-beast-electric-scooter-34484490879089.jpg?v=1699999000&width=480'] },
  { id: '4e2d9e19-8467-4103-9d73-ea77ccd87bc0', title: 'Kaabo Mantis 10 Pro',
    images: ['https://www.kaabousa.com/cdn/shop/files/mantis-10-lite-kaabo-usa-dual-motor-scooter.jpg?v=1775812879'] },
  { id: 'a763eebc-6eaa-4746-a0a7-ec3e762e3a12', title: 'Kaabo Skywalker 10H',
    images: ['https://www.kaabo.com/wp-content/uploads/2023/05/Kaabo-Skywalker-10H.png'] },
  { id: 'aa4e637c-41a5-4064-8e51-2e77d90e95de', title: 'Kaabo Wolf Warrior 11',
    images: ['https://www.kaabousa.com/cdn/shop/files/11-Pro_1eae3f0d-b311-4d92-9980-0ac4c4bef73d.jpg'] },
  { id: 'f248eef0-ffc3-4795-81df-5a0acebce9d9', title: 'Kaabo Wolf King GT',
    images: ['https://www.kaabousa.com/cdn/shop/files/King-GT_47e75ebb-bd9b-4fb0-810f-3c4a88cc7d3c.jpg?v=1769995504'] },
  { id: 'c38591b3-395e-457e-8e97-e0041dcbec92', title: 'Pure Air Pro',
    images: ['https://rhyde.co/cdn/shop/files/PURE_ELECTRIC_AIR_PRO_2NG_GEN_29095f6c-63e8-40dc-a420-44f3f13ddcb9.png?crop=center&height=2048&v=1765467411&width=2048'] },
  { id: '663d3164-146e-45e1-9cd2-3440db0e4485', title: 'Engwe Engine Pro Fat Tyre',
    images: ['https://us.engwe.com/cdn/shop/files/6_8245e44e-74ec-4927-9c2d-14c92a424f52.jpg'] },
  { id: '65d76c54-30d1-4207-b0b2-9bd3c3d2a3ec', title: 'Engwe C20 Pro City E-Bike',
    images: ['https://electroheads.com/cdn/shop/files/electroheads-engwe-c20-pro-30776600756337.webp?v=1704280978&width=480'] },
  { id: '8c690c21-023f-493d-9061-c44093829155', title: 'Lankeleisi RV800 Fat Tyre',
    images: ['https://lankeleisi-bikes.com/cdn/shop/files/RV800_Plus_89e25815-434b-473c-99a6-e46d9dda086d.png?v=1776071845&width=800'] },
  { id: 'c99f9afd-3908-4e5a-90ab-204e629c5619', title: 'ADO A20+ Folding E-Bike',
    images: ['https://www.adoebike.com/cdn/shop/files/20230306113026.png'] },
  { id: 'be549386-6a75-41c1-a7b1-aefd5cbaf011', title: 'Eleglide M1 Plus',
    images: ['https://eleglide.com/cdn/shop/files/IMG_0692-2.jpg'] },
  { id: '042ca1d6-7005-43f4-9f3c-7882808c1026', title: 'Kugoo M4 Pro',
    images: ['https://www.kugookirineu.com/cdn/shop/products/7_1800x1800.png?v=1665819887'] },
  { id: 'df04dd05-2ecd-49e7-9e1f-316d0e03dcf0', title: 'Joyor Y10S Long Range',
    images: ['https://joyorscooter.com/cdn/shop/files/Pre-_black_friday_website_models_535x.png?v=1776340358'] },
]

let ok = 0, fail = 0
for (const { id, title, images } of FIXES) {
  const r = await fetch(`${BASE}/rest/v1/listings?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: 'Bearer ' + KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ images })
  })
  if (r.ok) {
    console.log(`✅ ${title}`)
    ok++
  } else {
    const t = await r.text()
    console.log(`❌ ${title}: ${r.status} ${t}`)
    fail++
  }
}
console.log(`\nDone: ${ok} updated, ${fail} failed`)
