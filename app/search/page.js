import SearchView from '@/components/SearchView';

export const metadata = { title: 'Search results', robots: { index: false } };

export default function SearchPage({ searchParams }) {
  const title = searchParams.deals
    ? "Today's Deals"
    : searchParams.q
    ? `Results for “${searchParams.q}”`
    : 'All products';
  return (
    <div className="container">
      <SearchView basePath="/search" title={title} params={searchParams} />
    </div>
  );
}
