<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Plušis — agent guide

Vienintelis teisingas projekto kelias:

`C:\Users\37062\Projects\minkutis-shop`

Cursor: **File → Open Folder** → šis kelias. Terminale visos komandos tik iš šio folderio.

## Kas tai yra

- **Brand:** Plušis (lietuviškas „plushie“ — minkštas pliušinis žaislas)
- **Verslas:** Lafela, MB — weighted long-arm pliušinių žaislų e-commerce tik Lietuvoje
- **Niša:** ilgorankiai svoriniai pliušiniai (ne bendras žaislų marketplace)
- **Kalba UI:** lietuvių (LT), su diakritika kur įmanoma

## Įmonės duomenys (naudoti footer, legal puslapiuose)

| Laukas | Reikšmė |
|--------|---------|
| Įmonė | Lafela, MB |
| Brand | Plušis |
| Adresas | A. Vivulskio g. 22-40, LT-03115 Vilnius |
| Tel. | +370 623 94956 |
| El. paštas | info@plusis.lt |
| Įmonės kodas | 307556216 |

Šaltinis kode: `src/lib/company.ts` — **visada naudok `COMPANY`**, ne hardcode.

## Tech stack

| Sluoksnis | Technologija |
|-----------|--------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Stilius | Tailwind CSS v4, `globals.css` su `--cream` |
| Krepšelis | Zustand + `localStorage` (`plusis-cart`) |
| DB (prod) | Supabase PostgreSQL |
| Mokėjimai (prod) | Stripe Checkout + webhook |
| Hosting (planas) | Vercel |

## Paleidimas

```powershell
cd C:\Users\37062\Projects\minkutis-shop
npm install
npm run dev
```

- URL: http://localhost:3000 (jei užimtas → 3001)
- Build: `npm run build`
- Žr. ir `PALEIDIMAS.md`

## Demo režimas vs production

**Demo** (default be `.env`): `isDemoMode()` = nėra `STRIPE_SECRET_KEY`

- Checkout simuliuojamas → `/uzsakymas/sekme?demo=1`
- Užsakymai → `data/demo-orders.json`
- Waitlist → `data/demo-waitlist.json`
- Geltona juosta: `src/components/demo-banner.tsx`

**Production:** `.env.local` iš `.env.example` + Supabase migration `supabase/migrations/001_initial.sql`

## Produktai

- **11 SKU:** 4 pandos, 4 koalos, 3 raudonieji pandukai
- **Spec:** 60 cm, 0.61 kg, svoris rankose ir kūne
- **Kaina:** 38,99 EUR / vnt (`UNIT_PRICE` in `src/lib/cart-store.ts`)
- **Duomenys:** `src/lib/catalog.ts` (ne DB seed — statinis katalogas MVP)
- **Nuotraukos:** `public/products/{family}-{n}.svg` — placeholder; realios → `public/products/` arba Supabase Storage

### Bundle nuolaidos (automatiškai krepšelyje)

| Kiekis | Nuolaida | Kontekstas |
|--------|----------|------------|
| 2 vnt. | −15% | „Sau ir vaikui“, „Sau ir mergaitei“ |
| 3+ vnt. | −20% | „Surink kolekciją“ |

Logika: `calculateDiscount()` in `src/lib/cart-store.ts`. Aprašymai: `src/lib/bundles.ts`, UI: `src/components/bundle-promo.tsx`.

Pristatymas: nemokamas nuo 50 EUR, kitaip 3,99 EUR.

## Individualūs užsakymai

Standartinis svoris/dydis gali būti koreguojamas — tik asmeniniu susitarimu el. **info@plusis.lt**. Banner: `src/components/custom-size-banner.tsx`.

## Struktūra

```
src/
  app/                    # Next.js routes
    page.tsx              # Landing
    produktai/            # Katalogas + [slug] PDP
    krepselis/            # Cart + checkout CTA
    ateinancios/          # Waitlist (coming_soon produktai)
    uzsakymas/sekme/      # Order success
    duk/, apie/
    privatumo-politika/, grazinimas/, pirkimo-taisykles/
    api/checkout/         # Stripe arba demo checkout
    api/waitlist/
    api/webhooks/stripe/
  components/           # site-header, site-footer, product-card, ...
  lib/
    company.ts            # Lafela rekvizitai + brand
    catalog.ts            # 11 produktų
    cart-store.ts         # Zustand + pricing constants
    bundles.ts            # Bundle promo tekstai
    demo-mode.ts, demo-store.ts
    stripe.ts, supabase.ts
    utils.ts
  types/product.ts
public/
  logo.png, icon.png      # Brand logo + favicon
  products/*.svg          # Product placeholders
data/                     # Demo JSON (gitignored demo-*.json)
supabase/migrations/      # DB schema prod
```

## Dizainas ir UX

- Kopijuoti stilių iš sėkmingų nišinių plush shop (Moon Pals, Bilby) — emocinis copy, bundle promo, trust strip
- Spalvos: rose/cream, šiltas jaukumas (ne generic Shopify)
- Logo: `public/logo.png` — header `site-header.tsx`
- Mobile-first

## SEO

- `sitemap.ts`, `robots.ts`
- Metadata per `layout.tsx` ir puslapius
- LT raktažodžiai: svorinis pliusinis, ilgorankis, dovanos vaikams

## API routes

| Route | Funkcija |
|-------|----------|
| POST `/api/checkout` | Stripe session arba demo order |
| POST `/api/waitlist` | Supabase arba `data/demo-waitlist.json` |
| POST `/api/webhooks/stripe` | `checkout.session.completed` → orders |

## Windows / redagavimo pastabos

Šiame projekto kelyje **Cursor Write tool kartais sukuria UTF-16 failus** (build klaida `Unexpected character \0`). Jei taip — perrašyk failą PowerShell:

```powershell
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("kelias\failas.tsx", $turinys, $utf8)
```

## Ką daryti / ko nedaryti

**Daryti:**
- Minim scope — tik e-commerce, jokio admin dashboard be užklausos
- Naudoti `COMPANY`, `UNIT_PRICE`, `catalog.ts` kaip single source of truth
- Guest checkout (be privalomo account)
- Lietuvių kalba vartotojo matomame tekste

**Nedaryti:**
- Nenaudoti konkurentų (Moon Pals, Bilby) nuotraukų
- Necommit `.env.local`, `data/demo-*.json`
- Nekeisti git config, ne force push
- Nenaudoti „Minkutis“ — brand yra **Plušis**

## Production checklist

1. `.env.local` — Supabase + Stripe keys, `NEXT_PUBLIC_APP_URL`
2. Supabase: paleisti `001_initial.sql`
3. Vercel deploy + env vars
4. Stripe webhook → `https://domenas.lt/api/webhooks/stripe`
5. Pakeisti placeholder SVG → realios produktų nuotraukos
6. Patikrinti legal puslapius su teisininku jei reikia

## Nuorodos vartotojui

- Paleidimas: `PALEIDIMAS.md`
- Env šablonas: `.env.example`
- README: bendra info