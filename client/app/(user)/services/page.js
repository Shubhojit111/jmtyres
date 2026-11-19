import {
  ArrowUpRight,
  CircleCheck,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import Assets from "@/assets/Assets";
import PageIntro from "@/components/ui/PageIntro";
import ServiceBrands from "@/components/sections/ServiceBrands";
import PageEnd from "@/components/ui/PageEnd";
import InfoSteps from "@/components/ui/InfoSteps";
import SectionTag from "@/components/ui/SectionTag";
import { servicePages } from "@/lib/data/servicePages";
import { getBrands } from "@/lib/backend";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tyre & Wheel Services in Mulund West | J.M. Tyre Services",
  description:
    "Explore tyre fitting, puncture help, wheel alignment and balancing at J.M. Tyre Services in Mulund West. Confirm services, pricing and visit timing directly with the shop.",
};

export default async function ServicesIndex() {
  const listedBrands = await getBrands();
  return (
    <div className="content-page [min-width:0]">
      <PageIntro
        eyebrow="The J.M. service desk"
        title="Practical care for every journey."
        description="From choosing new tyres to questions about alignment or a puncture, start with the service you need. We will help you ask the right questions before visiting."
        image="WorkshopFitting"
        imageAlt="Illustrative photo of tyre fitting; not J.M. staff or equipment"
        action="Talk about your tyres"
        actionHref="/find-tyres"
      />
      <section
        className="page-block [margin:56px_32px_0] max-[720px]:[margin:34px_16px_0]"
        id="services-list"
      >
        <div className="page-block-intro [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:30px] [margin-bottom:23px] [&_h2]:[max-width:750px] [&_h2]:[margin:17px_0_0] [&_h2]:[font-size:clamp(29px,3.3vw,45px)] [&_h2]:[line-height:1.08] [&_h2]:[letter-spacing:-.075em] [&_h2]:[font-weight:800] [&_p]:[max-width:380px] [&_p]:[margin:0] [&_p]:[color:#536456] [&_p]:[font-size:13px] [&_p]:[line-height:1.55] max-[720px]:[align-items:flex-start] max-[720px]:[flex-direction:column] max-[720px]:[gap:9px] max-[720px]:[&_h2]:[margin-top:12px] max-[720px]:[&_h2]:[font-size:29px] max-[720px]:[&_p]:[font-size:12px]">
          <div>
            <SectionTag>Our services</SectionTag>
            <h2>Four clear ways we can help.</h2>
          </div>
          <p>
            Read the useful checks, then speak with the Mulund team to confirm
            the right work for your vehicle.
          </p>
        </div>
        <div className="service-index-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:18px] max-[720px]:[grid-template-columns:1fr]">
          {servicePages.map((service, index) => (
            <article
              className="service-index-card [display:grid] [grid-template-columns:39%_minmax(0,1fr)] [min-height:250px] [overflow:hidden] [border:1px_solid_#e4ebe3] [border-radius:17px] [background:#f8faf7] [&>img]:[width:100%] [&>img]:[height:100%] [&>img]:[object-fit:cover] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[padding:23px] [&_small]:[color:#387149] [&_small]:[font-size:10px] [&_small]:[font-weight:800] [&_small]:[letter-spacing:.1em] [&_h3]:[margin:12px_0] [&_h3]:[font-size:23px] [&_h3]:[line-height:1.1] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516655] [&_p]:[font-size:12.5px] [&_p]:[line-height:1.5] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[width:fit-content] [&_a]:[margin-top:auto] [&_a]:[padding-top:20px] [&_a]:[color:#25563a] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:3px] max-[1200px]:[grid-template-columns:38%_1fr] max-[1080px]:[grid-template-columns:1fr] max-[1080px]:[&>img]:[height:170px] max-[720px]:[grid-template-columns:39%_1fr] max-[720px]:[min-height:215px] max-[720px]:[&>img]:[height:100%] max-[720px]:[&>div]:[padding:15px] max-[720px]:[&_h3]:[font-size:18px] max-[720px]:[&_p]:[font-size:11px] max-[390px]:[grid-template-columns:1fr] max-[390px]:[&>img]:[height:160px]"
              key={service.slug}
            >
              <img
                alt={service.imageAlt}
                height="300"
                loading="lazy"
                src={Assets[service.image]}
                width="400"
              />
              <div>
                <small>0{index + 1} / TYRE &amp; WHEEL CARE</small>
                <h3>
                  {index === 0
                    ? "New tyres & fitting"
                    : index === 1
                      ? "Puncture help"
                      : index === 2
                        ? "Wheel alignment"
                        : "Wheel balancing"}
                </h3>
                <p>{service.intro}</p>
                <a href={`/services/${service.slug}`}>
                  Explore service <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ServiceBrands brands={listedBrands} />
      <section
        aria-label="How we approach service enquiries"
        className="page-block page-three-grid [margin:56px_32px_0] max-[720px]:[margin:34px_16px_0] [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:15px] max-[970px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[grid-template-columns:1fr]"
      >
        <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
          <ScanSearch aria-hidden="true" size={28} />
          <h3>Start with the vehicle</h3>
          <p>
            Share the make, model, tyre size and the issue you notice. A
            sidewall photo can help if you are unsure.
          </p>
        </div>
        <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
          <ShieldCheck aria-hidden="true" size={28} />
          <h3>Ask what is appropriate</h3>
          <p>
            Repairability and the work a vehicle needs should be assessed by the
            shop, not promised by a webpage.
          </p>
        </div>
        <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
          <CircleCheck aria-hidden="true" size={28} />
          <h3>Confirm the total</h3>
          <p>
            Check availability, scope, fitted price and when the team can help
            before you travel.
          </p>
        </div>
      </section>
      <InfoSteps
        dark
        eyebrow="When to ask"
        title="Notice a change? Tell us what you feel."
        description="These are conversation starters, not remote diagnoses. A technician needs to inspect the tyre and vehicle before recommending work."
        items={[
          {
            title: "Uneven tread wear",
            copy: "Ask whether an alignment check is appropriate. A shop inspection can also reveal wear or other issues that alignment alone will not fix.",
            href: "/services/wheel-alignment",
            link: "About alignment",
          },
          {
            title: "Steering vibration",
            copy: "Wheel balancing may be worth discussing, but vibration has more than one possible cause. Describe when and where you feel it.",
            href: "/services/wheel-balancing",
            link: "About balancing",
          },
          {
            title: "Pressure keeps dropping",
            copy: "A puncture may or may not be safely repairable. Avoid driving on a visibly flat tyre; call and explain what happened.",
            href: "/services/puncture-repair",
            link: "About puncture help",
          },
        ]}
      />
      <PageEnd
        title="Not sure which service to choose?"
        description="Send the team a short description of what you drive and what feels wrong. They can advise what to check next."
        href="/contact"
        action="Contact J.M."
      />
      <p className="page-disclaimer [margin:16px_32px] [color:#657568] [font-size:11px] [line-height:1.5] max-[720px]:[margin:13px_16px]">
        Specialist services or particular machines advertised by other
        businesses are not represented as J.M. services here. Confirm the shop’s
        current capabilities directly.
      </p>
    </div>
  );
}
