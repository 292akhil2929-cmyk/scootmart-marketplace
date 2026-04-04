-- ============================================================
-- ScootMart.ae – Full Database Schema with RLS Policies
-- Run: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE listing_condition AS ENUM ('new', 'used', 'refurbished');
CREATE TYPE listing_type AS ENUM ('scooter', 'ebike', 'accessory');
CREATE TYPE listing_status AS ENUM ('draft', 'pending_review', 'active', 'sold', 'archived', 'rejected');
CREATE TYPE order_status AS ENUM (
  'pending_payment', 'payment_received', 'in_escrow',
  'shipped', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
);
CREATE TYPE delivery_option AS ENUM ('seller_arranged', 'white_glove', 'pickup');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE escrow_status AS ENUM ('held', 'released', 'refunded', 'disputed');
CREATE TYPE promotion_type AS ENUM ('featured', 'premium', 'spotlight');

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            user_role DEFAULT 'buyer' NOT NULL,
  full_name       TEXT,
  display_name    TEXT,
  avatar_url      TEXT,
  phone           TEXT,
  whatsapp        TEXT,
  location_emirate TEXT CHECK (location_emirate IN ('Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain')),
  location_area   TEXT,
  bio             TEXT,
  rating          NUMERIC(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  rating_count    INTEGER DEFAULT 0,
  total_sales     INTEGER DEFAULT 0,
  verified_badge  BOOLEAN DEFAULT FALSE,
  preferred_lang  TEXT DEFAULT 'en' CHECK (preferred_lang IN ('en','ar')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SELLER VERIFICATIONS
-- ============================================================
CREATE TABLE public.seller_verifications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN ('individual', 'shop', 'importer')),
  emirates_id_url   TEXT,
  trade_license_url TEXT,
  business_name     TEXT,
  business_address  TEXT,
  trn_number        TEXT, -- UAE Tax Registration Number
  status            verification_status DEFAULT 'pending',
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  rejection_reason  TEXT,
  submitted_at      TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE TABLE public.listings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  slug                TEXT UNIQUE,
  description         TEXT,
  type                listing_type NOT NULL DEFAULT 'scooter',
  condition           listing_condition NOT NULL DEFAULT 'new',
  brand               TEXT NOT NULL,
  model               TEXT NOT NULL,
  year                INTEGER,
  color               TEXT,
  price               NUMERIC(10,2) NOT NULL CHECK (price > 0),
  original_price      NUMERIC(10,2),
  currency            TEXT DEFAULT 'AED',
  status              listing_status DEFAULT 'pending_review',
  featured            BOOLEAN DEFAULT FALSE,
  certified_used      BOOLEAN DEFAULT FALSE,
  rta_compliant       BOOLEAN DEFAULT FALSE,
  uae_tested          BOOLEAN DEFAULT FALSE,
  images              TEXT[] DEFAULT '{}',
  videos              TEXT[] DEFAULT '{}',
  inspection_report_url TEXT,
  view_count          INTEGER DEFAULT 0,
  wishlist_count      INTEGER DEFAULT 0,
  location_emirate    TEXT,
  location_area       TEXT,
  tags                TEXT[] DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX listings_fts_idx ON public.listings USING gin(
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(model,'') || ' ' || coalesce(description,''))
);
CREATE INDEX listings_status_idx ON public.listings(status);
CREATE INDEX listings_seller_idx ON public.listings(seller_id);
CREATE INDEX listings_price_idx ON public.listings(price);

