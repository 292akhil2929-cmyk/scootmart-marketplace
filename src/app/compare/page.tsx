import { createClient } from '@/lib/supabase/server'
import CompareClient from './CompareClient'
import type { Listing } from '@/types/database'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Compare E-Scooters & E-Bikes – ScootMart UAE',
  description: 'Side-by-side spec comparison of electric scooters available in UAE. Real prices, store links, and safety gear recommendations.',
}

async function getListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, specs:listing_specs(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data as Listing[]) ?? []
}

export default async function ComparePage() {
  const listings = await getListings()
  return <CompareClient listings={listings} />
}
