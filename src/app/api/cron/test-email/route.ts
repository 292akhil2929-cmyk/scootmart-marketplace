import { NextRequest, NextResponse } from 'next/server'
import { sendCronReport } from '@/lib/email'

export const dynamic = 'force-dynamic'

// One-shot test endpoint — sends a sample report email immediately
// Usage: GET /api/cron/test-email?secret=YOUR_CRON_SECRET
export async function GET(req: NextRequest) {
  const qsec   = req.nextUrl.searchParams.get('secret') ?? ''
  const secret = process.env.CRON_SECRET ?? ''

  if (secret && qsec !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const to = process.env.ADMIN_EMAIL ?? 'scootmartae@gmail.com'

  try {
    await sendCronReport({
      runAt: new Date().toISOString(),
      intervalHours: 6,
      totalListings: 50,
      activeListings: 50,
      affiliateListings: 50,
      updatedThisRun: 17,
      totalClicksPeriod: 0,
      clicksByPlatform: [],
      topListings: [],
      totalViews: 0,
      topViewedListings: [
        { title: 'Segway Ninebot Max G2', views: 12 },
        { title: 'Xiaomi Electric Scooter 4 Pro', views: 9 },
      ],
    })
    return NextResponse.json({ ok: true, message: `Test report sent to ${to}` })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
