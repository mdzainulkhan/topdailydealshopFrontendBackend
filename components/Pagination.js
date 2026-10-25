import Link from 'next/link';

export default function Pagination({ page, hasNext, makeHref }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? <Link href={makeHref(page - 1)}>← Previous</Link> : <span className="off">← Previous</span>}
      <span className="cur">Page {page}</span>
      {hasNext ? <Link href={makeHref(page + 1)}>Next →</Link> : <span className="off">Next →</span>}
    </nav>
  );
}
