# Belmond Bakes - Project Memory

## Overview
E-commerce site for Belmond Bakes, a cookie business in Singapore. Tech stack: Next.js 16 + Tailwind + Stripe (PayNow + Credit Card) + Prisma 5/Neon Postgres.

## User Requirements
- Sell cookies online (Singapore market)
- Add/edit products with images and descriptions
- Payment: Credit cards + PayNow (Singapore)
- Discount codes at checkout (Stripe Promo Codes)
- Under 20 products initially

## Tech Stack
- Next.js 16.1.6 (App Router)
- Tailwind CSS 4
- Stripe Checkout (SDK v20.3.1, API version 2026-01-28.clover)
- Prisma 5.22.0 + Neon Postgres (Singapore region, ap-southeast-1)
- Cloudinary for images (free tier)

## File Structure
```
cookie-shop/
├── app/
│   ├── api/checkout/route.ts      # POST - creates Stripe Checkout Session
│   ├── api/webhook/route.ts       # POST - Stripe webhook handler
│   ├── api/products/route.ts      # GET/POST products
│   ├── api/products/[id]/route.ts # GET/PUT/DELETE product
│   ├── cart/page.tsx              # Shopping cart page
│   ├── checkout/success/page.tsx  # Post-payment success page
│   ├── checkout/cancel/page.tsx   # Checkout cancelled page
│   ├── page.tsx                   # Home page (product listing)
│   ├── layout.tsx                 # Root layout with CartProvider
│   └── globals.css                # Tailwind styles
├── components/
│   ├── CartProvider.tsx           # Cart state (localStorage)
│   ├── CartButton.tsx             # Cart icon button
│   ├── Header.tsx                 # Site header
│   ├── ProductCard.tsx            # Product display card
│   └── ProductGrid.tsx            # Product grid with add to cart
├── prisma/
│   ├── schema.prisma              # Database schema (Product, Order, OrderItem)
│   └── seed.ts                    # Seed script (10 cookie products)
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   └── stripe.ts                  # Stripe client
├── next.config.ts                 # Next.js config (images)
├── .env                           # Environment variables
├── package.json
└── PROJECT_MEMORY.md              # This file
```

## Database Schema (Neon Postgres)
- **Product**: id, name, description, price (cents), imageUrl, category, inStock, createdAt, updatedAt
- **Order**: id, stripeSessionId (unique), stripePaymentId, customerEmail, amountTotal (cents), currency, status, createdAt
- **OrderItem**: id, orderId (FK→Order), productName, unitPrice (cents), quantity

## Completed Tasks

### Task 1: Initialize Next.js - DONE
- TypeScript, Tailwind, ESLint enabled
- App Router structure

### Task 2: Database - DONE
- Originally SQLite, **migrated to Neon Postgres** (Singapore region)
- Connection via pooler: `ep-dawn-thunder-a1r9qxh4-pooler.ap-southeast-1.aws.neon.tech`
- Schema pushed with `npx prisma db push`

### Task 3: Product Pages & Cart - DONE
- Homepage displays products from database
- ProductCard, ProductGrid components
- CartProvider with localStorage persistence
- Cart page with quantity controls
- Product CRUD API routes

### Task 4: Stripe Checkout - DONE
- **Checkout API** (`/api/checkout`): Creates Stripe Checkout Session with cart items, SGD currency, card + PayNow, promo codes enabled
- **Webhook** (`/api/webhook`): Handles `checkout.session.completed`, verifies signature, saves Order + OrderItems to DB, handles duplicate webhooks via unique constraint
- **Success page**: Clears cart, shows confirmation
- **Cancel page**: Preserves cart, links back
- **Tested end-to-end**: Stripe CLI trigger → webhook → order saved to Neon DB

### Task 5: Admin Panel - PENDING
- Currently using `npx prisma studio` for product management
- Option to build custom `/admin` routes later

## Current Status
- Task 1 (Initialize Next.js): ✅ COMPLETED
- Task 2 (Database): ✅ COMPLETED - Migrated to Neon Postgres
- Task 3 (Product pages): ✅ COMPLETED
- Task 4 (Stripe checkout): ✅ COMPLETED - Full checkout + webhook + order storage
- Task 5 (Admin): ⏳ PENDING - Using Prisma Studio for now
- Task 6 (Vercel deployment): ⏳ PENDING

## Remaining Steps for Vercel Deployment

### Step 1: Prepare for Production
- [ ] Review `.gitignore` — ensure `.env` is excluded (it is)
- [ ] Remove old SQLite files (`dev.db`, `prisma/migrations/`) from repo if present
- [ ] Ensure `npx next build` passes cleanly (it does)

### Step 2: Deploy to Vercel
- [ ] Connect GitHub repo (`timmyphang/cookie-shop`) to Vercel
- [ ] Vercel auto-detects Next.js — no special build config needed
- [ ] Add Prisma generate to build: set Build Command to `npx prisma generate && next build`

### Step 3: Set Environment Variables in Vercel
Add these in Vercel Project → Settings → Environment Variables:
- `DATABASE_URL` — Neon Postgres connection string
- `STRIPE_SECRET_KEY` — live key (`sk_live_...`) for production, or keep test key for staging
- `STRIPE_PUBLISHABLE_KEY` — live key (`pk_live_...`) for production
- `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard webhook endpoint (NOT the `stripe listen` local secret)
- `ADMIN_PASSWORD` — set a strong password

### Step 4: Create Stripe Webhook in Dashboard
- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-vercel-domain.vercel.app/api/webhook`
- Select event: `checkout.session.completed`
- Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### Step 5: Switch Stripe to Live Mode (when ready)
- In Stripe Dashboard, toggle from Test to Live mode
- Get live API keys and update Vercel env vars
- Enable PayNow in Stripe payment methods (requires Singapore Stripe account)

### Step 6: Custom Domain (optional)
- Purchase domain (~$10-15/year)
- Add to Vercel Project → Settings → Domains
- Update Stripe webhook URL to use custom domain

## Sample Products (10 cookies, all seeded in Neon)
- Classic Chocolate Chip ($4.80)
- Oatmeal Raisin ($4.20)
- Double Chocolate ($5.20)
- Peanut Butter ($4.80)
- White Chocolate Macadamia ($5.80)
- Cranberry Almond ($5.20)
- Salted Caramel ($5.50)
- Red Velvet ($5.80)
- Sticky Date ($4.80)
- Matcha White Chocolate ($6.20)

## Environment Variables (in .env)
```
DATABASE_URL="postgresql://..."     # Neon Postgres connection string
STRIPE_SECRET_KEY="sk_test_..."     # Stripe secret key
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Stripe publishable key
STRIPE_WEBHOOK_SECRET="whsec_..."   # Stripe webhook signing secret
ADMIN_PASSWORD="..."                # Admin password
```

## Quick Reference

### Local Development
```bash
npm run dev                    # Start dev server
npx prisma studio             # Admin UI at localhost:5555
stripe listen --forward-to localhost:3000/api/webhook  # Local webhook testing
```

### Testing
- Test card: `4242 4242 4242 4242` (any future expiry, any CVC)
- Trigger test webhook: `stripe trigger checkout.session.completed`

### GitHub Repo
- `https://github.com/timmyphang/cookie-shop`
