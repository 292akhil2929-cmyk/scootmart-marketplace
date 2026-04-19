-- Affiliate click tracking table
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/vowprwdtexsnjmgpwnvs/sql

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  uuid REFERENCES listings(id) ON DELETE SET NULL,
  platform    text,
  destination_url text,
  referer     text,
  user_agent  text,
  country     text DEFAULT 'AE',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast reporting
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_at ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_platform   ON affiliate_clicks(platform);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_listing_id ON affiliate_clicks(listing_id);

-- RLS: service role can do everything, anonymous can insert only
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_all"   ON affiliate_clicks;
DROP POLICY IF EXISTS "anon_insert"   ON affiliate_clicks;
CREATE POLICY "service_all" ON affiliate_clicks FOR ALL  TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert" ON affiliate_clicks FOR INSERT TO anon WITH CHECK (true);
