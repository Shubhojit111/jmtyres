"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, LockKeyhole, Phone } from "lucide-react";
import { business } from "@/lib/data/business";
import { formatINR } from "@/lib/data/money";

export default function RequestForm({ product }) {
  const [user, setUser] = useState(undefined);
  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState("pickup");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState(null);
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setPhone(d.user?.phone || "");
      })
      .catch(() => setUser(null));
  }, []);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: Number(quantity),
          fulfillment,
          message,
          phone,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || "Could not save this request.");
      setCreated(d.request);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto mb-12 mt-6 w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
      <a
        className="text-[12px] font-bold text-[#326842] underline"
        href={`/tyres/${product.slug}`}
      >
        ← Back to product
      </a>
      <div className="mt-5 grid overflow-hidden rounded-[22px] bg-[#eef4ec] lg:grid-cols-[.92fr_1.08fr]">
        <div className="flex flex-col bg-[#143c27] p-8 text-white sm:p-11">
          <span className="rounded-full border border-white/30 px-3 py-1 text-[10px] font-bold">
            OWNER-APPROVED PURCHASE
          </span>
          <h1 className="mt-6 text-[36px] font-extrabold leading-[1.08] tracking-[-.07em]">
            Request {product.name}.
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-[#d1e4d3]">
            {product.tyre.size} · {product.brand}
          </p>
          <p className="mt-7 text-[26px] font-extrabold">
            {formatINR(product.pricePaise)}{" "}
            <small className="block text-[11px] font-normal">
              per tyre ·{" "}
              {product.isDemo
                ? "illustrative demo price"
                : "current listed price"}
            </small>
          </p>
          <p className="mt-5 text-[12px] leading-relaxed text-[#d1e4d3]">
            {product.stockQty} available when this page loaded. The backend
            checks stock again on submission and owner approval; only approval
            reserves stock.
          </p>
          {product.isDemo && (
            <p className="mt-6 rounded-lg border border-white/30 p-3 text-[12px] font-bold">
              DEMO PRODUCT — all prices and stock are for testing only. Demo
              payment moves no money.
            </p>
          )}
        </div>
        <div className="p-7 sm:p-11">
          {created ? (
            <div role="status">
              <h2 className="text-[30px] font-extrabold tracking-[-.065em]">
                Request saved.
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[#506854]">
                Reference {created.requestId}. The owner reviews it before any
                payment is offered. With email unconfigured, notification
                attempts appear in the admin demo outbox.
              </p>
              <a
                className="mt-6 inline-flex min-h-[45px] items-center gap-2 rounded-full bg-[#173c2a] px-5 text-[12px] font-bold text-white"
                href={`/account/requests/${created.requestId}`}
              >
                View request <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
          ) : product.stockQty === 0 ? (
            <div>
              <h2 className="text-[25px] font-extrabold">Out of Stock</h2>
              <a
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173c2a] px-5 py-3 text-[12px] font-bold text-white"
                href={business.phoneHref}
              >
                <Phone aria-hidden="true" size={16} />
                Call Owner
              </a>
            </div>
          ) : user === undefined ? (
            <p className="text-[13px]">Checking your sign-in status…</p>
          ) : !user || !["customer", "admin"].includes(user.role) ? (
            <div>
              <LockKeyhole
                size={29}
                aria-hidden="true"
                className="text-[#356f4b]"
              />
              <h2 className="mt-4 text-[28px] font-extrabold tracking-[-.065em]">
                Sign in to submit.
              </h2>
              <p className="mt-3 text-[13px] text-[#55705b]">
                You can browse without an account, but requests require a
                signed-in customer or admin.
              </p>
              <a
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173c2a] px-5 py-3 text-[12px] font-bold text-white"
                href={`/account?next=${encodeURIComponent(`/request/${product.slug}`)}`}
              >
                Sign in or register{" "}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={submit}>
              <h2 className="text-[27px] font-extrabold tracking-[-.065em]">
                Request details
              </h2>
              <p className="text-[12px] leading-relaxed text-[#536d59]">
                No payment is due now. The owner may approve or reject this
                request.
              </p>
              <p className="rounded-lg bg-[#e2eee1] px-4 py-3 text-[12px]">
                {user.name} · {user.email}
              </p>
              <label className="block text-[12px] font-bold">
                Phone{" "}
                <input
                  className="mt-1.5 block h-11 w-full rounded-lg border border-[#d4e1d3] bg-white px-3 text-[12px]"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  value={phone}
                />
              </label>
              <label className="block text-[12px] font-bold">
                Quantity (up to {Math.min(20, product.stockQty)}){" "}
                <input
                  className="mt-1.5 block h-11 w-full rounded-lg border border-[#d4e1d3] bg-white px-3 text-[12px]"
                  max={Math.min(20, product.stockQty)}
                  min="1"
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  type="number"
                  value={quantity}
                />
              </label>
              <label className="block text-[12px] font-bold">
                Preference
                <select
                  className="mt-1.5 block h-11 w-full rounded-lg border border-[#d4e1d3] bg-white px-3 text-[12px]"
                  onChange={(e) => setFulfillment(e.target.value)}
                  value={fulfillment}
                >
                  <option value="pickup">Shop pickup</option>
                  <option value="delivery">
                    Ask about delivery (owner to confirm)
                  </option>
                </select>
              </label>
              <label className="block text-[12px] font-bold">
                Additional message{" "}
                <textarea
                  className="mt-1.5 block min-h-24 w-full rounded-lg border border-[#d4e1d3] bg-white p-3 text-[12px]"
                  maxLength={1500}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Vehicle and any helpful details"
                  value={message}
                />
              </label>
              <p className="font-bold">
                Estimated total:{" "}
                {formatINR(product.pricePaise * (Number(quantity) || 0))}
              </p>
              {notice && (
                <p className="text-[12px] text-red-800" role="alert">
                  {notice}
                </p>
              )}
              <button
                className="min-h-[46px] w-full rounded-full bg-[#173c2a] px-5 text-[12px] font-extrabold text-white disabled:opacity-60"
                disabled={busy}
                type="submit"
              >
                {busy ? "Saving…" : "Submit purchase request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
