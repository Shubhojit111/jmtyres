import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { business } from "@/lib/data/business";
export default function LocationPanel() {
  return (
    <section
      aria-labelledby="location-heading"
      className="mx-4 mt-12 grid overflow-hidden rounded-[21px] bg-[#eaf1e7] sm:mx-8 lg:grid-cols-[.8fr_1.2fr]"
    >
      <div className="flex flex-col items-start justify-center p-7 sm:p-10">
        <span className="rounded-full bg-[#dcebd9] px-3 py-1 text-[10px] font-extrabold text-[#2c603b]">
          Find the shop
        </span>
        <h2
          className="mt-5 text-[31px] font-extrabold leading-[1.07] tracking-[-.075em]"
          id="location-heading"
        >
          Local help, easy to find.
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-[#4d6653]">
          {business.address}
        </p>
        <p className="mt-3 text-[11px] text-[#617769]">
          Check current opening hours on the Maps listing or call before
          travelling. No weekly hours have been verified for this site.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-[#163b28] px-5 py-3 text-[12px] font-bold text-white"
            href={business.mapHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin size={15} aria-hidden="true" />
            Open Google Maps <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-full border border-[#9fbba4] px-5 py-3 text-[12px] font-bold"
            href={business.phoneHref}
          >
            <Phone size={15} aria-hidden="true" />
            Call now
          </a>
        </div>
      </div>
      <div className="min-h-[290px] bg-[#d6e4d2]">
        <iframe
          className="h-full min-h-[290px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=19.1683695%2C72.9485972&output=embed"
          title="Map of J.M. Tyre Services in Mulund West"
        />
      </div>
    </section>
  );
}
