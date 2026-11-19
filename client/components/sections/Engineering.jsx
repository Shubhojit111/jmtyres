/* Engineering.jsx — interactive service tabs and the reference's one-large/two-small workshop layout. */
"use client";
import { CircleCheck, Layers3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Assets from "@/assets/Assets";
import PillLink from "@/components/ui/PillLink";
import { serviceTabs } from "@/lib/data/services";

export default function Engineering() {
  const [activeId, setActiveId] = useState(serviceTabs[0].id);
  const active = serviceTabs.find((item) => item.id === activeId);

  return (
    <section
      className="engineering-section section-inset [margin-top:48px] [padding-top:24px] [border-top:1px_solid_#e9eae8] max-[720px]:[margin-top:30px] max-[720px]:[padding-top:23px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]"
      id="technology"
    >
      <div className="engineering-heading [display:flex] [justify-content:space-between] [align-items:flex-start] [height:170px] [&_h2]:[width:438px] [&_h2]:[margin:0] [&_h2]:[font-size:44px] [&_h2]:[font-weight:800] [&_h2]:[letter-spacing:-.083em] [&_h2]:[line-height:.99] max-[1250px]:[&_h2]:[width:39%] max-[970px]:[&_h2]:[font-size:39px] max-[720px]:[display:flex] max-[720px]:[flex-direction:column] max-[720px]:[height:auto] max-[720px]:[gap:21px] max-[720px]:[&_h2]:[width:100%] max-[720px]:[&_h2]:[font-size:38px]">
        <div className="engineering-heading-left [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:42px] [width:58%] [padding:14px_12px_0_12px] max-[1250px]:[width:60%] max-[720px]:[width:100%] max-[720px]:[align-items:center] max-[720px]:[gap:8px] max-[720px]:[padding:0_3px]">
          <span
            aria-hidden="true"
            className="engineering-emblem [display:inline-flex] [align-items:center] [justify-content:center] [width:56px] [height:56px] [border-radius:50%] [background:#0d3220] [color:#fff] [flex:0_0_auto] max-[720px]:[width:45px] max-[720px]:[height:45px]"
          >
            <Layers3 size={23} strokeWidth={1.6} />
          </span>
          <div
            aria-label="Explore our services"
            className="engineering-tabs [display:flex] [align-items:center] [gap:6px] [padding-top:16px] [&_button]:[height:31px] [&_button]:[padding:0_13px] [&_button]:[border:1px_solid_#cfd5cb] [&_button]:[border-radius:999px] [&_button]:[background:#fff] [&_button]:[color:#1c251d] [&_button]:[font-size:11px] [&_button]:[font-weight:750] [&_button]:[white-space:nowrap] [&_button]:[transition:color_.2s_ease,_background_.2s_ease] [&_button:hover]:[background:#edf3e9] [&_button.active]:[background:#476a47] [&_button.active]:[color:#fff] [&_button.active]:[border-color:#476a47] max-[970px]:[gap:3px] max-[970px]:[&_button]:[padding:0_8px] max-[970px]:[&_button]:[font-size:10px] max-[720px]:[padding-top:0] max-[720px]:[gap:3px] max-[720px]:[&_button]:[font-size:9px] max-[720px]:[&_button]:[padding:0_7px] max-[720px]:[&_button]:[height:27px] max-[375px]:[&_button]:[font-size:8px] max-[375px]:[&_button]:[padding:0_5px]"
            role="tablist"
          >
            {serviceTabs.map((item, index) => (
              <button
                aria-controls="engineering-panel"
                aria-selected={activeId === item.id}
                className={activeId === item.id ? "active" : ""}
                id={`service-tab-${item.id}`}
                key={item.id}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => {
                  const offset =
                    event.key === "ArrowRight"
                      ? 1
                      : event.key === "ArrowLeft"
                        ? -1
                        : 0;
                  if (!offset) return;
                  event.preventDefault();
                  const next =
                    serviceTabs[
                      (index + offset + serviceTabs.length) % serviceTabs.length
                    ];
                  setActiveId(next.id);
                  document.getElementById(`service-tab-${next.id}`)?.focus();
                }}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <h2>
          Expert care for
          <br />
          every road,
          <br />
          every condition.
        </h2>
      </div>
      <div
        aria-labelledby={`service-tab-${active.id}`}
        className="engineering-content [display:grid] [grid-template-columns:minmax(0,1.32fr)_minmax(0,1fr)] [gap:26px] [height:390px] [grid-template-rows:minmax(0,1fr)] [margin-top:22px] max-[720px]:[display:block] max-[720px]:[height:auto] max-[720px]:[margin-top:21px]"
        id="engineering-panel"
        role="tabpanel"
      >
        <div className="engineering-story [display:flex] [min-height:0] [gap:26px] [align-items:stretch] [overflow:hidden] [padding:14px] [border-radius:20px] [background:linear-gradient(135deg,#315d3d_0%,#6d906e_62%,#35583b_100%)] [color:#fff] [&>img]:[width:47%] [&>img]:[height:100%] [&>img]:[min-height:0] [&>img]:[border-radius:14px] [&>img]:[object-fit:cover] [&>img]:[object-position:41%_center] [&_h3]:[max-width:340px] [&_h3]:[margin:9px_0_0] [&_h3]:[font-size:28px] [&_h3]:[line-height:1.1] [&_h3]:[letter-spacing:-.068em] [&_h3]:[font-weight:700] [&_p]:[max-width:310px] [&_p]:[margin:14px_0_0] [&_p]:[font-size:13px] [&_p]:[line-height:1.47] [&_p]:[letter-spacing:-.025em] [&_p]:[font-weight:600] [&_.story-cta]:[margin-top:auto] max-[970px]:[&_h3]:[font-size:23px] max-[720px]:[height:345px] max-[720px]:[gap:11px] max-[720px]:[padding:9px] max-[720px]:[border-radius:16px] max-[720px]:[&>img]:[width:43%] max-[720px]:[&>img]:[height:100%] max-[720px]:[&>img]:[border-radius:11px] max-[720px]:[&>img]:[object-position:41%_center] max-[720px]:[&_h3]:[font-size:21px] max-[720px]:[&_p]:[font-size:10px] max-[720px]:[&_p]:[line-height:1.35] max-[720px]:[&_p]:[margin-top:12px] max-[720px]:[&_.pill-button]:[min-height:30px] max-[720px]:[&_.pill-button]:[gap:6px] max-[720px]:[&_.pill-button]:[padding:0_9px] max-[720px]:[&_.pill-button]:[font-size:9px] max-[720px]:[&_.pill-button_svg]:[width:12px]">
          <img
            alt={active.imageAlt}
            height="896"
            loading="lazy"
            src={Assets[active.image]}
            width="1200"
          />
          <div className="engineering-story-copy [min-width:0] [display:flex] [flex-direction:column] [align-items:flex-start] [padding:17px_8px_4px_0] max-[720px]:[padding:14px_0_5px]">
            <span className="story-eyebrow [font-size:10px] [letter-spacing:.14em] [font-weight:800] [color:rgba(255,255,255,.76)]">
              THE JM WAY
            </span>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
            <PillLink
              className="story-cta"
              href={`/services/${active.id === "fitting" ? "new-tyres" : `wheel-${active.id}`}`}
              light
            >
              Explore this service
            </PillLink>
          </div>
        </div>
        <div className="engineering-details [display:grid] [min-height:0] [grid-template-rows:repeat(2,minmax(0,1fr))] [gap:16px] max-[720px]:[display:grid] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:![grid-template-rows:auto] max-[720px]:[gap:10px] max-[720px]:[margin-top:13px]">
          <div className="engineering-detail [display:grid] [grid-template-columns:43%_minmax(0,1fr)] [gap:22px] [min-height:0] [&>img]:[width:100%] [&>img]:[height:100%] [&>img]:[min-height:0] [&>img]:[border-radius:16px] [&>img]:[object-fit:cover] [&:last-child>img]:[object-position:40%_20%] [&>div]:[padding-top:2px] [&_svg]:[color:#19251a] [&_svg]:[margin-bottom:10px] [&_h3]:[margin:0_0_7px] [&_h3]:[font-size:18px] [&_h3]:[line-height:1.12] [&_h3]:[font-weight:800] [&_h3]:[letter-spacing:-.052em] [&_p]:[margin:0] [&_p]:[font-size:13px] [&_p]:[line-height:1.28] [&_p]:[font-weight:550] [&_p]:[letter-spacing:-.035em] max-[970px]:[grid-template-columns:40%_minmax(0,1fr)] max-[970px]:[gap:13px] max-[970px]:[&_h3]:[font-size:15px] max-[970px]:[&_p]:[font-size:11px] max-[720px]:[display:block] max-[720px]:[&>img]:[width:100%] max-[720px]:[&>img]:[height:130px] max-[720px]:[&>img]:[border-radius:11px] max-[720px]:[&>div]:[padding:8px_2px] max-[720px]:[&_svg]:[width:18px] max-[720px]:[&_svg]:[height:18px] max-[720px]:[&_svg]:[margin-bottom:5px] max-[720px]:[&_h3]:[font-size:13px] max-[720px]:[&_p]:[font-size:10px]">
            <img
              alt="Tyre specialist examining tread in a workshop"
              loading="lazy"
              src={Assets.InspectionWorkshop}
            />
            <div>
              <ShieldCheck aria-hidden="true" size={25} strokeWidth={1.9} />
              <h3>{active.benefitOne}</h3>
              <p>{active.benefitOneCopy}</p>
            </div>
          </div>
          <div className="engineering-detail [display:grid] [grid-template-columns:43%_minmax(0,1fr)] [gap:22px] [min-height:0] [&>img]:[width:100%] [&>img]:[height:100%] [&>img]:[min-height:0] [&>img]:[border-radius:16px] [&>img]:[object-fit:cover] [&:last-child>img]:[object-position:40%_20%] [&>div]:[padding-top:2px] [&_svg]:[color:#19251a] [&_svg]:[margin-bottom:10px] [&_h3]:[margin:0_0_7px] [&_h3]:[font-size:18px] [&_h3]:[line-height:1.12] [&_h3]:[font-weight:800] [&_h3]:[letter-spacing:-.052em] [&_p]:[margin:0] [&_p]:[font-size:13px] [&_p]:[line-height:1.28] [&_p]:[font-weight:550] [&_p]:[letter-spacing:-.035em] max-[970px]:[grid-template-columns:40%_minmax(0,1fr)] max-[970px]:[gap:13px] max-[970px]:[&_h3]:[font-size:15px] max-[970px]:[&_p]:[font-size:11px] max-[720px]:[display:block] max-[720px]:[&>img]:[width:100%] max-[720px]:[&>img]:[height:130px] max-[720px]:[&>img]:[border-radius:11px] max-[720px]:[&>div]:[padding:8px_2px] max-[720px]:[&_svg]:[width:18px] max-[720px]:[&_svg]:[height:18px] max-[720px]:[&_svg]:[margin-bottom:5px] max-[720px]:[&_h3]:[font-size:13px] max-[720px]:[&_p]:[font-size:10px]">
            <img
              alt="Close-up of a performance tyre and tread"
              loading="lazy"
              src={Assets.TireTread}
            />
            <div>
              <CircleCheck aria-hidden="true" size={25} strokeWidth={1.9} />
              <h3>{active.benefitTwo}</h3>
              <p>{active.benefitTwoCopy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
