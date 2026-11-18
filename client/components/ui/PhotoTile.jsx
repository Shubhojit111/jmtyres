/* PhotoTile.jsx — photo card with a real destination, gradient, text, and circular arrow. */
import { ArrowUpRight } from 'lucide-react';
import Assets from '@/assets/Assets';

export default function PhotoTile({ alt, className = '', copy, href, image, title }) {
  return (
    <a aria-label={`${title} — ${href.startsWith('tel:') ? 'call J.M. Tyre Services' : 'browse tyres'}`} className={`photo-tile ${className}`} href={href}>
      <img alt={alt} className="photo-tile-image block h-full w-full max-w-none object-cover" loading="lazy" src={Assets[image] || image} />
      <span aria-hidden="true" className="photo-tile-shade" />
      <span className="photo-tile-copy">
        <strong>{title}</strong>
        <small>{copy}</small>
      </span>
      <span aria-hidden="true" className="arrow-circle"><ArrowUpRight size={18} strokeWidth={2} /></span>
    </a>
  );
}
