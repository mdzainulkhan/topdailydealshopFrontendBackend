import 'server-only';
import { unstable_cache } from 'next/cache';
import { AMAZON } from './config';
import { MOCK_PRODUCTS } from './mock';

/* ---------- auth (OAuth2 client-credentials, cached in memory) ---------- */
let tokenCache = { token: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token;
  if (!AMAZON.clientId || !AMAZON.clientSecret) throw new Error('Missing AMAZON_CLIENT_ID / AMAZON_CLIENT_SECRET');

  const res = await fetch(AMAZON.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: AMAZON.clientId,
      client_secret: AMAZON.clientSecret,
      scope: 'creatorsapi::default',
    }),
    // Not 'no-store' (that breaks static/ISR rendering); revalidate before the 1h token expiry.
    next: { revalidate: 3000 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  tokenCache = { token: json.access_token, expiresAt: Date.now() + Math.min(json.expires_in || 3600, 3000) * 1000 };
  return tokenCache.token;
}

/* ---------- request queue: Creators API starts at ~1 request/second ---------- */
let chain = Promise.resolve();
const GAP_MS = 1100;
function schedule(task) {
  const run = chain.then(task);
  chain = run.catch(() => {}).then(() => new Promise((r) => setTimeout(r, GAP_MS)));
  return run;
}

async function callApi(operation, body, attempt = 0) {
  const token = await getToken();
  const res = await fetch(`${AMAZON.apiBase}/${operation}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-marketplace': AMAZON.marketplace,
    },
    body: JSON.stringify({ marketplace: AMAZON.marketplace, partnerTag: AMAZON.partnerTag, ...body }),
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 429 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    return callApi(operation, body, attempt + 1);
  }
  if (!res.ok) throw new Error(`${operation} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

/* ---------- normalise API item -> UI product ---------- */
function normalize(item) {
  const listing = item.offersV2?.listings?.[0];
  const price = listing?.price;
  const primary = item.images?.primary;
  const variants = (item.images?.variants || []).map((v) => v.large?.url || v.medium?.url).filter(Boolean);
  const title = item.itemInfo?.title?.displayValue || 'Amazon product';
  return {
    asin: item.asin,
    title,
    brand: item.itemInfo?.byLineInfo?.brand?.displayValue || item.itemInfo?.byLineInfo?.manufacturer?.displayValue || null,
    image: primary?.large?.url || primary?.medium?.url || primary?.small?.url || null,
    images: variants,
    features: item.itemInfo?.features?.displayValues || [],
    price: price?.money?.displayAmount || null,
    mrp: price?.savingBasis?.money?.displayAmount || null,
    savePercent: price?.savings?.percentage || 0,
    inStock: listing ? listing.availability?.type !== 'OUT_OF_STOCK' : true,
    deal: Boolean(listing?.dealDetails),
    merchant: listing?.merchantInfo?.name || null,
    url: item.detailPageURL || `https://${AMAZON.marketplace}/dp/${item.asin}?tag=${AMAZON.partnerTag}`,
  };
}

const SEARCH_RESOURCES = [
  'images.primary.large',
  'itemInfo.title',
  'itemInfo.byLineInfo',
  'offersV2.listings.price',
  'offersV2.listings.availability',
  'offersV2.listings.dealDetails',
  'offersV2.listings.merchantInfo',
];

const ITEM_RESOURCES = [
  ...SEARCH_RESOURCES,
  'images.variants.large',
  'itemInfo.features',
];

/* ---------- cached live calls (1 hour) ---------- */
const liveSearch = unstable_cache(
  async (params) => {
    const data = await schedule(() =>
      callApi('searchItems', {
        itemCount: 10,
        resources: SEARCH_RESOURCES,
        ...params,
      })
    );
    const result = data.searchResult || {};
    return { items: (result.items || []).map(normalize), total: result.totalResultCount || 0 };
  },
  ['amz-search-v1'],
  { revalidate: 3600 }
);

const liveItem = unstable_cache(
  async (asin) => {
    const data = await schedule(() =>
      callApi('getItems', { itemIds: [asin], itemIdType: 'ASIN', resources: ITEM_RESOURCES })
    );
    const item = data.itemsResult?.items?.[0];
    return item ? normalize(item) : null;
  },
  ['amz-item-v1'],
  { revalidate: 3600 }
);

/* ---------- public helpers (fall back to demo data on any failure) ---------- */
const withLinks = (p) => ({
  ...p,
  url: p.url || `https://${AMAZON.marketplace}/s?k=${encodeURIComponent(p.title)}&tag=${AMAZON.partnerTag}`,
});

export async function searchProducts({ keywords, searchIndex, sortBy, itemPage, minPrice, maxPrice, minSavingPercent, itemCount }) {
  const params = {};
  if (keywords) params.keywords = keywords;
  if (searchIndex) params.searchIndex = searchIndex;
  if (sortBy) params.sortBy = sortBy;
  if (itemPage && itemPage > 1) params.itemPage = itemPage;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (minSavingPercent) params.minSavingPercent = minSavingPercent;
  if (itemCount) params.itemCount = itemCount;
  if (!params.keywords) params.keywords = 'deals';

  try {
    const { items, total } = await liveSearch(params);
    return { items, total, source: 'live' };
  } catch (err) {
    console.error('[amazon] searchItems failed → demo data:', err.message);
    const q = (keywords || '').toLowerCase();
    let items = MOCK_PRODUCTS.filter((p) => !q || q.split(/\s+/).some((w) => w.length > 2 && `${p.title} ${p.brand}`.toLowerCase().includes(w)));
    if (!items.length) items = MOCK_PRODUCTS;
    if (minSavingPercent) items = items.filter((p) => p.savePercent >= minSavingPercent);
    const n = itemCount || 10;
    return { items: items.slice(0, n).map(withLinks), total: items.length, source: 'demo' };
  }
}

export async function getProduct(asin) {
  if (asin.startsWith('DEMO')) {
    const p = MOCK_PRODUCTS.find((m) => m.asin === asin);
    return p ? { product: withLinks(p), source: 'demo' } : { product: null, source: 'demo' };
  }
  try {
    const product = await liveItem(asin);
    return { product, source: 'live' };
  } catch (err) {
    console.error('[amazon] getItems failed:', err.message);
    return { product: null, source: 'error' };
  }
}

export const affiliateHome = () => `https://${AMAZON.marketplace}/?tag=${AMAZON.partnerTag}`;
