'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SLIDES = [
  { title: 'Today\'s top deals', text: 'Fresh discounts picked every day', href: '/search?deals=1', cta: 'Shop deals', bg: 'linear-gradient(120deg,#232f3e,#37475a 55%,#ff9900)' },
  { title: 'Electronics & gadgets', text: 'Phones, audio and wearables for less', href: '/category/electronics', cta: 'Shop electronics', bg: 'linear-gradient(120deg,#0f3d3e,#1d6f6f 60%,#7dd3c0)' },
  { title: 'Home & kitchen', text: 'Upgrade your space without overpaying', href: '/category/home-kitchen', cta: 'Shop home', bg: 'linear-gradient(120deg,#5b2333,#a23b56 60%,#f4a6b8)' },
  { title: 'Fashion under budget', text: 'Style picks with real savings', href: '/category/fashion', cta: 'Shop fashion', bg: 'linear-gradient(120deg,#26215c,#4c3fb1 60%,#a89cff)' },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[i];
  return (
    <section className="hero" style={{ background: s.bg }} aria-roledescription="carousel">
      <button className="hero-arrow left" onClick={() => setI((i + SLIDES.length - 1) % SLIDES.length)} aria-label="Previous slide">‹</button>
      <div className="hero-copy" key={i}>
        <h1>{s.title}</h1>
        <p>{s.text}</p>
        <Link href={s.href} className="btn btn-lg">{s.cta}</Link>
      </div>
      <button className="hero-arrow right" onClick={() => setI((i + 1) % SLIDES.length)} aria-label="Next slide">›</button>
      <div className="hero-dots">
        {SLIDES.map((_, n) => (
          <button key={n} className={n === i ? 'on' : ''} onClick={() => setI(n)} aria-label={`Slide ${n + 1}`} />
        ))}
      </div>
      <div className="hero-fade" />
    </section>
  );
}
