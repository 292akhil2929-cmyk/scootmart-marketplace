-- ─────────────────────────────────────────────────────────────
-- 003: Add price_sources column + seed 50 top UAE e-scooters
-- Run this entire file in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS price_sources JSONB DEFAULT '[]'::jsonb;

-- Clear existing listings
DELETE FROM public.listing_specs;
DELETE FROM public.listings;

DO $$
DECLARE
  aid uuid;
  lid uuid;
BEGIN
  SELECT id INTO aid FROM auth.users WHERE email = 'scootmartae@gmail.com';
  IF aid IS NULL THEN RAISE EXCEPTION 'Admin user not found — sign up first at /register'; END IF;

  -- ── BUDGET (under AED 1,500) ─ 6 listings ──────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Electric Scooter 4 Lite','Xiaomi','Electric Scooter 4 Lite','scooter','new',799,999,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Lite',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Lite"},{"platform":"noon","label":"Noon","price":849,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Lite"}]'::jsonb,
    'Entry-level Xiaomi. 10 kg, RTA compliant, perfect for short hops and first-time riders in Dubai.',
    ARRAY['https://www.pixelzones.com/cdn/shop/files/Xiaomi-Electric-Scooter-4-Lite-IPX4-Splash-Resistant.jpg?v=1753296881'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,20,14,20,300,10.0,'IP54',4.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot E2','Segway','Ninebot E2','scooter','new',799,null,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+E2',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2"},{"platform":"noon","label":"Noon","price":820,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2"}]'::jsonb,
    '8 kg beginner scooter, foldable, ideal for metro+scooter commuters in Dubai and Abu Dhabi.',
    ARRAY['https://www.e-scooteruaehub.com/cdn/shop/files/27.03.2025_12.09.15_REC_1024x1024@2x.png?v=1743063557'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,20,14,20,180,8.0,'IPX4',3.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot E2 Plus','Segway','Ninebot E2 Plus','scooter','new',1099,1399,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+E2+Plus',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1099,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2+Plus"},{"platform":"noon","label":"Noon","price":1150,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2+Plus"}]'::jsonb,
    'Upgraded E2 with longer range. Best budget buy for short Dubai daily commutes.',
    ARRAY['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_E2-Plus_Product-picture-1?fmt=png-alpha&wid=1200'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,25,18,20,180,10.5,'IPX4',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'TurboAnt X7 Pro','TurboAnt','X7 Pro','scooter','new',1199,1499,'active',true,'amazon','https://www.amazon.ae/s?k=TurboAnt+X7+Pro',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1199,"url":"https://www.amazon.ae/s?k=TurboAnt+X7+Pro"}]'::jsonb,
    'Removable battery — charge it at your desk. Great range for the price, solid build for UAE heat.',
    ARRAY['https://turboant.com/cdn/shop/files/X7Pro_01_0c0fb7e7-0733-49b4-ab3f-d20709e27dfa.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,45,32,25,350,13.5,'IPX4',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Hiboy S2 Pro','Hiboy','S2 Pro','scooter','new',1299,1599,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+S2+Pro',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Hiboy+S2+Pro"},{"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Hiboy+S2+Pro"}]'::jsonb,
    'IP55 water resistance at budget price. Handles UAE dust and light rain better than most rivals.',
    ARRAY['https://cdn.shopify.com/s/files/1/0598/2181/files/S2-Pro-Black_1024x1024.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,350,14.5,'IP55',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Niu KQi2 Pro','Niu','KQi2 Pro','scooter','new',1599,1899,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi2+Pro',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1599,"url":"https://www.amazon.ae/s?k=Niu+KQi2+Pro"},{"platform":"noon","label":"Noon","price":1649,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi2+Pro"}]'::jsonb,
    'Premium build quality from Niu. App-connected, solid range, great for JBR and Dubai Marina roads.',
    ARRAY['https://global.niu.com/uploads/p/kqi2pro/kqi2pro-black-1.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,300,14.4,'IPX4',5.5,12);

  -- ── MID RANGE (AED 1,500 – 3,500) ─ 14 listings ─────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Electric Scooter 4','Xiaomi','Electric Scooter 4','scooter','new',1299,1599,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4"},{"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4"},{"platform":"xiaomi","label":"Xiaomi Store","price":1399,"url":"https://www.mi.com/ae"}]'::jsonb,
    'Top-selling scooter in UAE 2024. 450W, IP54, 12.5 kg — proven in 45°C Dubai heat for 3 years.',
    ARRAY['https://rhyde.co/cdn/shop/files/Xiaomi_4_IMG_1_658463b6-d469-42a1-bb5c-256d3028e087.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,35,25,25,450,12.5,'IP54',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Electric Scooter 4 Pro','Xiaomi','Electric Scooter 4 Pro','scooter','new',1699,2099,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Pro',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":1699,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Pro"},{"platform":"noon","label":"Noon","price":1749,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Pro"},{"platform":"xiaomi","label":"Xiaomi Store","price":1799,"url":"https://www.mi.com/ae"}]'::jsonb,
    'Best mid-range Xiaomi. 600W motor, 55 km range, pneumatic tyres absorb Dubai road bumps well.',
    ARRAY['https://rhyde.co/cdn/shop/files/Xiaomi_4_Pro_IMG_1.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,55,40,25,600,16.8,'IP54',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Mi Pro 2','Xiaomi','Mi Pro 2','scooter','new',2099,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Mi+Pro+2',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":2099,"url":"https://www.amazon.ae/s?k=Xiaomi+Mi+Pro+2"},{"platform":"noon","label":"Noon","price":2149,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Mi+Pro+2"},{"platform":"sharaf_dg","label":"Sharaf DG","price":2199,"url":"https://www.sharafdg.com/search?q=xiaomi+mi+pro+2"}]'::jsonb,
    'UAE best-seller for 3 years. 45 km range, 14 kg, app-connected. Proven reliable in extreme UAE heat.',
    ARRAY['https://rhyde.co/cdn/shop/files/Xiaomi_Pro_2_IMG_1_a908990b-324f-4dd5-9884-1bacbbde58d3.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,45,32,25,600,14.2,'IP54',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot Air T15E','Segway','Ninebot Air T15E','scooter','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Air+T15E',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Air+T15E"},{"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Air+T15E"}]'::jsonb,
    'Lightest serious commuter at 12.5 kg. Fastest charge at 3.5h. Best for metro+scooter riders.',
    ARRAY['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_Air-T15E_Product-picture-4?fmt=png-alpha&wid=1200'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,35,25,25,300,12.5,'IPX4',3.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Electric Scooter 4 Ultra','Xiaomi','Electric Scooter 4 Ultra','scooter','new',2499,2999,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Ultra',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Ultra"},{"platform":"xiaomi","label":"Xiaomi Store","price":2599,"url":"https://www.mi.com/ae"},{"platform":"noon","label":"Noon","price":2549,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Ultra"}]'::jsonb,
    'Flagship Xiaomi with IP55 — best dust/splash protection in the range. 70 km claimed, 50 km in UAE heat.',
    ARRAY['https://rhyde.co/cdn/shop/files/Xiaomi_4_Ultra_C_IMG_1.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,70,50,25,700,19.5,'IP55',6.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Niu KQi3 Pro','Niu','KQi3 Pro','scooter','new',2299,2699,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi3+Pro',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Pro"},{"platform":"noon","label":"Noon","price":2349,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi3+Pro"}]'::jsonb,
    'Hydraulic brakes and IPX5 rating. Best smart scooter under AED 2,500 for UAE conditions.',
    ARRAY['https://global.niu.com/uploads/p/kqi3pro/kqi3pro-black-1.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,50,35,25,350,16.5,'IPX5',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Inokim Light 2','Inokim','Light 2','scooter','new',2299,2599,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+Light+2',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Inokim+Light+2"}]'::jsonb,
    'Israeli engineering, UAE favourite. Solid folding mechanism, smooth ride on Abu Dhabi roads.',
    ARRAY['https://inokim.com/cdn/shop/files/light2_black_01.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,350,12.8,'IPX4',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Hiboy MAX3','Hiboy','MAX3','scooter','new',2299,2799,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+MAX3',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Hiboy+MAX3"}]'::jsonb,
    'IP65 waterproof — highest water rating under AED 2,500. Excellent for delivery riders in UAE.',
    ARRAY['https://cdn.shopify.com/s/files/1/0598/2181/files/MAX3-Black_1024x1024.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,60,42,45,800,18.0,'IP65',6.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Vsett 8','Vsett','8','scooter','new',2899,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+8+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2899,"url":"https://www.amazon.ae/s?k=Vsett+8+electric+scooter"}]'::jsonb,
    'Korean performance brand rising in UAE. 45 km/h, dual suspension, 70 km range. Smooth on Dubai highways.',
    ARRAY['https://vsett-scooter.com/cdn/shop/files/VSETT8-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,70,49,45,500,20.5,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot Max G30D II','Segway','Ninebot Max G30D II','scooter','new',3199,3799,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Max+G30D',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":3199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G30D"},{"platform":"noon","label":"Noon","price":3249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G30D"},{"platform":"sharaf_dg","label":"Sharaf DG","price":3299,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max"}]'::jsonb,
    'The benchmark UAE commuter scooter. IPX5, 65 km range, trusted by thousands of Dubai riders.',
    ARRAY['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_MAX-G30D-II_Product-pictures_-2-4?fmt=png-alpha&wid=1200'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,25,700,18.7,'IPX5',6.0,24);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot Max G2','Segway','Ninebot Max G2','scooter','new',2849,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Max+G2',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":2849,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G2"},{"platform":"noon","label":"Noon","price":2949,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G2"},{"platform":"sharaf_dg","label":"Sharaf DG","price":2999,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max+g2"}]'::jsonb,
    'Best overall scooter in UAE 2024. 70 km range, IP55, dual suspension, 150 kg load. Handles JBR hills easily.',
    ARRAY['https://centralscoot.com/cdn/shop/files/G2.png?v=1700617812&width=1080'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months,max_rider_weight_kg) VALUES (lid,70,50,25,700,25.0,'IP55',6.0,24,150);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Niu KQi3 Max','Niu','KQi3 Max','scooter','new',2999,3499,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi3+Max',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2999,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Max"}]'::jsonb,
    'Top-spec Niu with 65 km range and hydraulic brakes. Best smart app scooter under AED 3,000.',
    ARRAY['https://global.niu.com/uploads/p/kqi3max/kqi3max-black-1.png'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,25,450,18.7,'IPX5',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Inokim Quick 4','Inokim','Quick 4','scooter','new',3199,3699,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+Quick+4',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":3199,"url":"https://www.amazon.ae/s?k=Inokim+Quick+4"}]'::jsonb,
    '40 km/h, 65 km range, dual brakes. Popular with Abu Dhabi and Sharjah commuters wanting speed.',
    ARRAY['https://inokim.com/cdn/shop/files/quick4_black_01.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,40,500,21.3,'IPX5',7.0,12);

  -- NEW: Segway Ninebot F40E (very popular mid-range in UAE)
  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot F40E','Segway','Ninebot F40E','scooter','new',2499,2799,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+F40E',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+F40E"},{"platform":"noon","label":"Noon","price":2549,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+F40E"},{"platform":"sharaf_dg","label":"Sharaf DG","price":2599,"url":"https://www.sharafdg.com/search?q=segway+ninebot+f40"}]'::jsonb,
    'IPX5, 40 km/h, 40 km range. Sporty design with front suspension — a huge hit at Dubai Marina cycling routes.',
    ARRAY['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_F40E_Product-picture-1?fmt=png-alpha&wid=1200'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,40,700,18.7,'IPX5',5.5,12);

  -- ── PERFORMANCE (AED 3,500 – 8,000) ─ 12 listings ───────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Apollo City 2023','Apollo','City 2023','scooter','new',2799,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+City+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2799,"url":"https://www.amazon.ae/s?k=Apollo+City+2023+scooter"}]'::jsonb,
    'Canadian brand popular in UAE. 500W, hydraulic brakes, front suspension — great city commuter.',
    ARRAY['https://apolloscooters.co/cdn/shop/files/Apollo_City_2024_Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,56,40,35,500,19.0,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Zero 8X','Zero','8X','scooter','new',3099,3599,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+8X+electric+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":3099,"url":"https://www.amazon.ae/s?k=Zero+8X+electric+scooter"}]'::jsonb,
    '1000W, 45 km/h, hydraulic brakes. Serious commuter speed in a foldable package for UAE roads.',
    ARRAY['https://zerousascooters.com/cdn/shop/products/Zero-8X_Black_800x.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,45,1000,18.5,'IP54',8.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Dualtron Mini','Dualtron','Mini','scooter','new',4299,4799,'active',true,'amazon','https://www.amazon.ae/s?k=Dualtron+Mini',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4299,"url":"https://www.amazon.ae/s?k=Dualtron+Mini"}]'::jsonb,
    'Entry into Dualtron family. 1500W, 45 km/h, compact and powerful. Gateway to performance scootering.',
    ARRAY['https://minimotors.com.au/cdn/shop/products/dualtron-mini-electric-scooter.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,60,42,45,1500,18.7,'IPX5',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Kaabo Mantis 10 Pro','Kaabo','Mantis 10 Pro','scooter','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Mantis+10+Pro',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Kaabo+Mantis+10+Pro"}]'::jsonb,
    'Dual 1000W, 50 km/h, hydraulic brakes. Popular with serious commuters in Dubai and Sharjah.',
    ARRAY['https://kaabomantis.com/wp-content/uploads/2022/07/Kaabo-Mantis-10-Pro-electric-scooter-black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,50,2000,26.0,'IP54',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Kaabo Skywalker 10H','Kaabo','Skywalker 10H','scooter','new',4799,5299,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Skywalker+10H',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4799,"url":"https://www.amazon.ae/s?k=Kaabo+Skywalker+10H"}]'::jsonb,
    'Dual 600W, hydraulic brakes, 18Ah battery. Popular on private compounds in Dubai and Sharjah.',
    ARRAY['https://kaaboscooter.com/cdn/shop/files/Skywalker-10H-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,85,60,50,1200,27.0,'IP54',9.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Vsett 10+','Vsett','10+','scooter','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+10+Plus+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Vsett+10+Plus"}]'::jsonb,
    'Korean build quality. Dual 1000W, 80 km/h, 100 km range. Top choice in Abu Dhabi performance scene.',
    ARRAY['https://revrides.com/cdn/shop/files/Vsett_10__NewDisplay.webp?v=1687380770&width=1946'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,80,2000,31.0,'IP54',12.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Apollo Phantom V3','Apollo','Phantom V3','scooter','new',4599,5199,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+Phantom+V3',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4599,"url":"https://www.amazon.ae/s?k=Apollo+Phantom+V3"}]'::jsonb,
    'Dual 1600W, 65 km/h, air suspension front and rear. Smoothest ride quality at this price in UAE.',
    ARRAY['https://electroheads.com/cdn/shop/files/apollo-apollo-phantom-v3-2023-electric-scooter.webp?v=1705344650&width=1024'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,65,3200,28.5,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Inokim OXO','Inokim','OXO','scooter','new',5499,5999,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+OXO',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":5499,"url":"https://www.amazon.ae/s?k=Inokim+OXO"}]'::jsonb,
    'Dual 500W, 60 km/h, 100 km range. Premium Israeli brand, strong Dubai enthusiast following.',
    ARRAY['https://inokim.com/cdn/shop/files/carbon_01_d41db245-891a-4963-9d03-15ebaf02147a_819x.jpg?v=1742141079'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,60,1000,26.0,'IP54',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Apollo Ghost 2022','Apollo','Ghost 2022','scooter','new',5199,5799,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+Ghost+2022',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":5199,"url":"https://www.amazon.ae/s?k=Apollo+Ghost+2022"}]'::jsonb,
    'Dual 1000W, 55 km/h, spring suspension. Best bang-for-buck performance scooter in the UAE market.',
    ARRAY['https://www.electrickicks.com.au/cdn/shop/products/apollo-ghost-electric-scooter.jpg?v=1686744417'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,55,2000,27.0,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Zero 10X','Zero','10X','scooter','new',4999,5499,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+10X+electric+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4999,"url":"https://www.amazon.ae/s?k=Zero+10X+electric+scooter"}]'::jsonb,
    'Dual 1000W, 65 km/h. Best value high-speed scooter available in UAE. Strong resale value.',
    ARRAY['https://zeroelectricscooter.com/cdn/shop/products/Zero-10x-Electric-Scooter_6e428c73-8cd5-495c-9f53-627f5d7c6a1e_600x600.jpg?v=1686313913'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,90,63,65,2000,28.5,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Segway Ninebot GT1E','Segway','Ninebot GT1E','scooter','new',5499,5999,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+GT1E',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":5499,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+GT1E"},{"platform":"sharaf_dg","label":"Sharaf DG","price":5699,"url":"https://www.sharafdg.com/search?q=segway+gt1"}]'::jsonb,
    'Segway flagship performance model. 2400W, 70 km/h, full suspension. For compound and private road use.',
    ARRAY['https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_GT1E_Product-picture-1?fmt=png-alpha&wid=1200'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,90,63,70,2400,35.0,'IP54',8.0,24);

  -- NEW: Pure Air Pro (popular EU brand gaining UAE traction)
  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Pure Air Pro','Pure Electric','Air Pro','scooter','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Pure+Air+Pro+scooter',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Pure+Air+Pro+scooter"},{"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Pure+Air+Pro+scooter"}]'::jsonb,
    '700W, 40 km/h, IP65 waterproof — one of the best weatherproof builds at this price. Great for coastal UAE commutes.',
    ARRAY['https://pureelectric.com/cdn/shop/files/pure-air-pro-scooter-black-angle.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,40,700,16.5,'IP65',5.0,24);

  -- ── HIGH PERFORMANCE (AED 8,000+) ─ 5 listings ──────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Kaabo Wolf Warrior 11','Kaabo','Wolf Warrior 11','scooter','new',9499,10499,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Wolf+Warrior+11',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":9499,"url":"https://www.amazon.ae/s?k=Kaabo+Wolf+Warrior+11"}]'::jsonb,
    'Monster off-road scooter. Dual 1800W, 80 km/h, 35Ah. NOT RTA compliant — private/compound use only.',
    ARRAY['https://kaaboscooter.com/cdn/shop/files/Wolf-Warrior-11-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months,max_rider_weight_kg) VALUES (lid,150,105,80,3600,50.0,'IP54',13.0,12,150);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Vsett 11+ RE','Vsett','11+ RE','scooter','new',9500,10500,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+11+RE',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":9500,"url":"https://www.amazon.ae/s?k=Vsett+11+RE"}]'::jsonb,
    'Korean flagship dual motor. 5600W, 80 km/h, 35Ah. Best-in-class suspension for UAE road conditions.',
    ARRAY['https://vsett-scooter.com/cdn/shop/files/VSETT11-RE-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,80,5600,49.0,'IP55',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Zero 11X','Zero','11X','scooter','new',9999,10999,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+11X+electric+scooter',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":9999,"url":"https://www.amazon.ae/s?k=Zero+11X+electric+scooter"}]'::jsonb,
    'Dual 2700W, 80 km/h. Among the fastest folding scooters sold in UAE. Private compound use only.',
    ARRAY['https://zerousascooters.com/cdn/shop/products/Zero-11X_Black_800x.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,80,5400,50.0,'IP56',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Kaabo Wolf King GT','Kaabo','Wolf King GT','scooter','new',12500,13500,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Wolf+King+GT',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":12500,"url":"https://www.amazon.ae/s?k=Kaabo+Wolf+King+GT"}]'::jsonb,
    'Top-spec Kaabo. Dual 3360W, 100 km/h, 35Ah, IP56. For serious enthusiasts with private compound. NOT RTA compliant.',
    ARRAY['https://www.kaabousa.com/cdn/shop/files/King-GT_47e75ebb-bd9b-4fb0-810f-3c4a88cc7d3c.jpg?v=1769995504'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,100,6720,55.0,'IP56',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Dualtron Thunder 2','Dualtron','Thunder 2','scooter','new',16900,18000,'active',true,'amazon','https://www.amazon.ae/s?k=Dualtron+Thunder+2',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":16900,"url":"https://www.amazon.ae/s?k=Dualtron+Thunder+2"}]'::jsonb,
    'Dualtron flagship. Dual 4320W, 95 km/h, 63Ah. Most powerful folding scooter sold in the UAE.',
    ARRAY['https://dualtron.uk/cdn/shop/files/02-DUALTRON-THUNDER-2-NEW.jpg?v=1709241685&width=952'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,150,105,95,8640,52.0,'IPX5',18.0,12);

  -- ── E-BIKES ─ 13 listings ────────────────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi HIMO Z20 Plus','Xiaomi','HIMO Z20 Plus','ebike','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+HIMO+Z20',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Xiaomi+HIMO+Z20"},{"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+HIMO+Z20"}]'::jsonb,
    'Foldable e-bike from Xiaomi. 80 km range, 25 km/h. Lightweight and practical for Dubai city riding.',
    ARRAY['https://cdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-himo-z20-plus-1.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,25,250,23.0,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi HIMO C26','Xiaomi','HIMO C26','ebike','new',2499,2799,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+HIMO+C26',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Xiaomi+HIMO+C26"},{"platform":"xiaomi","label":"Xiaomi Store","price":2599,"url":"https://www.mi.com/ae"}]'::jsonb,
    'City e-bike with hydraulic disc brakes, IP54, 100 km range. App-connected. Great on Dubai bike tracks.',
    ARRAY['https://cdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-himo-c26-1.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,22.0,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Eleglide M1 Plus','Eleglide','M1 Plus','ebike','new',2299,2699,'active',true,'amazon','https://www.amazon.ae/s?k=Eleglide+M1+Plus',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Eleglide+M1+Plus"},{"platform":"noon","label":"Noon","price":2349,"url":"https://www.noon.com/uae-en/search/?q=Eleglide+M1+Plus"}]'::jsonb,
    'Best budget mountain e-bike in UAE. 100 km range, 21-speed gears, comfortable on Al Qudra cycling track.',
    ARRAY['https://eleglide.com/cdn/shop/products/eleglide-m1-plus-electric-mountain-bike-black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,23.4,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Hiboy P10 E-Bike','Hiboy','P10','ebike','new',1899,2299,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+P10+ebike',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1899,"url":"https://www.amazon.ae/s?k=Hiboy+P10+ebike"}]'::jsonb,
    'Affordable foldable e-bike. 7-speed, 50 km battery range. Folds flat for Dubai apartments and car boots.',
    ARRAY['https://cdn.shopify.com/s/files/1/0598/2181/files/P10-Black_1024x1024.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,50,35,25,250,21.0,'IPX4',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Fiido D11 Folding E-Bike','Fiido','D11','ebike','new',3299,3699,'active',true,'amazon','https://www.amazon.ae/s?k=Fiido+D11',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":3299,"url":"https://www.amazon.ae/s?k=Fiido+D11"},{"platform":"noon","label":"Noon","price":3349,"url":"https://www.noon.com/uae-en/search/?q=Fiido+D11"}]'::jsonb,
    'Premium folding e-bike, 150 km range, dual disc brakes. Very popular in Abu Dhabi cycling community.',
    ARRAY['https://eu.fiido.com/cdn/shop/files/1-d11-grey_1024x.webp?v=1747311027'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,150,105,25,250,19.5,'IPX5',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Engwe Engine Pro Fat Tyre','Engwe','Engine Pro','ebike','new',3499,3999,'active',true,'amazon','https://www.amazon.ae/s?k=Engwe+Engine+Pro',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":3499,"url":"https://www.amazon.ae/s?k=Engwe+Engine+Pro"},{"platform":"noon","label":"Noon","price":3549,"url":"https://www.noon.com/uae-en/search/?q=Engwe+Engine+Pro"}]'::jsonb,
    'Fat tyre e-bike — excellent on Dubai sand and loose gravel. 750W, 120 km range, front suspension.',
    ARRAY['https://engwe-bikes.com/cdn/shop/files/engine-pro-fat-tire-ebike-black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,25,750,28.0,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'ADO A20+ Folding E-Bike','ADO','A20+','ebike','new',2799,3199,'active',true,'amazon','https://www.amazon.ae/s?k=ADO+A20+Plus+ebike',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2799,"url":"https://www.amazon.ae/s?k=ADO+A20+Plus+ebike"},{"platform":"noon","label":"Noon","price":2849,"url":"https://www.noon.com/uae-en/search/?q=ADO+A20+ebike"}]'::jsonb,
    'Minimalist folding design, app-connected. 7-speed, 80 km range, very light at 18 kg for an e-bike.',
    ARRAY['https://adoebike.com/cdn/shop/files/ADO-A20-Plus-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,25,250,18.0,'IPX5',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Engwe C20 Pro City E-Bike','Engwe','C20 Pro','ebike','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Engwe+C20+Pro',true,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Engwe+C20+Pro"}]'::jsonb,
    'Compact city e-bike, folds to 60% size. 100 km range, hydraulic brakes. Clean commuter for Dubai Marina.',
    ARRAY['https://engwe-bikes.com/cdn/shop/files/C20-Pro-city-ebike-black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,22.5,'IPX4',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Lankeleisi RV800 Fat Tyre','Lankeleisi','RV800','ebike','new',3499,3999,'active',true,'amazon','https://www.amazon.ae/s?k=Lankeleisi+RV800',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":3499,"url":"https://www.amazon.ae/s?k=Lankeleisi+RV800"}]'::jsonb,
    'Dual battery option available. Fat 4" tyres, great on Hatta trails and Sharjah off-road. Cult UAE following.',
    ARRAY['https://lankeleisi.com/cdn/shop/files/RV800-fat-tire-ebike.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,35,800,31.0,'IPX4',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Fiido Beast Fat Tyre E-Bike','Fiido','Beast','ebike','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Fiido+Beast+ebike',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Fiido+Beast+ebike"},{"platform":"noon","label":"Noon","price":4549,"url":"https://www.noon.com/uae-en/search/?q=Fiido+Beast+ebike"}]'::jsonb,
    'Premium full-suspension fat tyre e-bike. 1000W, 200 km dual battery range. Top UAE off-road e-bike.',
    ARRAY['https://eu.fiido.com/cdn/shop/files/beast-fat-tire-ebike-black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,200,140,35,1000,33.0,'IPX5',8.0,12);

  -- NEW: Kugoo M4 Pro (Amazon.ae bestseller)
  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Kugoo M4 Pro','Kugoo','M4 Pro','scooter','new',1799,1999,'active',true,'amazon','https://www.amazon.ae/s?k=Kugoo+M4+Pro',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":1799,"url":"https://www.amazon.ae/s?k=Kugoo+M4+Pro"},{"platform":"noon","label":"Noon","price":1849,"url":"https://www.noon.com/uae-en/search/?q=Kugoo+M4+Pro"}]'::jsonb,
    '500W motor, 45 km/h, front+rear suspension, off-road tyres. Top-selling affordable dual-suspension scooter on Amazon UAE.',
    ARRAY['https://kugooofficial.com/cdn/shop/files/Kugoo-M4-Pro-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,45,32,45,500,16.5,'IP54',6.0,12);

  -- NEW: Joyor Y10S (long range budget)
  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Joyor Y10S Long Range','Joyor','Y10S','scooter','new',2099,2399,'active',true,'amazon','https://www.amazon.ae/s?k=Joyor+Y10S',false,false,
    '[{"platform":"amazon","label":"Amazon.ae","price":2099,"url":"https://www.amazon.ae/s?k=Joyor+Y10S"}]'::jsonb,
    '60 km range at a budget-friendly price. Disc brakes, 10" inflatable tyres, handles Abu Dhabi heat well.',
    ARRAY['https://joyorscooter.com/cdn/shop/files/Joyor-Y10S-Black.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,60,42,30,500,21.0,'IPX4',7.0,12);

  -- NEW: Xiaomi Electric Scooter 3 (legacy bestseller still widely sold)
  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description,images)
  VALUES (aid,'Xiaomi Electric Scooter 3','Xiaomi','Electric Scooter 3','scooter','new',999,1299,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+3',true,true,
    '[{"platform":"amazon","label":"Amazon.ae","price":999,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+3"},{"platform":"noon","label":"Noon","price":1049,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+3"},{"platform":"xiaomi","label":"Xiaomi Store","price":1099,"url":"https://www.mi.com/ae"}]'::jsonb,
    'The scooter that started it all for UAE riders. 600W, 30 km range, 14.2 kg. Still one of the best deals available.',
    ARRAY['https://mi-home.ae/cdn/shop/products/xiaomi-electric-scooter-3-1.jpg'])
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,30,21,25,600,14.2,'IP54',5.5,12);

END $$;

-- Verify count
SELECT COUNT(*) AS total_listings FROM public.listings;
