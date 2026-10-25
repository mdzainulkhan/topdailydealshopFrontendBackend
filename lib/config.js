export const SITE = {
  name: 'TopDailyDealShop',
  tagline: 'Hand-picked Amazon deals, updated every day',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

export const AMAZON = {
  clientId: process.env.AMAZON_CLIENT_ID,
  clientSecret: process.env.AMAZON_CLIENT_SECRET,
  tokenUrl: process.env.AMAZON_TOKEN_URL || 'https://api.amazon.co.uk/auth/o2/token', // v3.2 (EU) — India lives here
  marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.in',
  partnerTag: process.env.AMAZON_PARTNER_TAG || 'yaszayd-21',
  apiBase: 'https://creatorsapi.amazon/catalog/v1',
};

// Prices are sent to the API in the smallest currency unit (paise for INR).
export const MINOR_UNIT = 100;

export const CATEGORIES = [
  { slug: 'electronics', name: 'Electronics', index: 'Electronics', icon: '📱', keywords: 'best selling electronics' },
  { slug: 'computers', name: 'Computers & Laptops', index: 'Computers', icon: '💻', keywords: 'laptop' },
  { slug: 'home-kitchen', name: 'Home & Kitchen', index: 'HomeAndKitchen', icon: '🏠', keywords: 'home essentials' },
  { slug: 'appliances', name: 'Appliances', index: 'Appliances', icon: '🧺', keywords: 'appliances' },
  { slug: 'fashion', name: 'Fashion', index: 'Apparel', icon: '👕', keywords: 'clothing' },
  { slug: 'shoes', name: 'Shoes & Bags', index: 'Shoes', icon: '👟', keywords: 'sneakers' },
  { slug: 'beauty', name: 'Beauty', index: 'Beauty', icon: '💄', keywords: 'skincare' },
  { slug: 'books', name: 'Books', index: 'Books', icon: '📚', keywords: 'bestseller books' },
  { slug: 'toys', name: 'Toys & Games', index: 'ToysAndGames', icon: '🧸', keywords: 'toys' },
  { slug: 'sports', name: 'Sports & Outdoors', index: 'SportsAndOutdoors', icon: '🏏', keywords: 'fitness' },
  { slug: 'watches', name: 'Watches', index: 'Watches', icon: '⌚', keywords: 'smartwatch' },
];

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
