/* PhotoTile.jsx — photo card with a real destination, gradient, text, and circular arrow. */
import { ArrowUpRight } from 'lucide-react';
import Assets from '@/assets/Assets';

export default function PhotoTile({ alt, className = '', copy, href, image, title }) {
  return (
    <a aria-label={`${title} — ${href.startsWith('tel:') ? 'call J.M. Tyre Services' : 'browse tyres'}`} className={`photo-tile [position:relative] [display:block] [height:100%] [overflow:hidden] [border-radius:20px] [background:#263127] [color:#fff] [isolation:isolate] [&:hover_.photo-tile-image]:[transform:scale(1.05)] [&>.arrow-circle]:[position:absolute] [&>.arrow-circle]:[right:17px] [&>.arrow-circle]:[bottom:18px] max-[720px]:[&>.arrow-circle]:[right:8px] max-[720px]:[&>.arrow-circle]:[bottom:9px] max-[720px]:[&>.arrow-circle]:[width:27px] max-[720px]:[&>.arrow-circle]:[height:27px] max-[720px]:[&>.arrow-circle_svg]:[width:14px] ${className}`} href={href}>
      <img alt={alt} className="photo-tile-image [width:100%] [height:100%] [max-width:none] [object-fit:cover] [transition:transform_.45s_ease]" loading="lazy" src={Assets[image] || image} />
      <span aria-hidden="true" className="photo-tile-shade [position:absolute] [inset:0] [pointer-events:none] [background:linear-gradient(0deg,rgba(2,9,5,.86),rgba(3,9,4,.44)_27%,rgba(3,9,4,0)_65%)]" />
      <span className="photo-tile-copy [position:absolute] [left:22px] [bottom:21px] [display:flex] [flex-direction:column] [gap:5px] [max-width:calc(100%_-_78px)] [&_strong]:[font-size:21px] [&_strong]:[font-weight:750] [&_strong]:[line-height:1.12] [&_strong]:[letter-spacing:-.055em] [&_small]:[max-width:215px] [&_small]:[font-size:12px] [&_small]:[line-height:1.23] [&_small]:[font-weight:600] [&_small]:[letter-spacing:-.022em] max-[720px]:[left:12px] max-[720px]:[bottom:13px] max-[720px]:[max-width:calc(100%_-_42px)] max-[720px]:[&_strong]:[font-size:14px] max-[720px]:[&_small]:[font-size:9px]">
        <strong>{title}</strong>
        <small>{copy}</small>
      </span>
      <span aria-hidden="true" className="arrow-circle [display:inline-flex] [align-items:center] [justify-content:center] [width:37px] [height:37px] [border-radius:50%] [background:#fff] [color:#152319] [flex:0_0_auto]"><ArrowUpRight size={18} strokeWidth={2} /></span>
    </a>
  );
}
