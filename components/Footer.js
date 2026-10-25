import Link from 'next/link';
import { CATEGORIES, SITE } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top" className="to-top">Back to top</a>
      <div className="footer-cols">
        <div>
          <h4>Shop</h4>
          {CATEGORIES.slice(0, 5).map((c) => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h4>More</h4>
          {CATEGORIES.slice(5).map((c) => <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h4>{SITE.name}</h4>
          <Link href="/search?deals=1">Today&apos;s Deals</Link>
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        </div>
      </div>
      <div className="footer-legal">
        <p>As an Amazon Associate we earn from qualifying purchases.</p>
        <p>
          Prices and availability are accurate as of the time they were fetched and are subject to change. The price
          shown on Amazon at the time of purchase applies. {SITE.name} is not Amazon and does not sell products.
        </p>
        <p>© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
