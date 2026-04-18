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

  -- ── BUDGET (under AED 1,500) ────────────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi Electric Scooter 4 Lite','Xiaomi','Electric Scooter 4 Lite','scooter','new',799,999,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Lite',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Lite"},{"platform":"noon","label":"Noon","price":849,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Lite"}]'::jsonb,'Entry-level Xiaomi. 10 kg, RTA compliant, perfect for short hops and first-time riders in Dubai.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,20,14,20,300,10.0,'IP54',4.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot E2','Segway','Ninebot E2','scooter','new',799,null,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+E2',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":799,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2"},{"platform":"noon","label":"Noon","price":820,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2"}]'::jsonb,'8 kg beginner scooter, foldable, ideal for metro+scooter commuters in Dubai and Abu Dhabi.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,20,14,20,180,8.0,'IPX4',3.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot E2 Plus','Segway','Ninebot E2 Plus','scooter','new',1099,1399,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+E2+Plus',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":1099,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+E2+Plus"},{"platform":"noon","label":"Noon","price":1150,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+E2+Plus"}]'::jsonb,'Upgraded E2 with longer range. Best budget buy for short Dubai daily commutes.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,25,18,20,180,10.5,'IPX4',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'TurboAnt X7 Pro','TurboAnt','X7 Pro','scooter','new',1199,1499,'active',true,'amazon','https://www.amazon.ae/s?k=TurboAnt+X7+Pro',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":1199,"url":"https://www.amazon.ae/s?k=TurboAnt+X7+Pro"}]'::jsonb,'Removable battery — charge it at your desk. Great range for the price, solid build for UAE heat.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,45,32,25,350,13.5,'IPX4',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Hiboy S2 Pro','Hiboy','S2 Pro','scooter','new',1299,1599,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+S2+Pro',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Hiboy+S2+Pro"},{"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Hiboy+S2+Pro"}]'::jsonb,'IP55 water resistance at budget price. Handles UAE dust and light rain better than most rivals.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,350,14.5,'IP55',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Niu KQi2 Pro','Niu','KQi2 Pro','scooter','new',1599,1899,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi2+Pro',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":1599,"url":"https://www.amazon.ae/s?k=Niu+KQi2+Pro"},{"platform":"noon","label":"Noon","price":1649,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi2+Pro"}]'::jsonb,'Premium build quality from Niu. App-connected, solid range, great for JBR and Dubai Marina roads.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,300,14.4,'IPX4',5.5,12);

  -- ── MID RANGE (AED 1,500 – 3,500) ──────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi Electric Scooter 4','Xiaomi','Electric Scooter 4','scooter','new',1299,1599,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":1299,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4"},{"platform":"noon","label":"Noon","price":1349,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4"},{"platform":"xiaomi","label":"Xiaomi Store","price":1399,"url":"https://www.mi.com/ae"}]'::jsonb,'Top-selling scooter in UAE 2024. 450W, IP54, 12.5 kg — proven in 45°C Dubai heat for 3 years.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,35,25,25,450,12.5,'IP54',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi Electric Scooter 4 Pro','Xiaomi','Electric Scooter 4 Pro','scooter','new',1699,2099,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Pro',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":1699,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Pro"},{"platform":"noon","label":"Noon","price":1749,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Pro"},{"platform":"xiaomi","label":"Xiaomi Store","price":1799,"url":"https://www.mi.com/ae"}]'::jsonb,'Best mid-range Xiaomi. 600W motor, 55 km range, pneumatic tyres absorb Dubai road bumps well.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,55,40,25,600,16.8,'IP54',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi Mi Pro 2','Xiaomi','Mi Pro 2','scooter','new',2099,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Mi+Pro+2',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":2099,"url":"https://www.amazon.ae/s?k=Xiaomi+Mi+Pro+2"},{"platform":"noon","label":"Noon","price":2149,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Mi+Pro+2"},{"platform":"sharaf_dg","label":"Sharaf DG","price":2199,"url":"https://www.sharafdg.com/search?q=xiaomi+mi+pro+2"}]'::jsonb,'UAE best-seller for 3 years. 45 km range, 14 kg, app-connected. Proven reliable in extreme UAE heat.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,45,32,25,600,14.2,'IP54',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot Air T15E','Segway','Ninebot Air T15E','scooter','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Air+T15E',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Air+T15E"},{"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Air+T15E"}]'::jsonb,'Lightest serious commuter at 12.5 kg. Fastest charge at 3.5h. Best for metro+scooter riders.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,35,25,25,300,12.5,'IPX4',3.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi Electric Scooter 4 Ultra','Xiaomi','Electric Scooter 4 Ultra','scooter','new',2499,2999,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Ultra',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Xiaomi+Electric+Scooter+4+Ultra"},{"platform":"xiaomi","label":"Xiaomi Store","price":2599,"url":"https://www.mi.com/ae"},{"platform":"noon","label":"Noon","price":2549,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+Electric+Scooter+4+Ultra"}]'::jsonb,'Flagship Xiaomi with IP55 — best dust/splash protection in the range. 70 km claimed, 50 km in UAE heat.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,70,50,25,700,19.5,'IP55',6.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Niu KQi3 Pro','Niu','KQi3 Pro','scooter','new',2299,2699,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi3+Pro',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Pro"},{"platform":"noon","label":"Noon","price":2349,"url":"https://www.noon.com/uae-en/search/?q=Niu+KQi3+Pro"}]'::jsonb,'Hydraulic brakes and IPX5 rating. Best smart scooter under AED 2,500 for UAE conditions.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,50,35,25,350,16.5,'IPX5',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Inokim Light 2','Inokim','Light 2','scooter','new',2299,2599,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+Light+2',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Inokim+Light+2"}]'::jsonb,'Israeli engineering, UAE favourite. Solid folding mechanism, smooth ride on Abu Dhabi roads.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,40,28,25,350,12.8,'IPX4',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Hiboy MAX3','Hiboy','MAX3','scooter','new',2299,2799,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+MAX3',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Hiboy+MAX3"}]'::jsonb,'IP65 waterproof — highest water rating under AED 2,500. Excellent for delivery riders in UAE.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,60,42,45,800,18.0,'IP65',6.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Vsett 8','Vsett','8','scooter','new',2899,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+8+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":2899,"url":"https://www.amazon.ae/s?k=Vsett+8+electric+scooter"}]'::jsonb,'Korean performance brand rising in UAE. 45 km/h, dual suspension, 70 km range. Smooth on Dubai highways.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,70,49,45,500,20.5,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot Max G30D II','Segway','Ninebot Max G30D II','scooter','new',3199,3799,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Max+G30D',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":3199,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G30D"},{"platform":"noon","label":"Noon","price":3249,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G30D"},{"platform":"sharaf_dg","label":"Sharaf DG","price":3299,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max"}]'::jsonb,'The benchmark UAE commuter scooter. IPX5, 65 km range, trusted by thousands of Dubai riders.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,25,700,18.7,'IPX5',6.0,24);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot Max G2','Segway','Ninebot Max G2','scooter','new',2849,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+Max+G2',true,true,'[{"platform":"amazon","label":"Amazon.ae","price":2849,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+Max+G2"},{"platform":"noon","label":"Noon","price":2949,"url":"https://www.noon.com/uae-en/search/?q=Segway+Ninebot+Max+G2"},{"platform":"sharaf_dg","label":"Sharaf DG","price":2999,"url":"https://www.sharafdg.com/search?q=segway+ninebot+max+g2"}]'::jsonb,'Best overall scooter in UAE 2024. 70 km range, IP55, dual suspension, 150 kg load. Handles JBR hills easily.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months,max_rider_weight_kg) VALUES (lid,70,50,25,700,25.0,'IP55',6.0,24,150);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Niu KQi3 Max','Niu','KQi3 Max','scooter','new',2999,3499,'active',true,'amazon','https://www.amazon.ae/s?k=Niu+KQi3+Max',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2999,"url":"https://www.amazon.ae/s?k=Niu+KQi3+Max"}]'::jsonb,'Top-spec Niu with 65 km range and hydraulic brakes. Best smart app scooter under AED 3,000.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,25,450,18.7,'IPX5',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Inokim Quick 4','Inokim','Quick 4','scooter','new',3199,3699,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+Quick+4',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":3199,"url":"https://www.amazon.ae/s?k=Inokim+Quick+4"}]'::jsonb,'40 km/h, 65 km range, dual brakes. Popular with Abu Dhabi and Sharjah commuters wanting speed.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,40,500,21.3,'IPX5',7.0,12);

  -- ── PERFORMANCE (AED 3,500 – 8,000) ────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Apollo City 2023','Apollo','City 2023','scooter','new',2799,3299,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+City+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":2799,"url":"https://www.amazon.ae/s?k=Apollo+City+2023+scooter"}]'::jsonb,'Canadian brand popular in UAE. 500W, hydraulic brakes, front suspension — great city commuter.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,56,40,35,500,19.0,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Zero 8X','Zero','8X','scooter','new',3099,3599,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+8X+electric+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":3099,"url":"https://www.amazon.ae/s?k=Zero+8X+electric+scooter"}]'::jsonb,'1000W, 45 km/h, hydraulic brakes. Serious commuter speed in a foldable package for UAE roads.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,65,46,45,1000,18.5,'IP54',8.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Dualtron Mini','Dualtron','Mini','scooter','new',4299,4799,'active',true,'amazon','https://www.amazon.ae/s?k=Dualtron+Mini',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4299,"url":"https://www.amazon.ae/s?k=Dualtron+Mini"}]'::jsonb,'Entry into Dualtron family. 1500W, 45 km/h, compact and powerful. Gateway to performance scootering.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,60,42,45,1500,18.7,'IPX5',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Kaabo Mantis 10 Pro','Kaabo','Mantis 10 Pro','scooter','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Mantis+10+Pro',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Kaabo+Mantis+10+Pro"}]'::jsonb,'Dual 1000W, 50 km/h, hydraulic brakes. Popular with serious commuters in Dubai and Sharjah.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,50,2000,26.0,'IP54',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Kaabo Skywalker 10H','Kaabo','Skywalker 10H','scooter','new',4799,5299,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Skywalker+10H',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4799,"url":"https://www.amazon.ae/s?k=Kaabo+Skywalker+10H"}]'::jsonb,'Dual 600W, hydraulic brakes, 18Ah battery. Popular on private compounds in Dubai and Sharjah.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,85,60,50,1200,27.0,'IP54',9.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Vsett 10+','Vsett','10+','scooter','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+10+Plus+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Vsett+10+Plus"}]'::jsonb,'Korean build quality. Dual 1000W, 80 km/h, 100 km range. Top choice in Abu Dhabi performance scene.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,80,2000,31.0,'IP54',12.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Apollo Phantom V3','Apollo','Phantom V3','scooter','new',4599,5199,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+Phantom+V3',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4599,"url":"https://www.amazon.ae/s?k=Apollo+Phantom+V3"}]'::jsonb,'Dual 1600W, 65 km/h, air suspension front and rear. Smoothest ride quality at this price in UAE.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,65,3200,28.5,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Inokim OXO','Inokim','OXO','scooter','new',5499,5999,'active',true,'amazon','https://www.amazon.ae/s?k=Inokim+OXO',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":5499,"url":"https://www.amazon.ae/s?k=Inokim+OXO"}]'::jsonb,'Dual 500W, 60 km/h, 100 km range. Premium Israeli brand, strong Dubai enthusiast following.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,60,1000,26.0,'IP54',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Apollo Ghost 2022','Apollo','Ghost 2022','scooter','new',5199,5799,'active',true,'amazon','https://www.amazon.ae/s?k=Apollo+Ghost+2022',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":5199,"url":"https://www.amazon.ae/s?k=Apollo+Ghost+2022"}]'::jsonb,'Dual 1000W, 55 km/h, spring suspension. Best bang-for-buck performance scooter in the UAE market.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,55,2000,27.0,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Zero 10X','Zero','10X','scooter','new',4999,5499,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+10X+electric+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4999,"url":"https://www.amazon.ae/s?k=Zero+10X+electric+scooter"}]'::jsonb,'Dual 1000W, 65 km/h. Best value high-speed scooter available in UAE. Strong resale value.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,90,63,65,2000,28.5,'IP55',10.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Segway Ninebot GT1E','Segway','Ninebot GT1E','scooter','new',5499,5999,'active',true,'amazon','https://www.amazon.ae/s?k=Segway+Ninebot+GT1E',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":5499,"url":"https://www.amazon.ae/s?k=Segway+Ninebot+GT1E"},{"platform":"sharaf_dg","label":"Sharaf DG","price":5699,"url":"https://www.sharafdg.com/search?q=segway+gt1"}]'::jsonb,'Segway flagship performance model. 2400W, 70 km/h, full suspension. For compound and private road use.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,90,63,70,2400,35.0,'IP54',8.0,24);

  -- ── HIGH PERFORMANCE (AED 8,000+) ───────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Kaabo Wolf Warrior 11','Kaabo','Wolf Warrior 11','scooter','new',9499,10499,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Wolf+Warrior+11',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":9499,"url":"https://www.amazon.ae/s?k=Kaabo+Wolf+Warrior+11"}]'::jsonb,'Monster off-road scooter. Dual 1800W, 80 km/h, 35Ah. NOT RTA compliant — private/compound use only.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months,max_rider_weight_kg) VALUES (lid,150,105,80,3600,50.0,'IP54',13.0,12,150);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Vsett 11+ RE','Vsett','11+ RE','scooter','new',9500,10500,'active',true,'amazon','https://www.amazon.ae/s?k=Vsett+11+RE',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":9500,"url":"https://www.amazon.ae/s?k=Vsett+11+RE"}]'::jsonb,'Korean flagship dual motor. 5600W, 80 km/h, 35Ah. Best-in-class suspension for UAE road conditions.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,80,5600,49.0,'IP55',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Zero 11X','Zero','11X','scooter','new',9999,10999,'active',true,'amazon','https://www.amazon.ae/s?k=Zero+11X+electric+scooter',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":9999,"url":"https://www.amazon.ae/s?k=Zero+11X+electric+scooter"}]'::jsonb,'Dual 2700W, 80 km/h. Among the fastest folding scooters sold in UAE. Private compound use only.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,80,5400,50.0,'IP56',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Kaabo Wolf King GT','Kaabo','Wolf King GT','scooter','new',12500,13500,'active',true,'amazon','https://www.amazon.ae/s?k=Kaabo+Wolf+King+GT',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":12500,"url":"https://www.amazon.ae/s?k=Kaabo+Wolf+King+GT"}]'::jsonb,'Top-spec Kaabo. Dual 3360W, 100 km/h, 35Ah, IP56. For serious enthusiasts with private compound. NOT RTA compliant.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,100,6720,55.0,'IP56',14.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Dualtron Thunder 2','Dualtron','Thunder 2','scooter','new',16900,18000,'active',true,'amazon','https://www.amazon.ae/s?k=Dualtron+Thunder+2',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":16900,"url":"https://www.amazon.ae/s?k=Dualtron+Thunder+2"}]'::jsonb,'Dualtron flagship. Dual 4320W, 95 km/h, 63Ah. Most powerful folding scooter sold in the UAE.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,150,105,95,8640,52.0,'IPX5',18.0,12);

  -- ── E-BIKES (10) ────────────────────────────────────────────

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi HIMO Z20 Plus','Xiaomi','HIMO Z20 Plus','ebike','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+HIMO+Z20',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Xiaomi+HIMO+Z20"},{"platform":"noon","label":"Noon","price":2249,"url":"https://www.noon.com/uae-en/search/?q=Xiaomi+HIMO+Z20"}]'::jsonb,'Foldable e-bike from Xiaomi. 80 km range, 25 km/h. Lightweight and practical for Dubai city riding.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,25,250,23.0,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Xiaomi HIMO C26','Xiaomi','HIMO C26','ebike','new',2499,2799,'active',true,'amazon','https://www.amazon.ae/s?k=Xiaomi+HIMO+C26',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2499,"url":"https://www.amazon.ae/s?k=Xiaomi+HIMO+C26"},{"platform":"xiaomi","label":"Xiaomi Store","price":2599,"url":"https://www.mi.com/ae"}]'::jsonb,'City e-bike with hydraulic disc brakes, IP54, 100 km range. App-connected. Great on Dubai bike tracks.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,22.0,'IP54',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Eleglide M1 Plus','Eleglide','M1 Plus','ebike','new',2299,2699,'active',true,'amazon','https://www.amazon.ae/s?k=Eleglide+M1+Plus',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2299,"url":"https://www.amazon.ae/s?k=Eleglide+M1+Plus"},{"platform":"noon","label":"Noon","price":2349,"url":"https://www.noon.com/uae-en/search/?q=Eleglide+M1+Plus"}]'::jsonb,'Best budget mountain e-bike in UAE. 100 km range, 21-speed gears, comfortable on Al Qudra cycling track.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,23.4,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Hiboy P10 E-Bike','Hiboy','P10','ebike','new',1899,2299,'active',true,'amazon','https://www.amazon.ae/s?k=Hiboy+P10+ebike',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":1899,"url":"https://www.amazon.ae/s?k=Hiboy+P10+ebike"}]'::jsonb,'Affordable foldable e-bike. 7-speed, 50 km battery range. Folds flat for Dubai apartments and car boots.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,50,35,25,250,21.0,'IPX4',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Fiido D11 Folding E-Bike','Fiido','D11','ebike','new',3299,3699,'active',true,'amazon','https://www.amazon.ae/s?k=Fiido+D11',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":3299,"url":"https://www.amazon.ae/s?k=Fiido+D11"},{"platform":"noon","label":"Noon","price":3349,"url":"https://www.noon.com/uae-en/search/?q=Fiido+D11"}]'::jsonb,'Premium folding e-bike, 150 km range, dual disc brakes. Very popular in Abu Dhabi cycling community.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,150,105,25,250,19.5,'IPX5',4.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Engwe Engine Pro Fat Tyre','Engwe','Engine Pro','ebike','new',3499,3999,'active',true,'amazon','https://www.amazon.ae/s?k=Engwe+Engine+Pro',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":3499,"url":"https://www.amazon.ae/s?k=Engwe+Engine+Pro"},{"platform":"noon","label":"Noon","price":3549,"url":"https://www.noon.com/uae-en/search/?q=Engwe+Engine+Pro"}]'::jsonb,'Fat tyre e-bike — excellent on Dubai sand and loose gravel. 750W, 120 km range, front suspension.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,120,84,25,750,28.0,'IPX4',6.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'ADO A20+ Folding E-Bike','ADO','A20+','ebike','new',2799,3199,'active',true,'amazon','https://www.amazon.ae/s?k=ADO+A20+Plus+ebike',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2799,"url":"https://www.amazon.ae/s?k=ADO+A20+Plus+ebike"},{"platform":"noon","label":"Noon","price":2849,"url":"https://www.noon.com/uae-en/search/?q=ADO+A20+ebike"}]'::jsonb,'Minimalist folding design, app-connected. 7-speed, 80 km range, very light at 18 kg for an e-bike.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,80,56,25,250,18.0,'IPX5',5.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Engwe C20 Pro City E-Bike','Engwe','C20 Pro','ebike','new',2199,2499,'active',true,'amazon','https://www.amazon.ae/s?k=Engwe+C20+Pro',true,false,'[{"platform":"amazon","label":"Amazon.ae","price":2199,"url":"https://www.amazon.ae/s?k=Engwe+C20+Pro"}]'::jsonb,'Compact city e-bike, folds to 60% size. 100 km range, hydraulic brakes. Clean commuter for Dubai Marina.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,25,250,22.5,'IPX4',5.5,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Lankeleisi RV800 Fat Tyre','Lankeleisi','RV800','ebike','new',3499,3999,'active',true,'amazon','https://www.amazon.ae/s?k=Lankeleisi+RV800',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":3499,"url":"https://www.amazon.ae/s?k=Lankeleisi+RV800"}]'::jsonb,'Dual battery option available. Fat 4" tyres, great on Hatta trails and Sharjah off-road. Cult UAE following.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,100,70,35,800,31.0,'IPX4',7.0,12);

  INSERT INTO listings (seller_id,title,brand,model,type,condition,price,original_price,status,is_affiliate,affiliate_source,affiliate_url,rta_compliant,uae_tested,price_sources,description)
  VALUES (aid,'Fiido Beast Fat Tyre E-Bike','Fiido','Beast','ebike','new',4499,4999,'active',true,'amazon','https://www.amazon.ae/s?k=Fiido+Beast+ebike',false,false,'[{"platform":"amazon","label":"Amazon.ae","price":4499,"url":"https://www.amazon.ae/s?k=Fiido+Beast+ebike"},{"platform":"noon","label":"Noon","price":4549,"url":"https://www.noon.com/uae-en/search/?q=Fiido+Beast+ebike"}]'::jsonb,'Premium full-suspension fat tyre e-bike. 1000W, 200 km dual battery range. Top UAE off-road e-bike.')
  RETURNING id INTO lid;
  INSERT INTO listing_specs (listing_id,range_km,range_km_uae_heat,top_speed_kmh,motor_watts,weight_kg,ip_rating,charging_time_hours,warranty_months) VALUES (lid,200,140,35,1000,33.0,'IPX5',8.0,12);

END $$;
