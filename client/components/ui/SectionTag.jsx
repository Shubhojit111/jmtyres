/* SectionTag.jsx — the tiny soft-green editorial eyebrow seen throughout the screenshot. */
export default function SectionTag({ children, className = "" }) {
  return (
    <span
      className={`section-tag inline-flex items-center h-[22px] px-[11px] rounded-full bg-[#e9eee4] text-[#212b1f] text-[10px] leading-none font-extrabold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
