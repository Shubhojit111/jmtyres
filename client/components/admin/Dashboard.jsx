"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { formatDate, formatINR, statusLabel } from "@/lib/data/money";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message));
  }, []);
  if (!data)
    return (
      <p
        className="rounded-2xl bg-[#f4f8f2] p-8 text-[13px]"
        role={error ? "alert" : undefined}
      >
        {error || "Loading business overview…"}
      </p>
    );
  const stats = [
    ["Products", data.totalProducts, "/admin/products"],
    ["Customers", data.totalCustomers, "/admin/customers"],
    ["Requests", data.totalRequests, "/admin/requests"],
    ["Pending", data.pending, "/admin/requests?status=pending"],
    [
      "Awaiting payment",
      data.approved,
      "/admin/requests?status=awaiting_payment",
    ],
    ["Paid / completed", data.paid, "/admin/requests?status=paid"],
    ["Rejected", data.rejected, "/admin/requests?status=rejected"],
    ["Out of stock", data.outOfStock, "/admin/products"],
  ];
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#3d7650]">
            Live database totals
          </span>
          <h2 className="mt-1 text-[30px] font-extrabold tracking-[-.07em]">
            Overview
          </h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([name, count, href]) => (
          <a
            className="rounded-[16px] border border-[#e2ece0] bg-[#f9fbf8] p-5 hover:border-[#9fc1a3]"
            href={href}
            key={name}
          >
            <span className="text-[11px] font-bold text-[#56715b]">{name}</span>
            <strong className="mt-2 block text-[29px] font-extrabold tracking-[-.07em]">
              {count}
            </strong>
          </a>
        ))}
      </div>
      <div className="mt-5 rounded-xl bg-[#e7f2e5] p-5">
        <strong className="text-[13px]">
          Verified real payments:{" "}
          {formatINR(data.realSuccessfulPayments.totalPaise)} (
          {data.realSuccessfulPayments.count})
        </strong>
        <p className="mt-2 text-[11px] text-[#506653]">
          Demo transactions are never counted as actual revenue.
        </p>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="rounded-[18px] border border-[#e1eae0] p-6">
          <h3 className="text-[19px] font-extrabold">Recent requests</h3>
          {data.recentRequests.length ? (
            <div className="mt-3 divide-y divide-[#e3ebe1]">
              {data.recentRequests.map((r) => (
                <a
                  className="flex justify-between gap-4 py-3 text-[12px] hover:text-[#2c6640]"
                  href={`/admin/requests?request=${encodeURIComponent(r.requestId)}`}
                  key={r.requestId}
                >
                  <span>
                    <strong className="block">{r.requestId}</strong>
                    <small>
                      {r.name} · {r.product}
                    </small>
                  </span>
                  <span className="shrink-0 text-right">
                    {statusLabel(r.status)}
                    <small className="block text-[#637568]">
                      {formatDate(r.createdAt)}
                    </small>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[12px] text-[#607462]">No requests yet.</p>
          )}
        </section>
        <section className="rounded-[18px] border border-[#e1eae0] p-6">
          <h3 className="flex items-center gap-2 text-[19px] font-extrabold">
            <TriangleAlert size={18} aria-hidden="true" />
            Low stock
          </h3>
          {data.lowStock.length ? (
            <ul className="mt-3 divide-y divide-[#e3ebe1]">
              {data.lowStock.map((p) => (
                <li
                  className="flex items-center justify-between gap-2 py-3 text-[12px]"
                  key={p.id}
                >
                  <span>
                    {p.name}
                    <small className="block text-[#637568]">{p.sku}</small>
                  </span>
                  <strong>{p.stockQty} remaining</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[12px] text-[#607462]">
              No products with 1–4 units.
            </p>
          )}
          <a
            className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-[#2b6742] underline"
            href="/admin/products"
          >
            Manage stock <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </section>
      </div>
    </div>
  );
}
