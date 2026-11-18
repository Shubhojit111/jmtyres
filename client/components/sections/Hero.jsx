/* Hero.jsx — keep the approved cover geometry while leading with local, useful actions. */
import { CircleGauge, Star, Wrench } from 'lucide-react';
import Assets from '@/assets/Assets';
import PillLink from '@/components/ui/PillLink';
import { business } from '@/lib/data/business';

const heroBenefits = [
  { label: 'Tyres for every drive', Icon: CircleGauge },
  { label: 'Practical wheel care', Icon: Wrench },
];

export default function Hero({content}) {
  return (
    <section aria-label="J.M. Tyre Services introduction" className="hero-section [position:relative] [height:624px] [overflow:hidden] [border-radius:22px] [background:#26352a] [color:#fff] [isolation:isolate] max-[720px]:[height:590px] max-[720px]:[border-radius:15px]" id="hero">
      <img alt="" aria-hidden="true" className="hero-image [position:absolute] [inset:0] [width:100%] [height:100%] [max-width:none] [object-fit:cover] [object-position:center_center] [z-index:-2] max-[720px]:[object-position:60%_center]" fetchPriority="high" height="887" src={Assets[content.heroImage] || content.heroImage || Assets.HeroMountainDrive} width="1774" />
      <span aria-hidden="true" className="hero-shade [position:absolute] [inset:0] [z-index:-1] [background:linear-gradient(90deg,rgba(6,18,15,.51)_0%,rgba(6,18,15,.24)_35%,rgba(6,18,15,0)_69%),_linear-gradient(0deg,rgba(4,13,11,.55)_0%,rgba(4,13,11,0)_51%)] max-[720px]:[background:linear-gradient(0deg,rgba(5,13,9,.87)_0%,rgba(5,13,9,.48)_37%,rgba(5,13,9,.08)_75%),_linear-gradient(90deg,rgba(4,15,9,.35),transparent)]" />
      <div className="hero-intro [position:absolute] [top:48px] [left:48px] [display:flex] [flex-direction:column] [gap:16px] [font-size:19px] [line-height:1.11] [letter-spacing:-.065em] [font-weight:650] max-[720px]:[top:27px] max-[720px]:[left:24px] max-[720px]:[gap:11px] max-[720px]:[font-size:17px]"><span className="small-dash [display:block] [width:34px] [height:1px] [background:rgba(255,255,255,.9)]" /><span>{content.heroIntroLine1}<br />{content.heroIntroLine2}</span></div>
      <div className="hero-bottom [position:absolute] [left:48px] [bottom:38px] [max-width:760px] [&_h1]:[margin:0] [&_h1]:[font-size:clamp(52px,4.35vw,67px)] [&_h1]:[letter-spacing:-.077em] [&_h1]:[font-weight:800] [&_h1]:[line-height:.99] [&_h1]:[text-wrap:balance] max-[720px]:[left:22px] max-[720px]:[right:20px] max-[720px]:[bottom:24px] max-[720px]:[max-width:none] max-[720px]:[&_h1]:[font-size:clamp(36px,10vw,52px)] max-[720px]:[&_h1]:[line-height:1]">
        <p className="hero-location [margin:0_0_10px] [color:rgba(255,255,255,.85)] [font-size:11px] [font-weight:800] [letter-spacing:.15em] max-[720px]:[font-size:9px] max-[720px]:[letter-spacing:.12em]">{content.heroLocation}</p>
        <h1>{content.heroLine1}<br />{content.heroLine2}</h1>
        <p className="hero-description [margin:16px_0_17px] [font-size:14px] [font-weight:600] [line-height:1.38] [letter-spacing:-.025em] max-[720px]:[margin:12px_0_14px] max-[720px]:[font-size:12px] max-[720px]:[line-height:1.43] max-[720px]:[max-width:325px] max-[720px]:[&_br]:[display:none]">{content.heroDescription}</p>
        <div className="hero-actions [display:flex] [align-items:center] [flex-wrap:wrap] [gap:10px] [&_.pill-button]:[min-height:43px] max-[720px]:[gap:7px] max-[720px]:[&_.pill-button]:[min-height:40px] max-[720px]:[&_.pill-button]:[padding:0_11px] max-[720px]:[&_.pill-button]:[gap:7px] max-[720px]:[&_.pill-button]:[font-size:10.5px] max-[720px]:[&_.pill-button_svg]:[width:13px] max-[720px]:[&_.pill-button_svg]:[height:13px] max-[375px]:[align-items:stretch] max-[375px]:[&_.hero-cta]:[flex:1_1_100%] max-[375px]:[&_.hero-cta-call]:[flex:0_1_auto]">
          <PillLink className="hero-cta [border:1px_solid_rgba(255,255,255,.88)] [background:rgba(3,14,11,.75)]" href="#find-tyres">Check tyres &amp; price</PillLink>
          <PillLink className="hero-cta-call [border:1px_solid_rgba(255,255,255,.92)]" href={business.phoneHref} light>Call now</PillLink>
        </div>
      </div>
      <div aria-label="Our services and reviews" className="hero-benefits [position:absolute] [top:36%] [right:26px] [display:flex] [flex-direction:column] [align-items:flex-end] [gap:9px] max-[720px]:[top:174px] max-[720px]:[left:22px] max-[720px]:[right:auto] max-[720px]:[align-items:flex-start] max-[720px]:[gap:5px] max-[375px]:[top:155px]">
        {heroBenefits.map(({ label, Icon }) => <span className="hero-benefit [display:inline-flex] [align-items:center] [gap:10px] [min-width:170px] [min-height:38px] [padding:6px_13px_6px_8px] [border:1px_solid_rgba(255,255,255,.29)] [border-radius:999px] [background:rgba(31,42,29,.34)] [backdrop-filter:blur(5px)] [font-size:12px] [font-weight:700] [letter-spacing:-.03em] [&_svg]:[display:inline-flex] [&_svg]:[align-items:center] [&_svg]:[justify-content:center] [&_svg]:[width:27px] [&_svg]:[height:27px] [&_svg]:[padding:5px] [&_svg]:[border:1px_solid_rgba(255,255,255,.44)] [&_svg]:[border-radius:50%] [&_svg]:[flex:0_0_auto] max-[720px]:[min-width:0] max-[720px]:[min-height:30px] max-[720px]:[padding:4px_10px_4px_5px] max-[720px]:[gap:6px] max-[720px]:[font-size:9px] max-[720px]:[&_svg]:[width:20px] max-[720px]:[&_svg]:[height:20px] max-[720px]:[&_svg]:[padding:4px]" key={label}><Icon aria-hidden="true" size={20} strokeWidth={1.7} />{label}</span>)}
        <a className="hero-benefit hero-benefit-link [display:inline-flex] [align-items:center] [gap:10px] [min-width:170px] [min-height:38px] [padding:6px_13px_6px_8px] [border:1px_solid_rgba(255,255,255,.29)] [border-radius:999px] [background:rgba(31,42,29,.34)] [backdrop-filter:blur(5px)] [font-size:12px] [font-weight:700] [letter-spacing:-.03em] [&_svg]:[display:inline-flex] [&_svg]:[align-items:center] [&_svg]:[justify-content:center] [&_svg]:[width:27px] [&_svg]:[height:27px] [&_svg]:[padding:5px] [&_svg]:[border:1px_solid_rgba(255,255,255,.44)] [&_svg]:[border-radius:50%] [&_svg]:[flex:0_0_auto] max-[720px]:[min-width:0] max-[720px]:[min-height:30px] max-[720px]:[padding:4px_10px_4px_5px] max-[720px]:[gap:6px] max-[720px]:[font-size:9px] max-[720px]:[&_svg]:[width:20px] max-[720px]:[&_svg]:[height:20px] max-[720px]:[&_svg]:[padding:4px] [transition:background_.2s_ease,_border-color_.2s_ease] [&:hover]:[background:rgba(31,64,42,.9)] [&:hover]:[border-color:rgba(255,255,255,.8)]" href={business.mapHref} rel="noopener noreferrer" target="_blank"><Star aria-hidden="true" size={20} strokeWidth={1.7} />Read Google reviews</a>
      </div>
    </section>
  );
}
