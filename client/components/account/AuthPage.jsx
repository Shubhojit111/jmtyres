"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import AccountDashboard from "./AccountDashboard";

export default function AuthPage({ admin = false, initialMode = "login" }) {
  const [user, setUser] = useState(undefined);
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [next, setNext] = useState("");
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const token = search.get("reset") || "";
    if (token) {
      setResetToken(token);
      setMode("reset");
    }
    const requested = search.get("next") || "";
    if (requested.startsWith("/") && !requested.startsWith("//")) {
      try {
        const destination = new URL(requested, window.location.origin);
        if (destination.origin === window.location.origin)
          setNext(
            `${destination.pathname}${destination.search}${destination.hash}`,
          );
      } catch {
        /* Discard malformed return paths. */
      }
    }
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);
  const change = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const endpoint =
      mode === "register"
        ? "register"
        : mode === "forgot"
          ? "forgot-password"
          : mode === "reset"
            ? "reset-password"
            : "login";
    const payload =
      mode === "forgot"
        ? { email: form.email }
        : mode === "reset"
          ? { token: resetToken, password: form.password }
          : mode === "login"
            ? { email: form.email, password: form.password }
            : form;
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Please try again.");
      if (mode === "forgot" || mode === "reset") {
        setMessage(data.message);
        if (mode === "reset") {
          setMode("login");
          setResetToken("");
          setUser(null);
          setForm((prev) => ({ ...prev, password: "" }));
          window.history.replaceState({}, "", window.location.pathname);
        }
        return;
      }
      if (admin && data.user.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        setMessage("This account is not an admin account.");
        return;
      }
      setUser(data.user);
      if (next && !admin) {
        window.location.assign(next);
        return;
      }
      if (admin) {
        window.location.assign(
          next && next.startsWith("/admin") ? next : "/admin",
        );
        return;
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (user === undefined)
    return (
      <div className="mx-4 my-12 rounded-2xl bg-[#eff4ee] p-10 text-[13px] sm:mx-8">
        Checking your account…
      </div>
    );
  if (user?.role === "customer" && !admin && mode !== "reset")
    return <AccountDashboard user={user} onLogout={() => setUser(null)} />;
  if (user?.role === "admin" && admin && mode !== "reset") {
    if (typeof window !== "undefined")
      setTimeout(() => window.location.assign("/admin"), 0);
    return <p className="mx-4 my-12 text-sm">Opening admin panel…</p>;
  }
  return (
    <div className="mx-4 mb-12 mt-6 grid overflow-hidden rounded-[22px] bg-[#eff4ee] sm:mx-8 lg:grid-cols-2">
      <div className="flex min-h-[340px] flex-col justify-end bg-[#153c28] p-8 text-white sm:p-12">
        <span className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/40 px-3 py-1 text-[11px] font-extrabold">
          <LockKeyhole aria-hidden="true" size={14} />{" "}
          {admin ? "OWNER ACCESS" : "YOUR ACCOUNT"}
        </span>
        <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-.075em] sm:text-[53px]">
          {admin ? "Manage your shop." : "Your tyres, your requests."}
        </h1>
        <p className="mt-4 max-w-[460px] text-[13px] leading-relaxed text-[#d5e9d7]">
          {admin
            ? "Products, stock, customer requests, enquiries and demo payments in one protected workspace."
            : "Browse openly. Sign in only when you want to request a tyre and track the owner’s decision."}
        </p>
        <a
          className="mt-8 inline-flex items-center gap-2 text-[12px] font-extrabold underline"
          href="/catalogue"
        >
          Browse tyre catalogue <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </div>
      <div className="p-7 sm:p-12">
        <span className="rounded-full bg-[#e0ebe0] px-3 py-1 text-[10px] font-extrabold uppercase text-[#2d6541]">
          {mode === "login"
            ? "Welcome back"
            : mode === "register"
              ? "Create an account"
              : mode === "forgot"
                ? "Account recovery"
                : "Choose a new password"}
        </span>
        <h2 className="mt-5 text-[31px] font-extrabold tracking-[-.07em]">
          {mode === "login"
            ? "Sign in"
            : mode === "register"
              ? "Register"
              : mode === "forgot"
                ? "Forgot password?"
                : "Reset password"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "register" && (
            <label className="block text-[12px] font-bold">
              Full name{" "}
              <input
                autoComplete="name"
                className="mt-1.5 block h-12 w-full rounded-xl border border-[#d5e2d4] bg-white px-4 text-[13px]"
                onChange={(e) => change("name", e.target.value)}
                required
                value={form.name}
              />
            </label>
          )}
          {mode !== "reset" && (
            <label className="block text-[12px] font-bold">
              Email address{" "}
              <input
                autoComplete="email"
                className="mt-1.5 block h-12 w-full rounded-xl border border-[#d5e2d4] bg-white px-4 text-[13px]"
                onChange={(e) => change("email", e.target.value)}
                required
                type="email"
                value={form.email}
              />
            </label>
          )}
          {mode === "register" && (
            <label className="block text-[12px] font-bold">
              Phone number{" "}
              <input
                autoComplete="tel"
                className="mt-1.5 block h-12 w-full rounded-xl border border-[#d5e2d4] bg-white px-4 text-[13px]"
                onChange={(e) => change("phone", e.target.value)}
                required
                type="tel"
                value={form.phone}
              />
            </label>
          )}
          {mode !== "forgot" && (
            <label className="block text-[12px] font-bold">
              {mode === "reset" ? "New password" : "Password"}{" "}
              <input
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="mt-1.5 block h-12 w-full rounded-xl border border-[#d5e2d4] bg-white px-4 text-[13px]"
                minLength={mode === "login" ? 1 : 12}
                onChange={(e) => change("password", e.target.value)}
                required
                type="password"
                value={form.password}
              />
              {mode !== "login" && (
                <small className="mt-1 block text-[#607565]">
                  At least 12 characters, up to 72 UTF-8 bytes.
                </small>
              )}
            </label>
          )}
          {message && (
            <p
              aria-live="polite"
              className="rounded-lg bg-[#e4eee2] p-3 text-[12px] text-[#285135]"
              role="status"
            >
              {message}
            </p>
          )}
          <button
            className="flex min-h-[47px] w-full items-center justify-center gap-2 rounded-full bg-[#153c28] px-5 text-[13px] font-extrabold text-white disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy
              ? "Working…"
              : mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Request reset"
                    : "Set new password"}{" "}
            <ArrowUpRight aria-hidden="true" size={16} />
          </button>
        </form>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-bold text-[#2c6740]">
          {mode === "forgot" || mode === "reset" ? (
            <a href="/login">Back to sign in</a>
          ) : mode === "register" ? (
            <a href="/login">Already have an account? Sign in</a>
          ) : (
            <>
              <button
                onClick={() => {
                  setMode("forgot");
                  setMessage("");
                }}
                type="button"
              >
                Forgot password?
              </button>
              {!admin && <a href="/register">New here? Register</a>}
            </>
          )}
        </div>
        {mode === "forgot" && (
          <p className="mt-4 text-[11px] leading-relaxed text-[#5f7465]">
            Without SMTP, reset instructions are recorded in the protected admin
            demo outbox rather than emailed. A phone number alone cannot deliver
            email.
          </p>
        )}
        <p className="mt-9 flex items-center gap-2 text-[11px] text-[#657b68]">
          <Mail size={14} aria-hidden="true" />
          <UserRound size={14} aria-hidden="true" /> Your session uses an
          HTTP-only cookie. Purchases require owner approval.
        </p>
      </div>
    </div>
  );
}
