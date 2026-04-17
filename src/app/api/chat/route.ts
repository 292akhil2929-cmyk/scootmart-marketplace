// ScootBot API — Gemini Flash + live Supabase tools. GEMINI_API_KEY is server-side only.
import { streamText, tool } from 'ai'
import { geminiFlash, SYSTEM_PROMPT } from '@/lib/gemini'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 30

const rateLimitMap = new Map<string, { count: number; reset: number }>()
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }
    const { messages } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const result = streamText({
      model: geminiFlash,
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 800,
      maxSteps: 3,
      tools: {
        search_listings: tool({
          description:
            'Search live ScootMart marketplace listings. Use when user asks what is available, wants results filtered by budget/type/location, or asks about used or certified options.',
          parameters: z.object({
            budget_max: z.number().optional().describe('Max budget in AED'),
            type: z.enum(['scooter', 'ebike', 'accessory']).optional(),
            certified_used: z.boolean().optional().describe('Only certified used listings'),
            rta_compliant: z.boolean().optional().describe('Only RTA-compliant listings'),
            location_emirate: z.string().optional().describe('e.g. Dubai, Abu Dhabi, Sharjah'),
          }),
          execute: async (params) => {
            try {
              const supabase = await createClient()
              let query = supabase
                .from('listings')
                .select(`
                  id, title, brand, model, price, original_price, condition,
                  certified_used, rta_compliant, uae_tested, location_emirate,
                  seller:profiles(display_name, rating, rating_count, verified_badge, total_sales),
                  specs:listing_specs(range_km, range_km_uae_heat, top_speed_kmh, motor_watts, ip_rating, weight_kg, max_rider_weight_kg)
                `)
                .eq('status', 'active')
                .order('featured', { ascending: false })
                .limit(5)

              if (params.budget_max) query = query.lte('price', params.budget_max)
              if (params.type) query = query.eq('type', params.type)
              if (params.certified_used) query = query.eq('certified_used', true)
              if (params.rta_compliant) query = query.eq('rta_compliant', true)
              if (params.location_emirate) query = query.ilike('location_emirate', params.location_emirate)

              const { data, error } = await query
              if (error || !data?.length) {
                return 'No live marketplace listings match those filters right now. I can still recommend from our featured catalog or Amazon.ae products on the page.'
              }
              return data
            } catch {
              return 'Live search unavailable right now. I can still help you from our featured catalog and Amazon.ae products.'
            }
          },
        }),

        get_listing_detail: tool({
          description:
            'Get full details for a specific marketplace listing — complete specs, seller reliability info (rating, verified badge, total sales), and certified inspection summary.',
          parameters: z.object({
            listing_id: z.string().describe('The listing UUID'),
          }),
          execute: async ({ listing_id }) => {
            try {
              const supabase = await createClient()
              const { data, error } = await supabase
                .from('listings')
                .select(`
                  *,
                  specs:listing_specs(*),
                  seller:profiles(display_name, rating, rating_count, verified_badge, total_sales, location_emirate, bio),
                  inspection:certified_inspections(
                    mechanic_name, mechanic_shop, is_platform_partner, inspection_date,
                    battery_health_percent, motor_condition, brakes_condition, tires_condition,
                    overall_score, warranty_included, warranty_months, platform_warranty, notes
                  )
                `)
                .eq('id', listing_id)
                .single()
              if (error || !data) return 'Listing not found.'
              return data
            } catch {
              return 'Could not fetch listing details right now.'
            }
          },
        }),
      },
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error('[Chat API]', err)
    return NextResponse.json(
      { error: 'ScootBot is having a moment. Try again shortly or email hello@scootmart.ae' },
      { status: 500 }
    )
  }
}
