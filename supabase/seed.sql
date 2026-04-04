-- ============================================================
-- ScootMart.ae – Seed Data
-- 4 sellers, 12 listings, bundles, specs
-- Run AFTER schema migration
-- ============================================================

-- NOTE: In production, create users via Supabase Auth UI or admin API.
-- These UUIDs are fixed so foreign keys work.

-- ---- SELLER PROFILES (manually insert after creating auth users) ----
INSERT INTO public.profiles (id, role, full_name, display_name, phone, whatsapp, location_emirate, location_area, bio, rating, rating_count, verified_badge) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'seller', 'Ahmed Al Rashidi', 'Ahmed Scooters', '+971501234567', '+971501234567', 'Dubai', 'Al Quoz', 'Premium e-scooter retailer with 5 years in Dubai. We test every unit in UAE heat.', 4.8, 47, TRUE),
  ('a0000001-0000-0000-0000-000000000002', 'seller', 'Sarah Mitchell', 'UAE Ebikes Co', '+971556789012', '+971556789012', 'Abu Dhabi', 'Khalidiyah', 'Specializing in high-performance e-bikes for UAE commuters. All units certified.', 4.9, 32, TRUE),
  ('a0000001-0000-0000-0000-000000000003', 'seller', 'Khalid Bin Mansour', 'Khalid Rides', '+971528901234', '+971528901234', 'Sharjah', 'Al Nahda', 'Individual seller. Upgrading my fleet. All scooters well maintained, battery tested.', 4.6, 12, FALSE),
  ('a0000001-0000-0000-0000-000000000004', 'seller', 'TechMove FZCO', 'TechMove UAE', '+971505678901', '+971505678901', 'Dubai', 'DIFC', 'Official importer of Segway, Xiaomi, and NIU for UAE. Warranty support available.', 4.95, 89, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ---- SELLER VERIFICATIONS ----
INSERT INTO public.seller_verifications (seller_id, type, business_name, status) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'shop', 'Ahmed Scooters LLC', 'verified'),
  ('a0000001-0000-0000-0000-000000000002', 'shop', 'UAE Ebikes Co LLC', 'verified'),
  ('a0000001-0000-0000-0000-000000000003', 'individual', NULL, 'pending'),
  ('a0000001-0000-0000-0000-000000000004', 'importer', 'TechMove FZCO', 'verified')
ON CONFLICT DO NOTHING;

-- ---- LISTINGS ----
INSERT INTO public.listings (id, seller_id, title, description, type, condition, brand, model, year, color, price, original_price, status, featured, certified_used, rta_compliant, uae_tested, images, location_emirate, location_area, tags) VALUES

-- 1. Segway Ninebot Max G2 (New)
('b0000001-0000-0000-0000-000000000001',
 'a0000001-0000-0000-0000-000000000004',
 'Segway Ninebot Max G2 – UAE Edition, RTA Ready',
 'The flagship Segway Max G2, officially imported for UAE. Handles Dubai heat flawlessly. We tested real-world range of 48km in 40°C (vs claimed 70km). IP56 rated, perfect for Dubai streets. RTA permit guidance included.',
 'scooter', 'new', 'Segway', 'Ninebot Max G2', 2024, 'Black',
 3299.00, 3599.00, 'active', TRUE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
 'Dubai', 'DIFC', ARRAY['segway','max-range','rta-compliant','commuter']),

-- 2. NIU KQi3 Max (New)
('b0000001-0000-0000-0000-000000000002',
 'a0000001-0000-0000-0000-000000000004',
 'NIU KQi3 Max – Smart Commuter Scooter with App Control',
 'NIU KQi3 Max with GPS tracking, anti-theft alarm, and app connectivity. Great for Dubai Mall to DIFC commutes. Tested 35km range in summer. Excellent hill climbing for Dubai Marina ramps.',
 'scooter', 'new', 'NIU', 'KQi3 Max', 2024, 'White',
 2199.00, 2399.00, 'active', TRUE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'],
 'Dubai', 'Downtown Dubai', ARRAY['niu','smart','gps','anti-theft','commuter']),

-- 3. Xiaomi Electric Scooter 4 Pro (New)
('b0000001-0000-0000-0000-000000000003',
 'a0000001-0000-0000-0000-000000000001',
 'Xiaomi Electric Scooter 4 Pro – 55km Range, Dual Brakes',
 'Xiaomi 4 Pro with 55km claimed range (real-world 38km at 40°C Dubai). Front and rear disc brakes. Foldable, easy storage. Perfect for JBR to Media City commutes.',
 'scooter', 'new', 'Xiaomi', 'Electric Scooter 4 Pro', 2024, 'Grey',
 1899.00, 1999.00, 'active', FALSE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'],
 'Dubai', 'Al Quoz', ARRAY['xiaomi','disc-brakes','foldable','mid-range']),

