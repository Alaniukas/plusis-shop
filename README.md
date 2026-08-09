# Minkutis Shop

E-commerce for weighted long-arm plush toys in Lithuania.

## Stack

- Next.js 16 + TypeScript + Tailwind
- Supabase (orders, waitlist)
- Stripe Checkout
- Vercel deploy

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Env

See `.env.example` for Stripe and Supabase keys.

## Products

11 SKUs: 4 pandas, 4 koalas, 3 red pandas (60cm / 0.61kg).

Replace placeholder images in `public/products/` with real photos.

## Supabase

Run `supabase/migrations/001_initial.sql` in SQL editor.

## Deploy

Push to GitHub and import in Vercel. Set env vars and Stripe webhook to `/api/webhooks/stripe`.
