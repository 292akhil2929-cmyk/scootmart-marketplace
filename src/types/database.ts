export type UserRole = 'buyer' | 'seller' | 'admin'
export type ListingCondition = 'new' | 'used' | 'refurbished'
export type ListingType = 'scooter' | 'ebike' | 'accessory'
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'sold' | 'archived' | 'rejected'
export type OrderStatus = 'pending_payment' | 'payment_received' | 'in_escrow' | 'shipped' | 'delivered' | 'completed' | 'disputed' | 'refunded' | 'cancelled'
export type DeliveryOption = 'seller_arranged' | 'white_glove' | 'pickup'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed'
export type PromotionType = 'featured' | 'premium' | 'spotlight'
export type MotorCondition = 'excellent' | 'good' | 'fair' | 'poor'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  phone: string | null
  whatsapp: string | null
  location_emirate: string | null
  location_area: string | null
  bio: string | null
  rating: number
  rating_count: number
  total_sales: number
  verified_badge: boolean
  preferred_lang: 'en' | 'ar'
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  slug: string | null
  description: string | null
  type: ListingType
  condition: ListingCondition
  brand: string
  model: string
  year: number | null
  color: string | null
  price: number
  original_price: number | null
  currency: string
  status: ListingStatus
  featured: boolean
  certified_used: boolean
  rta_compliant: boolean
  uae_tested: boolean
  images: string[]
  videos: string[]
  inspection_report_url: string | null
  view_count: number
  wishlist_count: number
  location_emirate: string | null
  location_area: string | null
  tags: string[]
  created_at: string
  updated_at: string
  // joined
  seller?: Profile
  specs?: ListingSpecs
  inspection?: CertifiedInspection
  reviews?: Review[]
  is_wishlisted?: boolean
}

export interface ListingSpecs {
  id: string
  listing_id: string
  range_km: number | null
  range_km_uae_heat: number | null
  top_speed_kmh: number | null
  battery_kwh: number | null
  battery_voltage: number | null
  charging_time_hours: number | null
  battery_health_percent: number | null
  weight_kg: number | null
  max_rider_weight_kg: number | null
  motor_watts: number | null
  hill_climb_degrees: number | null
  ip_rating: string | null
  heat_performance_note: string | null
  sand_resistance_note: string | null
  deck_length_cm: number | null
  folded_length_cm: number | null
  wheel_size_inch: number | null
  brake_type: string | null
  connectivity: string[] | null
  lights: boolean
  carrier_rack: boolean
  suspension: string | null
  warranty_months: number | null
  rta_permit_included: boolean
  rta_category: string | null
}

export interface CertifiedInspection {
  id: string
  listing_id: string
  mechanic_name: string
  mechanic_shop: string | null
  mechanic_contact: string | null
  is_platform_partner: boolean
  inspection_date: string
  battery_health_percent: number
  battery_cells_ok: boolean
  motor_condition: MotorCondition | null
  brakes_condition: MotorCondition | null
  tires_condition: MotorCondition | null
  electronics_ok: boolean
  frame_damage: boolean
  frame_notes: string | null
  overall_score: number | null
  report_pdf_url: string | null
  inspection_video_url: string | null
  warranty_included: boolean
  warranty_months: number
  platform_warranty: boolean
  notes: string | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  bundle_id: string | null
  status: OrderStatus
  listing_price: number
  bundle_price: number
  delivery_fee: number
  total_amount: number
  currency: string
  commission_percent: number
  commission_amount: number
  seller_payout: number
  delivery_option: DeliveryOption
  delivery_address: DeliveryAddress | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  completed_at: string | null
  stripe_payment_intent_id: string | null
  payment_method: string | null
  paid_at: string | null
  dispute_reason: string | null
  disputed_at: string | null
  resolution: string | null
  buyer_notes: string | null
  seller_notes: string | null
  created_at: string
  updated_at: string
  // joined
  listing?: Listing
  buyer?: Profile
  seller?: Profile
}

export interface DeliveryAddress {
  name: string
  address: string
  emirate: string
  phone: string
}

export interface Review {
  id: string
  order_id: string
  listing_id: string
  reviewer_id: string
  seller_id: string
  rating: number
  title: string | null
  comment: string | null
  uae_tested_tags: string[]
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  reviewer?: Profile
}

export interface Bundle {
  id: string
  name: string
  description: string | null
  listing_id: string | null
  accessories: BundleAccessory[]
  rta_guidance: boolean
  total_savings: number
  is_active: boolean
  created_at: string
}

export interface BundleAccessory {
  name: string
  price: number
  image_url?: string
  required: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface SearchFilters {
  query?: string
  type?: ListingType
  condition?: ListingCondition
  brand?: string
  min_price?: number
  max_price?: number
  min_range?: number
  max_rider_weight?: number
  certified_used?: boolean
  rta_compliant?: boolean
  uae_tested?: boolean
  location_emirate?: string
  featured?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'range'
  page?: number
  limit?: number
}
