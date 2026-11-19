import { ArrowUpRight } from "lucide-react";
import SectionTag from "@/components/ui/SectionTag";

/** A compact, content-specific explainer for public subpages, with a light/dark variant. */
export default function InfoSteps({
  eyebrow,
  title,
  description,
  items,
  action,
  href,
  id,
  dark = false,
}) {
  return (
    <section
      aria-label={title}
      className={`page-block mx-4 mt-12 rounded-[20px] px-5 py-8 sm:mx-8 sm:mt-14 sm:px-9 sm:py-10 ${dark ? "bg-[#173b28] text-white" : "bg-[#edf4ec] text-[#172d1c]"}`}
      id={id}
    >
      <div className="grid gap-7 xl:grid-cols-[.75fr_1.4fr] xl:gap-10">
        <div className="flex flex-col items-start">
          <SectionTag>{eyebrow}</SectionTag>
          <h2 className="mt-4 max-w-[470px] text-[29px] font-extrabold leading-[1.08] tracking-[-.075em] sm:text-[41px]">
            {title}
          </h2>
          <p
            className={`mt-4 max-w-[460px] text-[13px] leading-relaxed ${dark ? "text-[#d5e4d6]" : "text-[#4e6753]"}`}
          >
            {description}
          </p>
          {action && href && (
            <a
              className={`mt-6 inline-flex items-center gap-1 text-[12px] font-extrabold underline underline-offset-4 ${dark ? "text-[#e6f2df]" : "text-[#265e3a]"}`}
              href={href}
            >
              {action} <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          )}
        </div>
        <ol className="grid gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <li
              className={`flex min-w-0 flex-col rounded-2xl border p-5 ${dark ? "border-[#48705a] bg-[#254b34]" : "border-[#d6e4d5] bg-white"}`}
              key={item.title}
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-extrabold ${dark ? "bg-[#dcead9] text-[#1d432b]" : "bg-[#e1eee0] text-[#24553a]"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[17px] font-extrabold leading-tight tracking-[-.045em]">
                {item.title}
              </h3>
              <p
                className={`mt-2 text-[12px] leading-relaxed ${dark ? "text-[#d8e7d9]" : "text-[#536a58]"}`}
              >
                {item.copy}
              </p>
              {item.href && (
                <a
                  className={`mt-auto inline-flex items-center gap-1 pt-5 text-[11px] font-extrabold underline underline-offset-2 ${dark ? "text-[#e4f0dc]" : "text-[#2d6541]"}`}
                  href={item.href}
                >
                  {item.link || "Learn more"}{" "}
                  <ArrowUpRight aria-hidden="true" size={13} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
