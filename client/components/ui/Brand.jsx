/* Brand.jsx — displays the actual circular jm mark photographed on the shop sign. */
import Assets from '@/assets/Assets';

export default function Brand({ className = '' }) {
  return (
    <a aria-label="J.M. Tyre Services, home page" className={`brand inline-flex items-center shrink-0 gap-[5px] min-w-[206px] text-[#141b16] max-[1250px]:min-w-[176px] max-[720px]:min-w-0 max-[720px]:gap-[2px] ${className}`} href="/">
      <img alt="Original J.M. Tyre Services mark" className="brand-mark w-[57px] h-[43px] object-contain mix-blend-multiply max-[1250px]:w-12 max-[1250px]:h-[39px] max-[720px]:w-[45px] max-[720px]:h-[35px] max-[375px]:w-10" height="48" src={Assets.ShopMark} width="65" />
      <span className="brand-type flex flex-col justify-center gap-0 whitespace-nowrap">
        <strong>JM TYRES<span className="brand-dot text-[#315f3b]">.</span></strong>
        <small>TYRE SERVICES</small>
      </span>
    </a>
  );
}
