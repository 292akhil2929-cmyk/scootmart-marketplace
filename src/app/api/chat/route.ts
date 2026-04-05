import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are ScootMart AI Assistant — the UAE's #1 micromobility expert.
You help buyers find the perfect electric scooter or e-bike for UAE conditions.

Key UAE factors you ALWAYS consider:
- Real-world battery range drops 25-35% in 40°C+ Dubai/Abu Dhabi heat
- IP rating matters (sand, rare rain): prefer IP55+ for daily use
- Rider weight affects range significantly — always ask
- Hill climbing matters in Marina, JBR, Yas Island areas
- RTA permit required for public roads in Dubai (max 25 km/h, no highways)
- Storage constraints: apartment living = foldable preferred
- Delivery riders need 60km+ real range, cargo racks, IP65

When recommending:
1. Always cite real UAE heat range (not just claimed range)
2. Explain WHY each recommendation fits their specific use case
3. Mention certified used options if budget is tight
4. Suggest relevant bundles (helmet, lock, charger)
5. Flag if RTA permit is needed

Be conversational, helpful, specific. Never recommend cheap unsafe products.`

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function supabaseQuery(table: string, params: Record<string, string>) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  })
  return res.json()
}

const chatTools = {
  search_listings: tool({
    description: 'Search ScootMart listings matching buyer criteria',
    parameters: z.object({
      budget_max: z.number().optional().describe('Max budget in AED'),
      type: z.enum(['scooter', 'ebike']).optional(),
      certified_used: z.boolean().optional(),
      rta_compliant: z.boolean().optional(),
      location_emirate: z.string().optional(),
    }),
    execute: async (params) => {
      const qp: Record<string, string> = {
        select: 'id,title,brand,price,condition,location_emirate,images,slug,uae_tested,certified_used,rta_compliant',
        status: 'eq.active',
        limit: '5',
        order: 'view_count.desc',
      }
      if (params.budget_max) qp['price'] = `lte.${params.budget_max}`
      if (params.type) qp['type'] = `eq.${params.type}`
      if (params.certified_used) qp['certified_used'] = `eq.true`
      if (params.rta_compliant) qp['rta_compliant'] = `eq.true`
      if (params.location_emirate) qp['location_emirate'] = `eq.${params.location_emirate}`
      return supabaseQuery('listings', qp)
    },
  }),

  get_listing_detail: tool({
    description: 'Get full specs for a specific listing by its ID',
    parameters: z.object({ listing_id: z.string() }),
    execute: async ({ listing_id }) => {
      const url = new URL(`${SUPABASE_URL}/rest/v1/listings`)
      url.searchParams.set('id', `eq.${listing_id}`)
      url.searchParams.set('select', '*,specs:listing_specs(*)')
      url.searchParams.set('limit', '1')
      const res = await fetch(url.toString(), {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Accept: 'application/json' },
      })
      const data = await res.json()
      return data[0] ?? null
    },
  }),
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: SYSTEM_PROMPT,
    messages,
    tools: chatTools,
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}
