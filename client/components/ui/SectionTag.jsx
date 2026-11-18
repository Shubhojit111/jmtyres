/* SectionTag.jsx — the tiny soft-green editorial eyebrow seen throughout the screenshot. */
export default function SectionTag({ children, className = '' }) {
  return <span className={`section-tag [display:inline-flex] [align-items:center] [height:22px] [padding:0_11px] [border-radius:999px] [background:#e9eee4] [color:#212b1f] [font-size:10px] [line-height:1] [font-weight:800] [white-space:nowrap] ${className}`}>{children}</span>;
}
