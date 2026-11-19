/* TyreCare.jsx — two contrasted care programmes with enquiry CTAs, no false booking flow. */
import { Check, Crown, Flower2 } from "lucide-react";
import Assets from "@/assets/Assets";
import PillLink from "@/components/ui/PillLink";
import SectionTag from "@/components/ui/SectionTag";
import { business } from "@/lib/data/business";
import { careOptions } from "@/lib/data/services";

export default function TyreCare() {
  const [essential, complete] = careOptions;
  return (
    <section
      className="care-section section-inset [margin-top:42px] [padding-top:28px] [padding-bottom:12px] [border-top:1px_solid_#e9ebe8] max-[720px]:[margin-top:35px] max-[720px]:[padding-top:23px] max-[720px]:[padding-bottom:0] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]"
      id="care"
    >
      <div className="care-heading [position:relative] [display:flex] [justify-content:center] [height:148px] [text-align:center] [&>.section-tag]:[position:absolute] [&>.section-tag]:[left:0] [&>.section-tag]:[top:0] [&_h2]:[margin:0] [&_h2]:[font-size:32px] [&_h2]:[line-height:1.02] [&_h2]:[letter-spacing:-.07em] [&_h2]:[font-weight:800] [&_p]:[margin:11px_0_0] [&_p]:[font-size:14px] [&_p]:[font-weight:650] max-[720px]:[height:143px] max-[720px]:[padding-top:26px] max-[720px]:[&_h2]:[font-size:27px]">
        <SectionTag>Tyre Care</SectionTag>
        <div>
          <h2>
            The right care
            <br />
            for your wheels.
          </h2>
          <p>Ask what suits your vehicle — no fixed package required.</p>
        </div>
      </div>
      <div className="care-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:26px] [height:388px] max-[720px]:[grid-template-columns:1fr] max-[720px]:[gap:11px] max-[720px]:[height:auto]">
        <div className="care-card care-essential [position:relative] [overflow:hidden] [border-radius:22px] [isolation:isolate] [&_h3]:[margin:13px_0_0] [&_h3]:[font-size:29px] [&_h3]:[line-height:1.08] [&_h3]:[letter-spacing:-.072em] [&_h3]:[font-weight:800] [&_p]:[max-width:270px] [&_p]:[margin:12px_0_0] [&_p]:[font-size:14.5px] [&_p]:[line-height:1.4] [&_p]:[letter-spacing:-.025em] [&_p]:[font-weight:600] [&_ul]:[display:flex] [&_ul]:[flex-direction:column] [&_ul]:[gap:7px] [&_ul]:[padding:0] [&_ul]:[margin:16px_0_0] [&_ul]:[list-style:none] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:9px] [&_li]:[font-size:13.5px] [&_li]:[line-height:1.32] [&_li]:[font-weight:650] [&_li]:[white-space:normal] [&_li_svg]:[flex:0_0_auto] [&_.pill-button]:[margin-top:auto] [&_.pill-button]:[min-height:40px] [&_.pill-button]:[font-size:12px] max-[970px]:[&_h3]:[font-size:25px] max-[970px]:[&_p]:[font-size:12.5px] max-[970px]:[&_li]:[font-size:12.5px] max-[720px]:[height:365px] max-[720px]:[border-radius:16px] max-[720px]:[&_h3]:[font-size:23px] max-[720px]:[&_h3]:[margin-top:10px] max-[720px]:[&_p]:[font-size:11.5px] max-[720px]:[&_p]:[line-height:1.45] max-[720px]:[&_p]:[margin-top:10px] max-[720px]:[&_ul]:[margin-top:15px] max-[720px]:[&_ul]:[gap:8px] max-[720px]:[&_li]:[font-size:10.5px] max-[720px]:[&_li]:[line-height:1.3] max-[720px]:[&_li]:[gap:5px] max-[720px]:[&_li]:[white-space:normal] max-[720px]:[&_li_svg]:[width:13px] max-[720px]:[&_li_svg]:[height:13px] max-[720px]:[&_.pill-button]:[min-height:34px] max-[720px]:[&_.pill-button]:[padding:0_11px] max-[720px]:[&_.pill-button]:[font-size:10px] max-[720px]:[&_.pill-button]:[gap:5px] max-[720px]:[&_.pill-button_svg]:[width:12px] [background:linear-gradient(125deg,#2e5134_0%,#6b986b_75%)] [color:#fff] [&_.care-card-photo]:[object-position:55%_center]">
          <div className="care-card-text [position:relative] [z-index:2] [display:flex] [flex-direction:column] [align-items:flex-start] [width:55%] [height:100%] [padding:29px_20px_22px_29px] max-[970px]:[padding-left:18px] max-[720px]:[width:56%] max-[720px]:[padding:20px_7px_17px_18px] max-[375px]:[width:56%]">
            <Flower2 aria-hidden="true" size={28} strokeWidth={1.6} />
            <h3>{essential.title}</h3>
            <p>{essential.copy}</p>
            <ul>
              {essential.items.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" size={17} strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
            <PillLink href={business.phoneHref} light>
              Call about care
            </PillLink>
          </div>
          <img
            alt="Tyre technician fitting a wheel in a workshop"
            className="care-card-photo [position:absolute] [z-index:1] [right:9px] [top:9px] [bottom:9px] [width:44%] [height:calc(100%_-_18px)] [border-radius:15px] [object-fit:cover] max-[720px]:[width:41%] max-[720px]:[right:7px] max-[720px]:[top:7px] max-[720px]:[height:calc(100%_-_14px)] max-[720px]:[border-radius:11px]"
            loading="lazy"
            src={Assets.WorkshopFitting}
          />
        </div>
        <div className="care-card care-complete [position:relative] [overflow:hidden] [border-radius:22px] [isolation:isolate] [&_h3]:[margin:13px_0_0] [&_h3]:[font-size:29px] [&_h3]:[line-height:1.08] [&_h3]:[letter-spacing:-.072em] [&_h3]:[font-weight:800] [&_p]:[max-width:270px] [&_p]:[margin:12px_0_0] [&_p]:[font-size:14.5px] [&_p]:[line-height:1.4] [&_p]:[letter-spacing:-.025em] [&_p]:[font-weight:600] [&_ul]:[display:flex] [&_ul]:[flex-direction:column] [&_ul]:[gap:7px] [&_ul]:[padding:0] [&_ul]:[margin:16px_0_0] [&_ul]:[list-style:none] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:9px] [&_li]:[font-size:13.5px] [&_li]:[line-height:1.32] [&_li]:[font-weight:650] [&_li]:[white-space:normal] [&_li_svg]:[flex:0_0_auto] [&_.pill-button]:[margin-top:auto] [&_.pill-button]:[min-height:40px] [&_.pill-button]:[font-size:12px] max-[970px]:[&_h3]:[font-size:25px] max-[970px]:[&_p]:[font-size:12.5px] max-[970px]:[&_li]:[font-size:12.5px] max-[720px]:[height:365px] max-[720px]:[border-radius:16px] max-[720px]:[&_h3]:[font-size:23px] max-[720px]:[&_h3]:[margin-top:10px] max-[720px]:[&_p]:[font-size:11.5px] max-[720px]:[&_p]:[line-height:1.45] max-[720px]:[&_p]:[margin-top:10px] max-[720px]:[&_ul]:[margin-top:15px] max-[720px]:[&_ul]:[gap:8px] max-[720px]:[&_li]:[font-size:10.5px] max-[720px]:[&_li]:[line-height:1.3] max-[720px]:[&_li]:[gap:5px] max-[720px]:[&_li]:[white-space:normal] max-[720px]:[&_li_svg]:[width:13px] max-[720px]:[&_li_svg]:[height:13px] max-[720px]:[&_.pill-button]:[min-height:34px] max-[720px]:[&_.pill-button]:[padding:0_11px] max-[720px]:[&_.pill-button]:[font-size:10px] max-[720px]:[&_.pill-button]:[gap:5px] max-[720px]:[&_.pill-button_svg]:[width:12px] [background:#f3f4f1] [color:#161b16] [&_.care-card-photo]:[object-position:25%_center] [&_.care-card-photo]:[filter:saturate(.66)_contrast(1.1)]">
          <div className="care-card-text [position:relative] [z-index:2] [display:flex] [flex-direction:column] [align-items:flex-start] [width:55%] [height:100%] [padding:29px_20px_22px_29px] max-[970px]:[padding-left:18px] max-[720px]:[width:56%] max-[720px]:[padding:20px_7px_17px_18px] max-[375px]:[width:56%]">
            <Crown aria-hidden="true" size={28} strokeWidth={1.6} />
            <h3>{complete.title}</h3>
            <p>{complete.copy}</p>
            <ul>
              {complete.items.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" size={17} strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
            <PillLink href={business.phoneHref}>Call about care</PillLink>
          </div>
          <img
            alt="Stacks of car tyres in a tyre shop"
            className="care-card-photo [position:absolute] [z-index:1] [right:9px] [top:9px] [bottom:9px] [width:44%] [height:calc(100%_-_18px)] [border-radius:15px] [object-fit:cover] max-[720px]:[width:41%] max-[720px]:[right:7px] max-[720px]:[top:7px] max-[720px]:[height:calc(100%_-_14px)] max-[720px]:[border-radius:11px]"
            loading="lazy"
            src={Assets.TireStacks}
          />
        </div>
      </div>
    </section>
  );
}
