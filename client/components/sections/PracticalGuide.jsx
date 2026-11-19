import {
  ArrowUpRight,
  CircleHelp,
  CreditCard,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
export default function PracticalGuide() {
  const items = [
    [
      "01",
      "Read the sidewall",
      "A marking such as 205/55 R16 gives width, profile and rim size. Match the full code and ask about load and speed ratings.",
      ScanSearch,
    ],
    [
      "02",
      "Check a real listing",
      "Search the catalogue for that size, then review available quantities. Any DEMO label means the price and stock are only examples.",
      ShieldCheck,
    ],
    [
      "03",
      "Request, then await approval",
      "Signing in saves a request, not a sale. The owner checks stock and reserves quantity only when approving.",
      CircleHelp,
    ],
    [
      "04",
      "Pay only after approval",
      "Approved requests show a payment choice. In this preview, DEMO payment is simulated—no real Razorpay charge occurs.",
      CreditCard,
    ],
  ];
  return (
    <section
      aria-labelledby="guide-heading"
      className="mx-4 mt-14 rounded-[22px] bg-[#f1f5ef] p-7 sm:mx-8 sm:p-10"
    >
      <span className="rounded-full bg-[#e0ebdb] px-3 py-1 text-[10px] font-extrabold uppercase text-[#315d3b]">
        Good to know
      </span>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2
          className="max-w-[660px] text-[31px] font-extrabold leading-tight tracking-[-.075em] sm:text-[43px]"
          id="guide-heading"
        >
          A clearer path from tyre size to next steps.
        </h2>
        <a
          className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#265c39] underline"
          href="/find-tyres"
        >
          Use the tyre finder <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(([n, title, copy, Icon]) => (
          <div
            className="rounded-[16px] border border-[#dfe9db] bg-white p-5"
            key={n}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#498055]">
                {n}
              </span>
              <Icon className="text-[#2b6841]" size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-[19px] font-extrabold tracking-[-.05em]">
              {title}
            </h3>
            <p className="mt-3 text-[12px] leading-relaxed text-[#556b59]">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
