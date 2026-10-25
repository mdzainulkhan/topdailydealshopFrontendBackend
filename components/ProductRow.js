import Link from 'next/link';
import ProductCard from './ProductCard';

export default function ProductRow({ title, href, items }) {
  if (!items?.length) return null;
  return (
    <section className="row-section">
      <div className="row-head">
        <h2>{title}</h2>
        {href && <Link href={href}>See all</Link>}
      </div>
      <div className="row-scroll">
        {items.map((p) => (
          <div className="row-item" key={p.asin}><ProductCard p={p} /></div>
        ))}
      </div>
    </section>
  );
}
