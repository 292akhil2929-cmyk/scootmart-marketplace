import type { Metadata } from 'next'
import { getProducts } from '@/lib/products'
import { ScootersCatalog } from '@/components/shop/ScootersCatalog'

export const metadata: Metadata = {
  title: 'Electric Scooters UAE — Shop All Models | Scootmart',
  description: 'Browse verified electric scooters and e-bikes in the UAE. Filter by range, speed, budget. Free delivery. 2-year warranty.',
}

export const revalidate = 60

export default async function ScootersPage() {
  const products = await getProducts()
  return <ScootersCatalog initialProducts={products} />
}
