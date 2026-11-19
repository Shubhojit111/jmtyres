/* Hero.jsx — keep the approved cover geometry while leading with local, useful actions. */
import { CircleGauge, Star, Wrench } from "lucide-react";
import Assets from "@/assets/Assets";
import PillLink from "@/components/ui/PillLink";
import { business } from "@/lib/data/business";

const heroBenefits = [
  { label: "Tyres for every drive", Icon: CircleGauge },
  { label: "Practical wheel care", Icon: Wrench },
];

const defaultContent = {
  heroIntroLine1: "Confidence in",
  heroIntroLine2: "every kilometre.",
  heroLocation: "YOUR LOCAL TYRE EXPERTS · MULUND WEST",
  heroLine1: "Tyres & wheel care.",
  heroLine2: "Mulund West.",
  heroDescription:
    "Need new tyres or wheel care? Tell us your vehicle or tyre size. We can check options and fitted pricing before you visit.",
  heroImage: "HeroMountainDrive",
};

export default function Hero({ content }) {
  const c = { ...defaultContent, ...(content || {}) };
  const heroImageSrc =
    Assets[c.heroImage] ||
    (c.heroImage &&
    (c.heroImage.startsWith("/") || c.heroImage.startsWith("http"))
      ? c.heroImage
      : null) ||
    Assets.HeroMountainDrive;

  return (
    <section
      aria-label="J.M. Tyre Services introduction"
      className="hero-section relative w-full h-[624px] overflow-hidden rounded-[22px] bg-[#26352a] text-white isolate max-[720px]:h-[590px] max-[720px]:rounded-[15px]"
      id="hero"
    >
      <img
        alt="J.M. Tyre Services cover"
        aria-hidden="true"
        className="hero-image absolute inset-0 z-0 w-full h-full max-w-none object-cover object-center max-[720px]:object-[60%_center]"
        fetchPriority="high"
        height="887"
        src={heroImageSrc}
        width="1774"
      />
      <span
        aria-hidden="true"
        className="hero-shade absolute inset-0 z-10 [background:linear-gradient(90deg,rgba(6,18,15,.51)_0%,rgba(6,18,15,.24)_35%,rgba(6,18,15,0)_69%),_linear-gradient(0deg,rgba(4,13,11,.55)_0%,rgba(4,13,11,0)_51%)] max-[720px]:[background:linear-gradient(0deg,rgba(5,13,9,.87)_0%,rgba(5,13,9,.48)_37%,rgba(5,13,9,.08)_75%),_linear-gradient(90deg,rgba(4,15,9,.35),transparent)]"
      />
      <div className="hero-intro absolute z-20 top-12 left-12 flex flex-col gap-4 text-[19px] leading-[1.11] tracking-[-.065em] font-semibold max-[720px]:top-7 max-[720px]:left-6 max-[720px]:gap-2.5 max-[720px]:text-[17px]">
        <span className="small-dash block w-[34px] h-[1px] bg-white/90" />
        <span>
          {c.heroIntroLine1}
          <br />
          {c.heroIntroLine2}
        </span>
      </div>
      <div className="hero-bottom absolute z-20 left-12 bottom-9 max-w-[760px] [&_h1]:m-0 [&_h1]:text-[clamp(52px,4.35vw,67px)] [&_h1]:tracking-[-.077em] [&_h1]:font-extrabold [&_h1]:leading-[.99] [&_h1]:[text-wrap:balance] max-[720px]:left-5 max-[720px]:right-5 max-[720px]:bottom-6 max-[720px]:max-w-none max-[720px]:[&_h1]:text-[clamp(36px,10vw,52px)] max-[720px]:[&_h1]:leading-none">
        <p className="hero-location m-0 mb-2.5 text-white/85 text-[11px] font-extrabold tracking-[.15em] max-[720px]:text-[9px] max-[720px]:tracking-[.12em]">
          {c.heroLocation}
        </p>
        <h1>
          {c.heroLine1}
          <br />
          {c.heroLine2}
        </h1>
        <p className="hero-description my-4 text-[14px] font-semibold leading-[1.38] tracking-[-.025em] max-[720px]:my-3 max-[720px]:text-[12px] max-[720px]:leading-[1.43] max-[720px]:max-w-[325px] max-[720px]:[&_br]:hidden">
          {c.heroDescription}
        </p>
        <div className="hero-actions flex items-center flex-wrap gap-2.5 [&_.pill-button]:min-h-[43px] max-[720px]:gap-1.5 max-[720px]:[&_.pill-button]:min-h-[40px] max-[720px]:[&_.pill-button]:px-3 max-[720px]:[&_.pill-button]:gap-1.5 max-[720px]:[&_.pill-button]:text-[10.5px] max-[720px]:[&_.pill-button_svg]:w-3 max-[720px]:[&_.pill-button_svg]:h-3 max-[375px]:items-stretch max-[375px]:[&_.hero-cta]:flex-[1_1_100%] max-[375px]:[&_.hero-cta-call]:flex-[0_1_auto]">
          <PillLink
            className="hero-cta border border-white/90 bg-[#030e0b]/75"
            href="#find-tyres"
          >
            Check tyres &amp; price
          </PillLink>
          <PillLink
            className="hero-cta-call border border-white/90"
            href={business.phoneHref}
            light
          >
            Call now
          </PillLink>
        </div>
      </div>
      <div
        aria-label="Our services and reviews"
        className="hero-benefits absolute z-20 top-[36%] right-6 flex flex-col items-end gap-2 max-[720px]:top-[174px] max-[720px]:left-5 max-[720px]:right-auto max-[720px]:items-start max-[720px]:gap-1 max-[375px]:top-[155px]"
      >
        {heroBenefits.map(({ label, Icon }) => (
          <span
            className="hero-benefit inline-flex items-center gap-2.5 min-w-[170px] min-h-[38px] py-1.5 pr-3 pl-2 border border-white/30 rounded-full bg-[#1f2a1d]/35 backdrop-blur-[5px] text-[12px] font-bold tracking-[-.03em] [&_svg]:inline-flex [&_svg]:items-center [&_svg]:justify-center [&_svg]:w-[27px] [&_svg]:h-[27px] [&_svg]:p-1 [&_svg]:border [&_svg]:border-white/40 [&_svg]:rounded-full [&_svg]:shrink-0 max-[720px]:min-w-0 max-[720px]:min-h-[30px] max-[720px]:py-1 max-[720px]:pr-2.5 max-[720px]:pl-1 max-[720px]:gap-1.5 max-[720px]:text-[9px] max-[720px]:[&_svg]:w-5 max-[720px]:[&_svg]:h-5 max-[720px]:[&_svg]:p-1"
            key={label}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
            {label}
          </span>
        ))}
        <a
          className="hero-benefit hero-benefit-link inline-flex items-center gap-2.5 min-w-[170px] min-h-[38px] py-1.5 pr-3 pl-2 border border-white/30 rounded-full bg-[#1f2a1d]/35 backdrop-blur-[5px] text-[12px] font-bold tracking-[-.03em] [&_svg]:inline-flex [&_svg]:items-center [&_svg]:justify-center [&_svg]:w-[27px] [&_svg]:h-[27px] [&_svg]:p-1 [&_svg]:border [&_svg]:border-white/40 [&_svg]:rounded-full [&_svg]:shrink-0 max-[720px]:min-w-0 max-[720px]:min-h-[30px] max-[720px]:py-1 max-[720px]:pr-2.5 max-[720px]:pl-1 max-[720px]:gap-1.5 max-[720px]:text-[9px] max-[720px]:[&_svg]:w-5 max-[720px]:[&_svg]:h-5 max-[720px]:[&_svg]:p-1 transition-colors hover:bg-[#1f402a]/90 hover:border-white/80"
          href={business.mapHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Star aria-hidden="true" size={20} strokeWidth={1.7} />
          Read Google reviews
        </a>
      </div>
    </section>
  );
}
