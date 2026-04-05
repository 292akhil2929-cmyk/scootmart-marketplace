import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const SYSTEM_PROMPT = `You are ScootMart AI Assistant — the UAE's #1 micromobility expert.
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

export async function searchListings(params: {
  budget_max?: number
  min_range_uae?: number
  max_rider_weight?: number
  type?: string
  certified_used?: boolean
  rta_compliant?: boolean
  location?: string
}) {
  const supabase = await createClient()
  let query = supabase
    .from('listings')
    .select(`*, specs:listing_specs(*)`)
    .eq('status', 'active')
    .limit(5)

  if (params.budget_max) query = query.lte('price', params.budget_max)
  if (params.type) query = query.eq('type', params.type)
  if (params.certified_used) query = query.eq('certified_used', true)
  if (params.rta_compliant) query = query.eq('rta_compliant', true)
  if (params.location) query = query.eq('location_emirate', params.location)

  const { data } = await query
  return data ?? []
}

export const chatTools = {
  search_listings: tool({
    description: 'Search ScootMart listings matching buyer criteria',
    parameters: z.object({
      budget_max: z.number().optional().describe('Max budget in AED'),
      min_range_uae_heat: z.number().optional().describe('Min real-world UAE heat range in km'),
      max_rider_weight: z.number().optional().describe('Rider weight in kg'),
      type: z.enum(['scooter', 'ebike']).optional(),
      certified_used: z.boolean().optional(),
      rta_compliant: z.boolean().optional(),
      location_emirate: z.string().optional(),
    }),
    execute: async (params) => searchListings(params),
  }),

  get_listing_detail: tool({
    description: 'Get full specs for a specific listing',
    parameters: z.object({ listing_id: z.string() }),
    execute: async ({ listing_id }) => {
      const supabase = await createClient()
      const { data } = await supabase
        .from('listings')
        .select(`*, specs:listing_specs(*), seller:profiles(*), inspection:certified_inspections(*)`)
        .eq('id', listing_id)
        .single()
      return data
    },
  }),

  compare_listings: tool({
    description: 'Compare 2-3 listings side by side',
    parameters: z.object({ listing_ids: z.array(z.string()).min(2).max(3) }),
    execute: async ({ listing_ids }) => {
      const supabase = await createClient()
      const { data } = await supabase
        .from('listings')
        .select(`*, specs:listing_specs(*)`)
        .in('id', listing_ids)
      return data
    },
  }),
}

export { openai }
