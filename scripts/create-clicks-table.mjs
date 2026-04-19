/**
 * Creates the affiliate_clicks tracking table.
 * Run with your Supabase DB direct connection password:
 *
 *   DB_PASS=your_password node scripts/create-clicks-table.mjs
 *
 * Or paste the SQL from supabase/migrations/005_affiliate_clicks.sql
 * directly in: https://supabase.com/dashboard/project/vowprwdtexsnjmgpwnvs/sql
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vowprwdtexsnjmgpwnvs.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvd3Byd2R0ZXhzbmptZ3B3bnZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ0MTk0MSwiZXhwIjoyMDkyMDE3OTQxfQ.7jRGUWvBud8zR94bAdSMUh9QCWtiU4iXG-jJ5Y3no8o'

const supabase = createClient(SUPABASE_URL, KEY)

// Verify we can connect
const { data, error } = await supabase.from('listings').select('id').limit(1)
if (error) { console.error('Cannot connect:', error); process.exit(1) }
console.log('✓ Connected to Supabase')
console.log('')
console.log('ACTION REQUIRED: Paste this SQL in the Supabase SQL editor:')
console.log('https://supabase.com/dashboard/project/vowprwdtexsnjmgpwnvs/sql/new')
console.log('')
console.log(`-- ScootMart affiliate click tracking
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
CREATE INDEX IF NOT EXISTS idx_ac_cat  ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ac_plat ON affiliate_clicks(platform);
CREATE INDEX IF NOT EXISTS idx_ac_lid  ON affiliate_clicks(listing_id);
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON affiliate_clicks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert" ON affiliate_clicks FOR INSERT TO anon WITH CHECK (true);`)
