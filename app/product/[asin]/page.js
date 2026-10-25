import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import ProductRow from '@/components/ProductRow';
import { getProduct, searchProducts } from '@/lib/amazon';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { product } = await getProduct(params.asin);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.title,
    description: (product.features[0] || product.title).slice(0, 155),
    openGraph: { images: product.image ? [product.image] : [] },
  };
}

export default async function ProductPage({ params }) {
  const { product: p } = await getProduct(params.asin);
  if (!p) notFound();

  const related = await searchProducts({ keywords: p.title.split(/\s+/).slice(0, 3).join(' '), itemCount: 8 });
  const images = [p.image, ...(p.images || [])].filter(Boolean);
  const more = related.items.filter((r) => r.asin !== p.asin);

  return (
    <div className="container">
      <nav className="crumbs"><Link href="/">Home</Link> › <span>{p.title.slice(0, 60)}</span></nav>

      <div className="pdp">
        <Gallery images={[...new Set(images)]} alt={p.title} />

        <div className="pdp-info">
          <h1>{p.title}</h1>
          {p.brand && <p className="muted">Brand: <b>{p.brand}</b></p>}
          <hr />
          <div className="pdp-price">
            {p.savePercent > 0 && <span className="neg">-{p.savePercent}%</span>}
            <span className="price big">{p.price || 'See price on Amazon'}</span>
          </div>
          {p.mrp && p.mrp !== p.price && <p className="muted">M.R.P.: <s>{p.mrp}</s></p>}
          {p.features.length > 0 && (
            <>
              <h3>About this item</h3>
              <ul className="features">{p.features.map((f, n) => <li key={n}>{f}</li>)}</ul>
            </>
          )}
        </div>

        <aside className="buybox">
          <div className="price big">{p.price || 'See price on Amazon'}</div>
          <p className={p.inStock ? 'stock ok' : 'stock no'}>{p.inStock ? 'In stock' : 'Currently unavailable'}</p>
          {p.merchant && <p className="muted">Sold by {p.merchant}</p>}
          <a className="btn btn-lg btn-block" href={p.url} target="_blank" rel="sponsored nofollow noopener">Buy on Amazon</a>
          <p className="fineprint">
            You&apos;ll complete your purchase on Amazon. As an Amazon Associate we earn from qualifying purchases. Price and
            availability may change.
          </p>
        </aside>
      </div>

      <ProductRow title="You may also like" items={more} />
    </div>
  );
}