-- ============================================================
-- LISTING SPECS (UAE-specific performance data)
-- ============================================================
CREATE TABLE public.listing_specs (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id              UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE UNIQUE,
  -- Range & Speed
  range_km                INTEGER,
  range_km_uae_heat       INTEGER, -- Real-world range in 40°C+
  top_speed_kmh           INTEGER,
  -- Battery
  battery_kwh             NUMERIC(5,3),
  battery_voltage         INTEGER,
  charging_time_hours     NUMERIC(4,1),
  battery_health_percent  INTEGER, -- For used listings
  -- Physical
  weight_kg               NUMERIC(5,1),
  max_rider_weight_kg     INTEGER,
  -- Performance
  motor_watts             INTEGER,
  hill_climb_degrees      INTEGER,
  -- Durability
  ip_rating               TEXT, -- e.g. IP65, IP67
  heat_performance_note   TEXT, -- e.g. "Tested at 45°C in Dubai"
  sand_resistance_note    TEXT,
  -- Dimensions
  deck_length_cm          INTEGER,
  folded_length_cm        INTEGER,
  -- Wheels & Brakes
  wheel_size_inch         NUMERIC(4,1),
  brake_type              TEXT, -- disc, drum, regen
  -- Additional
  connectivity            TEXT[], -- e.g. ['Bluetooth','GPS','App']
  lights                  BOOLEAN DEFAULT FALSE,
  carrier_rack            BOOLEAN DEFAULT FALSE,
  suspension              TEXT,
  warranty_months         INTEGER,
  -- RTA
  rta_permit_included     BOOLEAN DEFAULT FALSE,
  rta_category            TEXT
);

