-- ─────────────────────────────────────────────────────────────
-- 004: Expand price sources to 5-6 stores per listing
-- Run this in Supabase SQL Editor AFTER 003_affiliate_seed.sql
-- ─────────────────────────────────────────────────────────────

-- Xiaomi Electric Scooter 4 Lite
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Lite"},
  {"platform":"noon","label":"Noon","price":849,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Lite"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":879,"url":"https://www.sharafdg.com/search?q=xiaomi+scooter+4+lite"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":899,"url":"https://www.mi.com/ae"},
  {"platform":"carrefour","label":"Carrefour UAE","price":919,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=xiaomi+scooter"}
]'::jsonb WHERE title = 'Xiaomi Electric Scooter 4 Lite';

-- Xiaomi Electric Scooter 3
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":999,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+3"},
  {"platform":"noon","label":"Noon","price":1049,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+3"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":1099,"url":"https://www.mi.com/ae"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":1099,"url":"https://www.sharafdg.com/search?q=xiaomi+scooter+3"},
  {"platform":"carrefour","label":"Carrefour UAE","price":1129,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=xiaomi+scooter"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":1149,"url":"https://www.jumbo.ae/search?q=xiaomi+scooter"}
]'::jsonb WHERE title = 'Xiaomi Electric Scooter 3';

-- Segway Ninebot E2
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2"},
  {"platform":"noon","label":"Noon","price":820,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":849,"url":"https://www.sharafdg.com/search?q=segway+ninebot+e2"},
  {"platform":"carrefour","label":"Carrefour UAE","price":859,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=segway+e2"}
]'::jsonb WHERE title = 'Segway Ninebot E2';

-- Segway Ninebot E2 Plus
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1099,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2+Plus"},
  {"platform":"noon","label":"Noon","price":1150,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2+Plus"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":1179,"url":"https://www.sharafdg.com/search?q=segway+ninebot+e2+plus"},
  {"platform":"carrefour","label":"Carrefour UAE","price":1199,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=segway+e2+plus"}
]'::jsonb WHERE title = 'Segway Ninebot E2 Plus';

-- TurboAnt X7 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1199,"url":"https://www.amazon.ae/s?k=TurboAnt+X7+Pro"},
  {"platform":"noon","label":"Noon","price":1249,"url":"https://www.noon.com/uae-en/search/?q=TurboAnt+X7+Pro"}
]'::jsonb WHERE title = 'TurboAnt X7 Pro';

-- Hiboy S2 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Hiboy+S2+Pro"},
  {"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Hiboy+S2+Pro"},
  {"platform":"microless","label":"Microless","price":1379,"url":"https://www.microless.com/search?q=hiboy+s2+pro"}
]'::jsonb WHERE title = 'Hiboy S2 Pro';

-- Niu KQi2 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1599,"url":"https://www.amazon.ae/s?k=Niu+KQi2+Pro"},
  {"platform":"noon","label":"Noon","price":1649,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi2+Pro"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":1699,"url":"https://www.sharafdg.com/search?q=niu+kqi2"},
  {"platform":"virgin","label":"Virgin Megastore","price":1729,"url":"https://www.virginmegastore.ae/search?q=niu+scooter"}
]'::jsonb WHERE title = 'Niu KQi2 Pro';

-- Xiaomi Electric Scooter 4
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4"},
  {"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":1399,"url":"https://www.mi.com/ae"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":1399,"url":"https://www.sharafdg.com/search?q=xiaomi+scooter+4"},
  {"platform":"carrefour","label":"Carrefour UAE","price":1449,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=xiaomi+electric+scooter+4"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":1499,"url":"https://www.jumbo.ae/search?q=xiaomi+electric+scooter"}
]'::jsonb WHERE title = 'Xiaomi Electric Scooter 4';

-- Xiaomi Electric Scooter 4 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1699,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Pro"},
  {"platform":"noon","label":"Noon","price":1749,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Pro"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":1799,"url":"https://www.mi.com/ae"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":1799,"url":"https://www.sharafdg.com/search?q=xiaomi+scooter+4+pro"},
  {"platform":"carrefour","label":"Carrefour UAE","price":1849,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=xiaomi+scooter+4+pro"},
  {"platform":"lulu","label":"LuLu Webstore","price":1899,"url":"https://www.luluhypermarket.com/en-ae/search?q=xiaomi+scooter"}
]'::jsonb WHERE title = 'Xiaomi Electric Scooter 4 Pro';

-- Xiaomi Mi Pro 2
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2099,"url":"https://www.amazon.ae/s?k=Xiaomi+Mi+Pro+2"},
  {"platform":"noon","label":"Noon","price":2149,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Mi+Pro+2"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2199,"url":"https://www.sharafdg.com/search?q=xiaomi+mi+pro+2"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":2249,"url":"https://www.mi.com/ae"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":2299,"url":"https://www.jumbo.ae/search?q=xiaomi+mi+pro"},
  {"platform":"virgin","label":"Virgin Megastore","price":2349,"url":"https://www.virginmegastore.ae/search?q=xiaomi+mi+pro+2"}
]'::jsonb WHERE title = 'Xiaomi Mi Pro 2';

