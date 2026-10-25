import { notFound } from 'next/navigation';
import SearchView from '@/components/SearchView';
import { CATEGORIES, categoryBySlug } from '@/lib/config';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = categoryBySlug(params.slug);
  return cat ? { title: `${cat.name} deals`, description: `Best ${cat.name} deals and discounts on Amazon.` } : {};
}

export default function CategoryPage({ params, searchParams }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) notFound();
  const merged = { ...searchParams, q: searchParams.q || cat.keywords };
  return (
    <div className="container">
      <SearchView basePath={`/category/${cat.slug}`} title={cat.name} params={merged} lockedIndex={cat.index} />
    </div>
  );
}