-- ============================================================
-- CERTIFIED INSPECTIONS (for used listings)
-- ============================================================
CREATE TABLE public.certified_inspections (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id            UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  mechanic_name         TEXT NOT NULL,
  mechanic_shop         TEXT,
  mechanic_contact      TEXT,
  is_platform_partner   BOOLEAN DEFAULT FALSE,
  inspection_date       DATE NOT NULL,
  battery_health_percent INTEGER NOT NULL CHECK (battery_health_percent BETWEEN 0 AND 100),
  battery_cells_ok      BOOLEAN DEFAULT TRUE,
  motor_condition       TEXT CHECK (motor_condition IN ('excellent','good','fair','poor')),
  brakes_condition      TEXT CHECK (brakes_condition IN ('excellent','good','fair','poor')),
  tires_condition       TEXT CHECK (tires_condition IN ('excellent','good','fair','poor')),
  electronics_ok        BOOLEAN DEFAULT TRUE,
  frame_damage          BOOLEAN DEFAULT FALSE,
  frame_notes           TEXT,
  overall_score         INTEGER CHECK (overall_score BETWEEN 1 AND 10),
  report_pdf_url        TEXT,
  inspection_video_url  TEXT,
  warranty_included     BOOLEAN DEFAULT FALSE,
  warranty_months       INTEGER DEFAULT 0,
  platform_warranty     BOOLEAN DEFAULT FALSE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUNDLES
-- ============================================================
CREATE TABLE public.bundles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  listing_id    UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  accessories   JSONB DEFAULT '[]', -- [{name, price, image_url, required}]
  rta_guidance  BOOLEAN DEFAULT TRUE,
  total_savings NUMERIC(10,2) DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS & ESCROW
-- ============================================================
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id          UUID NOT NULL REFERENCES public.profiles(id),
  seller_id         UUID NOT NULL REFERENCES public.profiles(id),
  listing_id        UUID NOT NULL REFERENCES public.listings(id),
  bundle_id         UUID REFERENCES public.bundles(id),
  status            order_status DEFAULT 'pending_payment',
  -- Pricing
  listing_price     NUMERIC(10,2) NOT NULL,
  bundle_price      NUMERIC(10,2) DEFAULT 0,
  delivery_fee      NUMERIC(10,2) DEFAULT 0,
  total_amount      NUMERIC(10,2) NOT NULL,
  currency          TEXT DEFAULT 'AED',
  -- Commission
  commission_percent  NUMERIC(5,2) NOT NULL DEFAULT 10,
  commission_amount   NUMERIC(10,2) NOT NULL,
  seller_payout       NUMERIC(10,2) NOT NULL,
  -- Delivery
  delivery_option   delivery_option DEFAULT 'seller_arranged',
  delivery_address  JSONB, -- {name, address, emirate, phone}
  tracking_number   TEXT,
  shipped_at        TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  -- Payment
  stripe_payment_intent_id TEXT,
  payment_method    TEXT, -- stripe, tabby, tamara, bank_transfer
  paid_at           TIMESTAMPTZ,
  -- Dispute
  dispute_reason    TEXT,
  disputed_at       TIMESTAMPTZ,
  resolution        TEXT,
  -- Notes
  buyer_notes       TEXT,
  seller_notes      TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ESCROW TRANSACTIONS
-- ============================================================
CREATE TABLE public.escrow_transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status            escrow_status DEFAULT 'held',
  amount            NUMERIC(10,2) NOT NULL,
  currency          TEXT DEFAULT 'AED',
  stripe_transfer_id TEXT,
  held_at           TIMESTAMPTZ DEFAULT NOW(),
  released_at       TIMESTAMPTZ,
  refunded_at       TIMESTAMPTZ,
  release_trigger   TEXT, -- 'buyer_confirmed', 'auto_7days', 'admin_override'
  notes             TEXT
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id    UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_id   UUID NOT NULL REFERENCES public.profiles(id),
  seller_id     UUID NOT NULL REFERENCES public.profiles(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  comment       TEXT,
  -- UAE-specific tags
  uae_tested_tags TEXT[] DEFAULT '{}', -- ['accurate_range_dubai','good_heat_perf','quick_seller','as_described']
  verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE public.wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ============================================================
-- PROMOTIONS (Featured listings)
-- ============================================================
CREATE TABLE public.promotions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  seller_id     UUID NOT NULL REFERENCES public.profiles(id),
  type          promotion_type NOT NULL DEFAULT 'featured',
  stripe_payment_intent_id TEXT,
  amount_paid   NUMERIC(10,2) NOT NULL,
  starts_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at       TIMESTAMPTZ NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL, -- 'order_update','message','listing_approved','review',etc
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB DEFAULT '{}',
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAVED SEARCHES
-- ============================================================
CREATE TABLE public.saved_searches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT,
  filters     JSONB NOT NULL DEFAULT '{}',
  alert_email BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES (Buyer-Seller)
-- ============================================================
CREATE TABLE public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id     UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id   UUID NOT NULL REFERENCES public.profiles(id),
  content       TEXT NOT NULL,
  read          BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLATFORM CONFIG (Admin-editable)
-- ============================================================
CREATE TABLE public.platform_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.platform_config (key, value) VALUES
  ('commission_percent', '10'),
  ('min_commission_percent', '8'),
  ('max_commission_percent', '12'),
  ('escrow_hold_days', '7'),
  ('warranty_default_months', '3'),
  ('featured_listing_price_aed', '299'),
  ('premium_listing_price_aed', '599'),
  ('spotlight_listing_price_aed', '999');

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-generate listing slug
CREATE OR REPLACE FUNCTION public.generate_listing_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(
      NEW.brand || '-' || NEW.model || '-' || substring(NEW.id::text, 1, 8),
      '[^a-z0-9]+', '-', 'g'
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_slug_trigger BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.generate_listing_slug();

-- Update seller rating on review insert
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    rating = (
      SELECT ROUND(AVG(rating::NUMERIC), 2)
      FROM public.reviews
      WHERE seller_id = NEW.seller_id
    ),
    rating_count = (
      SELECT COUNT(*) FROM public.reviews WHERE seller_id = NEW.seller_id
    )
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER review_inserted AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_seller_rating();

-- Update wishlist count
CREATE OR REPLACE FUNCTION public.update_wishlist_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.listings SET wishlist_count = wishlist_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.listings SET wishlist_count = wishlist_count - 1 WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER wishlist_count_trigger
  AFTER INSERT OR DELETE ON public.wishlists
  FOR EACH ROW EXECUTE FUNCTION public.update_wishlist_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certified_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- PROFILES ----
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin());

-- ---- LISTINGS ----
CREATE POLICY "listings_public_read" ON public.listings FOR SELECT USING (status = 'active' OR auth.uid() = seller_id OR public.is_admin());
CREATE POLICY "listings_seller_insert" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_seller_update" ON public.listings FOR UPDATE USING (auth.uid() = seller_id OR public.is_admin());
CREATE POLICY "listings_admin_delete" ON public.listings FOR DELETE USING (auth.uid() = seller_id OR public.is_admin());

-- ---- LISTING SPECS ----
CREATE POLICY "specs_public_read" ON public.listing_specs FOR SELECT USING (TRUE);
CREATE POLICY "specs_seller_manage" ON public.listing_specs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid())
  OR public.is_admin()
);

