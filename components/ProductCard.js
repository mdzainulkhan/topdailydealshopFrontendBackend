import Link from 'next/link';

export default function ProductCard({ p }) {
  const href = `/product/${p.asin}`;
  return (
    <article className="card">
      {p.savePercent > 0 && <span className="badge">{p.savePercent}% off</span>}
      <Link href={href} className="card-img">
        {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <span className="noimg">No image</span>}
      </Link>
      {p.deal && <span className="deal-tag">Limited time deal</span>}
      <h3 className="card-title"><Link href={href}>{p.title}</Link></h3>
      {p.brand && <p className="card-brand">by {p.brand}</p>}
      <div className="price-row">
        <span className="price">{p.price || 'See price on Amazon'}</span>
        {p.mrp && p.mrp !== p.price && <span className="mrp">M.R.P.: <s>{p.mrp}</s></span>}
      </div>
      <a className="btn" href={p.url} target="_blank" rel="sponsored nofollow noopener">View on Amazon</a>
    </article>
  );
}
