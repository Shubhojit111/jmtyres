/* PillLink.jsx — reusable capsule link; all arrows are Lucide, not handwritten SVG. */
import { ArrowUpRight } from 'lucide-react';

export default function PillLink({ children, className = '', href, external = false, light = false }) {
  return (
    <a className={`pill-button inline-flex items-center justify-center gap-[15px] w-fit min-h-[39px] px-[17px] rounded-full bg-[#111814] text-white text-xs font-extrabold whitespace-nowrap transition-[background,transform] duration-200 hover:bg-[#294e31] hover:-translate-y-0.5 ${light ? "pill-button-light bg-white !text-[#12251a] hover:bg-[#ecf4e7] hover:!text-[#12251a]" : ''} ${className}`} href={href} rel={external ? 'noopener noreferrer' : undefined} target={external ? '_blank' : undefined}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} />
    </a>
  );
}
