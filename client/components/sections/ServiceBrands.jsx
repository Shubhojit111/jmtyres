import { ArrowUpRight } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";
import { brandLogos, brandNote } from "@/lib/data/brandLogos";

export default function ServiceBrands({ brands = [] }) {
  const listed = brands.length
    ? brands
    : Object.keys(brandLogos).map((name) => ({ name, count: 0, demoCount: 0 }));
  return (
    <section
      aria-labelledby="service-brands-heading"
      className="page-block mx-4 mt-12 rounded-[20px] bg-[#edf4ec] px-5 py-8 sm:mx-8 sm:mt-14 sm:px-9 sm:py-10"
      id="service-brands"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <SectionTag>Brands &amp; fitment</SectionTag>
          <h2
            className="mt-4 max-w-[690px] text-[29px] font-extrabold leading-[1.07] tracking-[-.075em] sm:text-[43px]"
            id="service-brands-heading"
          >
            The badge matters. The right size matters more.
          </h2>
          <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-[#4c6651]">
            {brands.length
              ? "See the brands represented in the current catalogue, then compare the size, rating and tyre type for your vehicle."
              : "These are examples of brands you can ask about; none is listed as available until the owner adds real products."}{" "}
            Ask the team to confirm fitment and the final fitted total.
          </p>
        </div>
        <a
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#173e29] px-5 text-[12px] font-extrabold text-white hover:bg-[#2a6540]"
          href={brands.length ? "/catalogue" : "/contact"}
        >
          {brands.length ? "Browse listed tyres" : "Ask about brands"}{" "}
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {listed.map((item) => {
          const logo = brandLogos[item.name];
          return (
            <a
              aria-label={
                item.count
                  ? `Browse ${item.name} listings`
                  : `Ask about ${item.name} tyres`
              }
              className="group flex min-h-[151px] min-w-0 flex-col rounded-2xl border border-[#dbe8da] bg-white p-3.5 transition-colors hover:border-[#8aa992]"
              href={
                item.count
                  ? `/catalogue?brand=${encodeURIComponent(item.name)}`
                  : "/contact"
              }
              key={item.name}
            >
              <span
                className={`flex h-[77px] items-center justify-center rounded-xl ${logo?.dark ? "bg-[#173523]" : "bg-[#f5f8f3]"}`}
              >
                {logo ? (
                  <img
                    alt={`${item.name} logo`}
                    className="brand-logo max-h-[62px] max-w-[90%] object-contain"
                    decoding="async"
                    height={logo.height}
                    loading="eager"
                    src={logo.src}
                    width={logo.width}
                  />
                ) : (
                  <strong className="text-center text-[17px] font-extrabold text-[#1b4228]">
                    {item.name}
                  </strong>
                )}
              </span>
              <strong className="mt-3 text-[12px] font-extrabold leading-tight text-[#192f20]">
                {item.name}
              </strong>
              <span className="mt-1 text-[10px] font-semibold text-[#58715e]">
                {item.count
                  ? `${item.count} ${item.count === 1 ? "listing" : "listings"}`
                  : "No listed stock"}
                {item.count && item.demoCount === item.count
                  ? " · DEMO"
                  : item.demoCount
                    ? " · includes DEMO"
                    : ""}
              </span>
            </a>
          );
        })}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-[#526a57]">
        {brandNote(brands)}
      </p>
    </section>
  );
}
