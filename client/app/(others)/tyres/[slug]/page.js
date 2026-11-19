import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Phone } from "lucide-react";
import { getProduct } from "@/lib/backend";
import { business } from "@/lib/data/business";
import { formatINR } from "@/lib/data/money";
import ProductGallery from "@/components/catalogue/ProductGallery";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  try {
    const { product } = { product: await getProduct(params.slug) };
    return {
      title: `${product.name} | J.M. Tyres`,
      description: `${product.brand} tyre ${product.tyre.size}. ${product.isDemo ? "Demo product data for testing only." : "Check current price and stock before requesting to buy."}`,
    };
  } catch {
    return { title: "Tyre not found | J.M. Tyres" };
  }
}
export default async function ProductPage({ params }) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  const specs = [
    ["Tyre size", product.tyre.size],
    ["Width", `${product.tyre.width} mm`],
    ["Aspect ratio", `${product.tyre.aspectRatio}%`],
    ["Rim diameter", `${product.tyre.rimDiameter} in`],
    ["Load index", product.tyre.loadIndex || "Ask owner"],
    ["Speed rating", product.tyre.speedRating || "Ask owner"],
    ["Tyre type", product.tyre.type],
    ["SKU", product.sku],
  ];
  return (
    <article className="mx-auto mb-12 mt-2 w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
      <a
        className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#2d6842] hover:underline"
        href="/catalogue"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to catalogue
      </a>
      {product.isDemo && (
        <div className="mt-5 rounded-xl border border-[#b9d2b9] bg-[#ecf5eb] p-4 text-[12px] font-bold text-[#35593d]">
          DEMO PRODUCT — sample name, stock, price and imagery are for testing.
          This is not an actual listed tyre or a fitment recommendation.
        </div>
      )}
      <div className="mt-5 grid gap-8 rounded-[22px] bg-[#f3f7f2] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <ProductGallery images={product.images} name={product.name} />
        <div className="flex flex-col justify-center">
          <span className="w-fit rounded-full bg-[#e0eee0] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#2b6140]">
            {product.brand} · {product.category}
          </span>
          <h1 className="mt-5 text-[35px] font-extrabold leading-[1.07] tracking-[-.078em] sm:text-[50px]">
            {product.name}
          </h1>
          <p className="mt-4 text-[13px] leading-[1.65] text-[#48614d]">
            {product.description}
          </p>
          <p className="mt-6 text-[34px] font-extrabold tracking-[-.06em]">
            {formatINR(product.pricePaise)}{" "}
            <small className="block text-[11px] font-semibold tracking-normal text-[#6b7b6e]">
              {product.isDemo
                ? "Illustrative demo price only"
                : "Current listed price; final terms confirmed by owner"}
            </small>
          </p>
          <span
            className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold ${product.stockQty ? "bg-[#e1efe0] text-[#265b38]" : "bg-[#f6eae7] text-[#8b4538]"}`}
          >
            {product.stockQty ? (
              <CheckCircle2 aria-hidden="true" size={15} />
            ) : null}
            {product.stockQty
              ? `${product.stockQty} currently available`
              : "Out of Stock"}
          </span>
          {product.stockQty ? (
            <a
              className="mt-6 inline-flex min-h-[48px] w-fit items-center gap-3 rounded-full bg-[#153c28] px-6 text-[13px] font-extrabold text-white hover:bg-[#2a6643]"
              href={`/request/${product.slug}`}
            >
              Request to Buy <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ) : (
            <a
              className="mt-6 inline-flex min-h-[48px] w-fit items-center gap-3 rounded-full bg-[#153c28] px-6 text-[13px] font-extrabold text-white hover:bg-[#2a6643]"
              href={business.phoneHref}
            >
              <Phone size={17} aria-hidden="true" />
              Call Owner · {business.phoneDisplay}
            </a>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-[#697b6a]">
            Owner approval is required before payment. Stock is reserved only
            when the owner approves a request.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[19px] border border-[#e4ece3] bg-white p-6">
          <h2 className="text-[25px] font-extrabold tracking-[-.065em]">
            Technical details
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-5">
            {specs.map(([key, value]) => (
              <div className="border-b border-[#e5ece4] py-3" key={key}>
                <dt className="text-[11px] font-bold text-[#63806a]">{key}</dt>
                <dd className="mt-1 text-[13px] font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-[19px] bg-[#eaf2e9] p-6">
          <h2 className="text-[25px] font-extrabold tracking-[-.065em]">
            Verified vehicle compatibility
          </h2>
          {product.compatibility.length ? (
            <ul className="mt-4 space-y-3">
              {product.compatibility.map((v, i) => (
                <li
                  className="rounded-xl bg-white px-4 py-3 text-[13px]"
                  key={i}
                >
                  {v.vehicleType} · {v.make} {v.model} {v.variant || ""}
                  {v.yearFrom
                    ? ` · ${v.yearFrom}${v.yearTo ? `–${v.yearTo}` : "+"}`
                    : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[13px] leading-relaxed text-[#4e6855]">
              No model/variant/year compatibility has been entered for this
              product. Do not assume it fits a vehicle based on the tyre size
              alone. Confirm your sidewall size and suitability with the shop.
            </p>
          )}
          <a
            className="mt-6 inline-flex items-center gap-2 text-[12px] font-extrabold text-[#285d3b] underline"
            href="/find-tyres"
          >
            Search by tyre size <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </section>
      </div>
    </article>
  );
}
