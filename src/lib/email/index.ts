// Email sending — Resend (primary) with Gmail SMTP fallback
// Resend works once scootmart.ae domain is verified at resend.com/domains
// Gmail fallback works immediately — set GMAIL_APP_PASSWORD in Vercel env

import nodemailer from 'nodemailer'

const RESEND_API_KEY    = process.env.RESEND_API_KEY
const GMAIL_USER        = process.env.GMAIL_USER        ?? 'scootmartae@gmail.com'
const GMAIL_APP_PASS    = process.env.GMAIL_APP_PASSWORD               // 16-char Google App Password
const FROM_RESEND       = process.env.EMAIL_FROM        ?? 'ScootMart.ae <noreply@scootmart.ae>'
const FROM_GMAIL        = `ScootMart.ae <${GMAIL_USER}>`
const APP_URL           = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scootmart.ae'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

// ── Base template wrapper ─────────────────────────────────────────────────────
function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ScootMart.ae</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#000;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
              <a href="${APP_URL}" style="text-decoration:none;">
                <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">⚡ ScootMart.ae</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:32px;border-left:1px solid #e4e4e7;border-right:1px solid #e4e4e7;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border:1px solid #e4e4e7;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#71717a;font-size:12px;">UAE's #1 Electric Scooter Marketplace</p>
              <p style="margin:0;color:#a1a1aa;font-size:11px;">
                <a href="${APP_URL}/legal/privacy" style="color:#a1a1aa;">Privacy Policy</a> &nbsp;·&nbsp;
                <a href="${APP_URL}/legal/terms" style="color:#a1a1aa;">Terms</a> &nbsp;·&nbsp;
                <a href="mailto:hello@scootmart.ae" style="color:#a1a1aa;">hello@scootmart.ae</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function btn(label: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#000;color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:20px;">${label}</a>`
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />`
}

function badge(text: string, color = '#000') {
  return `<span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;letter-spacing:0.5px;">${text}</span>`
}

// ── Send helper ───────────────────────────────────────────────────────────────
async function sendViaGmail(payload: EmailPayload) {
  if (!GMAIL_APP_PASS) throw new Error('GMAIL_APP_PASSWORD not set')
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASS },
  })
  await transporter.sendMail({
    from: FROM_GMAIL,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
  console.log('[Email] Sent via Gmail SMTP to', payload.to)
}

async function sendViaResend(payload: EmailPayload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_RESEND, ...payload }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend API error: ${err}`)
  }
  console.log('[Email] Sent via Resend to', payload.to)
}

async function sendEmail(payload: EmailPayload) {
  // 1. Try Gmail SMTP first (works without domain verification)
  if (GMAIL_APP_PASS) {
    try {
      await sendViaGmail(payload)
      return
    } catch (err) {
      console.error('[Email] Gmail SMTP failed:', err)
    }
  }

  // 2. Fall back to Resend (requires scootmart.ae domain verified at resend.com/domains)
  if (RESEND_API_KEY) {
    try {
      await sendViaResend(payload)
      return
    } catch (err) {
      console.error('[Email] Resend failed:', err)
    }
  }

  console.warn('[Email] No working email provider — set GMAIL_APP_PASSWORD in Vercel env vars')
}

// ── Templates ─────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: `Welcome to ScootMart.ae, ${name}! 🛴`,
    html: baseTemplate(`
      <h1 style="margin:0 0 8px;font-size:24px;color:#09090b;">Welcome, ${name}! 🛴</h1>
      <p style="margin:0 0 20px;color:#71717a;font-size:15px;">You've joined the UAE's smartest marketplace for electric scooters and e-bikes.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#3f3f46;">🔒&nbsp; <strong>Escrow-protected</strong> payments on every order</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#3f3f46;">✅&nbsp; All sellers are <strong>verified</strong> (Emirates ID / trade license)</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#3f3f46;">🌡️&nbsp; Real <strong>UAE heat performance</strong> data on every model</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#3f3f46;">🤖&nbsp; <strong>AI scooter expert</strong> — ask anything, 24/7</td>
        </tr>
      </table>
      ${divider()}
      ${btn('Browse Scooters →', `${APP_URL}/browse`)}
    `),
  })
}

export async function sendOrderConfirmationBuyer(
  to: string,
  orderId: string,
  listingTitle: string,
  amount: number
) {
  await sendEmail({
    to,
    subject: `Order confirmed – ${listingTitle}`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('Order Confirmed')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">Your payment is secure 🔒</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">Your funds are held in escrow and will only be released once you confirm receipt of your item.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:120px;">Item</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">${listingTitle}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Amount paid</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">AED ${amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Order ID</td>
          <td style="padding:6px 16px;font-size:13px;color:#71717a;font-family:monospace;">${orderId}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Status</td>
          <td style="padding:6px 16px;">${badge('Awaiting Shipment', '#2563eb')}</td>
        </tr>
      </table>
      ${divider()}
      <p style="margin:0;color:#71717a;font-size:13px;">The seller has been notified and must ship within <strong>3 business days</strong>. You'll get another email with tracking details.</p>
      ${btn('Track Your Order →', `${APP_URL}/buyer/orders`)}
    `),
  })
}

