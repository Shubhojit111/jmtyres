/* Brand.jsx — displays the actual circular jm mark photographed on the shop sign. */
import Assets from '@/assets/Assets';

export default function Brand({ className = '' }) {
  return (
    <a aria-label="J.M. Tyre Services, home page" className={`brand [display:inline-flex] [align-items:center] [flex:0_0_auto] [gap:5px] [min-width:206px] [color:#141b16] max-[1250px]:[min-width:176px] max-[720px]:[min-width:0] max-[720px]:[gap:2px] ${className}`} href="/">
      <img alt="Original J.M. Tyre Services mark" className="brand-mark [width:57px] [height:43px] [object-fit:contain] [mix-blend-mode:multiply] max-[1250px]:[width:48px] max-[1250px]:[height:39px] max-[720px]:[width:45px] max-[720px]:[height:35px] max-[375px]:[width:40px]" height="48" src={Assets.ShopMark} width="65" />
      <span className="brand-type [display:flex] [flex-direction:column] [justify-content:center] [gap:0] [white-space:nowrap] [&_strong]:[font-size:23px] [&_strong]:[font-weight:800] [&_strong]:[letter-spacing:-.095em] [&_strong]:[line-height:.92] [&_small]:[margin-top:5px] [&_small]:[font-size:8px] [&_small]:[font-weight:800] [&_small]:[letter-spacing:.22em] [&_small]:[line-height:1] max-[1250px]:[&_strong]:[font-size:20px] max-[720px]:[&_strong]:[font-size:18px] max-[720px]:[&_small]:[margin-top:4px] max-[720px]:[&_small]:[font-size:6px] max-[720px]:[&_small]:[letter-spacing:.2em] max-[375px]:[&_strong]:[font-size:16px]">
        <strong>JM TYRES<span className="brand-dot [color:#315f3b]">.</span></strong>
        <small>TYRE SERVICES</small>
      </span>
    </a>
  );
}
