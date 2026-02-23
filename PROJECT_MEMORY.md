# Cookie Shop Project Memory

## Overview
Building a simple e-commerce site to sell cookies in Singapore. Tech stack: Next.js 14 + Tailwind + Stripe (PayNow + Credit Card) + Prisma/SQLite.

## User Requirements
- Sell cookies online (Singapore market)
- Add/edit products with images and descriptions
- Payment: Credit cards + PayNow (Singapore)
- Discount codes at checkout
- Under 20 products initially

## Architecture Decisions

### Why Vercel + Stripe?
- User selected this stack (Vercel + Stripe)
- Vercel: Best Next.js integration, generous free tier (100GB bandwidth)
- Stripe: Built-in PayNow support for Singapore, handles credit cards

### Why SQLite/Prisma instead of Turso?
- Simpler for <20 products
- No external database setup needed
- Easy to migrate to Turso later if needed

### Discount Codes Approach
- Use Stripe Promo Codes (built-in)
- Simpler than building custom code validation
- Customer enters code at Stripe Checkout

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Stripe Checkout
- Prisma + SQLite (Prisma 7+)
- Cloudinary for images (free tier)

## File Structure (Current)
```
cookie-shop/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Home page (default)
│   ├── globals.css           # Tailwind styles
│   └── layout.tsx            # Root layout
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   └── stripe.ts             # Stripe client
├── components/               # React components (to be created)
├── .env                     # Environment variables
├── package.json
└── PROJECT_MEMORY.md         # This file
```

## Completed Setup

### 1. Next.js Project
- Created with `npx create-next-app@latest cookie-shop`
- TypeScript, Tailwind, ESLint enabled
- App Router structure

### 2. Database (Prisma + SQLite)
- Schema: Product model with id, name, description, price, imageUrl, category, inStock, createdAt, updatedAt
- Migration applied: `20260223061024_init`
- Client generated: `npx prisma generate`
- Database file: `prisma/dev.db`

### 3. Dependencies Installed
- `stripe` - Stripe SDK
- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI
- `dotenv` - Environment variables

## Current Status
- Task 1 (Initialize Next.js): ✅ COMPLETED
- Task 2 (Database): ✅ COMPLETED - Prisma + SQLite set up
- Task 3 (Product pages): 🔄 IN PROGRESS
- Task 4 (Stripe checkout): ⏳ PENDING
- Task 5 (Admin panel): ⏳ PENDING

## What Needs to Be Built Next

### Task 3: Product Pages & API Routes
1. Create directory structure:
   ```
   app/api/products/route.ts      # GET/POST products
   app/products/[id]/page.tsx     # Product detail page
   app/cart/page.tsx              # Shopping cart
   components/ProductCard.tsx     # Product grid item
   ```

2. API Routes needed:
   - `GET /api/products` - List all products
   - `POST /api/products` - Create product (admin)
   - `PUT /api/products/[id]` - Update product (admin)
   - `DELETE /api/products/[id]` - Delete product (admin)

3. Pages needed:
   - Update `app/page.tsx` for product listing
   - Create product detail page
   - Create cart page with state management

### Task 4: Stripe Checkout
- Create `app/api/checkout/route.ts` for checkout session
- Create Stripe Checkout redirect
- Set up webhook handler for payment confirmation

### Task 5: Admin Panel
- Create protected `/admin` routes
- Product CRUD forms
- Image upload (use Cloudinary or direct URL)

## Environment Variables Required (in .env)
```
DATABASE_URL="file:./dev.db"
STRIPE_SECRET_KEY="sk_test_..."       # Get from https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Get from Stripe Dashboard
STRIPE_WEBHOOK_SECRET="whsec_..."     # Get after creating webhook
ADMIN_PASSWORD="change-me"             # Password for admin routes
```

## How to Continue on Another Machine

```bash
# 1. Clone the repo
git clone <repo-url>
cd cookie-shop

# 2. Install dependencies
npm install

# 3. Get Stripe keys from https://dashboard.stripe.com/apikeys (use test mode)
#    Update .env with your keys

# 4. Generate Prisma client (if needed)
npx prisma generate

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

## Notes
- Prisma 7+ uses `prisma.config.ts` instead of url in schema
- Use Stripe Test Mode for development (test card: 4242 4242 4242 4242)
- PayNow available in Stripe for Singapore accounts
- For webhook testing locally: use `stripe listen` or ngrok
- Domain: ~$10-15/year (not yet purchased)
