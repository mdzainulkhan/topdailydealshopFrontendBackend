import Link from 'next/link';
import { searchProducts } from '@/lib/amazon';
import { CATEGORIES, MINOR_UNIT } from '@/lib/config';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

const SORTS = [
  ['', 'Featured'],
  ['Price:LowToHigh', 'Price: Low to High'],
  ['Price:HighToLow', 'Price: High to Low'],
  ['AvgCustomerReviews', 'Avg. Customer Review'],
  ['NewestArrivals', 'Newest Arrivals'],
];

const PRICES = [
  ['Under ₹500', '', 500],
  ['₹500 – ₹1,000', 500, 1000],
  ['₹1,000 – ₹5,000', 1000, 5000],
  ['₹5,000 – ₹20,000', 5000, 20000],
  ['Over ₹20,000', 20000, ''],
];

const DISCOUNTS = [[10, '10% off or more'], [25, '25% off or more'], [50, '50% off or more']];

export default async function SearchView({ basePath, title, params, lockedIndex }) {
  const page = Math.min(Math.max(parseInt(params.page || '1', 10) || 1, 1), 10);
  const q = params.q || '';
  const index = lockedIndex ?? (params.index || '');
  const sort = params.sort || '';
  const minP = params.min ? Number(params.min) : '';
  const maxP = params.max ? Number(params.max) : '';
  const minSave = params.deals ? Math.max(Number(params.save) || 20, 20) : Number(params.save) || '';

  const { items, total, source } = await searchProducts({
    keywords: q || (params.deals ? 'deals' : ''),
    searchIndex: index || undefined,
    sortBy: sort || undefined,
    itemPage: page,
    minPrice: minP ? minP * MINOR_UNIT : undefined,
    maxPrice: maxP ? maxP * MINOR_UNIT : undefined,
    minSavingPercent: minSave || undefined,
  });

  const href = (over = {}) => {
    const next = { q, index: lockedIndex ? '' : index, sort, min: minP, max: maxP, save: params.save || '', deals: params.deals || '', ...over };
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v !== '' && v !== undefined && v !== null && sp.set(k, String(v)));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="results-layout">
      <details className="filters" open>
        <summary>Filters</summary>
        {!lockedIndex && (
          <div className="filter-group">
            <h4>Department</h4>
            <Link href={href({ index: '', page: '' })} className={!index ? 'on' : ''}>All departments</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={href({ index: c.index, page: '' })} className={index === c.index ? 'on' : ''}>{c.name}</Link>
            ))}
          </div>
        )}
        <div className="filter-group">
          <h4>Price</h4>
          {PRICES.map(([label, lo, hi]) => (
            <Link key={label} href={href({ min: lo, max: hi, page: '' })} className={minP === lo && maxP === hi ? 'on' : ''}>{label}</Link>
          ))}
          {(minP || maxP) && <Link href={href({ min: '', max: '', page: '' })}>Clear price</Link>}
        </div>
        <div className="filter-group">
          <h4>Discount</h4>
          {DISCOUNTS.map(([n, label]) => (
            <Link key={n} href={href({ save: n, page: '' })} className={Number(params.save) === n ? 'on' : ''}>{label}</Link>
          ))}
          {params.save && <Link href={href({ save: '', page: '' })}>Clear discount</Link>}
        </div>
      </details>

      <section className="results">
        <div className="results-head">
          <div>
            <h1>{title}</h1>
            <p className="muted">{total ? `${total.toLocaleString('en-IN')} results` : `${items.length} results`}</p>
          </div>
          <div className="sort">
            <span>Sort by:</span>
            {SORTS.map(([val, label]) => (
              <Link key={label} href={href({ sort: val, page: '' })} className={sort === val ? 'on' : ''}>{label}</Link>
            ))}
          </div>
        </div>

        {source === 'demo' && process.env.NODE_ENV !== 'production' && (
          <p className="demo-note">Showing demo products — the Amazon API call failed. Check the server console and your .env.local.</p>
        )}

        {items.length ? (
          <div className="grid">{items.map((p) => <ProductCard key={p.asin} p={p} />)}</div>
        ) : (
          <div className="empty">
            <h2>No results found</h2>
            <p>Try fewer keywords, remove a filter, or browse a category from the menu.</p>
          </div>
        )}

        <Pagination page={page} hasNext={items.length >= 10 && page < 10} makeHref={(n) => href({ page: n })} />
      </section>
    </div>
  );
}
