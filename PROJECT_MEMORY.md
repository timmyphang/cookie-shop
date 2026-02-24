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

### Why SQLite/Prisma instead of Firebase?
- Simpler for <20 products
- No external database setup needed
- Full SQL type safety with Prisma
- Easy to migrate to Turso later if needed

### Discount Codes Approach
- Use Stripe Promo Codes (built-in)
- Simpler than building custom code validation
- Customer enters code at Stripe Checkout

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Stripe Checkout
- Prisma + SQLite (Prisma 5)
- Cloudinary for images (free tier)

## File Structure
```
cookie-shop/
├── app/
│   ├── api/products/route.ts       # GET/POST products
│   ├── api/products/[id]/route.ts  # GET/PUT/DELETE product
│   ├── cart/page.tsx               # Shopping cart page
│   ├── page.tsx                    # Home page (product listing)
│   ├── layout.tsx                  # Root layout with CartProvider
│   └── globals.css                 # Tailwind styles
├── components/
│   ├── CartProvider.tsx            # Cart state (localStorage)
│   ├── CartButton.tsx              # Cart icon button
│   ├── Header.tsx                  # Site header
│   ├── ProductCard.tsx              # Product display card
│   └── ProductGrid.tsx             # Product grid with add to cart
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── seed.ts                    # Seed script
│   ├── migrations/                 # Database migrations
│   └── dev.db                     # SQLite database
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   └── stripe.ts                  # Stripe client
├── next.config.ts                  # Next.js config (images)
├── .env                           # Environment variables
├── package.json
└── PROJECT_MEMORY.md              # This file
```

## Completed Setup

### 1. Next.js Project
- Created with `npx create-next-app@latest cookie-shop`
- TypeScript, Tailwind, ESLint enabled
- App Router structure

### 2. Database (Prisma + SQLite)
- Schema: Product model with id, name, description, price, imageUrl, category, inStock, createdAt, updatedAt
- Migration: `20260223061024_init`
- Database: `prisma/dev.db` (SQLite)
- **Downgraded to Prisma 5** (Prisma 7 had configuration issues)

### 3. Product API Routes
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### 4. Product Pages & Cart
- Homepage displays products from database
- ProductCard component with image, price, add to cart
- CartProvider with localStorage persistence
- Cart page with quantity controls

### 5. Sample Products Seeded
10 cookie products:
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

## Current Status
- Task 1 (Initialize Next.js): ✅ COMPLETED
- Task 2 (Database): ✅ COMPLETED - Prisma 5 + SQLite set up
- Task 3 (Product pages): ✅ COMPLETED - Homepage, cart, API routes
- Task 4 (Stripe checkout): ⏳ PENDING
- Task 5 (Admin): ⏳ PENDING - Use `npx prisma studio` for now

## Quick Admin Access
Run `npx prisma studio` to open a point-and-click UI at http://localhost:5555
- View, add, edit, delete products
- Toggle inStock status
- Update images via URL

## What Needs to Be Built Next

### Task 4: Stripe Checkout
- Create `app/api/checkout/route.ts` for checkout session
- Create Stripe Checkout redirect
- Set up webhook handler for payment confirmation

### Task 5: Admin Panel
- **Option A: Prisma Studio** (built-in, quick) - Run `npx prisma studio` for point-and-click database management
- **Option B: Custom Admin Panel** (future) - Build protected `/admin` routes with product CRUD forms

## Environment Variables (in .env)
```
DATABASE_URL="file:./prisma/dev.db"
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

# 4. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 5. Seed sample products (optional)
npm run db:seed

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

## Notes
- Use Stripe Test Mode for development (test card: 4242 4242 4242 4242)
- PayNow available in Stripe for Singapore accounts
- For webhook testing locally: use `stripe listen` or ngrok
- Domain: ~$10-15/year (not yet purchased)
