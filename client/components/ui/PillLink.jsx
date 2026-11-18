/* PillLink.jsx — reusable capsule link; all arrows are Lucide, not handwritten SVG. */
import { ArrowUpRight } from 'lucide-react';

export default function PillLink({ children, className = '', href, external = false, light = false }) {
  return (
    <a className={`pill-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [width:fit-content] [min-height:39px] [padding:0_17px] [border-radius:999px] [background:#111814] [color:#fff] [font-size:12px] [font-weight:800] [white-space:nowrap] [transition:background_.2s_ease,_transform_.2s_ease] [&:hover]:[background:#294e31] [&:hover]:[transform:translateY(-2px)] ${light ? "pill-button-light [background:#fff] ![color:#12251a] [&:hover]:[background:#ecf4e7] [&:hover]:[color:#12251a]" : ''} ${className}`} href={href} rel={external ? 'noopener noreferrer' : undefined} target={external ? '_blank' : undefined}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
    </a>
  );
}
