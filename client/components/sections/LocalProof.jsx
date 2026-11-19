/* LocalProof.jsx — practical, checkable proof directly after the visual cover. */
import { ArrowUpRight, Phone, Star } from "lucide-react";
import Assets from "@/assets/Assets";
import { business } from "@/lib/data/business";

export default function LocalProof() {
  return (
    <aside
      aria-label="Find and verify J.M. Tyre Services"
      className="local-proof mx-4 mt-[18px] grid max-w-7xl grid-cols-[1.22fr_1fr_1fr] gap-[13px] sm:mx-6 md:mx-auto md:px-6 max-[970px]:grid-cols-2 max-[720px]:mx-[9px] max-[720px]:mt-3 max-[720px]:grid-cols-1 max-[720px]:gap-[9px]"
    >
      <a
        className="local-proof-item local-proof-shop"
        href={business.mapHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          alt="Photograph of the J.M. Tyre Services shop sign in Mulund West"
          height="70"
          loading="eager"
          src={Assets.Storefront}
          width="82"
        />
        <span>
          <strong>Find our Mulund shop</strong>
          <small>Goshala Road · opposite Aishwarya Tower</small>
        </span>
        <ArrowUpRight aria-hidden="true" size={17} />
      </a>
      <a
        className="local-proof-item"
        href={business.mapHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className="local-proof-icon">
          <Star size={20} strokeWidth={1.9} />
        </span>
        <span>
          <strong>Google customer reviews</strong>
          <small>See the latest feedback on Maps</small>
        </span>
        <ArrowUpRight aria-hidden="true" size={17} />
      </a>
      <a className="local-proof-item" href={business.phoneHref}>
        <span aria-hidden="true" className="local-proof-icon">
          <Phone size={20} strokeWidth={1.9} />
        </span>
        <span>
          <strong>Need help today?</strong>
          <small>Call {business.phoneDisplay}</small>
        </span>
        <ArrowUpRight aria-hidden="true" size={17} />
      </a>
    </aside>
  );
}