-- 4. Dualtron Thunder 2 (Premium, New)
('b0000001-0000-0000-0000-000000000004',
 'a0000001-0000-0000-0000-000000000001',
 'Dualtron Thunder 2 – Dual Motor 6,640W Beast for UAE Roads',
 'The Dualtron Thunder 2 is the king of premium scooters. Dual motor 6,640W total, 160km range, 95 km/h top speed. For serious UAE riders who need power on any terrain. Handles UAE desert sand entry points.',
 'scooter', 'new', 'Dualtron', 'Thunder 2', 2024, 'Black',
 12500.00, 13200.00, 'active', TRUE, FALSE, FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'],
 'Dubai', 'Al Quoz', ARRAY['dualtron','dual-motor','premium','high-performance','long-range']),

-- 5. Vsett 10+ (Premium, New)
('b0000001-0000-0000-0000-000000000005',
 'a0000001-0000-0000-0000-000000000002',
 'VSETT 10+ Dual Motor – Premium UAE Desert Performer',
 'VSETT 10+ with dual 1,000W motors, hydraulic brakes, and massive 35Ah battery. Tested in Abu Dhabi desert roads. Handles sand, heat, and bumps with ease. Full suspension front and rear.',
 'scooter', 'new', 'VSETT', '10+', 2024, 'Black',
 8900.00, 9500.00, 'active', FALSE, FALSE, FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
 'Abu Dhabi', 'Khalidiyah', ARRAY['vsett','dual-motor','suspension','desert','hydraulic-brakes']),

-- 6. Segway eMoped C80 E-Bike (New)
('b0000001-0000-0000-0000-000000000006',
 'a0000001-0000-0000-0000-000000000004',
 'Segway eMoped C80 – Urban E-Bike for Dubai Commuters',
 'The Segway C80 e-moped with 80km range, integrated lights, and cargo rack. Perfect for delivery riders and daily Dubai commuters. App connectivity, theft alarm. UAE compliant.',
 'ebike', 'new', 'Segway', 'eMoped C80', 2024, 'White',
 4500.00, 4800.00, 'active', TRUE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'],
 'Dubai', 'Business Bay', ARRAY['segway','emoped','ebike','delivery','long-range','cargo']),

-- 7. KTM Macina Style 720 E-Bike (New)
('b0000001-0000-0000-0000-000000000007',
 'a0000001-0000-0000-0000-000000000002',
 'KTM Macina Style 720 – Premium Trekking E-Bike',
 'KTM''s flagship trekking e-bike for UAE. Bosch Performance CX motor, 720Wh battery. Tested Abu Dhabi Corniche to Yas Island. Real range 70km in UAE heat. Hydraulic disc brakes, dropper seatpost.',
 'ebike', 'new', 'KTM', 'Macina Style 720', 2024, 'Midnight Black',
 8200.00, 8700.00, 'active', FALSE, FALSE, FALSE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
 'Abu Dhabi', 'Yas Island', ARRAY['ktm','trekking','bosch','premium','ebike']),

-- 8. Segway Ninebot ES4 (Used, Certified)
('b0000001-0000-0000-0000-000000000008',
 'a0000001-0000-0000-0000-000000000003',
 '[Certified Used] Segway ES4 – Battery 91%, Dubai Marina Area',
 'My personal Segway ES4 used for 8 months. Battery health certified at 91% by our partner mechanic Al Quoz Scooter Workshop. Includes 3-month platform warranty. Minor cosmetic scratches, everything works perfectly.',
 'scooter', 'used', 'Segway', 'Ninebot ES4', 2023, 'Black',
 749.00, 1299.00, 'active', FALSE, TRUE, TRUE, FALSE,
 ARRAY['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'],
 'Dubai', 'Dubai Marina', ARRAY['segway','used','certified','budget','good-condition']),

-- 9. Xiaomi Mi Pro 2 (Used, Certified)
('b0000001-0000-0000-0000-000000000009',
 'a0000001-0000-0000-0000-000000000003',
 '[Certified Used] Xiaomi Mi Pro 2 – 88% Battery, Sharjah',
 'Well-maintained Xiaomi Mi Pro 2, used 14 months. Battery tested at 88%. Brakes and tires in good condition. Comes with original charger and bag. Certified inspection report available.',
 'scooter', 'used', 'Xiaomi', 'Mi Electric Scooter Pro 2', 2022, 'Black',
 599.00, 1199.00, 'active', FALSE, TRUE, TRUE, FALSE,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
 'Sharjah', 'Al Nahda', ARRAY['xiaomi','used','certified','budget','sharjah']),

