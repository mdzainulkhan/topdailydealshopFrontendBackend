import Link from 'next/link';
import { CATEGORIES, SITE } from '@/lib/config';

export default function Header({ q = '', index = '' }) {
  return (
    <header className="site-header">
      <div className="header-main">
        <details className="menu">
          <summary aria-label="Open menu">☰</summary>
          <nav className="menu-panel">
            <strong>Shop by category</strong>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`}>{c.icon} {c.name}</Link>
            ))}
            <Link href="/search?deals=1">🔥 Today&apos;s Deals</Link>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
          </nav>
        </details>

        <Link href="/" className="logo" aria-label={`${SITE.name} home`}>
          <span className="logo-top">TopDaily</span>
          <span className="logo-bottom">DealShop<i /></span>
        </Link>

        <form action="/search" className="search" role="search">
          <select name="index" defaultValue={index} aria-label="Category">
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.index}>{c.name}</option>
            ))}
          </select>
          <input type="search" name="q" defaultValue={q} placeholder={`Search ${SITE.name}`} aria-label="Search products" />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        <nav className="header-links">
          <Link href="/search?deals=1"><small>Hello,</small><b>Today&apos;s Deals</b></Link>
          <Link href="/affiliate-disclosure"><small>About</small><b>Disclosure</b></Link>
        </nav>
      </div>

      <nav className="subnav" aria-label="Categories">
        <Link href="/search?deals=1" className="hot">🔥 Today&apos;s Deals</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`}>{c.name}</Link>
        ))}
      </nav>
    </header>
  );
}
