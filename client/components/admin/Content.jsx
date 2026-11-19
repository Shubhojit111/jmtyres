"use client";
import { useEffect, useState } from "react";
import { api, buttonClass, inputClass } from "./api";
export default function AdminContent() {
  const [form, setForm] = useState(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/api/admin/content/home")
      .then((d) => setForm(d.content))
      .catch((e) => setError(e.message));
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await api("/api/admin/content/home", "PUT", form);
      setForm(d.content);
      setNotice(
        "Website content saved. The homepage reads this record from MongoDB.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    ["heroIntroLine1", "Small hero line 1"],
    ["heroIntroLine2", "Small hero line 2"],
    ["heroLocation", "Location eyebrow"],
    ["heroLine1", "Main headline line 1"],
    ["heroLine2", "Main headline line 2"],
    ["heroDescription", "Hero description"],
    ["heroImage", "Hero image (asset name or uploaded URL)"],
    ["catalogueHeading", "Featured catalogue heading"],
    ["catalogueDescription", "Featured catalogue description"],
  ];
  return (
    <div>
      <span className="text-[10px] font-extrabold uppercase text-[#3b7650]">
        Admin-managed homepage data
      </span>
      <h2 className="mt-1 text-[30px] font-extrabold tracking-[-.07em]">
        Website content
      </h2>
      <p className="mt-2 text-[12px] leading-relaxed text-[#607866]">
        The initial text and image choice match the approved design. Editing
        content changes the words/images, not its palette or layout. The
        original asset name is HeroMountainDrive.
      </p>
      {error && (
        <p className="mt-4 text-[12px] text-red-800" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 text-[12px] text-[#2c6540]" role="status">
          {notice}
        </p>
      )}
      {form ? (
        <form
          className="mt-5 grid gap-4 rounded-[18px] border border-[#dfebdf] bg-[#f8fbf7] p-5 sm:grid-cols-2 sm:p-7"
          onSubmit={save}
        >
          {fields.map(([key, label]) => (
            <label
              className={`text-[12px] font-bold ${["heroDescription", "catalogueDescription"].includes(key) ? "sm:col-span-2" : ""}`}
              key={key}
            >
              {label}
              {["heroDescription", "catalogueDescription"].includes(key) ? (
                <textarea
                  className={`${inputClass} min-h-20 py-3`}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  required
                  value={form[key]}
                />
              ) : (
                <input
                  className={inputClass}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  required
                  value={form[key]}
                />
              )}
            </label>
          ))}
          <button className={buttonClass} disabled={busy} type="submit">
            {busy ? "Saving…" : "Save homepage content"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-[12px]">Loading content…</p>
      )}
    </div>
  );
}
