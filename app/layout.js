import './globals.css';
import { SITE } from '@/lib/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: 'Daily Amazon deals, discounts and top-rated products across electronics, home, fashion and more.',
  openGraph: { siteName: SITE.name, type: 'website' },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#131921' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id="top">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
