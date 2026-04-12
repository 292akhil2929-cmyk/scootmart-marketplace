// Inquiry submission: save to Supabase + email vendor + confirmation to customer
import { NextResponse } from 'next/server'
import { sendInquiryToVendor, sendInquiryConfirmationToCustomer } from '@/lib/email/index'

export const runtime = 'nodejs'

// Input validation
function validateInquiry(body: unknown): body is {
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message?: string
} {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.productId === 'string' &&
    typeof b.productName === 'string' &&
    typeof b.customerName === 'string' &&
    typeof b.customerEmail === 'string' &&
    typeof b.customerPhone === 'string'
  )
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!validateInquiry(body)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { productId, productName, customerName, customerEmail, customerPhone, message } = body

    // 1. Save to Supabase (fire-and-forget — don't block if DB unavailable)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            product_id: productId,
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            message: message ?? '',
            contacted: false,
          }),
        })
      } catch (dbErr) {
        console.error('[Inquiries] Supabase insert failed (non-fatal):', dbErr)
      }
    }

    // 2. Email vendor notification (non-blocking)
    const vendorEmail = process.env.VENDOR_NOTIFICATION_EMAIL ?? process.env.EMAIL_FROM ?? 'hello@scootmart.ae'
    await Promise.allSettled([
      sendInquiryToVendor(vendorEmail, {
        productName,
        customerName,
        customerEmail,
        customerPhone,
        message: message ?? '(no message)',
      }),
      sendInquiryConfirmationToCustomer(customerEmail, { productName, customerName }),
    ])

    return NextResponse.json({ success: true, message: 'Inquiry received. The vendor will contact you within 24 hours.' })
  } catch (err) {
    console.error('[Inquiries API]', err)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
