/* The original two public Google reviews scroll inside the original testimonial area.
 * Duplicates are decorative and the pause button meets moving-content accessibility. */
"use client";
import { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Stars from "@/components/ui/Stars";
import SectionTag from "@/components/ui/SectionTag";
import { business } from "@/lib/data/business";
import { reviews } from "@/lib/data/reviews";

const sectionClass =
  "reviews-section section-inset [display:grid] [grid-template-columns:.68fr_2fr] [gap:20px] [height:260px] [margin-top:42px] max-[970px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[970px]:[height:auto] max-[970px]:[gap:16px] max-[840px]:min-[721px]:[grid-template-columns:1fr] max-[840px]:min-[721px]:[gap:15px] max-[720px]:[grid-template-columns:1fr] max-[720px]:[height:auto] max-[720px]:[gap:14px] max-[720px]:[margin-top:36px] max-[1249px]:min-[971px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[1249px]:min-[971px]:[height:auto] max-[1249px]:min-[971px]:[gap:18px] [margin-left:16px] [margin-right:16px] max-[720px]:[margin-left:9px] max-[720px]:[margin-right:9px]";
const introClass =
  "reviews-intro [display:flex] [flex-direction:column] [align-items:flex-start] [padding:0_0_4px_18px] [&_h2]:[margin:14px_0_0] [&_h2]:[font-size:34px] [&_h2]:[line-height:1.08] [&_h2]:[letter-spacing:-.077em] [&_h2]:[font-weight:800] [&>a]:[display:inline-flex] [&>a]:[align-items:center] [&>a]:[gap:5px] [&>a]:[margin-top:auto] [&>a]:[color:#3e5c40] [&>a]:[font-size:12px] [&>a]:[font-weight:800] max-[970px]:[grid-column:1/-1] max-[970px]:[min-height:104px] max-[970px]:[padding-left:7px] max-[970px]:[&_h2_br]:[display:none] max-[840px]:min-[721px]:[grid-column:1] max-[840px]:min-[721px]:[min-height:105px] max-[720px]:[min-height:155px] max-[720px]:[padding-left:8px] max-[720px]:[&_h2]:[font-size:31px] max-[720px]:[&_h2_br]:[display:none] max-[720px]:[&>a]:[margin-top:12px] max-[1249px]:min-[971px]:[grid-column:1/-1] max-[1249px]:min-[971px]:[min-height:115px] max-[1249px]:min-[971px]:[&_h2_br]:[display:none]";
const cardClass =
  "review-card [position:relative] [min-width:0] [height:100%] [padding:25px_24px_21px] [border:1px_solid_#f0f1ed] [border-radius:20px] [background:#fff] [box-shadow:0_5px_25px_rgba(12,30,17,.045)] [&>p]:[display:-webkit-box] [&>p]:[overflow:hidden] [&>p]:[-webkit-box-orient:vertical] [&>p]:[-webkit-line-clamp:6] [&>p]:[margin:8px_0_0_49px] [&>p]:[font-size:14.5px] [&>p]:[line-height:1.4] [&>p]:[letter-spacing:-.02em] [&>p]:[font-weight:600] max-[970px]:[height:285px] max-[970px]:[&>p]:[-webkit-line-clamp:7] max-[840px]:min-[721px]:[height:225px] max-[720px]:[min-height:255px] max-[720px]:[height:auto] max-[720px]:[padding:21px_21px_88px] max-[720px]:[border-radius:15px] max-[720px]:[&>p]:[display:block] max-[720px]:[&>p]:[overflow:visible] max-[720px]:[&>p]:[margin-left:42px] max-[720px]:[&>p]:[font-size:13px] max-[720px]:[&>p]:[line-height:1.42] max-[720px]:[&>p]:[-webkit-line-clamp:unset] max-[1249px]:min-[971px]:[height:285px] max-[1249px]:min-[971px]:[&>p]:[-webkit-line-clamp:7] [flex:0_0_auto] [width:calc((100cqw_-_20px)/2)] max-[840px]:[width:100cqw] max-[720px]:![height:100%]";
const personClass =
  "review-person [position:absolute] [left:73px] [right:22px] [bottom:21px] [display:flex] [align-items:center] [gap:10px] [&>span:nth-child(2)]:[display:flex] [&>span:nth-child(2)]:[flex-direction:column] [&>span:nth-child(2)]:[gap:1px] [&>span:nth-child(2)]:[min-width:0] [&_strong]:[font-size:11.5px] [&_strong]:[line-height:1.15] [&_strong]:[white-space:nowrap] [&_strong]:[font-weight:800] [&_small]:[font-size:10px] [&_small]:[white-space:nowrap] [&_small]:[color:#7b857d] [&_.stars]:[margin-left:auto] max-[720px]:[left:64px] max-[720px]:[right:15px] max-[720px]:[bottom:16px] max-[375px]:[left:52px] max-[375px]:[right:10px] max-[375px]:[gap:6px] max-[375px]:[&_strong]:[font-size:10px] max-[375px]:[&_small]:[font-size:8.5px] max-[375px]:[&_.stars]:[gap:0] max-[375px]:[&_.stars_svg]:[width:9px] max-[375px]:[&_.stars_svg]:[height:9px]";
const quoteClass =
  "review-quote-mark [position:absolute] [left:23px] [top:15px] [color:#50734e] [font-family:Georgia,serif] [font-size:66px] [font-weight:800] [line-height:1]";
const avatarClass =
  "review-avatar [display:inline-flex] [align-items:center] [justify-content:center] [width:37px] [height:37px] [border-radius:50%] [background:#dfebe1] [color:#1c432a] [font-size:11px] [font-weight:800] [flex:0_0_auto] max-[375px]:[width:30px] max-[375px]:[height:30px] max-[375px]:[font-size:9px]";

function ReviewCard({ review }) {
  return (
    <article className={cardClass}>
      <span aria-hidden="true" className={quoteClass}>
        “
      </span>
      <p>“{review.quote}”</p>
      <div className={personClass}>
        <span aria-hidden="true" className={avatarClass}>
          {review.initials}
        </span>
        <span>
          <strong>{review.author}</strong>
          <small>{review.context}</small>
        </span>
        <Stars />
      </div>
    </article>
  );
}

export default function Testimonials() {
  const [playing, setPlaying] = useState(true);
  return (
    <section className={sectionClass} id="reviews">
      <div className={introClass}>
        <SectionTag>Testimonials</SectionTag>
        <h2>
          Trusted by <br />
          drivers across <br />
          Mumbai.
        </h2>
        <a href={business.mapHref} rel="noopener noreferrer" target="_blank">
          See latest Google reviews{" "}
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
        <small className="reviews-snapshot [margin-top:5px] [color:#6d7d71] [font-size:9.5px] [line-height:1.25] [font-weight:650] max-[720px]:[font-size:9px]">
          Snapshot: {business.rating} / 5 · {business.reviewCount} reviews ·{" "}
          {business.verifiedAt}
        </small>
        <button
          aria-pressed={!playing}
          className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#d5e4d3] px-3 py-1 text-[10px] font-extrabold text-[#315c3d] hover:bg-[#eff5ee] motion-reduce:hidden"
          onClick={() => setPlaying((value) => !value)}
          type="button"
        >
          {playing ? (
            <Pause aria-hidden="true" size={11} />
          ) : (
            <Play aria-hidden="true" size={11} />
          )}
          {playing ? "Pause moving reviews" : "Resume moving reviews"}
        </button>
      </div>
      <div
        aria-label="Customer review excerpts"
        className="reviews-viewport [grid-column:2] [height:260px] [min-width:0] [overflow:hidden] [container-type:inline-size] max-[1249px]:[grid-column:1/-1] max-[1249px]:[height:285px] max-[840px]:[height:225px] max-[720px]:[grid-column:1] max-[720px]:[height:300px]"
        role="group"
      >
        <div
          className={`reviews-track flex h-full w-max ${playing ? "" : "is-paused"}`}
        >
          <div className="reviews-set flex h-full flex-none gap-5 pr-5">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="reviews-set flex h-full flex-none gap-5 pr-5"
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
