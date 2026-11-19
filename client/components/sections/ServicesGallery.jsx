/* ServicesGallery.jsx — four useful service/shop cards, replacing imaginary employee portraits. */
import { ArrowUpRight, UsersRound } from "lucide-react";
import Assets from "@/assets/Assets";
import SectionTag from "@/components/ui/SectionTag";
import { business } from "@/lib/data/business";
import { serviceCards } from "@/lib/data/gallery";

export default function ServicesGallery() {
  return (
    <section
      className="gallery-section section-inset [margin-top:42px] [padding-top:18px] [border-top:1px_solid_#e9ebe8] max-[720px]:[margin-top:35px] max-[720px]:[padding-top:24px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]"
      id="services"
    >
      <div className="gallery-heading [position:relative] [display:flex] [align-items:flex-start] [justify-content:center] [height:72px] [&_.section-tag]:[position:absolute] [&_.section-tag]:[top:0] [&_.section-tag]:[left:0] [&_h2]:[margin:0] [&_h2]:[font-size:30px] [&_h2]:[line-height:1.17] [&_h2]:[font-weight:800] [&_h2]:[letter-spacing:-.07em] [&_h2]:[text-align:center] max-[970px]:[flex-direction:column] max-[970px]:[justify-content:flex-start] max-[970px]:[align-items:flex-start] max-[970px]:[height:112px] max-[970px]:[gap:13px] max-[970px]:[&_.section-tag]:[position:static] max-[970px]:[&_h2]:[text-align:left] max-[970px]:[&_h2]:[font-size:29px] max-[720px]:[position:relative] max-[720px]:[display:flex] max-[720px]:[flex-direction:row] max-[720px]:[align-items:flex-end] max-[720px]:[justify-content:center] max-[720px]:[height:96px] max-[720px]:[gap:0] max-[720px]:[padding-bottom:18px] max-[720px]:[&_.section-tag]:[position:absolute] max-[720px]:[&_.section-tag]:[left:0] max-[720px]:[&_.section-tag]:[top:0] max-[720px]:[&_h2]:[max-width:285px] max-[720px]:[&_h2]:[font-size:25px] max-[720px]:[&_h2]:[text-align:center]">
        <SectionTag>What we do</SectionTag>
        <h2>Everything your wheels need, in one place.</h2>
      </div>
      <div className="gallery-grid [display:grid] [grid-template-columns:repeat(5,minmax(0,1fr))] [gap:14px] [height:226px] max-[970px]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-[970px]:[grid-auto-rows:220px] max-[970px]:[height:auto] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[grid-auto-rows:auto] max-[720px]:[gap:11px] max-[720px]:[height:auto]">
        {serviceCards.map((card) => (
          <a
            aria-label={`${card.title} — ${card.subtitle}`}
            className="gallery-card [&:hover_img]:[transform:scale(1.05)] [&>.arrow-circle]:[position:absolute] [&>.arrow-circle]:[right:11px] [&>.arrow-circle]:[bottom:16px] [&>.arrow-circle]:[width:32px] [&>.arrow-circle]:[height:32px] [position:relative] [display:block] [overflow:hidden] [border-radius:17px] [background:#24442b] [color:#fff] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[transition:transform_.45s_ease] [&:nth-child(4)_img]:[object-position:30%_40%] max-[720px]:[height:195px] max-[720px]:[border-radius:13px] max-[720px]:[&>.arrow-circle]:[right:8px] max-[720px]:[&>.arrow-circle]:[bottom:12px] max-[720px]:[&>.arrow-circle]:[width:28px] max-[720px]:[&>.arrow-circle]:[height:28px]"
            href={card.id === "mulund-shop" ? business.mapHref : card.href}
            key={card.id}
            rel={card.id === "mulund-shop" ? "noopener noreferrer" : undefined}
            target={card.id === "mulund-shop" ? "_blank" : undefined}
          >
            <img alt={card.alt} loading="eager" src={Assets[card.image]} />
            <span
              aria-hidden="true"
              className="gallery-shade [position:absolute] [inset:0] [pointer-events:none] [background:linear-gradient(0deg,rgba(2,9,5,.86),rgba(3,9,4,.44)_27%,rgba(3,9,4,0)_65%)]"
            />
            <span className="gallery-card-copy [position:absolute] [bottom:19px] [left:17px] [display:flex] [flex-direction:column] [max-width:calc(100%_-_58px)] [gap:4px] [&_strong]:[font-size:18px] [&_strong]:[line-height:1.08] [&_strong]:[font-weight:800] [&_strong]:[letter-spacing:-.055em] [&_small]:[font-size:11.5px] [&_small]:[line-height:1.28] [&_small]:[font-weight:650] max-[720px]:[left:12px] max-[720px]:[bottom:14px] max-[720px]:[&_strong]:[font-size:16px]">
              <strong>{card.title}</strong>
              <small>{card.subtitle}</small>
            </span>
            <span
              aria-hidden="true"
              className="arrow-circle [display:inline-flex] [align-items:center] [justify-content:center] [width:37px] [height:37px] [border-radius:50%] [background:#fff] [color:#152319] [flex:0_0_auto]"
            >
              <ArrowUpRight size={17} />
            </span>
          </a>
        ))}
        <a
          className="gallery-join [position:relative] [display:flex] [overflow:hidden] [border-radius:17px] [background:radial-gradient(circle_at_100%_0%,#244f31,#0e301e_66%)] [color:#fff] [flex-direction:column] [align-items:flex-start] [padding:24px_20px] [&_strong]:[margin-top:12px] [&_strong]:[font-size:22px] [&_strong]:[line-height:1.2] [&_strong]:[font-weight:700] [&_strong]:[letter-spacing:-.055em] [&_.arrow-circle]:[margin-top:auto] [&_.arrow-circle]:[width:35px] [&_.arrow-circle]:[height:35px] [&_small]:[position:absolute] [&_small]:[bottom:27px] [&_small]:[right:17px] [&_small]:[max-width:105px] [&_small]:[font-size:11px] [&_small]:[font-weight:650] [&_small]:[text-align:right] [&_small]:[line-height:1.25] max-[970px]:[grid-column:span_2] max-[720px]:[grid-column:1/-1] max-[720px]:[height:145px] max-[720px]:[padding:18px_19px] max-[720px]:[border-radius:13px] max-[720px]:[&_strong]:[font-size:21px] max-[720px]:[&_strong]:[margin-top:6px] max-[720px]:[&_.arrow-circle]:[position:absolute] max-[720px]:[&_.arrow-circle]:[right:17px] max-[720px]:[&_.arrow-circle]:[top:18px] max-[720px]:[&_.arrow-circle]:[width:36px] max-[720px]:[&_.arrow-circle]:[height:36px] max-[720px]:[&_small]:[right:17px] max-[720px]:[&_small]:[bottom:13px] max-[720px]:[&_small]:[max-width:none]"
          href={business.mapHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <UsersRound aria-hidden="true" size={26} strokeWidth={1.6} />
          <strong>
            Visit our
            <br />
            Mulund shop
          </strong>
          <span
            aria-hidden="true"
            className="arrow-circle [display:inline-flex] [align-items:center] [justify-content:center] [width:37px] [height:37px] [border-radius:50%] [background:#fff] [color:#152319] [flex:0_0_auto]"
          >
            <ArrowUpRight size={19} />
          </span>
          <small>Goshala Road, Mumbai</small>
        </a>
      </div>
    </section>
  );
}