-- 10. Dualtron Eagle Pro (Used, Certified)
('b0000001-0000-0000-0000-000000000010',
 'a0000001-0000-0000-0000-000000000001',
 '[Certified Used] Dualtron Eagle Pro – 94% Battery, Minimal Use',
 'Barely-used Dualtron Eagle Pro (5 months, ~200km). Battery health 94%. Perfect for someone wanting a premium dual-motor scooter at half price. Certified by Dubai Scooter Workshop.',
 'scooter', 'used', 'Dualtron', 'Eagle Pro', 2023, 'Black',
 4200.00, 7800.00, 'active', TRUE, TRUE, FALSE, FALSE,
 ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'],
 'Dubai', 'Al Quoz', ARRAY['dualtron','used','certified','premium','dual-motor','barely-used']),

-- 11. Ninebot Max G30LP (New)
('b0000001-0000-0000-0000-000000000011',
 'a0000001-0000-0000-0000-000000000004',
 'Segway Ninebot Max G30LP – Lightweight 85% Range G30',
 'The G30LP is perfect for lighter riders (up to 100kg). Claimed 40km range, real-world 30km in Dubai heat. More compact and lighter than G2. Great for apartment storage.',
 'scooter', 'new', 'Segway', 'Ninebot Max G30LP', 2024, 'Black',
 1799.00, 1999.00, 'active', FALSE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'],
 'Dubai', 'JBR', ARRAY['segway','lightweight','compact','apartment-friendly','budget']),

-- 12. Freego Eagle Pro E-Bike (New)
('b0000001-0000-0000-0000-000000000012',
 'a0000001-0000-0000-0000-000000000002',
 'Freego Eagle Pro Foldable E-Bike – Delivery Hero Special',
 'Purpose-built for UAE delivery riders. 60km range, massive cargo capacity, IP65 rated against UAE dust and rain. Foldable for easy van/car transport. Tested 8+ hour delivery shifts in Dubai summer.',
 'ebike', 'new', 'Freego', 'Eagle Pro', 2024, 'Black',
 2800.00, 3100.00, 'active', FALSE, FALSE, TRUE, TRUE,
 ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
 'Dubai', 'Al Qusais', ARRAY['freego','delivery','foldable','ip65','cargo','ebike'])

ON CONFLICT (id) DO NOTHING;

-- ---- LISTING SPECS ----
INSERT INTO public.listing_specs (listing_id, range_km, range_km_uae_heat, top_speed_kmh, battery_kwh, battery_voltage, charging_time_hours, weight_kg, max_rider_weight_kg, motor_watts, hill_climb_degrees, ip_rating, heat_performance_note, connectivity, lights, suspension, warranty_months, rta_permit_included) VALUES

('b0000001-0000-0000-0000-000000000001', 70, 48, 25, 0.551, 36, 6, 23.5, 150, 700, 25, 'IP56', 'Tested 48km real-world at 40°C Dubai July. Battery management handles heat excellently.', ARRAY['Bluetooth','App'], TRUE, 'front', 12, TRUE),

('b0000001-0000-0000-0000-000000000002', 50, 35, 25, 0.365, 48, 5, 20.3, 120, 450, 20, 'IP55', 'Tested 35km in Dubai summer. GPS tracking helps monitor battery in heat.', ARRAY['Bluetooth','GPS','App'], TRUE, NULL, 12, TRUE),

('b0000001-0000-0000-0000-000000000003', 55, 38, 25, 0.446, 36, 5.5, 17.2, 120, 500, 18, 'IPX5', 'Tested 38km at 40°C. Performs reliably in Dubai conditions.', ARRAY['Bluetooth','App'], TRUE, NULL, 12, TRUE),

('b0000001-0000-0000-0000-000000000004', 160, 110, 95, 5.040, 72, 18, 50.0, 120, 6640, 35, 'IP54', 'Dual motor maintains performance in UAE heat. Battery management rated for 50°C operation.', ARRAY['Bluetooth','App'], TRUE, 'both', 24, FALSE),

('b0000001-0000-0000-0000-000000000005', 120, 85, 80, 2.520, 60, 14, 38.0, 130, 2000, 30, 'IP54', 'Tested Abu Dhabi desert. Handles sand track entry and heat well.', ARRAY['Bluetooth','App'], TRUE, 'both', 24, FALSE),

('b0000001-0000-0000-0000-000000000006', 80, 60, 45, 0.647, 48, 8, 26.0, 130, 300, 15, 'IP55', 'Moped-style battery management optimized for stop-and-go Dubai traffic in heat.', ARRAY['Bluetooth','GPS','App'], TRUE, 'front', 12, TRUE),

('b0000001-0000-0000-0000-000000000007', 120, 70, 32, 0.720, 36, 4.5, 22.5, 130, 625, 25, 'IPX4', 'Bosch Performance CX motor runs cool. Tested Abu Dhabi to Yas Island, 70km real-world.', ARRAY['Bluetooth','App'], TRUE, 'front', 24, FALSE),

