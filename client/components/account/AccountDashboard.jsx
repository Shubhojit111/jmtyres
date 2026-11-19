"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, PackageCheck, UserRound } from "lucide-react";
import { formatDate, formatINR, statusLabel } from "@/lib/data/money";

export default function AccountDashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone,
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let alive = true;
    setError("");
    fetch(`/api/requests/my?page=${page}`, { cache: "no-store" })
      .then(async (r) => {
        const result = await r.json();
        if (!r.ok) throw Error(result.error || "Could not load your requests.");
        if (alive) setData(result);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
    };
  }, [page]);
  async function saveProfile(event) {
    event.preventDefault();
    setNotice("");
    try {
      const r = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setNotice("Profile saved.");
    } catch (e) {
      setNotice(e.message);
    }
  }
  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
    window.location.assign("/account");
  }
  return (
    <div className="mx-4 mb-12 mt-6 sm:mx-8">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-[22px] bg-[#eaf2e9] p-7 sm:p-10">
        <div>
          <span className="rounded-full bg-[#d9e9d8] px-3 py-1 text-[10px] font-extrabold uppercase text-[#2c603f]">
            Customer account
          </span>
          <h1 className="mt-5 text-[36px] font-extrabold tracking-[-.075em] sm:text-[50px]">
            Hello, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-[13px] text-[#4f6956]">
            Track owner-approved requests, demo payments and previous orders
            here.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-[#9ebba4] px-4 py-2 text-[12px] font-bold"
          onClick={signOut}
          type="button"
        >
          <LogOut aria-hidden="true" size={16} />
          Sign out
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.6fr)]">
        <section className="rounded-[19px] border border-[#e1eae0] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-[24px] font-extrabold tracking-[-.06em]">
              <PackageCheck aria-hidden="true" size={22} />
              Purchase requests
            </h2>
            <a
              className="text-[12px] font-extrabold text-[#2d6840] underline"
              href="/catalogue"
            >
              Find a tyre{" "}
              <ArrowUpRight aria-hidden="true" className="inline" size={15} />
            </a>
          </div>
          {error && (
            <p className="mt-5 text-[12px] text-red-800" role="alert">
              {error}
            </p>
          )}
          {!data && !error && (
            <p className="mt-5 text-[12px]">Loading request history…</p>
          )}
          {data &&
            (!data.items.length ? (
              <p className="mt-5 rounded-xl bg-[#f3f7f2] p-5 text-[13px] text-[#4d6754]">
                No purchase requests yet. Browse tyres without signing in, then
                submit a request when ready.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-[#e4ece2]">
                {data.items.map((item) => (
                  <a
                    className="flex flex-wrap items-center justify-between gap-3 py-4 hover:text-[#25653c]"
                    href={`/account/requests/${item.requestId}`}
                    key={item.id}
                  >
                    <span>
                      <strong className="block text-[13px]">
                        {item.productSnapshot.name}
                      </strong>
                      <small className="mt-1 block text-[11px] text-[#67806c]">
                        {item.requestId} · {formatDate(item.createdAt)} · Qty{" "}
                        {item.quantity}
                      </small>
                    </span>
                    <span className="text-right">
                      <strong className="block text-[13px]">
                        {formatINR(item.totalPaise)}
                      </strong>
                      <small className="block text-[11px] font-bold text-[#3d704b]">
                        {statusLabel(item.status)} ·{" "}
                        {statusLabel(item.paymentStatus)}
                      </small>
                    </span>
                  </a>
                ))}
              </div>
            ))}
          {data?.pages > 1 && (
            <nav
              aria-label="Your request pages"
              className="mt-5 flex items-center gap-3 text-[12px] font-bold"
            >
              <button
                className="rounded-full border border-[#b7cfb7] px-3 py-2 disabled:opacity-45"
                disabled={page <= 1}
                onClick={() => setPage((v) => v - 1)}
                type="button"
              >
                Previous
              </button>
              <span>
                Page {page} of {data.pages}
              </span>
              <button
                className="rounded-full border border-[#b7cfb7] px-3 py-2 disabled:opacity-45"
                disabled={page >= data.pages}
                onClick={() => setPage((v) => v + 1)}
                type="button"
              >
                Next
              </button>
            </nav>
          )}
        </section>
        <section className="h-fit rounded-[19px] bg-[#f2f7f0] p-6">
          <h2 className="flex items-center gap-2 text-[23px] font-extrabold tracking-[-.06em]">
            <UserRound aria-hidden="true" size={21} />
            Profile
          </h2>
          <p className="mt-2 text-[12px] text-[#59705e]">{user.email}</p>
          <form className="mt-5 space-y-4" onSubmit={saveProfile}>
            <label className="block text-[12px] font-bold">
              Full name{" "}
              <input
                className="mt-1.5 block h-11 w-full rounded-lg border border-[#d9e5d8] bg-white px-3 text-[12px]"
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                value={profile.name}
              />
            </label>
            <label className="block text-[12px] font-bold">
              Phone{" "}
              <input
                className="mt-1.5 block h-11 w-full rounded-lg border border-[#d9e5d8] bg-white px-3 text-[12px]"
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
                type="tel"
                value={profile.phone}
              />
            </label>
            <button
              className="min-h-[40px] rounded-full bg-[#153c28] px-5 text-[12px] font-bold text-white"
              type="submit"
            >
              Save profile
            </button>
            {notice && (
              <p aria-live="polite" className="text-[11px] text-[#3a6d49]">
                {notice}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
