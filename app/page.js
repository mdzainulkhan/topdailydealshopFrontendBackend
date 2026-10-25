import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import ProductRow from '@/components/ProductRow';
import { searchProducts } from '@/lib/amazon';
import { CATEGORIES } from '@/lib/config';

export const revalidate = 3600; // rebuild the home page at most once an hour

const TILES = [
  { title: 'Gadgets under ₹2,000', icon: '🎧', cat: 'electronics', q: 'gadgets', max: 2000 },
  { title: 'Kitchen must-haves', icon: '🍳', cat: 'home-kitchen', q: 'kitchen' },
  { title: 'Style for less', icon: '👟', cat: 'fashion', q: 'fashion' },
  { title: 'Beauty & care', icon: '💄', cat: 'beauty', q: 'skincare' },
];

export default async function Home() {
  // Sequential on purpose: the API allows roughly 1 request per second.
  const deals = await searchProducts({ keywords: 'deals', minSavingPercent: 30, itemCount: 10 });
  const electronics = await searchProducts({ keywords: 'best selling', searchIndex: 'Electronics', itemCount: 10 });
  const home = await searchProducts({ keywords: 'home essentials', searchIndex: 'HomeAndKitchen', itemCount: 10 });
  const fashion = await searchProducts({ keywords: 'trending', searchIndex: 'Apparel', itemCount: 10 });

  return (
    <>
      <HeroCarousel />
      <div className="container overlap">
        <section className="tiles">
          {TILES.map((t) => (
            <Link key={t.title} href={`/category/${t.cat}?q=${encodeURIComponent(t.q)}${t.max ? `&max=${t.max}` : ''}`} className="tile">
              <h2>{t.title}</h2>
              <div className="tile-art" aria-hidden>{t.icon}</div>
              <span>Shop now</span>
            </Link>
          ))}
          <div className="tile tile-cats">
            <h2>Browse all</h2>
            <ul>
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/category/${c.slug}`}>{c.icon} {c.name}</Link></li>
              ))}
            </ul>
          </div>
        </section>

        <ProductRow title="Today's Deals" href="/search?deals=1" items={deals.items} />
        <ProductRow title="Best in Electronics" href="/category/electronics" items={electronics.items} />
        <ProductRow title="Home & Kitchen picks" href="/category/home-kitchen" items={home.items} />
        <ProductRow title="Trending in Fashion" href="/category/fashion" items={fashion.items} />
      </div>
    </>
  );
}
