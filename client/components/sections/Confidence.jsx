/* Confidence.jsx — panoramic wheel image, circular tyre detail, and three service benefits. */
"use client";
import { CircleGauge, Handshake, ScanSearch } from "lucide-react";
import Assets from "@/assets/Assets";
import useInView from "@/hooks/useInView";

const reasons = [
  {
    title: "The right fit for you",
    copy: "Useful advice for the way you drive and the vehicle you drive.",
    Icon: ScanSearch,
  },
  {
    title: "Wheel care in one stop",
    copy: "Ask about fitting, balancing, alignment, and puncture repair.",
    Icon: CircleGauge,
  },
  {
    title: "Real local support",
    copy: "A neighbourhood shop you can call or visit in Mulund West.",
    Icon: Handshake,
  },
];

export default function Confidence() {
  const [ref, inView] = useInView({ threshold: 0.17 });
  return (
    <section
      className="confidence-section section-inset [margin-top:44px] [&_h2]:[margin:0_0_22px_18px] [&_h2]:[font-size:42px] [&_h2]:[line-height:1.02] [&_h2]:[font-weight:800] [&_h2]:[letter-spacing:-.079em] max-[720px]:[margin-top:29px] max-[720px]:[&_h2]:[margin-left:9px] max-[720px]:[&_h2]:[margin-bottom:17px] max-[720px]:[&_h2]:[font-size:36px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]"
      id="why-jm"
      ref={ref}
    >
      <h2>
        We build confidence
        <br />
        into every mile.
      </h2>
      <div
        className={`confidence-content [display:grid] [grid-template-columns:minmax(0,1.64fr)_170px_minmax(0,1fr)] [align-items:center] [gap:26px] [height:314px] max-[1250px]:[grid-template-columns:minmax(0,1.5fr)_125px_minmax(0,1fr)] max-[1250px]:[gap:15px] max-[720px]:[display:block] max-[720px]:[height:auto] ${inView ? "reveal-in" : ""}`}
      >
        <img
          alt="Large tyre and alloy wheel beside a winding mountain road"
          className="confidence-photo [width:100%] [height:314px] [border-radius:20px] [object-fit:cover] [object-position:46%_center] max-[720px]:[height:235px] max-[720px]:[border-radius:15px] max-[720px]:[object-position:37%_center]"
          height="704"
          loading="lazy"
          src={Assets.ConfidenceWheel}
          width="1504"
        />
        <div
          aria-hidden="true"
          className="confidence-orbit [display:flex] [align-items:center] [justify-content:center] [width:170px] [height:170px] [margin:0_auto] [border:2px_solid_#19432c] ![border-top-color:transparent] ![border-left-color:#dfe6de] [border-radius:50%] [transform:rotate(-24deg)] max-[1250px]:[width:125px] max-[1250px]:[height:125px] max-[720px]:[position:relative] max-[720px]:[width:120px] max-[720px]:[height:120px] max-[720px]:[margin:-62px_15px_15px_auto] max-[720px]:[background:#fff] max-[720px]:[border-width:3px]"
        >
          <div className="confidence-orbit-inner [width:129px] [height:129px] [overflow:hidden] [border:6px_solid_#fff] [border-radius:50%] [background:#e1e2df] [box-shadow:0_0_0_1px_#e5e8e4] [transform:rotate(24deg)] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[object-position:24%_28%] max-[1250px]:[width:98px] max-[1250px]:[height:98px] max-[720px]:[width:95px] max-[720px]:[height:95px] max-[720px]:[border-width:4px]">
            <img alt="" loading="lazy" src={Assets.TireTread} />
          </div>
        </div>
        <div className="confidence-reasons [display:flex] [flex-direction:column] [justify-content:space-between] [gap:22px] [height:314px] [padding:5px_0] max-[720px]:[display:grid] max-[720px]:[grid-template-columns:1fr] max-[720px]:[gap:20px] max-[720px]:[height:auto] max-[720px]:[padding:8px_5px_0]">
          {reasons.map(({ title, copy, Icon }) => (
            <div
              className="confidence-reason [display:grid] [grid-template-columns:52px_minmax(0,1fr)] [gap:18px] [align-items:flex-start] [&_h3]:[margin:0_0_7px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.058em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[font-size:14.5px] [&_p]:[line-height:1.38] [&_p]:[letter-spacing:-.025em] [&_p]:[font-weight:550] max-[720px]:[grid-template-columns:47px_1fr] max-[720px]:[gap:12px] max-[720px]:[&_h3]:[font-size:18px] max-[720px]:[&_p]:[font-size:13px] max-[720px]:[&_p]:[line-height:1.4]"
              key={title}
            >
              <span className="reason-icon [display:inline-flex] [align-items:center] [justify-content:center] [width:48px] [height:48px] [border-radius:13px] [background:#eaf0e5] [color:#1d462d] max-[720px]:[width:42px] max-[720px]:[height:42px]">
                <Icon aria-hidden="true" size={23} strokeWidth={1.8} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
