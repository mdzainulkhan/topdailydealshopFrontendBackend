// Demo products shown only when the Amazon API is unreachable or credentials are missing.
const art = (emoji, c1, c2) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><text x='200' y='235' font-size='110' text-anchor='middle'>${emoji}</text></svg>`
  )}`;

const make = (n, emoji, title, brand, price, mrp, c1, c2) => {
  const amount = Number(price.replace(/[^\d]/g, ''));
  const was = Number(mrp.replace(/[^\d]/g, ''));
  return {
    asin: `DEMO${String(n).padStart(4, '0')}`,
    title,
    brand,
    image: art(emoji, c1, c2),
    images: [],
    features: [
      'Demo listing — connect the Creators API to show live Amazon products.',
      'Real prices, images and affiliate links appear automatically once credentials work.',
    ],
    price,
    mrp,
    savePercent: Math.round(((was - amount) / was) * 100),
    inStock: true,
    deal: n % 3 === 0,
    url: null,
  };
};

export const MOCK_PRODUCTS = [
  make(1, '🎧', 'Wireless Bluetooth Headphones with 40H Playtime', 'SoundPeak', '₹1,499', '₹3,999', '#232f3e', '#37475a'),
  make(2, '📱', '5G Smartphone 8GB RAM 128GB Storage, 50MP Camera', 'Nexa', '₹14,999', '₹19,999', '#0f766e', '#134e4a'),
  make(3, '⌚', 'Smart Watch with AMOLED Display and Calling', 'FitPulse', '₹2,299', '₹6,999', '#7c3aed', '#4c1d95'),
  make(4, '💻', '15.6" Laptop, Core i5, 16GB RAM, 512GB SSD', 'Volta', '₹44,990', '₹62,990', '#1d4ed8', '#1e3a8a'),
  make(5, '☕', 'Stainless Steel Electric Kettle 1.8L', 'HomeEase', '₹699', '₹1,595', '#b45309', '#78350f'),
  make(6, '🍳', 'Non-stick Cookware Set, 5 Pieces', 'KitchenKing', '₹1,799', '₹3,500', '#be123c', '#881337'),
  make(7, '👟', 'Men\'s Running Shoes, Lightweight Mesh', 'StrideX', '₹1,099', '₹2,999', '#0369a1', '#0c4a6e'),
  make(8, '👜', 'Women\'s Faux Leather Handbag', 'Urbane', '₹899', '₹2,499', '#a21caf', '#701a75'),
  make(9, '💄', 'Vitamin C Face Serum, 30 ml', 'GlowLab', '₹399', '₹799', '#db2777', '#9d174d'),
  make(10, '📚', 'Atomic Habits — Paperback Bestseller', 'Penguin', '₹349', '₹799', '#15803d', '#14532d'),
  make(11, '🧸', 'Building Blocks Set, 500 Pieces', 'BrickJoy', '₹749', '₹1,499', '#ca8a04', '#854d0e'),
  make(12, '🏏', 'Kashmir Willow Cricket Bat, Full Size', 'Striker', '₹1,299', '₹2,200', '#4d7c0f', '#365314'),
];
