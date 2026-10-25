import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container prose">
      <h1>Page not found</h1>
      <p>We couldn&apos;t find that page or product. It may have been removed.</p>
      <Link className="btn" href="/">Back to home</Link>
    </div>
  );
}
