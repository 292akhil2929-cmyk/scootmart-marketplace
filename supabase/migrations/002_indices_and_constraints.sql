-- ============================================================
-- Migration 002: Performance indices + data constraints
-- ============================================================

-- ---- Listings ----
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);

-- Price sanity check
ALTER TABLE public.listings
  ADD CONSTRAINT check_price_positive CHECK (price > 0 AND price < 9999999);

-- ---- Orders ----
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_shipped_at ON public.orders(shipped_at) WHERE shipped_at IS NOT NULL;

-- ---- Messages ----
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);

-- ---- Notifications ----
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ---- Wishlists ----
ALTER TABLE public.wishlists
  ADD CONSTRAINT wishlists_user_listing_unique UNIQUE (user_id, listing_id)
  ON CONFLICT DO NOTHING;

-- ---- Escrow ----
CREATE INDEX IF NOT EXISTS idx_escrow_order_id ON public.escrow_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON public.escrow_transactions(status);

-- ---- Profiles ----
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- Function: auto-increment seller total_sales on completion
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_seller_sales(seller_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET total_sales = total_sales + 1
  WHERE id = seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Function: update listing view_count safely
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_view_count(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.listings
  SET view_count = view_count + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
