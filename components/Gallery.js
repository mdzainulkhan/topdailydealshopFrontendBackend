'use client';
import { useState } from 'react';

export default function Gallery({ images, alt }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="gallery"><div className="gallery-main"><span className="noimg">No image</span></div></div>;
  return (
    <div className="gallery">
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, n) => (
            <button key={src} className={n === active ? 'on' : ''} onMouseEnter={() => setActive(n)} onClick={() => setActive(n)} aria-label={`Image ${n + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <div className="gallery-main"><img src={images[active]} alt={alt} /></div>
    </div>
  );
}
