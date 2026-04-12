import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProducts } from '@/lib/products'
import { ProductDetail } from '@/components/shop/ProductDetail'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProductBySlug(slug)
  if (!p) return { title: 'Scooter Not Found | Scootmart' }
  return {
    title: `${p.brand} ${p.model} — AED ${p.priceAed.toLocaleString()} | Scootmart`,
    description: p.description ?? `Buy the ${p.brand} ${p.model} in the UAE. ${p.rangeKm}km range, ${p.motorWatts}W motor. Free delivery.`,
    openGraph: {
      title: `${p.brand} ${p.model}`,
      description: `AED ${p.priceAed.toLocaleString()} · ${p.rangeKm}km range · ${p.motorWatts}W motor`,
    },
  }
}

export default async function ScooterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
