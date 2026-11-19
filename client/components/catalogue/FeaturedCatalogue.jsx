"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function FeaturedCatalogue({ content }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((r) => {
        if (!r.ok) throw Error("Catalogue unavailable");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-4 mt-14 rounded-[22px] bg-[#edf3ec] px-6 py-10 sm:mx-8 sm:px-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="rounded-full bg-[#dce9db] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#244b30]">
            From the catalogue
          </span>
          <h2
            className="mt-4 text-[32px] font-extrabold leading-tight tracking-[-.075em] sm:text-[42px]"
            id="featured-heading"
          >
            {content?.catalogueHeading || "Explore available tyres"}
          </h2>
          <p className="mt-2 max-w-[610px] text-[13px] leading-relaxed text-[#49604f]">
            {content?.catalogueDescription ||
              "Browse tyre sizes and product details entered by the shop."}
          </p>
        </div>
        <a
          className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#173e29] px-5 text-[12px] font-extrabold text-white hover:bg-[#2b6542]"
          href="/catalogue"
        >
          Browse all tyres <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </div>
      {data?.items?.some((item) => item.isDemo) && (
        <p className="mt-5 rounded-lg border border-[#bbd3bb] bg-white px-4 py-3 text-[12px] font-semibold text-[#36563b]">
          Demo catalogue: sample names, stock, prices and images are for testing
          only, not actual J.M. Tyres inventory or quotes.
        </p>
      )}
      {data?.items?.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-8 text-[13px] text-[#526857]">
          {error ||
            (data
              ? "No products have been added yet. The owner can add them in the admin panel."
              : "Loading current catalogue…")}
        </div>
      )}
    </section>
  );
}