export async function sendOrderNotificationSeller(
  to: string,
  orderId: string,
  listingTitle: string,
  payout: number
) {
  await sendEmail({
    to,
    subject: `New sale! Ship "${listingTitle}" now 📦`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('New Sale 🎉')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">You made a sale!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">Your payout is waiting in escrow. Ship the item within <strong>3 business days</strong> to trigger your release.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:140px;">Item sold</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">${listingTitle}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Your payout</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:700;color:#16a34a;">AED ${payout.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Order ID</td>
          <td style="padding:6px 16px;font-size:13px;color:#71717a;font-family:monospace;">${orderId}</td>
        </tr>
      </table>
      ${divider()}
      <p style="margin:0;font-size:14px;color:#3f3f46;"><strong>Action required:</strong> Add a tracking number in your dashboard within 3 business days. Missing this deadline may trigger an automatic refund to the buyer.</p>
      ${btn('Go to Dashboard →', `${APP_URL}/seller/dashboard`)}
    `),
  })
}

export async function sendListingApprovedEmail(to: string, listingTitle: string, listingSlug: string) {
  await sendEmail({
    to,
    subject: `Your listing is live: ${listingTitle} ✅`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('Listing Approved ✅')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">You're live!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;"><strong>${listingTitle}</strong> is now visible to buyers across the UAE.</p>
      ${divider()}
      <p style="margin:0 0 8px;font-size:14px;color:#3f3f46;">Tips to sell faster:</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:14px;color:#3f3f46;">📸&nbsp; Add more photos (buyers love 5+ images)</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#3f3f46;">🏷️&nbsp; Price competitively — check similar listings</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#3f3f46;">💬&nbsp; Respond to inquiries within 1 hour</td></tr>
      </table>
      ${btn('View Your Listing →', `${APP_URL}/listings/${listingSlug}`)}
    `),
  })
}

export async function sendInquiryToVendor(
  to: string,
  data: {
    productName: string
    customerName: string
    customerEmail: string
    customerPhone: string
    message: string
  }
) {
  await sendEmail({
    to,
    subject: `New inquiry: ${data.productName}`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('New Inquiry 📨')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">Someone's interested!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">A customer wants to know more about <strong>${data.productName}</strong>. Respond within 24 hours for the best chance of a sale.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:100px;">Name</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Email</td>
          <td style="padding:6px 16px;font-size:14px;"><a href="mailto:${data.customerEmail}" style="color:#000;">${data.customerEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Phone</td>
          <td style="padding:6px 16px;font-size:14px;"><a href="tel:${data.customerPhone}" style="color:#000;">${data.customerPhone}</a></td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;vertical-align:top;">Message</td>
          <td style="padding:6px 16px;font-size:14px;color:#3f3f46;font-style:italic;">"${data.message}"</td>
        </tr>
      </table>
      ${btn('Reply via Dashboard →', `${APP_URL}/seller/dashboard`)}
    `),
  })
}

export async function sendInquiryConfirmationToCustomer(
  to: string,
  data: { productName: string; customerName: string }
) {
  await sendEmail({
    to,
    subject: `We got your inquiry — ${data.productName}`,
    html: baseTemplate(`
      <h1 style="margin:0 0 8px;font-size:22px;color:#09090b;">Inquiry received! ✅</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">Hi ${data.customerName}, thanks for your interest in <strong>${data.productName}</strong>.</p>
      ${divider()}
      <p style="margin:0 0 8px;font-size:14px;color:#3f3f46;">What happens next:</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;font-size:14px;color:#3f3f46;">1️⃣&nbsp; The seller will contact you within <strong>24 hours</strong></td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#3f3f46;">2️⃣&nbsp; Discuss availability, test ride, and delivery options</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#3f3f46;">3️⃣&nbsp; Purchase securely with <strong>escrow protection</strong></td></tr>
      </table>
      ${divider()}
      <p style="margin:0 0 16px;font-size:14px;color:#71717a;">While you wait, explore more options:</p>
      ${btn('Browse All Scooters →', `${APP_URL}/browse`)}
    `),
  })
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  await sendEmail({
    to,
    subject: 'Reset your ScootMart password',
    html: baseTemplate(`
      <h1 style="margin:0 0 8px;font-size:22px;color:#09090b;">Reset your password</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      ${btn('Reset Password →', resetLink)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:#a1a1aa;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
    `),
  })
}

export async function sendOrderShippedBuyer(
  to: string,
  listingTitle: string,
  trackingNumber: string,
  carrier: string
) {
  await sendEmail({
    to,
    subject: `Your scooter is on the way! 🚚 — ${listingTitle}`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('Shipped 🚚', '#2563eb')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">Your order is on the way!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;"><strong>${listingTitle}</strong> has been shipped and is heading to you.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:140px;">Carrier</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">${carrier}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Tracking no.</td>
          <td style="padding:6px 16px;font-size:14px;font-family:monospace;color:#09090b;">${trackingNumber}</td>
        </tr>
      </table>
      ${divider()}
      <p style="margin:0;font-size:13px;color:#71717a;">Once you receive your item, please confirm delivery in your orders page so the seller gets paid and your escrow is released.</p>
      ${btn('Confirm Receipt →', `${APP_URL}/buyer/orders`)}
    `),
  })
}

export async function sendNewListingAdminNotification(
  data: {
    sellerName: string
    sellerEmail: string
    listingTitle: string
    listingId: string
    price: number
    condition: string
    emirate: string
  }
) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'scootmartae@gmail.com'
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New listing pending review: ${data.listingTitle}`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('New Listing 📋')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">A new listing needs your review</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;"><strong>${data.sellerName}</strong> has submitted a listing for approval.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:120px;">Listing</td>
          <td style="padding:6px 16px;font-size:14px;font-weight:600;color:#09090b;">${data.listingTitle}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Price</td>
          <td style="padding:6px 16px;font-size:14px;color:#09090b;">AED ${data.price.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Condition</td>
          <td style="padding:6px 16px;font-size:14px;color:#09090b;">${data.condition}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Emirate</td>
          <td style="padding:6px 16px;font-size:14px;color:#09090b;">${data.emirate}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;">Seller</td>
          <td style="padding:6px 16px;font-size:14px;"><a href="mailto:${data.sellerEmail}" style="color:#000;">${data.sellerEmail}</a></td>
        </tr>
      </table>
      ${btn('Review in Admin Panel →', `${APP_URL}/admin/listings`)}
    `),
  })
}

