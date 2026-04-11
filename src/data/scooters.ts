export interface Scooter {
  id: number
  brand: string
  model: string
  price: number
  oldPrice?: number
  range: string
  speed: string
  motor: string
  weight: string
  battery: string
  charge: string
  ip: string
  suspension: boolean
  app: boolean
  hydraulic: boolean
  foldable: boolean
  seat: boolean
  load: string
  warranty: string
  tyres: string
  badge: 'sale' | 'hot' | 'new' | 'beast' | null
  category: 'commuter' | 'performance' | 'offroad'
  rating: number
  reviews: number
  amazonAsin?: string
}

export const SCOOTERS: Scooter[] = [
  {
    id: 1, brand: 'Xiaomi', model: 'Mi Pro 4', price: 1999, oldPrice: 2299,
    range: '55km', speed: '25km/h', motor: '600W', weight: '16.8kg',
    battery: '446 Wh', charge: '5.5h', ip: 'IP54', suspension: false,
    app: true, hydraulic: false, foldable: true, seat: false, load: '100kg',
    warranty: '1yr', tyres: '8.5" Pneumatic', badge: 'sale',
    category: 'commuter', rating: 4.8, reviews: 342, amazonAsin: 'B0BJMY4FKS'
  },
  {
    id: 2, brand: 'Segway', model: 'Max G2', price: 2849,
    range: '70km', speed: '25km/h', motor: '700W', weight: '25kg',
    battery: '551 Wh', charge: '6h', ip: 'IP55', suspension: true,
    app: true, hydraulic: false, foldable: true, seat: true, load: '150kg',
    warranty: '2yr', tyres: '10" Tubeless', badge: 'hot',
    category: 'commuter', rating: 4.9, reviews: 521, amazonAsin: 'B09N69NYKW'
  },
  {
    id: 3, brand: 'Kaabo', model: 'Wolf King GT', price: 12500,
    range: '120km', speed: '100km/h', motor: '6720W', weight: '55kg',
    battery: '2072 Wh', charge: '13h', ip: 'IP56', suspension: true,
    app: true, hydraulic: true, foldable: false, seat: true, load: '150kg',
    warranty: '1yr', tyres: '11" Tubeless', badge: 'beast',
    category: 'performance', rating: 4.7, reviews: 89
  },
  {
    id: 4, brand: 'Ninebot', model: 'Air T15E', price: 2199, oldPrice: 2499,
    range: '35km', speed: '25km/h', motor: '300W', weight: '12.5kg',
    battery: '187 Wh', charge: '3.5h', ip: 'IPX4', suspension: false,
    app: true, hydraulic: false, foldable: true, seat: false, load: '100kg',
    warranty: '1yr', tyres: '9" Pneumatic', badge: 'sale',
    category: 'commuter', rating: 4.5, reviews: 204, amazonAsin: 'B09FXWN7HK'
  },
  {
    id: 5, brand: 'Apollo', model: 'City Pro', price: 4200,
    range: '56km', speed: '45km/h', motor: '1000W', weight: '20kg',
    battery: '614 Wh', charge: '7h', ip: 'IP54', suspension: true,
    app: true, hydraulic: true, foldable: true, seat: false, load: '120kg',
    warranty: '1yr', tyres: '10" Air-Filled', badge: null,
    category: 'performance', rating: 4.6, reviews: 156
  },
  {
    id: 6, brand: 'Dualtron', model: 'Thunder 2', price: 16900,
    range: '150km', speed: '95km/h', motor: '8640W', weight: '52kg',
    battery: '2268 Wh', charge: '18h', ip: 'IPX5', suspension: true,
    app: true, hydraulic: true, foldable: false, seat: true, load: '150kg',
    warranty: '1yr', tyres: '11" Tubeless', badge: 'new',
    category: 'offroad', rating: 4.9, reviews: 67
  },
]

export const AMAZON_TAG = 'scootmart-21'

export function getAmazonUrl(asin?: string, query?: string): string {
  if (asin) return `https://www.amazon.ae/dp/${asin}?tag=${AMAZON_TAG}`
  return `https://www.amazon.ae/s?k=${encodeURIComponent(query ?? 'electric scooter')}&tag=${AMAZON_TAG}`
}