-- Segway Ninebot Air T15E
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Air+T15E"},
  {"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Air+T15E"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2299,"url":"https://www.sharafdg.com/search?q=segway+ninebot+air+t15"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":2349,"url":"https://www.jumbo.ae/search?q=segway+ninebot+air"}
]'::jsonb WHERE title = 'Segway Ninebot Air T15E';

-- Xiaomi Electric Scooter 4 Ultra
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Ultra"},
  {"platform":"noon","label":"Noon","price":2549,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Ultra"},
  {"platform":"xiaomi","label":"Xiaomi Store","price":2599,"url":"https://www.mi.com/ae"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2649,"url":"https://www.sharafdg.com/search?q=xiaomi+scooter+4+ultra"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":2699,"url":"https://www.jumbo.ae/search?q=xiaomi+electric+scooter+4+ultra"}
]'::jsonb WHERE title = 'Xiaomi Electric Scooter 4 Ultra';

-- Segway Ninebot F40E
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+F40E"},
  {"platform":"noon","label":"Noon","price":2549,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+F40E"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2599,"url":"https://www.sharafdg.com/search?q=segway+ninebot+f40"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":2649,"url":"https://www.jumbo.ae/search?q=segway+f40"},
  {"platform":"carrefour","label":"Carrefour UAE","price":2699,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=segway+f40"}
]'::jsonb WHERE title = 'Segway Ninebot F40E';

-- Niu KQi3 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Pro"},
  {"platform":"noon","label":"Noon","price":2349,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi3+Pro"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2399,"url":"https://www.sharafdg.com/search?q=niu+kqi3+pro"},
  {"platform":"virgin","label":"Virgin Megastore","price":2449,"url":"https://www.virginmegastore.ae/search?q=niu+kqi3+pro"},
  {"platform":"microless","label":"Microless","price":2399,"url":"https://www.microless.com/search?q=niu+kqi3+pro"}
]'::jsonb WHERE title = 'Niu KQi3 Pro';

-- Segway Ninebot Max G2
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2849,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G2"},
  {"platform":"noon","label":"Noon","price":2949,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G2"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":2999,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max+g2"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":3049,"url":"https://www.jumbo.ae/search?q=segway+max+g2"},
  {"platform":"carrefour","label":"Carrefour UAE","price":3099,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=segway+max+g2"},
  {"platform":"virgin","label":"Virgin Megastore","price":3149,"url":"https://www.virginmegastore.ae/search?q=segway+max+g2"}
]'::jsonb WHERE title = 'Segway Ninebot Max G2';

-- Segway Ninebot Max G30D II
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":3199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G30D"},
  {"platform":"noon","label":"Noon","price":3249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G30D"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":3299,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max+g30"},
  {"platform":"jumbo","label":"Jumbo Electronics","price":3349,"url":"https://www.jumbo.ae/search?q=segway+max+g30"},
  {"platform":"carrefour","label":"Carrefour UAE","price":3399,"url":"https://www.carrefouruae.com/mafuae/en/search?keyword=segway+max+g30"}
]'::jsonb WHERE title = 'Segway Ninebot Max G30D II';

-- Niu KQi3 Max
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":2999,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Max"},
  {"platform":"noon","label":"Noon","price":3049,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi3+Max"},
  {"platform":"sharaf_dg","label":"Sharaf DG","price":3099,"url":"https://www.sharafdg.com/search?q=niu+kqi3+max"},
  {"platform":"virgin","label":"Virgin Megastore","price":3149,"url":"https://www.virginmegastore.ae/search?q=niu+kqi3+max"}
]'::jsonb WHERE title = 'Niu KQi3 Max';

-- Kugoo M4 Pro
UPDATE listings SET price_sources = '[
  {"platform":"amazon","label":"Amazon.ae","price":1799,"url":"https://www.amazon.ae/s?k=Kugoo+M4+Pro"},
  {"platform":"noon","label":"Noon","price":1849,"url":"https://www.noon.com/uae-en/search/?q=Kugoo+M4+Pro"},
  {"platform":"microless","label":"Microless","price":1879,"url":"https://www.microless.com/search?q=kugoo+m4+pro"}
]'::jsonb WHERE title = 'Kugoo M4 Pro';

-- Verify
SELECT title, jsonb_array_length(price_sources) as store_count FROM listings ORDER BY price ASC;
