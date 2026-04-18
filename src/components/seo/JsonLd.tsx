// JSON-LD structured data components for Google rich results
// Docs: https://developers.google.com/search/docs/appearance/structured-data

interface ProductJsonLdProps {
  id: string
  title: string
  description?: string
  image?: string
  price: number
  condition: 'new' | 'used' | string
  brand?: string
  sku?: string
  url: string
  rating?: number
  reviewCount?: number
  availability?: 'in_stock' | 'out_of_stock'
}

export function ProductJsonLd({
  id, title, description, image, price, condition,
  brand, sku, url, rating, reviewCount, availability = 'in_stock',
}: ProductJsonLdProps) {
  const itemCondition =
    condition === 'new'
      ? 'https://schema.org/NewCondition'
      : condition === 'certified_used'
      ? 'https://schema.org/RefurbishedCondition'
      : 'https://schema.org/UsedCondition'

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description ?? title,
    url,
    sku: sku ?? id,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    image: image ? [image] : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'AED',
      price: price.toFixed(2),
      itemCondition,
      availability: `https://schema.org/${availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'ScootMart.ae',
      },
    },
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.toFixed(1),
            reviewCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  }

  // Remove undefined values
  Object.keys(schema).forEach(k => schema[k] === undefined && delete schema[k])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Organisation (site-wide) ──────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ScootMart.ae',
    url: 'https://scootmart-marketplace.vercel.app',
    logo: 'https://scootmart-marketplace.vercel.app/logo.png',
    description: "UAE's #1 marketplace for new and certified used electric scooters and e-bikes.",
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@scootmart.ae',
      contactType: 'customer support',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Website / Sitelinks searchbox ─────────────────────────────────────────────
export function WebsiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ScootMart.ae',
    url: 'https://scootmart-marketplace.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://scootmart-marketplace.vercel.app/browse?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
