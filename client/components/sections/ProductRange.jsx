/* The original four photographic category tiles now use categories from MongoDB. */
"use client";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PhotoTile from "@/components/ui/PhotoTile";
import SectionTag from "@/components/ui/SectionTag";
import { products as presentation } from "@/lib/data/products";

const curated = {
  Car: presentation[0],
  SUV: presentation[1],
  Commercial: presentation[2],
  Bike: presentation[3],
};
export default function ProductRange() {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setCategories(a.items || []);
        setBrands(b.items || []);
      })
      .catch(() => setCategories([]));
  }, []);
  const mapped = useMemo(() => {
    if (!categories) return [];
    return [...categories]
      .sort(
        (a, b) =>
          ["Car", "SUV", "Commercial", "Bike"].indexOf(a.name) -
          ["Car", "SUV", "Commercial", "Bike"].indexOf(b.name),
      )
      .map((item) => ({
        id: item.name,
        title: curated[item.name]?.title || `${item.name} tyres`,
        copy:
          curated[item.name]?.copy ||
          `${item.count} ${item.count === 1 ? "product" : "products"} in this category.`,
        image: curated[item.name]?.image || item.image,
        alt: curated[item.name]?.alt || "Illustrative tyre category image",
        category: item.name,
        keywords: item.name,
      }));
  }, [categories]);
  const filtered = useMemo(
    () =>
      mapped.filter((item) =>
        `${item.title} ${item.keywords}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [mapped, search],
  );
  const current = filtered.length ? index % filtered.length : 0;
  const visible = filtered.length
    ? [...filtered.slice(current), ...filtered.slice(0, current)].slice(0, 4)
    : [];
  return (
    <section
      className="products-section [height:550px] [margin-top:52px] [padding:32px_24px_26px] [border-radius:22px] [background:linear-gradient(140deg,#f1f2f1_0%,#f6f6f4_55%,#f1f2f0_100%)] max-[970px]:[height:auto] max-[970px]:[min-height:550px] max-[720px]:[height:auto] max-[720px]:[margin-top:29px] max-[720px]:[padding:20px_13px_19px] max-[720px]:[border-radius:16px]"
      id="tyres"
    >
      <div className="products-header [display:flex] [align-items:center] [justify-content:space-between] [gap:20px] [height:60px] max-[970px]:[height:auto] max-[970px]:[min-height:60px] max-[970px]:[flex-wrap:wrap] max-[970px]:[row-gap:12px] max-[720px]:[display:flex] max-[720px]:[flex-direction:column] max-[720px]:[align-items:stretch] max-[720px]:[height:auto] max-[720px]:[gap:15px]">
        <div className="products-title [display:flex] [align-items:center] [gap:19px] [&_h2]:[margin:0] [&_h2]:[font-size:31px] [&_h2]:[line-height:1] [&_h2]:[letter-spacing:-.077em] [&_h2]:[font-weight:800] [&_h2]:[white-space:nowrap] max-[970px]:[flex:1_1_310px] max-[720px]:[flex:none] max-[720px]:[gap:9px] max-[720px]:[&_h2]:[font-size:22px]">
          <SectionTag>Products</SectionTag>
          <h2>Explore our tyre range</h2>
        </div>
        <div className="products-tools [display:flex] [align-items:center] [gap:15px] max-[970px]:[flex:1_1_355px] max-[970px]:[justify-content:flex-end] max-[720px]:[flex:none] max-[720px]:[gap:8px] max-[720px]:[justify-content:flex-start]">
          <label className="products-search [display:flex] [align-items:center] [justify-content:space-between] [width:270px] [height:36px] [padding:0_12px_0_16px] [border-radius:999px] [background:#fff] [color:#111713] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[outline:none] [&_input]:[border:0] [&_input]:[background:none] [&_input]:[font-size:11px] [&_input]:[font-weight:650] [&_svg]:[flex:0_0_auto] max-[970px]:[width:min(270px,100%)] max-[970px]:[flex:1_1_190px] max-[970px]:[max-width:270px] max-[720px]:[width:auto] max-[720px]:[flex:1] max-[720px]:[&_input]:[font-size:10px]">
            <span className="sr-only">
              Search tyre categories in the database
            </span>
            <input
              onChange={(e) => {
                setSearch(e.target.value);
                setIndex(0);
              }}
              placeholder="Search by vehicle or tyre type..."
              type="search"
              value={search}
            />
            <Search aria-hidden="true" size={17} strokeWidth={2} />
          </label>
          <a
            className="products-view [display:inline-flex] [align-items:center] [justify-content:center] [gap:13px] [height:36px] [padding:0_15px] [border:0] [border-radius:999px] [background:#111713] [color:#fff] [font-size:11px] [font-weight:800] [white-space:nowrap] [&:hover]:[background:#315e3d] max-[720px]:[padding:0_11px] max-[720px]:[gap:4px]"
            href="/catalogue"
          >
            View all <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </div>
      <div
        aria-live="polite"
        className={`products-grid [display:grid] [grid-template-columns:repeat(4,minmax(0,1fr))] [gap:16px] [height:330px] [margin-top:14px] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[gap:9px] max-[720px]:[height:auto] max-[720px]:[margin-top:14px] ${visible.length < 4 ? "products-grid-filtered [grid-template-columns:repeat(4,minmax(0,1fr))] max-[720px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[720px]:[gap:9px] max-[720px]:[height:auto] max-[720px]:[margin-top:14px]" : ""}`}
      >
        {visible.map((item) => (
          <PhotoTile
            alt={item.alt}
            className="product-tile ![border-radius:16px] [&_.photo-tile-copy]:[left:18px] [&_.photo-tile-copy]:[bottom:17px] [&_.photo-tile-copy_strong]:[font-size:18px] [&_.photo-tile-copy_strong]:[letter-spacing:-.055em] [&_.photo-tile-copy_small]:[font-size:11px] [&_.photo-tile-copy_small]:[line-height:1.24] [&>.arrow-circle]:![right:13px] [&>.arrow-circle]:![bottom:13px] [&>.arrow-circle]:[width:34px] [&>.arrow-circle]:[height:34px] [&_.photo-tile-image]:[object-position:center] [&:nth-child(2)_.photo-tile-image]:[object-position:center_65%] [&:nth-child(3)_.photo-tile-image]:[object-position:57%_center] max-[720px]:[height:245px] max-[720px]:![border-radius:12px] max-[720px]:[&_.photo-tile-copy]:[left:11px] max-[720px]:[&_.photo-tile-copy]:[bottom:14px] max-[720px]:[&_.photo-tile-copy_strong]:[font-size:14px] max-[720px]:[&_.photo-tile-copy_small]:[font-size:9px] max-[720px]:[&>.arrow-circle]:![right:8px] max-[720px]:[&>.arrow-circle]:![bottom:9px] max-[720px]:[&>.arrow-circle]:[width:27px] max-[720px]:[&>.arrow-circle]:[height:27px]"
            copy={item.copy}
            href={`/catalogue?category=${encodeURIComponent(item.category)}`}
            image={item.image}
            key={item.id}
            title={item.title}
          />
        ))}
        {visible.length === 0 && (
          <div className="products-empty [grid-column:1_/_-1] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:11px] [color:#38513c] [&_strong]:[font-size:22px] [&_span]:[font-size:14px] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:8px] [&_a]:[padding:8px_14px] [&_a]:[border-radius:99px] [&_a]:[background:#173421] [&_a]:[color:white] [&_a]:[font-size:13px] max-[720px]:[min-height:245px] max-[720px]:[padding:15px] max-[720px]:[text-align:center] max-[720px]:[&_span]:[font-size:11px]">
            <strong>
              {categories
                ? "No matching category found."
                : "Loading categories…"}
            </strong>
            <span>
              {categories?.length
                ? "Try another category or search all products."
                : "The owner can add products from the admin panel."}
            </span>
            <a href="/catalogue">
              Search the catalogue <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        )}
      </div>
      <div className="products-bottom [display:flex] [align-items:center] [justify-content:space-between] [margin-top:20px] max-[720px]:[margin-top:14px]">
        <div className="products-arrows [display:flex] [gap:8px] [&_button]:[display:inline-flex] [&_button]:[align-items:center] [&_button]:[justify-content:center] [&_button]:[width:35px] [&_button]:[height:35px] [&_button]:[border:1px_solid_#808982] [&_button]:[border-radius:50%] [&_button]:[background:transparent] [&_button]:[transition:background_.2s_ease] [&_button:disabled]:[opacity:.42] [&_button:disabled]:[cursor:not-allowed] max-[720px]:[&_button]:[width:31px] max-[720px]:[&_button]:[height:31px]">
          <button
            aria-label="Previous tyre category"
            disabled={filtered.length < 2}
            onClick={() =>
              setIndex((v) => (v - 1 + filtered.length) % filtered.length)
            }
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={19} />
          </button>
          <button
            aria-label="Next tyre category"
            disabled={filtered.length < 2}
            onClick={() => setIndex((v) => (v + 1) % filtered.length)}
            type="button"
          >
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
        <span className="products-bottom-copy [font-size:11px] [font-weight:750] [letter-spacing:-.025em] max-[720px]:[max-width:180px] max-[720px]:[font-size:9px] max-[720px]:[text-align:right]">
          {brands.length
            ? `Explore ${brands
                .slice(0, 5)
                .map((b) => b.name)
                .join(" · ")}.`
            : "Brands appear when products are entered."}
          <a
            className="products-size-cta [display:inline-flex] [align-items:center] [gap:4px] [margin:6px_0_0_6px] [color:#235738] [font-weight:800] [text-decoration:underline] [text-underline-offset:3px] [&:hover]:[color:#122e20] max-[970px]:[display:flex] max-[970px]:[justify-content:flex-end]"
            href="/find-tyres"
          >
            Have a specific size? Find tyres{" "}
            <ArrowUpRight aria-hidden="true" size={13} />
          </a>
        </span>
      </div>
    </section>
  );
}
