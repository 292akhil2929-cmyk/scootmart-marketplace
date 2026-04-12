-- ════════════════════════════════════════════════════════
-- SCOOTMART.AE — SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ════════════════════════════════════════════════════════

-- Vendors
CREATE TABLE IF NOT EXISTS vendors (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  phone        TEXT,
  location     TEXT,
  rating       DECIMAL DEFAULT 0,
  verified     BOOLEAN DEFAULT false,
  featured     BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Products (scooter listings)
CREATE TABLE IF NOT EXISTS products (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand                 TEXT NOT NULL,
  model                 TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  price_aed             INTEGER NOT NULL,
  old_price_aed         INTEGER,
  description           TEXT,
  category              TEXT CHECK (category IN ('commuter','performance','offroad')),
  badge                 TEXT CHECK (badge IN ('new','hot','sale','beast')),
  in_stock              BOOLEAN DEFAULT true,
  stock_count           INTEGER DEFAULT 0,
  range_km              INTEGER,
  speed_kmh             INTEGER,
  motor_watts           INTEGER,
  weight_kg             DECIMAL,
  battery_wh            INTEGER,
  charge_hours          DECIMAL,
  ip_rating             TEXT,
  has_suspension        BOOLEAN DEFAULT false,
  has_app               BOOLEAN DEFAULT false,
  has_hydraulic_brakes  BOOLEAN DEFAULT false,
  is_foldable           BOOLEAN DEFAULT true,
  has_seat              BOOLEAN DEFAULT false,
  max_load_kg           INTEGER,
  warranty_years        INTEGER DEFAULT 1,
  tyre_size             TEXT,
  rating                DECIMAL DEFAULT 0,
  review_count          INTEGER DEFAULT 0,
  stripe_price_id       TEXT,
  vendor_id             UUID REFERENCES vendors(id),
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id      TEXT UNIQUE,
  stripe_payment_intent  TEXT,
  product_id             UUID REFERENCES products(id),
  vendor_id              UUID REFERENCES vendors(id),
  customer_email         TEXT NOT NULL,
  customer_name          TEXT NOT NULL,
  customer_phone         TEXT,
  shipping_address       JSONB,
  amount_aed             INTEGER NOT NULL,
  status                 TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  created_at             TIMESTAMPTZ DEFAULT now()
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id       UUID REFERENCES products(id),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  message          TEXT,
  contacted        BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Hero config (one row — the featured product on the homepage)
CREATE TABLE IF NOT EXISTS hero_config (
  id             INTEGER PRIMARY KEY DEFAULT 1,
  product_id     UUID REFERENCES products(id),
  vendor_id      UUID REFERENCES vendors(id),
  campaign_label TEXT DEFAULT 'FEATURED',
  active_until   TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_config ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read products"    ON products    FOR SELECT USING (true);
CREATE POLICY "Public read vendors"     ON vendors     FOR SELECT USING (true);
CREATE POLICY "Public read hero_config" ON hero_config FOR SELECT USING (true);

-- Inquiries: anyone can insert (no auth required for enquiry form)
CREATE POLICY "Anyone can insert inquiry" ON inquiries FOR INSERT WITH CHECK (true);

-- ── Sample data (6 featured models) ──────────────────────
INSERT INTO products (brand, model, slug, price_aed, old_price_aed, description, category, badge, in_stock, stock_count, range_km, speed_kmh, motor_watts, weight_kg, battery_wh, charge_hours, ip_rating, has_suspension, has_app, has_hydraulic_brakes, is_foldable, has_seat, max_load_kg, warranty_years, tyre_size, rating, review_count)
VALUES
  ('Xiaomi',   'Mi Pro 4',      'xiaomi-mi-pro-4',      1999, 2299, 'The Xiaomi Mi Pro 4 is the definitive urban commuter. Lightweight, foldable, and app-connected with a 55km range and robust IP54 weather resistance.', 'commuter',    'sale',  true, 24, 55,  25, 600,  16.8, 446,  5.5, 'IP54', false, true,  false, true,  false, 100, 1, '8.5" Pneumatic',  4.8, 342),
  ('Segway',   'Max G2',        'segway-max-g2',        2849, NULL, 'Purpose-built for UAE roads. Dual suspension handles Dubai speed bumps with ease. IP55 rated, 70km range, and a seat for longer rides.', 'commuter',    'hot',   true, 18, 70,  25, 700,  25.0, 551,  6.0, 'IP55', true,  true,  false, true,  true,  150, 2, '10" Tubeless',    4.9, 521),
  ('Kaabo',    'Wolf King GT',  'kaabo-wolf-king-gt',  12500, NULL, 'The apex predator of electric scooters. Dual 6720W motors, 120km range, hydraulic brakes, and 100km/h top speed. Not for the faint-hearted.', 'performance', 'beast', true,  8, 120, 100,6720,  55.0,2072, 13.0, 'IP56', true,  true,  true,  false, true,  150, 1, '11" Tubeless',    4.7,  89),
  ('Ninebot',  'Air T15E',      'ninebot-air-t15e',     2199, 2499, 'The lightest on the market at just 12.5kg. Perfect for apartment living, public transport, and short city hops.', 'commuter',    'sale',  true, 30, 35,  25, 300,  12.5, 187,  3.5, 'IPX4', false, true,  false, true,  false, 100, 1, '9" Pneumatic',    4.5, 204),
  ('Apollo',   'City Pro',      'apollo-city-pro',      4200, NULL, 'The sweet spot between speed and everyday usability. 45km/h, hydraulic brakes, front suspension, and a 56km real-world range.', 'performance', NULL,    true, 12, 56,  45,1000,  20.0, 614,  7.0, 'IP54', true,  true,  true,  true,  false, 120, 1, '10" Air-Filled',  4.6, 156),
  ('Dualtron', 'Thunder 2',     'dualtron-thunder-2',  16900, NULL, 'The flagship. Dual 8640W motors, 150km range, 95km/h top speed. UAE''s fastest production scooter. For experienced riders only.', 'offroad',     'new',   true,  5, 150, 95, 8640, 52.0,2268, 18.0, 'IPX5', true,  true,  true,  false, true,  150, 1, '11" Tubeless',    4.9,  67)
ON CONFLICT (slug) DO NOTHING;
