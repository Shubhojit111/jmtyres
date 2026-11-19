"use client";
import { useEffect, useState } from "react";
import { api, buttonClass } from "./api";
import { formatDate } from "@/lib/data/money";
export default function AdminEnquiries() {
  const [data, setData] = useState(null),
    [status, setStatus] = useState("all"),
    [page, setPage] = useState(1),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = async (s = status, n = page) => {
    try {
      setData(await api(`/api/admin/enquiries?status=${s}&page=${n}`));
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, [page]);
  async function change(id, next) {
    try {
      await api(`/api/admin/enquiries/${id}`, "PATCH", { status: next });
      setNotice("Enquiry status updated.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div>
      <span className="text-[10px] font-extrabold uppercase text-[#3a754c]">
        Saved in MongoDB
      </span>
      <h2 className="mt-1 text-[30px] font-extrabold tracking-[-.07em]">
        Customer enquiries
      </h2>
      <p className="mt-2 text-[12px] text-[#5e7563]">
        Enquiries are saved before WhatsApp opens. Email notifications are
        demo-log-only until SMTP is configured.
      </p>
      {error && (
        <p className="mt-4 text-[12px] text-red-800" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 text-[12px] text-[#2c6740]" role="status">
          {notice}
        </p>
      )}
      <label className="mt-5 block text-[12px] font-bold">
        Status{" "}
        <select
          className="ml-2 rounded-full border border-[#bfd4c0] bg-white px-4 py-2"
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
            load(e.target.value, 1);
          }}
          value={status}
        >
          {["all", "new", "contacted", "closed"].map((x) => (
            <option key={x} value={x}>
              {x === "all" ? "All" : x}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-5 space-y-3">
        {data?.items.map((item) => (
          <article
            className="rounded-[16px] border border-[#dfebdf] bg-[#f9fbf7] p-5"
            key={item.id}
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-extrabold">{item.name}</h3>
                <p className="mt-1 text-[11px] text-[#5f7664]">
                  {formatDate(item.createdAt)} ·{" "}
                  {item.vehicleType || "Vehicle not specified"}
                </p>
              </div>
              <span className="rounded-full bg-[#e4efe2] px-3 py-1 text-[11px] font-bold">
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-[12px] font-bold">{item.requirement}</p>
            <p className="mt-1 whitespace-pre-wrap text-[12px] text-[#4d6553]">
              {item.message}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
              <a
                className="font-bold text-[#286342] underline"
                href={`tel:${item.phone}`}
              >
                {item.phone}
              </a>
              <a
                className="font-bold text-[#286342] underline"
                href={`mailto:${item.email}`}
              >
                {item.email}
              </a>
              <label className="ml-auto">
                Status{" "}
                <select
                  className="ml-2 rounded-full border border-[#bcd1bd] bg-white px-3 py-2"
                  onChange={(e) => change(item.id, e.target.value)}
                  value={item.status}
                >
                  {["new", "contacted", "closed"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
        {data && !data.items.length && (
          <p className="rounded-xl bg-[#f3f7f2] p-6 text-[12px]">
            No enquiries yet.
          </p>
        )}
        {!data && <p className="text-[12px]">Loading enquiries…</p>}
      </div>
      {data?.pages > 1 && (
        <div className="mt-4 flex gap-3 text-[11px]">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            type="button"
          >
            Previous
          </button>
          Page {page}/{data.pages}
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