-- ---- ORDERS ----
CREATE POLICY "orders_party_read" ON public.orders FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin()
);
CREATE POLICY "orders_buyer_insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "orders_party_update" ON public.orders FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id OR public.is_admin()
);

-- ---- ESCROW ----
CREATE POLICY "escrow_party_read" ON public.escrow_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid()))
  OR public.is_admin()
);
CREATE POLICY "escrow_admin_manage" ON public.escrow_transactions FOR ALL USING (public.is_admin());

-- ---- REVIEWS ----
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_buyer_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_admin_manage" ON public.reviews FOR ALL USING (public.is_admin());

-- ---- WISHLIST ----
CREATE POLICY "wishlist_self_only" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- ---- NOTIFICATIONS ----
CREATE POLICY "notifications_self_only" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ---- MESSAGES ----
CREATE POLICY "messages_party_read" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id OR public.is_admin()
);
CREATE POLICY "messages_authenticated_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ---- SELLER VERIFICATIONS ----
CREATE POLICY "verifications_seller_read" ON public.seller_verifications FOR SELECT USING (
  auth.uid() = seller_id OR public.is_admin()
);
CREATE POLICY "verifications_seller_insert" ON public.seller_verifications FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "verifications_admin_manage" ON public.seller_verifications FOR UPDATE USING (public.is_admin());

-- ---- CERTIFIED INSPECTIONS ----
CREATE POLICY "inspections_public_read" ON public.certified_inspections FOR SELECT USING (TRUE);
CREATE POLICY "inspections_seller_insert" ON public.certified_inspections FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.listings l WHERE l.id = listing_id AND l.seller_id = auth.uid())
  OR public.is_admin()
);

-- ---- PROMOTIONS ----
CREATE POLICY "promotions_seller_read" ON public.promotions FOR SELECT USING (
  auth.uid() = seller_id OR public.is_admin()
);
CREATE POLICY "promotions_seller_insert" ON public.promotions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "promotions_admin_manage" ON public.promotions FOR ALL USING (public.is_admin());

-- ---- BUNDLES ----
CREATE POLICY "bundles_public_read" ON public.bundles FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "bundles_admin_manage" ON public.bundles FOR ALL USING (public.is_admin());

-- ---- SAVED SEARCHES ----
CREATE POLICY "saved_searches_self_only" ON public.saved_searches FOR ALL USING (auth.uid() = user_id);

-- ---- PLATFORM CONFIG ----
CREATE POLICY "config_public_read" ON public.platform_config FOR SELECT USING (TRUE);
CREATE POLICY "config_admin_manage" ON public.platform_config FOR ALL USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('listing-images', 'listing-images', TRUE, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('listing-videos', 'listing-videos', TRUE, 104857600, ARRAY['video/mp4','video/webm']),
  ('inspection-reports', 'inspection-reports', FALSE, 20971520, ARRAY['application/pdf']),
  ('verification-docs', 'verification-docs', FALSE, 10485760, ARRAY['image/jpeg','image/png','application/pdf']),
  ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "listing_images_public" ON storage.objects FOR SELECT USING (bucket_id = 'listing-images');
CREATE POLICY "listing_images_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
CREATE POLICY "listing_images_owner_delete" ON storage.objects FOR DELETE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "inspection_reports_auth" ON storage.objects FOR SELECT USING (bucket_id = 'inspection-reports' AND auth.role() = 'authenticated');
CREATE POLICY "inspection_reports_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inspection-reports' AND auth.role() = 'authenticated');

CREATE POLICY "verification_docs_auth" ON storage.objects FOR SELECT USING (bucket_id = 'verification-docs' AND auth.role() = 'authenticated');
CREATE POLICY "verification_docs_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'verification-docs' AND auth.role() = 'authenticated');
