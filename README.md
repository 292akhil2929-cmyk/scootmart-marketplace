# ScootMart.ae

UAE's #1 marketplace for new and certified used electric scooters and e-bikes. Verified sellers, escrow payment protection, UAE-tested performance reviews, and certified used battery inspection program.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query
- **Backend**: Next.js API routes + Server Actions
- **Database**: Supabase (PostgreSQL) with RLS policies
- **Auth**: Supabase Auth (email + Google OAuth)
- **Storage**: Supabase Storage (images, videos, PDFs)
- **Payments**: Stripe (cards) + Tabby/Tamara (BNPL) escrow
- **AI Chatbot**: Vercel AI SDK + OpenAI gpt-4o
- **Deployment**: Vercel

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/your-org/scootmart-ae.git
cd scootmart-ae
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key into `.env.local`
3. Run the schema migration:

```bash
# Option A: Paste into Supabase SQL editor
# Open: supabase/migrations/001_initial_schema.sql

# Option B: Use Supabase CLI
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

4. Seed the database:

```bash
# In Supabase SQL editor, paste and run:
# supabase/seed.sql
```

### 4. Stripe setup

1. Create account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys
3. Set up webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy webhook secret to `.env.local`

### 5. OpenAI setup

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to `.env.local` as `OPENAI_API_KEY`

### 6. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Supabase Auth Setup

In your Supabase dashboard → Authentication → Providers:
- Enable **Email** provider
- Enable **Google** provider (add OAuth credentials from Google Cloud Console)
- Set redirect URL: `http://localhost:3000/api/auth/callback`

---

## Vercel Deployment

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. Deploy

Update Supabase redirect URLs to include your Vercel domain.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── browse/page.tsx             # Browse & search
│   ├── listings/[id]/page.tsx      # Product detail
│   ├── uae-tested/page.tsx         # UAE-Tested section
│   ├── bundles/page.tsx            # Bundle deals
│   ├── checkout/page.tsx           # Escrow checkout
│   ├── wishlist/page.tsx           # Saved listings
│   ├── (auth)/login|register/      # Auth pages
│   ├── seller/dashboard/           # Seller dashboard
│   ├── seller/listings/new/        # Create listing (multi-step)
│   ├── buyer/orders/               # Order tracking
│   ├── admin/                      # Admin panel
│   ├── api/
│   │   ├── chat/route.ts           # AI chatbot (streaming)
│   │   ├── listings/route.ts       # Listings CRUD
│   │   ├── orders/route.ts         # Order creation + Stripe
│   │   ├── stripe/webhook/         # Stripe webhooks → escrow
│   │   └── auth/callback/          # Supabase OAuth callback
│   └── legal/                      # Legal pages
├── components/
│   ├── layout/Header.tsx           # Sticky nav with auth
│   ├── layout/Footer.tsx
│   ├── home/Hero.tsx               # Search hero
│   ├── home/HowItWorks.tsx
│   ├── home/TrustBadges.tsx
│   ├── listings/ListingCard.tsx    # Card with wishlist toggle
│   ├── listings/SearchFilters.tsx  # UAE-specific filters
│   ├── chatbot/ChatBot.tsx         # AI floating chatbot
│   └── shared/VerifiedBadge.tsx    # Trust badges
├── lib/
│   ├── supabase/client.ts          # Browser Supabase client
│   ├── supabase/server.ts          # Server Supabase client
│   ├── stripe/server.ts            # Stripe + checkout sessions
│   ├── ai/chatbot.ts               # OpenAI tools + system prompt
│   └── utils.ts                    # Helpers, formatters
├── types/database.ts               # Full TypeScript types
└── hooks/use-toast.ts
supabase/
├── migrations/001_initial_schema.sql   # Full schema + RLS
└── seed.sql                            # 12 listings + 4 sellers
middleware.ts                           # Auth guard
```

---

## Seed Data

The seed file includes:
- **4 sellers**: Ahmed Scooters (verified shop, Dubai), UAE Ebikes Co (verified, Abu Dhabi), Khalid Rides (individual, Sharjah), TechMove FZCO (verified importer, Dubai)
- **12 listings**: Segway Max G2, NIU KQi3 Max, Xiaomi Pro, Dualtron Thunder 2, VSETT 10+, Segway eMoped C80, KTM Macina, + 3 certified used units + 2 more
- **Real UAE heat range data** for every listing
- **3 bundles**: Commuter Starter, Delivery Rider Pro, Premium Safety Kit
- **Certified inspections** for all used listings with battery health %

---

## Commission & Escrow Flow

```
Buyer pays AED X
    → Stripe holds in escrow
    → Order status: in_escrow
    → Listing status: sold
    → Seller notified to ship
    → Buyer confirms receipt (or auto-releases after 7 days)
    → Escrow releases (X minus 8-12% commission) to seller
    → Seller payout via Stripe Connect or bank transfer
```

---

## Environment Variables Reference

See `.env.example` for all required variables including:
- Supabase (URL, anon key, service role)
- OpenAI API key
- Stripe (publishable, secret, webhook secret)
- Tabby and Tamara BNPL keys
- Aramex/Fetchr delivery API keys
- Resend email API key
