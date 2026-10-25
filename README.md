# TopDailyDealShop — Amazon-style affiliate store (Next.js 14)

Responsive, Amazon-inspired storefront powered by the **Amazon Creators API** (credential version 3.2 → EU token endpoint, India marketplace).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Setup
1. Copy `.env.example` to `.env.local` (a ready `.env.local` is already included).
2. Check `AMAZON_PARTNER_TAG` — it must be your Associates **store/tracking ID** (e.g. `yaszayd-21`).
3. Never commit `.env.local` and never use `NEXT_PUBLIC_` for the secret.

## Structure
```
app/            layout, home, /search, /category/[slug], /product/[asin], /affiliate-disclosure
components/     Header, Footer, HeroCarousel, ProductCard, ProductRow, SearchView, Gallery, Pagination
lib/amazon.js   OAuth token cache, 1 req/sec queue, searchItems/getItems, 1-hour cache, demo fallback
lib/config.js   site name, categories (search indexes), marketplace
lib/mock.js     demo products used only if the API call fails
```

## Notes
- Prices/images/links come only from the API; every buy button uses the tagged `detailPageURL`.
- Data is cached 1 hour (`revalidate`), keeping you within API rate limits and Amazon's freshness rules.
- Category `index` values (Electronics, HomeAndKitchen, Apparel…) must match Amazon's India Locale Reference; edit `lib/config.js` if a category returns nothing.
- Keep the "As an Amazon Associate we earn from qualifying purchases" line (footer + disclosure page).
- Dev mode shows a yellow note when the API fails and demo products are used; check the terminal for the error.