export async function sendPayoutReleasedSeller(to: string, listingTitle: string, payout: number) {
  await sendEmail({
    to,
    subject: `Payout released — AED ${payout.toLocaleString()} 💸`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('Payout Released 💸', '#16a34a')}</p>
      <h1 style="margin:12px 0 8px;font-size:22px;color:#09090b;">Your money is on the way!</h1>
      <p style="margin:0 0 24px;color:#71717a;font-size:15px;">The buyer confirmed receipt of <strong>${listingTitle}</strong>. Your escrow has been released.</p>
      ${divider()}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">
        <tr>
          <td style="padding:6px 16px;color:#71717a;font-size:13px;width:120px;">Payout</td>
          <td style="padding:6px 16px;font-size:18px;font-weight:700;color:#16a34a;">AED ${payout.toLocaleString()}</td>
        </tr>
      </table>
      ${divider()}
      <p style="margin:0;font-size:13px;color:#71717a;">Funds will arrive in your registered bank account within <strong>3–5 business days</strong>.</p>
      ${btn('View Payouts →', `${APP_URL}/seller/payouts`)}
    `),
  })
}

// ── Admin Cron Report ─────────────────────────────────────────────────────────

export interface CronReportData {
  runAt: string           // ISO timestamp
  intervalHours: number
  totalListings: number
  activeListings: number
  affiliateListings: number
  updatedThisRun: number
  // Click stats (empty if table not yet created)
  totalClicksPeriod: number
  clicksByPlatform: { platform: string; clicks: number }[]
  topListings: { title: string; clicks: number; platform: string }[]
  // View stats from listings table
  totalViews: number
  topViewedListings: { title: string; views: number }[]
}

export async function sendCronReport(data: CronReportData) {
  const ADMIN = process.env.ADMIN_EMAIL ?? 'scootmartae@gmail.com'
  const d = data
  const dateStr = new Date(d.runAt).toLocaleString('en-AE', {
    timeZone: 'Asia/Dubai',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const platformRows = d.clicksByPlatform.length > 0
    ? d.clicksByPlatform.map(p => `
        <tr>
          <td style="padding:8px 16px;font-size:14px;color:#09090b;border-bottom:1px solid #f4f4f5;">${p.platform.toUpperCase()}</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;border-bottom:1px solid #f4f4f5;">${p.clicks.toLocaleString()}</td>
        </tr>`).join('')
    : `<tr><td colspan="2" style="padding:12px 16px;font-size:13px;color:#a1a1aa;text-align:center;">
        No click data yet — run <code>005_affiliate_clicks.sql</code> in Supabase to enable tracking.
       </td></tr>`

  const topClickRows = d.topListings.length > 0
    ? d.topListings.slice(0, 5).map((l, i) => `
        <tr>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;border-bottom:1px solid #f4f4f5;">${i + 1}</td>
          <td style="padding:8px 16px;font-size:14px;color:#09090b;border-bottom:1px solid #f4f4f5;">${l.title}</td>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;border-bottom:1px solid #f4f4f5;">${l.platform}</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;border-bottom:1px solid #f4f4f5;">${l.clicks}</td>
        </tr>`).join('')
    : ''

  const topViewRows = d.topViewedListings.slice(0, 5).map((l, i) => `
      <tr>
        <td style="padding:8px 16px;font-size:13px;color:#71717a;border-bottom:1px solid #f4f4f5;">${i + 1}</td>
        <td style="padding:8px 16px;font-size:14px;color:#09090b;border-bottom:1px solid #f4f4f5;">${l.title}</td>
        <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;border-bottom:1px solid #f4f4f5;">${l.views.toLocaleString()}</td>
      </tr>`).join('')

  const statCard = (label: string, value: string | number, sub?: string, color = '#09090b') =>
    `<td style="padding:0 8px 0 0;width:33%;">
      <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:14px 16px;">
        <p style="margin:0 0 4px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
        <p style="margin:0;font-size:22px;font-weight:800;color:${color};">${value}</p>
        ${sub ? `<p style="margin:4px 0 0;font-size:11px;color:#a1a1aa;">${sub}</p>` : ''}
      </div>
    </td>`

  await sendEmail({
    to: ADMIN,
    subject: `📊 ScootMart Report — ${d.totalClicksPeriod} clicks · ${d.activeListings} live listings`,
    html: baseTemplate(`
      <p style="margin:0 0 4px;">${badge('Cron Report ⚡')}</p>
      <h1 style="margin:12px 0 4px;font-size:20px;color:#09090b;">ScootMart.ae — Automated Report</h1>
      <p style="margin:0 0 24px;font-size:13px;color:#71717a;">${dateStr} (Asia/Dubai) · runs every ${d.intervalHours}h</p>

      <!-- KPI row -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          ${statCard('Affiliate Clicks', d.totalClicksPeriod.toLocaleString(), `last ${d.intervalHours}h`, d.totalClicksPeriod > 0 ? '#16a34a' : '#09090b')}
          ${statCard('Active Listings', d.activeListings, `${d.affiliateListings} affiliate`)}
          ${statCard('Total Views', d.totalViews.toLocaleString(), 'all time')}
        </tr>
      </table>

      <!-- Clicks by platform -->
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#09090b;text-transform:uppercase;letter-spacing:0.5px;">Clicks by Platform (last ${d.intervalHours}h)</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 16px;font-size:11px;color:#71717a;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Platform</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;text-align:right;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Clicks</th>
          </tr>
        </thead>
        <tbody>${platformRows}</tbody>
      </table>

      ${topClickRows ? `
      <!-- Top clicked listings -->
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#09090b;text-transform:uppercase;letter-spacing:0.5px;">Top Clicked Listings (last ${d.intervalHours}h)</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 16px;font-size:11px;color:#71717a;font-weight:600;">#</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;font-weight:600;">Listing</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;font-weight:600;">Store</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;text-align:right;font-weight:600;">Clicks</th>
          </tr>
        </thead>
        <tbody>${topClickRows}</tbody>
      </table>` : ''}

      <!-- Top viewed listings -->
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#09090b;text-transform:uppercase;letter-spacing:0.5px;">Top Viewed Listings (All Time)</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 16px;font-size:11px;color:#71717a;font-weight:600;">#</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;font-weight:600;">Listing</th>
            <th style="padding:10px 16px;font-size:11px;color:#71717a;text-align:right;font-weight:600;">Views</th>
          </tr>
        </thead>
        <tbody>${topViewRows}</tbody>
      </table>

      ${divider()}

      <!-- Cron health -->
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#09090b;text-transform:uppercase;letter-spacing:0.5px;">Cron Health</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;padding:4px 0;">
        <tr>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;">Listings updated this run</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;">${d.updatedThisRun}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;">Affiliate links live</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;">${d.affiliateListings}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;">Next run in</td>
          <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#09090b;text-align:right;">${d.intervalHours} hours</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;font-size:13px;color:#71717a;">Status</td>
          <td style="padding:8px 16px;text-align:right;">${badge('✓ Healthy', '#16a34a')}</td>
        </tr>
      </table>

      ${divider()}
      <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center;">
        This report is sent automatically every ${d.intervalHours} hours by ScootMart.ae cron.<br/>
        <a href="${APP_URL}/admin" style="color:#a1a1aa;">Admin Panel</a> &nbsp;·&nbsp;
        <a href="${APP_URL}/browse" style="color:#a1a1aa;">Browse Listings</a>
      </p>
    `),
  })
}
