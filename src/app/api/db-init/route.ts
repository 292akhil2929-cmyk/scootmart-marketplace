/**
 * One-time database initialization endpoint.
 * POST /api/db-init  { dbUrl: "postgresql://...", secret: "scootmart-setup-2024" }
 */
import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'

const SETUP_SECRET = 'scootmart-setup-2024'

export async function POST(request: Request) {
  try {
    const { dbUrl, secret } = await request.json()

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
    }
    if (!dbUrl) {
      return NextResponse.json({ error: 'dbUrl required' }, { status: 400 })
    }

    // Dynamically import pg to avoid issues at build time
    const { Client } = await import('pg')
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
    await client.connect()

    const schemaPath = path.join(process.cwd(), 'supabase/migrations/001_initial_schema.sql')
    const seedPath = path.join(process.cwd(), 'supabase/seed.sql')

    const schemaSQL = readFileSync(schemaPath, 'utf8')
    await client.query(schemaSQL)

    const seedSQL = readFileSync(seedPath, 'utf8')
    await client.query(seedSQL)

    await client.end()

    return NextResponse.json({ success: true, message: 'Database initialized with schema and seed data!' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    // If tables already exist, that's OK
    if (message.includes('already exists')) {
      return NextResponse.json({ success: true, message: 'Schema already exists — all good!' })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
