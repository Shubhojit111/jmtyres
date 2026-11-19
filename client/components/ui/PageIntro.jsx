/* Shared subpage cover in the original J.M. website's green/white visual language. */
import Assets from "@/assets/Assets";
import PillLink from "@/components/ui/PillLink";
import SectionTag from "@/components/ui/SectionTag";

export default function PageIntro({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  action,
  actionHref,
  compact = false,
}) {
  return (
    <header
      className={`page-hero [display:grid] [grid-template-columns:1.08fr_.92fr] [min-height:440px] [overflow:hidden] [margin:20px_16px_0] [border-radius:22px] [background:#edf3ed] [&_h1]:[max-width:700px] [&_h1]:[margin:22px_0_0] [&_h1]:[font-size:clamp(41px,4.8vw,68px)] [&_h1]:[line-height:1.02] [&_h1]:[letter-spacing:-.079em] [&_h1]:[font-weight:800] [&_p]:[max-width:565px] [&_p]:[margin:19px_0_0] [&_p]:[color:#3d5444] [&_p]:[font-size:16px] [&_p]:[line-height:1.5] [&_p]:[font-weight:570] [&_.pill-button]:[margin-top:29px] [&>img]:[width:100%] [&>img]:[height:100%] [&>img]:[min-height:440px] [&>img]:[object-fit:cover] max-[1200px]:[&_h1]:[font-size:clamp(40px,4.5vw,62px)] max-[1080px]:[min-height:400px] max-[1080px]:[&>img]:[min-height:400px] max-[720px]:[grid-template-columns:1fr] max-[720px]:[min-height:0] max-[720px]:[margin:12px_9px_0] max-[720px]:[border-radius:16px] max-[720px]:[&_h1]:[margin-top:17px] max-[720px]:[&_h1]:[font-size:clamp(36px,10vw,46px)] max-[720px]:[&_p]:[margin-top:15px] max-[720px]:[&_p]:[font-size:13px] max-[720px]:[&>img]:[height:220px] max-[720px]:[&>img]:[min-height:0] ${compact ? "min-[721px]:![height:370px] min-[721px]:![min-height:0] min-[721px]:![grid-template-rows:minmax(0,1fr)] min-[721px]:[&>img]:![min-height:0] max-[720px]:[&>img]:![height:180px]" : ""}`}
    >
      <div className="page-hero-copy flex flex-col items-start justify-center p-[clamp(29px,4.2vw,68px)] max-[720px]:py-[27px] max-[720px]:px-[23px]">
        <SectionTag>{eyebrow}</SectionTag>
        <h1>{title}</h1>
        <p>{description}</p>
        {action && (
          <PillLink external={actionHref?.startsWith("http")} href={actionHref}>
            {action}
          </PillLink>
        )}
      </div>
      <img
        alt={imageAlt}
        height="750"
        loading="eager"
        src={Assets[image]}
        width="1000"
      />
    </header>
  );
}
