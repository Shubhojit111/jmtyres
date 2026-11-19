import {
  ArrowUpRight,
  CircleCheck,
  MessageCircle,
  ScanSearch,
} from "lucide-react";
import PageIntro from "@/components/ui/PageIntro";
import PageEnd from "@/components/ui/PageEnd";
import SectionTag from "@/components/ui/SectionTag";
import TyreFinder from "@/components/sections/TyreFinder";
import TyreSizeGuide from "@/components/sections/TyreSizeGuide";
export const metadata = {
  title: "Find Tyres by Size or Verified Vehicle Match | J.M. Tyres",
  description:
    "Search current tyre products by width, profile and rim diameter, or use staff-entered vehicle compatibility records. No guessed fitment.",
};
export default function FindTyresPage() {
  return (
    <div className="content-page [min-width:0]">
      <PageIntro
        eyebrow="Find tyres · Mulund West"
        title="Your next tyre starts here."
        description="Search actual product records by tyre size or staff-entered vehicle compatibility. Check the listing, then ask the owner to confirm final suitability."
        image="PassengerSedan"
        imageAlt="Illustrative passenger vehicle, not a product match"
        action="Start the tyre finder"
        actionHref="#find-tyres"
      />
      <TyreFinder dedicated />
      <TyreSizeGuide />
      <section
        className="page-block [margin:56px_32px_0] max-[720px]:[margin:34px_16px_0]"
        id="how-finder-works"
      >
        <div className="page-block-intro [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:30px] [margin-bottom:23px] [&_h2]:[max-width:750px] [&_h2]:[margin:17px_0_0] [&_h2]:[font-size:clamp(29px,3.3vw,45px)] [&_h2]:[line-height:1.08] [&_h2]:[letter-spacing:-.075em] [&_h2]:[font-weight:800] [&_p]:[max-width:380px] [&_p]:[margin:0] [&_p]:[color:#536456] [&_p]:[font-size:13px] [&_p]:[line-height:1.55] max-[720px]:[align-items:flex-start] max-[720px]:[flex-direction:column] max-[720px]:[gap:9px] max-[720px]:[&_h2]:[margin-top:12px] max-[720px]:[&_h2]:[font-size:29px] max-[720px]:[&_p]:[font-size:12px]">
          <div>
            <SectionTag>How it works</SectionTag>
            <h2>A useful start, not a guessed result.</h2>
          </div>
          <p>
            Tyre-size results come from database records. Vehicle results appear
            only for compatibility mappings explicitly entered by staff.
          </p>
        </div>
        <div className="page-three-grid [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:15px] max-[970px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[grid-template-columns:1fr]">
          <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
            <ScanSearch aria-hidden="true" size={28} />
            <h3>01 / Read the sidewall</h3>
            <p>
              Enter width, profile and rim diameter—for example 205/55 R16. The
              sample code is not a fitment recommendation.
            </p>
          </div>
          <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
            <CircleCheck aria-hidden="true" size={28} />
            <h3>02 / See real records</h3>
            <p>
              Search returns matching database listings, prices and available
              quantities. DEMO records are explicitly marked as fictional
              examples.
            </p>
          </div>
          <div className="page-card [min-width:0] [padding:25px] [border:1px_solid_#e7ede5] [border-radius:17px] [background:#f8faf7] [&_svg]:[color:#2a6942] [&_h3]:[margin:17px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[line-height:1.12] [&_h3]:[letter-spacing:-.06em] [&_h3]:[font-weight:800] [&_p]:[margin:0] [&_p]:[color:#516354] [&_p]:[font-size:13px] [&_p]:[line-height:1.53] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[margin-top:18px] [&_a]:[color:#245a37] [&_a]:[font-size:12px] [&_a]:[font-weight:800] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:4px] max-[720px]:[padding:20px]">
            <MessageCircle aria-hidden="true" size={28} />
            <h3>03 / Confirm with the shop</h3>
            <p>
              Match vehicle model and variant only when staff have entered them,
              and confirm the full fitted quote and suitability directly.
            </p>
          </div>
        </div>
      </section>
      <section className="page-block rounded-[18px] bg-[#eef5ec] p-6 sm:p-9 [margin:56px_32px_0] max-[720px]:[margin:34px_16px_0]">
        <SectionTag>Finder questions</SectionTag>
        <h2 className="mt-4 text-[28px] font-extrabold tracking-[-.07em]">
          Before you choose.
        </h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <details className="rounded-xl bg-white p-4 text-[13px]">
            <summary className="cursor-pointer font-extrabold">
              Why did my vehicle search find nothing?
            </summary>
            <p className="mt-3 text-[#54705a]">
              No verified make/model/variant/year mapping may be entered yet.
              Try the size printed on the sidewall or ask the owner; the site
              never guesses fitment.
            </p>
          </details>
          <details className="rounded-xl bg-white p-4 text-[13px]">
            <summary className="cursor-pointer font-extrabold">
              Does a matching size guarantee fitment?
            </summary>
            <p className="mt-3 text-[#54705a]">
              No. Check the full vehicle specification, load and speed ratings
              and the shop’s guidance before purchasing.
            </p>
          </details>
        </div>
        <a
          className="mt-6 inline-flex items-center gap-2 text-[12px] font-extrabold text-[#2b6240] underline"
          href="/catalogue"
        >
          Browse every listing <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </section>
      <PageEnd
        title="Already know your tyre size?"
        description="Enter the exact sidewall code above or browse the catalogue. Call the owner if there is no suitable result."
        href="/catalogue"
        action="Browse catalogue"
      />
    </div>
  );
}
