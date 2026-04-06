#!/usr/bin/env node
/**
 * ScootMart.ae — One-time database setup script
 * Usage:  node scripts/setup-db.js "postgresql://postgres:YOUR_PASSWORD@db.dxlvxfsupjfkstufrjtb.supabase.co:5432/postgres"
 */

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function main() {
  const dbUrl = process.argv[2]
  if (!dbUrl) {
    console.error('\n❌  Usage: node scripts/setup-db.js "postgresql://postgres:PASSWORD@db.dxlvxfsupjfkstufrjtb.supabase.co:5432/postgres"\n')
    console.error('Get your password from: Supabase Dashboard → Settings → Database → Connection string\n')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

  try {
    console.log('\n🔌  Connecting to database…')
    await client.connect()
    console.log('✅  Connected!\n')

    const schemaSQL = fs.readFileSync(path.join(__dirname, '../supabase/migrations/001_initial_schema.sql'), 'utf8')
    const seedSQL = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8')

    console.log('📦  Applying schema migration…')
    await client.query(schemaSQL)
    console.log('✅  Schema applied!\n')

    console.log('🌱  Seeding sample data…')
    await client.query(seedSQL)
    console.log('✅  Seed data applied!\n')

    console.log('🎉  Database setup complete! ScootMart.ae is ready.\n')
    console.log('Next steps:')
    console.log('  1. Sign up on your website as admin@scootmart.ae')
    console.log('  2. Visit https://scootmart-ae.vercel.app/api/admin/init?secret=scootmart-setup-2024&email=YOUR_EMAIL')
    console.log('     (replace YOUR_EMAIL with the email you just signed up with)\n')
  } catch (err) {
    console.error('\n❌  Error:', err.message, '\n')
    if (err.message.includes('already exists')) {
      console.log('ℹ️   Some tables already exist — this is OK if you already ran the setup.\n')
    }
  } finally {
    await client.end()
  }
}

main()
