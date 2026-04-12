// Product data layer — tries Supabase first, falls back to hardcoded catalog
// This means the site works even before the DB is populated

import { SCOOTERS } from '@/data/scooters'
import type { Scooter } from '@/data/scooters'

export interface Product {
  id: string
  brand: string
  model: string
  slug: string
  priceAed: number
  oldPriceAed?: number
  description?: string
  category: 'commuter' | 'performance' | 'offroad'
  badge?: 'new' | 'hot' | 'sale' | 'beast' | null
  inStock: boolean
  stockCount?: number
  rangeKm?: number
  speedKmh?: number
  motorWatts?: number
  weightKg?: number
  batteryWh?: number
  chargeHours?: number
  ipRating?: string
  hasSuspension: boolean
  hasApp: boolean
  hasHydraulicBrakes: boolean
  isFoldable: boolean
  hasSeat: boolean
  maxLoadKg?: number
  warrantyYears?: number
  tyreSize?: string
  rating?: number
  reviewCount?: number
  stripePriceId?: string
}

// Convert hardcoded Scooter → Product shape
function scooterToProduct(s: Scooter): Product {
  return {
    id: String(s.id),
    brand: s.brand,
    model: s.model,
    slug: `${s.brand.toLowerCase()}-${s.model.toLowerCase().replace(/\s+/g, '-')}`,
    priceAed: s.price,
    oldPriceAed: s.oldPrice,
    description: `The ${s.brand} ${s.model} is engineered for UAE conditions — ${s.range} range, ${s.speed} top speed, and ${s.ip} weather protection.`,
    category: s.category as 'commuter' | 'performance' | 'offroad',
    badge: s.badge as Product['badge'],
    inStock: true,
    rangeKm: parseInt(s.range) || undefined,
    speedKmh: parseInt(s.speed) || undefined,
    motorWatts: parseInt(s.motor) || undefined,
    weightKg: parseFloat(s.weight) || undefined,
    batteryWh: parseInt(s.battery) || undefined,
    chargeHours: parseFloat(s.charge) || undefined,
    ipRating: s.ip,
    hasSuspension: s.suspension,
    hasApp: s.app,
    hasHydraulicBrakes: s.hydraulic,
    isFoldable: s.foldable,
    hasSeat: s.seat,
    maxLoadKg: parseInt(s.load) || undefined,
    warrantyYears: s.warranty ? parseInt(s.warranty) : undefined,
    tyreSize: s.tyres,
    rating: s.rating,
    reviewCount: s.reviews,
  }
}

// Fetch all products from Supabase, fallback to hardcoded
export async function getProducts(filters?: { category?: string; q?: string }): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key && !url.includes('placeholder')) {
    try {
      const params = new URLSearchParams({
        select: '*',
        order: 'created_at.desc',
        limit: '50',
      })
      if (filters?.category && filters.category !== 'all') {
        params.set('category', `eq.${filters.category}`)
      }
      const res = await fetch(`${url}/rest/v1/products?${params}`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
        next: { revalidate: 60 },
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map(mapDbRow)
        }
      }
    } catch (e) {
      console.warn('[Products] Supabase fetch failed, using fallback:', e)
    }
  }

  // Fallback
  let list = SCOOTERS.map(scooterToProduct)
  if (filters?.category && filters.category !== 'all') {
    list = list.filter((p) => p.category === filters.category)
  }
  if (filters?.q) {
    const q = filters.q.toLowerCase()
    list = list.filter((p) =>
      `${p.brand} ${p.model} ${p.category}`.toLowerCase().includes(q)
    )
  }
  return list
}

// Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key && !url.includes('placeholder')) {
    try {
      const res = await fetch(`${url}/rest/v1/products?slug=eq.${slug}&limit=1&select=*`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
        next: { revalidate: 60 },
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows.length > 0) return mapDbRow(rows[0])
      }
    } catch (e) {
      console.warn('[Products] Supabase fetch failed:', e)
    }
  }

  // Fallback: match slug against hardcoded
  const match = SCOOTERS.map(scooterToProduct).find((p) => p.slug === slug)
  return match ?? null
}

// Map Supabase DB row → Product
function mapDbRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    brand: String(row.brand ?? ''),
    model: String(row.model ?? ''),
    slug: String(row.slug ?? ''),
    priceAed: Number(row.price_aed ?? 0),
    oldPriceAed: row.old_price_aed ? Number(row.old_price_aed) : undefined,
    description: row.description ? String(row.description) : undefined,
    category: (row.category as 'commuter' | 'performance' | 'offroad') ?? 'commuter',
    badge: row.badge as Product['badge'],
    inStock: Boolean(row.in_stock ?? true),
    stockCount: row.stock_count ? Number(row.stock_count) : undefined,
    rangeKm: row.range_km ? Number(row.range_km) : undefined,
    speedKmh: row.speed_kmh ? Number(row.speed_kmh) : undefined,
    motorWatts: row.motor_watts ? Number(row.motor_watts) : undefined,
    weightKg: row.weight_kg ? Number(row.weight_kg) : undefined,
    batteryWh: row.battery_wh ? Number(row.battery_wh) : undefined,
    chargeHours: row.charge_hours ? Number(row.charge_hours) : undefined,
    ipRating: row.ip_rating ? String(row.ip_rating) : undefined,
    hasSuspension: Boolean(row.has_suspension),
    hasApp: Boolean(row.has_app),
    hasHydraulicBrakes: Boolean(row.has_hydraulic_brakes),
    isFoldable: Boolean(row.is_foldable ?? true),
    hasSeat: Boolean(row.has_seat),
    maxLoadKg: row.max_load_kg ? Number(row.max_load_kg) : undefined,
    warrantyYears: row.warranty_years ? Number(row.warranty_years) : undefined,
    tyreSize: row.tyre_size ? String(row.tyre_size) : undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    reviewCount: row.review_count ? Number(row.review_count) : undefined,
    stripePriceId: row.stripe_price_id ? String(row.stripe_price_id) : undefined,
  }
}