('b0000001-0000-0000-0000-000000000008', 28, 20, 25, 0.187, 36, 3.5, 12.5, 100, 300, 12, 'IP54', 'Used unit, tested post-purchase. Performs well in Dubai conditions despite age.', NULL, TRUE, NULL, 3, TRUE),

('b0000001-0000-0000-0000-000000000009', 35, 25, 25, 0.280, 36, 5, 14.2, 100, 300, 15, 'IP54', 'Battery at 88%. Tested Sharjah-Dubai route, 25km real-world.', NULL, TRUE, NULL, 3, TRUE),

('b0000001-0000-0000-0000-000000000010', 90, 65, 55, 2.016, 60, 10, 32.0, 120, 2400, 28, 'IP54', 'Barely used, battery at 94%. Performance close to new.', ARRAY['Bluetooth','App'], TRUE, 'both', 6, FALSE),

('b0000001-0000-0000-0000-000000000011', 40, 30, 25, 0.367, 36, 6, 16.5, 100, 350, 15, 'IP55', 'Lightweight model. 30km real-world at 40°C. Great for shorter commutes.', ARRAY['Bluetooth','App'], TRUE, NULL, 12, TRUE),

('b0000001-0000-0000-0000-000000000012', 60, 45, 35, 0.480, 48, 6, 24.5, 150, 500, 20, 'IP65', 'IP65 protects against Dubai dust storms and occasional rain. Delivery-tested 8 hours continuous.', ARRAY['Bluetooth','App'], TRUE, 'front', 12, TRUE)

ON CONFLICT DO NOTHING;

-- ---- CERTIFIED INSPECTIONS (for used listings) ----
INSERT INTO public.certified_inspections (listing_id, mechanic_name, mechanic_shop, is_platform_partner, inspection_date, battery_health_percent, motor_condition, brakes_condition, tires_condition, electronics_ok, frame_damage, overall_score, warranty_included, warranty_months, platform_warranty) VALUES

('b0000001-0000-0000-0000-000000000008', 'Mohammed Al Zaabi', 'Al Quoz Scooter Workshop', TRUE, '2024-01-15', 91, 'excellent', 'good', 'good', TRUE, FALSE, 8, TRUE, 3, TRUE),

('b0000001-0000-0000-0000-000000000009', 'Raj Kumar', 'Sharjah EV Repair', FALSE, '2024-01-10', 88, 'good', 'good', 'fair', TRUE, FALSE, 7, TRUE, 3, FALSE),

('b0000001-0000-0000-0000-000000000010', 'Mohammed Al Zaabi', 'Al Quoz Scooter Workshop', TRUE, '2024-01-20', 94, 'excellent', 'excellent', 'excellent', TRUE, FALSE, 9, TRUE, 6, TRUE)

ON CONFLICT DO NOTHING;

-- ---- BUNDLES ----
INSERT INTO public.bundles (name, description, listing_id, accessories, rta_guidance, total_savings, is_active) VALUES

('Commuter Starter Pack', 'Everything you need for safe Dubai commuting', 'b0000001-0000-0000-0000-000000000001',
 '[{"name":"Predator Helmet (ECE certified)","price":149,"required":true},{"name":"D-Lock Security Lock","price":89,"required":true},{"name":"Home Wall Charger","price":120,"required":false},{"name":"Waterproof Phone Mount","price":49,"required":false}]'::jsonb,
 TRUE, 85, TRUE),

('Delivery Rider Pro Bundle', 'Optimized for full-day UAE delivery operations', 'b0000001-0000-0000-0000-000000000006',
 '[{"name":"Full Face Helmet (DOT+ECE)","price":199,"required":true},{"name":"Cargo Bag Set","price":149,"required":false},{"name":"Extra Charger","price":199,"required":false},{"name":"Reflective Safety Vest","price":39,"required":false},{"name":"Chain Lock Heavy Duty","price":79,"required":true}]'::jsonb,
 TRUE, 130, TRUE),

('Premium Dualtron Safety Kit', 'For high-speed premium scooter riders', 'b0000001-0000-0000-0000-000000000004',
 '[{"name":"Full Face Carbon Helmet","price":599,"required":true},{"name":"Motorcycle Gloves","price":149,"required":false},{"name":"Body Armour Jacket","price":399,"required":false},{"name":"Kryptonite Heavy Lock","price":249,"required":true},{"name":"Tail Bag Pannier","price":199,"required":false}]'::jsonb,
 TRUE, 200, TRUE)

ON CONFLICT DO NOTHING;

-- ---- SAMPLE REVIEWS ----
-- Note: orders must exist first in production. These are illustrative.
-- INSERT actual reviews via order flow.

-- ---- PLATFORM CONFIG UPDATE ----
UPDATE public.platform_config SET value = '10' WHERE key = 'commission_percent';
