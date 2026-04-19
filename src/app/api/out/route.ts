import { NextRequest, NextResponse } from 'next/server'

const AMAZON_TAG = 'scootmartae-21'
const NOON_PARTNER = '518012'

function buildAffiliateUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl)
    if (u.hostname.includes('amazon.ae') || u.hostname.includes('amazon.com')) {
      u.searchParams.set('tag', AMAZON_TAG)
      return u.toString()
    }
    if (u.hostname.includes('noon.com')) {
      // noon affiliate redirect format
      return `https://www.noon.com/uae-en/redirect?partnerID=${NOON_PARTNER}&url=${encodeURIComponent(rawUrl)}`
    }
    return rawUrl
  } catch {
    return rawUrl
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  const destination = buildAffiliateUrl(decodeURIComponent(url))
  return NextResponse.redirect(destination, { status: 302 })
}
