"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { formatINR } from "@/lib/data/money";
import { api, buttonClass, inputClass } from "./api";
const empty = () => ({
  name: "",
  sku: "",
  brand: "",
  category: "Car",
  description: "",
  priceRupees: "",
  stockQty: 0,
  images: [],
  tyre: {
    width: "",
    aspectRatio: "",
    rimDiameter: "",
    loadIndex: "",
    speedRating: "",
    type: "Tubeless radial",
  },
  compatibility: [],
  active: true,
  isDemo: false,
  featured: false,
});
const fromProduct = (p) => ({
  ...p,
  priceRupees: (p.pricePaise / 100).toString(),
  tyre: { ...p.tyre },
  compatibility: p.compatibility.map((v) => ({
    ...v,
    yearFrom: v.yearFrom || "",
    yearTo: v.yearTo || "",
  })),
});
export default function AdminProducts() {
  const [data, setData] = useState(null),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [edit, setEdit] = useState(null),
    [form, setForm] = useState(empty()),
    [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [options, setOptions] = useState({ brands: [], categories: [] });
  async function load(nextPage = page, search = query) {
    try {
      const result = await api(
        `/api/admin/products?page=${nextPage}&q=${encodeURIComponent(search)}`,
      );
      setData(result);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
    Promise.all([api("/api/brands"), api("/api/categories")])
      .then(([b, c]) => setOptions({ brands: b.items, categories: c.items }))
      .catch(() => {});
  }, [page]);
  const open = (product = null) => {
    setEdit(product);
    setForm(product ? fromProduct(product) : empty());
    setShowForm(true);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const field = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const tyreField = (key, value) =>
    setForm((prev) => ({ ...prev, tyre: { ...prev.tyre, [key]: value } }));
  const mapping = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      compatibility: prev.compatibility.map((m, i) =>
        i === index ? { ...m, [key]: value } : m,
      ),
    }));
  async function upload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      if (form.images.length + files.length > 8)
        throw Error("Maximum 8 images per product.");
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/admin/products/images", {
          method: "POST",
          body: fd,
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { url: d.url, alt: `${prev.name || "Tyre"} product image` },
          ],
        }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        brand: form.brand,
        category: form.category,
        description: form.description,
        pricePaise: Math.round(Number(form.priceRupees) * 100),
        stockQty: Number(form.stockQty),
        images: form.images,
        tyre: form.tyre,
        compatibility: form.compatibility.map((v) => ({
          ...v,
          yearFrom: v.yearFrom ? Number(v.yearFrom) : null,
          yearTo: v.yearTo ? Number(v.yearTo) : null,
        })),
        active: form.active,
        isDemo: form.isDemo,
        featured: form.featured,
      };
      const result = await api(
        edit ? `/api/admin/products/${edit.id}` : "/api/admin/products",
        edit ? "PUT" : "POST",
        payload,
      );
      if (edit) {
        const removed = edit.images.filter(
          (img) => !form.images.some((current) => current.url === img.url),
        );
        for (const image of removed)
          if (image.url.startsWith("/uploads/"))
            await fetch(
              `/api/admin/products/images?url=${encodeURIComponent(image.url)}`,
              { method: "DELETE" },
            );
      }
      setNotice(
        `${result.product.name} saved. Product and stock updates are now visible to customers.`,
      );
      setEdit(null);
      setForm(empty());
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(product) {
    if (
      !window.confirm(
        `Delete ${product.name}? Referenced products are archived so request history remains accurate.`,
      )
    )
      return;
    setError("");
    try {
      const result = await api(`/api/admin/products/${product.id}`, "DELETE");
      setNotice(
        result.archived
          ? "Product archived; historical requests were preserved."
          : "Product deleted.",
      );
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function seed() {
    if (
      !window.confirm(
        "Add 16 explicitly labelled DEMO examples for search and workflow testing? They are NOT real inventory, fitment or prices.",
      )
    )
      return;
    setBusy(true);
    try {
      const d = await api("/api/admin/demo-seed", "POST", {});
      setNotice(`${d.inserted} demo products added. ${d.message}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const label = "block text-[11px] font-bold text-[#3f5946]";
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#39754d]">
            Database-driven inventory
          </span>
          <h2 className="mt-1 text-[30px] font-extrabold tracking-[-.07em]">
            Products & stock
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="min-h-[40px] rounded-full border border-[#b6cbb8] px-4 text-[11px] font-bold"
            disabled={busy}
            onClick={seed}
            type="button"
          >
            Load 16 DEMO products
          </button>
          <button className={buttonClass} onClick={() => open()} type="button">
            <Plus aria-hidden="true" size={16} />
            Add product
          </button>
        </div>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-[#5d7261]">
        Prices and stock on customer pages come from these records. Demo items
        are labelled prominently; only enter verified vehicle compatibility.
      </p>
      {notice && (
        <p
          aria-live="polite"
          className="mt-4 rounded-xl bg-[#e4f1e1] p-4 text-[12px] text-[#2e5c3c]"
          role="status"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          className="mt-4 rounded-xl bg-red-50 p-4 text-[12px] text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}
      {showForm && (
        <form
          className="mt-5 rounded-[19px] border border-[#cfe1cf] bg-[#f7faf5] p-5 sm:p-7"
          onSubmit={save}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[22px] font-extrabold tracking-[-.05em]">
              {edit ? "Edit product" : "New product"}
            </h3>
            <button
              className="text-[12px] font-bold text-[#355f41] underline"
              onClick={() => {
                setEdit(null);
                setForm(empty());
                setShowForm(false);
              }}
              type="button"
            >
              Close form
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Product name
              <input
                className={inputClass}
                maxLength={120}
                onChange={(e) => field("name", e.target.value)}
                required
                value={form.name}
              />
            </label>
            <label className={label}>
              SKU / product code
              <input
                className={inputClass}
                maxLength={64}
                onChange={(e) => field("sku", e.target.value)}
                required
                value={form.sku}
              />
            </label>
            <label className={label}>
              Brand
              <input
                className={inputClass}
                list="admin-brands"
                onChange={(e) => field("brand", e.target.value)}
                required
                value={form.brand}
              />
              <datalist id="admin-brands">
                {options.brands.map((x) => (
                  <option key={x.name} value={x.name} />
                ))}
              </datalist>
            </label>
            <label className={label}>
              Category
              <input
                className={inputClass}
                list="admin-categories"
                onChange={(e) => field("category", e.target.value)}
                required
                value={form.category}
              />
              <datalist id="admin-categories">
                {[
                  ...new Set([
                    "Car",
                    "SUV",
                    "Bike",
                    "Commercial",
                    ...options.categories.map((x) => x.name),
                  ]),
                ].map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </label>
            <label className={label}>
              Selling price (₹)
              <input
                className={inputClass}
                min="1"
                onChange={(e) => field("priceRupees", e.target.value)}
                required
                step="0.01"
                type="number"
                value={form.priceRupees}
              />
            </label>
            <label className={label}>
              Stock quantity
              <input
                className={inputClass}
                min="0"
                onChange={(e) => field("stockQty", e.target.value)}
                required
                type="number"
                value={form.stockQty}
              />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Description
              <textarea
                className={`${inputClass} min-h-24 py-3`}
                maxLength={3500}
                onChange={(e) => field("description", e.target.value)}
                required
                value={form.description}
              />
            </label>
          </div>
          <h4 className="mt-7 text-[16px] font-extrabold">
            Tyre specifications
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              ["width", "Width (mm)"],
              ["aspectRatio", "Aspect ratio"],
              ["rimDiameter", "Rim diameter (in)"],
            ].map(([key, name]) => (
              <label className={label} key={key}>
                {name}
                <input
                  className={inputClass}
                  max={key === "rimDiameter" ? 30 : key === "width" ? 450 : 100}
                  min={key === "rimDiameter" ? 8 : key === "width" ? 60 : 20}
                  onChange={(e) => tyreField(key, e.target.value)}
                  required
                  type="number"
                  value={form.tyre[key]}
                />
              </label>
            ))}
            {[
              ["loadIndex", "Load index"],
              ["speedRating", "Speed rating"],
              ["type", "Tyre type"],
            ].map(([key, name]) => (
              <label className={label} key={key}>
                {name}
                <input
                  className={inputClass}
                  onChange={(e) => tyreField(key, e.target.value)}
                  required={key === "type"}
                  value={form.tyre[key]}
                />
              </label>
            ))}
          </div>
          <h4 className="mt-7 text-[16px] font-extrabold">Product images</h4>
          <p className="mt-1 text-[11px] text-[#657769]">
            Upload up to 8 JPEG/PNG/WebP images (5 MB each). Development stores
            locally; production needs configured Cloudflare R2.
          </p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#a8c3ab] bg-white px-4 py-2 text-[11px] font-bold">
            <ImagePlus aria-hidden="true" size={16} />
            Upload images
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              multiple
              onChange={upload}
              type="file"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {form.images.map((img, i) => (
              <div
                className="rounded-xl border border-[#dce9dc] bg-white p-2"
                key={`${img.url}-${i}`}
              >
                <img
                  alt={img.alt || "Uploaded tyre"}
                  className="h-28 w-full rounded-lg object-cover"
                  src={img.url}
                />
                <input
                  aria-label={`Alt text for image ${i + 1}`}
                  className={`${inputClass} min-h-9`}
                  maxLength={150}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.map((im, index) =>
                        index === i ? { ...im, alt: e.target.value } : im,
                      ),
                    }))
                  }
                  placeholder="Describe image"
                  value={img.alt || ""}
                />
                <button
                  className="mt-2 flex items-center gap-1 text-[11px] font-bold text-red-800"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, index) => index !== i),
                    }))
                  }
                  type="button"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  Remove image
                </button>
              </div>
            ))}
          </div>
          <div className="mt-7 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-[16px] font-extrabold">
                Verified vehicle compatibility
              </h4>
              <p className="mt-1 max-w-[580px] text-[11px] text-[#627869]">
                Do not guess: add only confirmed make/model/variant/year
                mappings. An empty list means vehicle search will not claim a
                match.
              </p>
            </div>
            <button
              className="shrink-0 rounded-full border border-[#b6cdb7] px-3 py-2 text-[11px] font-bold"
              onClick={() =>
                field("compatibility", [
                  ...form.compatibility,
                  {
                    vehicleType: "Car / SUV",
                    make: "",
                    model: "",
                    variant: "",
                    yearFrom: "",
                    yearTo: "",
                  },
                ])
              }
              type="button"
            >
              + Add mapping
            </button>
          </div>
          {form.compatibility.map((v, i) => (
            <div
              className="mt-3 grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-3"
              key={i}
            >
              <label className={label}>
                Vehicle type
                <select
                  className={inputClass}
                  onChange={(e) => mapping(i, "vehicleType", e.target.value)}
                  value={v.vehicleType}
                >
                  {["Car / SUV", "Bike / scooter", "Commercial"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {[
                ["make", "Manufacturer"],
                ["model", "Model"],
                ["variant", "Variant (optional)"],
                ["yearFrom", "Year from (optional)"],
                ["yearTo", "Year to (optional)"],
              ].map(([key, name]) => (
                <label className={label} key={key}>
                  {name}
                  <input
                    className={inputClass}
                    onChange={(e) => mapping(i, key, e.target.value)}
                    required={["make", "model"].includes(key)}
                    type={key.startsWith("year") ? "number" : "text"}
                    value={v[key] || ""}
                  />
                </label>
              ))}
              <button
                className="self-end text-[11px] font-bold text-red-800"
                onClick={() =>
                  field(
                    "compatibility",
                    form.compatibility.filter((_, index) => index !== i),
                  )
                }
                type="button"
              >
                Remove mapping
              </button>
            </div>
          ))}
          <div className="mt-6 flex flex-wrap gap-5 text-[12px] font-bold">
            {[
              ["active", "Published"],
              ["featured", "Featured on homepage"],
              ["isDemo", "DEMO / fictitious product"],
            ].map(([key, name]) => (
              <label className="flex items-center gap-2" key={key}>
                <input
                  checked={form[key]}
                  onChange={(e) => field(key, e.target.checked)}
                  type="checkbox"
                />
                {name}
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button className={buttonClass} disabled={busy} type="submit">
              {busy ? "Saving…" : edit ? "Save changes" : "Create product"}{" "}
              <ArrowUpRight aria-hidden="true" size={14} />
            </button>
            <p className="text-[11px] text-[#617767]">
              Low-stock emails trigger when stock crosses from 5 or more to
              below 5.
            </p>
          </div>
        </form>
      )}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <label className="text-[12px] font-bold">
          Search products{" "}
          <span className="relative mt-1 flex items-center">
            <Search
              className="absolute left-3 text-[#66816c]"
              size={16}
              aria-hidden="true"
            />
            <input
              className={`${inputClass} mt-0 w-[230px] pl-9`}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") load(1, e.currentTarget.value);
              }}
              placeholder="Name or SKU"
              value={query}
            />
          </span>
        </label>
        <button
          className="text-[11px] font-bold text-[#356e46] underline"
          onClick={() => load(1, query)}
          type="button"
        >
          Apply search
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {data?.items?.map((p) => (
          <article
            className="flex flex-wrap items-center gap-4 rounded-[15px] border border-[#e0eae0] bg-[#f9fbf8] p-3 sm:p-4"
            key={p.id}
          >
            {p.images?.[0] && (
              <img
                alt={p.images[0].alt}
                className="h-[72px] w-[86px] rounded-lg object-cover"
                src={p.images[0].url}
              />
            )}
            <div className="min-w-[180px] flex-1">
              <strong className="block text-[13px]">{p.name}</strong>
              <small className="mt-1 block text-[11px] text-[#607765]">
                {p.sku} · {p.brand} · {p.category} · {p.tyre.size}
              </small>
              <small className="mt-1 block text-[10px] font-bold text-[#3e6948]">
                {p.isDemo ? "DEMO · " : ""}
                {p.active ? "Published" : "Unpublished"}
              </small>
            </div>
            <div className="text-[12px] font-bold">
              {formatINR(p.pricePaise)}
              <small className="block text-[#667a6a]">
                Stock: {p.stockQty}
              </small>
            </div>
            <div className="flex gap-2">
              <button
                aria-label={`Edit ${p.name}`}
                className="rounded-full border border-[#bcd0bc] p-2"
                onClick={() => open(p)}
                type="button"
              >
                <Pencil aria-hidden="true" size={16} />
              </button>
              <button
                aria-label={`Delete ${p.name}`}
                className="rounded-full border border-[#dabbb5] p-2 text-red-800"
                onClick={() => remove(p)}
                type="button"
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </div>
          </article>
        ))}
        {!data && <p className="p-6 text-[12px]">Loading products…</p>}
        {data && !data.items.length && (
          <p className="rounded-xl bg-[#f3f8f2] p-6 text-[12px]">
            No products match. Add a product or load explicit DEMO fixtures for
            testing.
          </p>
        )}
      </div>
      {data?.pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 text-[12px]">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            type="button"
          >
            Previous
          </button>
          Page {page} of {data.pages}
          <button
            disabled={page === data.pages}
            onClick={() => setPage(page + 1)}
            type="button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
